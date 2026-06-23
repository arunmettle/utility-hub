import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildSvgFixture,
  buildWavFixture,
  convertFixtureSizeToBytes,
  createFixtureFileName,
  estimateVideoPlan,
  fixtureFormatsByKind,
  formatFixtureBytes,
  getDefaultFormatForKind,
  generateFixture,
  getFixtureFormatOption,
  getMaxFixtureBytes,
  mediaFixtureSizeLimits,
  mediaSizePresets,
  validateCustomFixtureSize,
} from '../src/lib/mediaFixtures';

const originalDocument = globalThis.document;
const originalMediaRecorder = globalThis.MediaRecorder;
const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
const originalPerformance = globalThis.performance;
const originalURL = globalThis.URL;

afterEach(() => {
  globalThis.document = originalDocument;
  globalThis.MediaRecorder = originalMediaRecorder;
  globalThis.requestAnimationFrame = originalRequestAnimationFrame;
  globalThis.performance = originalPerformance;
  globalThis.URL = originalURL;
  vi.restoreAllMocks();
});

describe('mediaFixtures', () => {
  it('exposes practical preset sizes for boundary testing', () => {
    expect(mediaSizePresets).toHaveLength(4);
    expect(mediaSizePresets[0].targetBytes).toBe(64 * 1024);
    expect(mediaSizePresets[3].targetBytes).toBe(5 * 1024 * 1024);
  });

  it('exposes format options for images, audio, video, and documents', () => {
    expect(fixtureFormatsByKind.image.map((option) => option.id)).toEqual(['svg', 'png', 'jpeg']);
    expect(fixtureFormatsByKind.audio.map((option) => option.id)).toEqual(['wav', 'mp3']);
    expect(fixtureFormatsByKind.video.map((option) => option.id)).toEqual(['webm', 'mp4']);
    expect(fixtureFormatsByKind.document.map((option) => option.id)).toEqual(['pdf', 'csv', 'xlsx']);
    expect(getDefaultFormatForKind('document')).toBe('pdf');
    expect(getFixtureFormatOption('image', 'mp3').id).toBe('svg');
  });

  it('formats human-readable byte labels', () => {
    expect(formatFixtureBytes(512)).toBe('512 bytes');
    expect(formatFixtureBytes(1024)).toBe('1 KB');
    expect(formatFixtureBytes(1024 * 1024)).toBe('1.00 MB');
  });

  it('converts custom size values into bytes', () => {
    expect(convertFixtureSizeToBytes(256, 'KB')).toBe(256 * 1024);
    expect(convertFixtureSizeToBytes(1.5, 'MB')).toBe(1572864);
  });

  it('validates custom size boundaries by fixture kind', () => {
    expect(validateCustomFixtureSize({ kind: 'image', amount: Number.NaN, unit: 'KB' })).toEqual({
      ok: false,
      error: 'Enter a valid custom size before generating a fixture.',
    });

    expect(validateCustomFixtureSize({ kind: 'image', amount: 0, unit: 'KB' })).toEqual({
      ok: false,
      error: 'Custom size must be greater than zero.',
    });

    expect(validateCustomFixtureSize({ kind: 'image', amount: 16, unit: 'KB' })).toEqual({
      ok: false,
      error: `Custom size must be at least ${formatFixtureBytes(mediaFixtureSizeLimits.minBytes)}.`,
    });

    expect(validateCustomFixtureSize({ kind: 'image', amount: 101, unit: 'MB' })).toEqual({
      ok: false,
      error: `Custom size must be ${formatFixtureBytes(getMaxFixtureBytes('image'))} or less for image fixtures.`,
    });

    expect(validateCustomFixtureSize({ kind: 'audio', amount: 251, unit: 'MB' })).toEqual({
      ok: false,
      error: `Custom size must be ${formatFixtureBytes(getMaxFixtureBytes('audio'))} or less for audio fixtures.`,
    });

    expect(validateCustomFixtureSize({ kind: 'video', amount: 400, unit: 'MB' })).toEqual({
      ok: true,
      targetBytes: 400 * 1024 * 1024,
      label: '400 MB',
    });

    expect(getMaxFixtureBytes('document')).toBe(100 * 1024 * 1024);
  });

  it('accepts exact minimum and maximum custom sizes', () => {
    expect(validateCustomFixtureSize({ kind: 'document', amount: 32, unit: 'KB' })).toEqual({
      ok: true,
      targetBytes: 32 * 1024,
      label: '32 KB',
    });

    expect(validateCustomFixtureSize({ kind: 'image', amount: 100, unit: 'MB' })).toEqual({
      ok: true,
      targetBytes: 100 * 1024 * 1024,
      label: '100 MB',
    });
  });

  it('builds svg fixtures close to the requested target size', async () => {
    const blob = buildSvgFixture(256 * 1024);
    expect(blob.type).toBe('image/svg+xml');
    expect(blob.size).toBeGreaterThan(255 * 1024);
    expect(blob.size).toBeLessThanOrEqual(256 * 1024 + 256);
    await expect(blob.text()).resolves.toContain('<svg');
  });

  it('generates svg fixtures through the main switchboard without requiring canvas support', async () => {
    const result = await generateFixture('image', 'svg', 64 * 1024);

    expect(result.kind).toBe('image');
    expect(result.format).toBe('svg');
    expect(result.mimeType).toBe('image/svg+xml');
    expect(result.actualBytes).toBeGreaterThan(60 * 1024);
    expect(await result.blob.text()).toContain('<svg');
  });

  it('builds wav fixtures with a valid header and usable duration', async () => {
    const generated = buildWavFixture(128 * 1024);
    expect(generated.blob.type).toBe('audio/wav');
    expect(generated.blob.size).toBeLessThanOrEqual(128 * 1024);
    expect(generated.durationSeconds).toBeGreaterThan(1);

    const bytes = new Uint8Array(await generated.blob.arrayBuffer());
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('RIFF');
    expect(String.fromCharCode(...bytes.slice(8, 12))).toBe('WAVE');
  });

  it('pads small wav fixtures up to the minimum playable payload size', () => {
    const generated = buildWavFixture(1024);
    expect(generated.blob.size).toBeGreaterThan(1024);
    expect(generated.durationSeconds).toBeGreaterThan(0);
  });

  it('estimates a usable video plan from the requested size', () => {
    const plan = estimateVideoPlan(1024 * 1024);
    expect(plan.durationSeconds).toBeGreaterThan(0);
    expect(plan.bitsPerSecond).toBeGreaterThan(0);
    expect(plan.width).toBe(640);
  });

  it('changes video duration bands across target size thresholds', () => {
    expect(estimateVideoPlan(128 * 1024).durationSeconds).toBe(2);
    expect(estimateVideoPlan(2 * 1024 * 1024).durationSeconds).toBe(6);
    expect(estimateVideoPlan(8 * 1024 * 1024).durationSeconds).toBe(8);
  });

  it('creates download-friendly file names', () => {
    expect(createFixtureFileName('image', 'png', 256 * 1024, 'png')).toBe('utility-hub-image-png-256kb.png');
    expect(createFixtureFileName('document', 'xlsx', 64 * 1024, 'xlsx')).toBe('utility-hub-document-xlsx-64kb.xlsx');
  });

  it('generates csv fixtures with preview text and matching mime metadata', async () => {
    const result = await generateFixture('document', 'csv', 64 * 1024);

    expect(result.kind).toBe('document');
    expect(result.format).toBe('csv');
    expect(result.mimeType).toBe('text/csv');
    expect(result.actualBytes).toBeGreaterThan(1000);
    expect(result.previewText).toContain('id,name,team,scenario,sizeHint');
  });

  it('generates pdf fixtures with padded blob size and preview metadata', async () => {
    const result = await generateFixture('document', 'pdf', 128 * 1024);

    expect(result.format).toBe('pdf');
    expect(result.mimeType).toBe('application/pdf');
    expect(result.actualBytes).toBe(128 * 1024);
    expect(result.previewBlob?.size).toBeLessThanOrEqual(result.actualBytes);
    expect(result.previewText).toContain('PDF lines');
  });

  it('generates xlsx fixtures with workbook summary and spreadsheet mime type', async () => {
    const result = await generateFixture('document', 'xlsx', 128 * 1024);

    expect(result.format).toBe('xlsx');
    expect(result.mimeType).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(result.actualBytes).toBeGreaterThanOrEqual(128 * 1024);
    expect(result.previewText).toContain('Workbook with');
  });

  it('generates mp3 fixtures with preview audio blob and duration', async () => {
    const result = await generateFixture('audio', 'mp3', 128 * 1024);

    expect(result.format).toBe('mp3');
    expect(result.mimeType).toBe('audio/mpeg');
    expect(result.actualBytes).toBe(128 * 1024);
    expect(result.previewBlob?.size).toBeGreaterThan(0);
    expect(result.durationSeconds).toBeGreaterThan(0);
  });

  it('generates wav fixtures through the main fixture switchboard', async () => {
    const result = await generateFixture('audio', 'wav', 64 * 1024);

    expect(result.kind).toBe('audio');
    expect(result.format).toBe('wav');
    expect(result.mimeType).toBe('audio/wav');
    expect(result.actualBytes).toBeGreaterThan(1024);
    expect(result.durationSeconds).toBeGreaterThan(0);
  });

  it('generates raster image fixtures when canvas support is available', async () => {
    const putImageData = vi.fn();
    const fillRect = vi.fn();
    const fillText = vi.fn();
    const createLinearGradient = vi.fn(() => ({ addColorStop: vi.fn() }));
    const toBlob = vi.fn((callback: (blob: Blob | null) => void) => callback(new Blob(['png'], { type: 'image/png' })));

    globalThis.document = {
      createElement: vi.fn((tag: string) => {
        if (tag !== 'canvas') throw new Error(`Unexpected element: ${tag}`);
        return {
          width: 0,
          height: 0,
          getContext: vi.fn(() => ({
            createLinearGradient,
            fillStyle: '',
            font: '',
            fillRect,
            createImageData: vi.fn((width: number, height: number) => ({
              data: new Uint8ClampedArray(width * height * 4),
            })),
            putImageData,
            fillText,
          })),
          toBlob,
        };
      }),
    } as unknown as Document;

    const result = await generateFixture('image', 'png', 64 * 1024);

    expect(result.kind).toBe('image');
    expect(result.format).toBe('png');
    expect(result.mimeType).toBe('image/png');
    expect(result.previewBlob?.size).toBeGreaterThan(0);
    expect(result.actualBytes).toBe(64 * 1024);
  });

  it('generates browser-recorded video fixtures when recording support is available', async () => {
    const trackStop = vi.fn();
    const frameTimes = [0, 10_000];
    const mediaRecorderState: { instance?: { ondataavailable: ((event: { data: Blob }) => void) | null; onstop: (() => void) | null } } = {};

    class FakeMediaRecorder {
      static isTypeSupported(candidate: string) {
        return candidate.includes('webm');
      }
      ondataavailable: ((event: { data: Blob }) => void) | null = null;
      onstop: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(_stream: unknown, _options: unknown) {
        mediaRecorderState.instance = this;
      }
      start() {}
      stop() {
        this.ondataavailable?.({ data: new Blob(['video'], { type: 'video/webm' }) });
        this.onstop?.();
      }
    }

    globalThis.MediaRecorder = FakeMediaRecorder as unknown as typeof MediaRecorder;
    globalThis.performance = { now: () => 0 } as Performance;
    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(frameTimes.shift() ?? 10_000);
      return 1;
    }) as typeof requestAnimationFrame;

    globalThis.document = {
      createElement: vi.fn((tag: string) => {
        if (tag !== 'canvas') throw new Error(`Unexpected element: ${tag}`);
        return {
          width: 0,
          height: 0,
          getContext: vi.fn(() => ({
            clearRect: vi.fn(),
            createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
            fillStyle: '',
            font: '',
            fillRect: vi.fn(),
            fillText: vi.fn(),
            beginPath: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
          })),
          captureStream: vi.fn(() => ({
            getTracks: () => [{ stop: trackStop }],
          })),
        };
      }),
    } as unknown as Document;

    const result = await generateFixture('video', 'webm', 64 * 1024);

    expect(result.kind).toBe('video');
    expect(result.format).toBe('webm');
    expect(result.mimeType).toContain('video/webm');
    expect(result.previewBlob?.size).toBeGreaterThan(0);
    expect(result.durationSeconds).toBeGreaterThan(0);
    expect(trackStop).toHaveBeenCalled();
  });

  it('throws a helpful mp4 support error when the runtime cannot record mp4 fixtures', async () => {
    class FakeMediaRecorder {
      static isTypeSupported() {
        return false;
      }
    }

    globalThis.MediaRecorder = FakeMediaRecorder as unknown as typeof MediaRecorder;
    globalThis.performance = { now: () => 0 } as Performance;
    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(10_000);
      return 1;
    }) as typeof requestAnimationFrame;
    globalThis.document = {
      createElement: vi.fn((tag: string) => {
        if (tag !== 'canvas') throw new Error(`Unexpected element: ${tag}`);
        return {
          width: 0,
          height: 0,
          getContext: vi.fn(() => ({
            clearRect: vi.fn(),
            createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
            fillStyle: '',
            font: '',
            fillRect: vi.fn(),
            fillText: vi.fn(),
            beginPath: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
          })),
          captureStream: vi.fn(() => ({
            getTracks: () => [{ stop: vi.fn() }],
          })),
        };
      }),
    } as unknown as Document;

    await expect(generateFixture('video', 'mp4', 64 * 1024)).rejects.toThrow(
      'MP4 generation is not supported in this browser. Use WebM here or try a browser/runtime that exposes MP4 recording.',
    );
  });

  it('throws for unsupported fixture combinations', async () => {
    await expect(generateFixture('document', 'webm', 64 * 1024)).rejects.toThrow('Unsupported fixture combination');
  });

  it('falls back to the default format option when a mismatched format is requested', () => {
    expect(getFixtureFormatOption('audio', 'svg').id).toBe('wav');
    expect(getFixtureFormatOption('video', 'pdf').id).toBe('webm');
  });
});
