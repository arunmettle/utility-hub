export interface VideoGifSettings {
  startTime: number;
  endTime: number;
  fps: number;
  width: number;
  colorCount: number;
}

export interface VideoGifPlan {
  startTime: number;
  endTime: number;
  frameCount: number;
  frameDelayMs: number;
  width: number;
  height: number;
  estimatedPixels: number;
}

export interface VideoGifProgress {
  completedFrames: number;
  totalFrames: number;
  percent: number;
  currentTime: number;
}

const MIN_FRAME_DELAY_MS = 20;
const MIN_DIMENSION = 96;
const MAX_DIMENSION = 960;
const MAX_FPS = 20;
const MIN_FPS = 1;
const MIN_COLORS = 8;
const MAX_COLORS = 256;
const SEEK_EPSILON_SECONDS = 0.02;

export function clampVideoGifNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function sanitizeVideoGifSettings(
  duration: number,
  sourceWidth: number,
  settings: Partial<VideoGifSettings>,
): VideoGifSettings {
  const safeDuration = Math.max(duration || 0, 0.1);
  const safeSourceWidth = Math.max(Math.round(sourceWidth || 0), MIN_DIMENSION);

  const startTime = clampVideoGifNumber(settings.startTime ?? 0, 0, safeDuration);
  const requestedEnd = clampVideoGifNumber(settings.endTime ?? safeDuration, 0, safeDuration);
  const endTime = requestedEnd <= startTime ? safeDuration : requestedEnd;

  return {
    startTime,
    endTime,
    fps: Math.round(clampVideoGifNumber(settings.fps ?? 8, MIN_FPS, MAX_FPS)),
    width: Math.round(clampVideoGifNumber(settings.width ?? Math.min(safeSourceWidth, 480), MIN_DIMENSION, Math.min(MAX_DIMENSION, safeSourceWidth))),
    colorCount: Math.round(clampVideoGifNumber(settings.colorCount ?? 64, MIN_COLORS, MAX_COLORS)),
  };
}

export function buildVideoGifPlan(
  duration: number,
  sourceWidth: number,
  sourceHeight: number,
  settings: Partial<VideoGifSettings>,
): VideoGifPlan {
  const safeSourceWidth = Math.max(Math.round(sourceWidth || 0), MIN_DIMENSION);
  const safeSourceHeight = Math.max(Math.round(sourceHeight || 0), MIN_DIMENSION);
  const sanitized = sanitizeVideoGifSettings(duration, safeSourceWidth, settings);
  const clippedDuration = Math.max(sanitized.endTime - sanitized.startTime, 0.01);
  const frameCount = Math.max(1, Math.ceil(clippedDuration * sanitized.fps));
  const height = Math.max(1, Math.round((sanitized.width / safeSourceWidth) * safeSourceHeight));

  return {
    startTime: sanitized.startTime,
    endTime: sanitized.endTime,
    frameCount,
    frameDelayMs: Math.max(MIN_FRAME_DELAY_MS, Math.round(1000 / sanitized.fps)),
    width: sanitized.width,
    height,
    estimatedPixels: frameCount * sanitized.width * height,
  };
}

export function formatVideoGifDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0.0s';
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds - minutes * 60;
  return `${minutes}m ${remainder.toFixed(1)}s`;
}

export function formatVideoGifBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 100 || unitIndex === 0 ? 0 : value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

export function slugifyVideoGifFileName(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'video'
  );
}

export function buildVideoGifFileName(sourceName: string, width: number, fps: number) {
  return `${slugifyVideoGifFileName(sourceName)}-${width}w-${fps}fps.gif`;
}

export async function waitForVideoMetadata(video: HTMLVideoElement) {
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) return;
  await new Promise<void>((resolve, reject) => {
    const onLoadedMetadata = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Unable to read the selected video in this browser. Try an MP4 or WebM file that can play locally.'));
    };
    const cleanup = () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('error', onError);
    };
    video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
    video.addEventListener('error', onError, { once: true });
  });
}

export async function seekVideo(video: HTMLVideoElement, time: number) {
  const boundedTarget = Math.min(Math.max(time, 0), Math.max(video.duration - SEEK_EPSILON_SECONDS, 0));
  await new Promise<void>((resolve, reject) => {
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Video seeking failed while preparing GIF frames.'));
    };
    const cleanup = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
    };
    video.addEventListener('seeked', onSeeked, { once: true });
    video.addEventListener('error', onError, { once: true });
    video.currentTime = boundedTarget;
  });
}

export async function nextMainThreadTick() {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
}
