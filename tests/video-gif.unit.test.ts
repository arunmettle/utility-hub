import { describe, expect, it } from 'vitest';
import {
  buildVideoGifFileName,
  buildVideoGifPlan,
  formatVideoGifBytes,
  formatVideoGifDuration,
  sanitizeVideoGifSettings,
  slugifyVideoGifFileName,
} from '../src/lib/videoGif';

describe('video gif helpers', () => {
  it('sanitizes timing, fps, width, and color settings to safe ranges', () => {
    const settings = sanitizeVideoGifSettings(95, 1920, {
      startTime: -5,
      endTime: 999,
      fps: 40,
      width: 5000,
      colorCount: 500,
    });

    expect(settings).toEqual({
      startTime: 0,
      endTime: 95,
      fps: 20,
      width: 960,
      colorCount: 256,
    });
  });

  it('falls back to the full duration when the end time is not after the start time', () => {
    const settings = sanitizeVideoGifSettings(42, 1280, {
      startTime: 10,
      endTime: 8,
      fps: 8,
      width: 480,
      colorCount: 64,
    });

    expect(settings.startTime).toBe(10);
    expect(settings.endTime).toBe(42);
  });

  it('builds a render plan with the expected frame count and scaled height', () => {
    const plan = buildVideoGifPlan(120, 1920, 1080, {
      startTime: 5,
      endTime: 17,
      fps: 10,
      width: 480,
      colorCount: 64,
    });

    expect(plan.frameCount).toBe(120);
    expect(plan.frameDelayMs).toBe(100);
    expect(plan.width).toBe(480);
    expect(plan.height).toBe(270);
    expect(plan.estimatedPixels).toBe(120 * 480 * 270);
  });

  it('formats short and long durations for the UI', () => {
    expect(formatVideoGifDuration(8.24)).toBe('8.2s');
    expect(formatVideoGifDuration(92.4)).toBe('1m 32.4s');
  });

  it('formats byte sizes for source and output metadata', () => {
    expect(formatVideoGifBytes(0)).toBe('0 B');
    expect(formatVideoGifBytes(1536)).toBe('1.50 KB');
    expect(formatVideoGifBytes(5 * 1024 * 1024)).toBe('5.00 MB');
  });

  it('slugifies source file names and builds predictable gif file names', () => {
    expect(slugifyVideoGifFileName('Sprint Demo (Final).mp4')).toBe('sprint-demo-final');
    expect(slugifyVideoGifFileName('')).toBe('video');
    expect(buildVideoGifFileName('Sprint Demo (Final).mp4', 480, 8)).toBe('sprint-demo-final-480w-8fps.gif');
  });
});
