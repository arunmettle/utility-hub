import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Mp3Encoder } from '@breezystack/lamejs';

export type FixtureKind = 'image' | 'audio' | 'video' | 'document';
export type MediaFixtureKind = FixtureKind;
export type MediaFixtureSizeUnit = 'KB' | 'MB';
export type FixtureFormat = 'svg' | 'png' | 'jpeg' | 'wav' | 'mp3' | 'webm' | 'mp4' | 'pdf' | 'csv' | 'xlsx';

export interface MediaSizePreset {
  id: string;
  label: string;
  targetBytes: number;
  helper: string;
}

export interface FixtureFormatOption {
  id: FixtureFormat;
  label: string;
  extension: string;
  mimeType: string;
  helper: string;
}

export interface GeneratedFixture {
  blob: Blob;
  previewBlob?: Blob;
  fileName: string;
  kind: FixtureKind;
  format: FixtureFormat;
  mimeType: string;
  targetBytes: number;
  actualBytes: number;
  durationSeconds?: number;
  previewText?: string;
}

export interface MediaFixtureCustomSize {
  kind: FixtureKind;
  amount: number;
  unit: MediaFixtureSizeUnit;
}

export const mediaSizePresets: MediaSizePreset[] = [
  { id: 'tiny', label: '64 KB', targetBytes: 64 * 1024, helper: 'Good for tiny upload and thumbnail checks.' },
  { id: 'small', label: '256 KB', targetBytes: 256 * 1024, helper: 'Useful for ordinary client-side validation flows.' },
  { id: 'medium', label: '1 MB', targetBytes: 1024 * 1024, helper: 'A realistic general-purpose fixture size.' },
  { id: 'large', label: '5 MB', targetBytes: 5 * 1024 * 1024, helper: 'Helpful for upper-bound QA and upload-limit checks.' },
];

export const fixtureFormatsByKind: Record<FixtureKind, FixtureFormatOption[]> = {
  image: [
    { id: 'svg', label: 'SVG', extension: 'svg', mimeType: 'image/svg+xml', helper: 'Vector image fixture that stays crisp and scales cleanly.' },
    { id: 'png', label: 'PNG', extension: 'png', mimeType: 'image/png', helper: 'Lossless raster fixture for screenshots, uploads, and transparency checks.' },
    { id: 'jpeg', label: 'JPEG', extension: 'jpg', mimeType: 'image/jpeg', helper: 'Compressed photo-style image fixture for common upload workflows.' },
  ],
  audio: [
    { id: 'wav', label: 'WAV', extension: 'wav', mimeType: 'audio/wav', helper: 'Uncompressed audio fixture for exact byte-oriented upload testing.' },
    { id: 'mp3', label: 'MP3', extension: 'mp3', mimeType: 'audio/mpeg', helper: 'Common compressed audio fixture for product and mobile upload flows.' },
  ],
  video: [
    { id: 'webm', label: 'WebM', extension: 'webm', mimeType: 'video/webm', helper: 'Reliable browser-generated video fixture with in-browser preview support.' },
    { id: 'mp4', label: 'MP4', extension: 'mp4', mimeType: 'video/mp4', helper: 'Preferred delivery format when the current browser can record MP4 locally.' },
  ],
  document: [
    { id: 'pdf', label: 'PDF', extension: 'pdf', mimeType: 'application/pdf', helper: 'Portable document fixture for viewer, download, and attachment testing.' },
    { id: 'csv', label: 'CSV', extension: 'csv', mimeType: 'text/csv', helper: 'Plain-text tabular fixture for imports, exports, and spreadsheet handoffs.' },
    { id: 'xlsx', label: 'Excel', extension: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', helper: 'Workbook fixture for Excel upload, import, and parsing workflows.' },
  ],
};

export const mediaFixtureSizeLimits = {
  minBytes: 32 * 1024,
  maxBytesByKind: {
    image: 100 * 1024 * 1024,
    audio: 250 * 1024 * 1024,
    video: 500 * 1024 * 1024,
    document: 100 * 1024 * 1024,
  } satisfies Record<FixtureKind, number>,
};

const textEncoder = new TextEncoder();

export function formatFixtureBytes(value: number) {
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(2)} MB`;
  if (value >= 1024) return `${(value / 1024).toFixed(0)} KB`;
  return `${value} bytes`;
}

export function convertFixtureSizeToBytes(amount: number, unit: MediaFixtureSizeUnit) {
  return Math.round(amount * (unit === 'MB' ? 1024 * 1024 : 1024));
}

export function getMaxFixtureBytes(kind: FixtureKind) {
  return mediaFixtureSizeLimits.maxBytesByKind[kind];
}

export function getDefaultFormatForKind(kind: FixtureKind): FixtureFormat {
  return fixtureFormatsByKind[kind][0].id;
}

export function getFixtureFormatOption(kind: FixtureKind, format: FixtureFormat) {
  return fixtureFormatsByKind[kind].find((option) => option.id === format) ?? fixtureFormatsByKind[kind][0];
}

export function validateCustomFixtureSize({ kind, amount, unit }: MediaFixtureCustomSize) {
  if (!Number.isFinite(amount)) {
    return { ok: false as const, error: 'Enter a valid custom size before generating a fixture.' };
  }

  if (amount <= 0) {
    return { ok: false as const, error: 'Custom size must be greater than zero.' };
  }

  const targetBytes = convertFixtureSizeToBytes(amount, unit);
  const maxBytes = getMaxFixtureBytes(kind);

  if (targetBytes < mediaFixtureSizeLimits.minBytes) {
    return {
      ok: false as const,
      error: `Custom size must be at least ${formatFixtureBytes(mediaFixtureSizeLimits.minBytes)}.`,
    };
  }

  if (targetBytes > maxBytes) {
    return {
      ok: false as const,
      error: `Custom size must be ${formatFixtureBytes(maxBytes)} or less for ${kind} fixtures.`,
    };
  }

  return {
    ok: true as const,
    targetBytes,
    label: `${amount} ${unit}`,
  };
}

function padBlobToTarget(blob: Blob, targetBytes: number, fillByte = 0x20) {
  if (blob.size >= targetBytes) return blob;
  const padding = new Uint8Array(targetBytes - blob.size);
  padding.fill(fillByte);
  return new Blob([blob, padding], { type: blob.type });
}

function padSvgToTarget(svg: string, targetBytes: number) {
  const bytes = textEncoder.encode(svg).length;
  if (bytes >= targetBytes) return svg;

  const padBytes = targetBytes - bytes;
  const padding = 'x'.repeat(Math.max(0, padBytes - '<!-- -->'.length));
  return svg.replace('</svg>', `<!-- ${padding} --></svg>`);
}

function buildBaseSvgText(targetBytes: number) {
  const stripes = Array.from({ length: 24 }, (_, index) => {
    const x = (index % 6) * 170;
    const y = Math.floor(index / 6) * 120;
    const hue = 180 + index * 7;
    return `<rect x="${x}" y="${y}" width="150" height="96" rx="18" fill="hsl(${hue} 58% 48%)" opacity="0.75" />`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640">
  <defs>
    <linearGradient id="fixtureGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#084c61" />
      <stop offset="55%" stop-color="#177e89" />
      <stop offset="100%" stop-color="#ffc857" />
    </linearGradient>
  </defs>
  <rect width="960" height="640" fill="url(#fixtureGradient)" />
  <g>${stripes}</g>
  <circle cx="780" cy="158" r="108" fill="#db3a34" opacity="0.18" />
  <circle cx="210" cy="500" r="126" fill="#ffffff" opacity="0.08" />
  <text x="80" y="120" fill="#ffffff" font-family="ui-sans-serif, system-ui" font-size="48" font-weight="700">Utility Hub Fixture</text>
  <text x="80" y="176" fill="#f3f7f8" font-family="ui-monospace, monospace" font-size="24">Local test asset generated for upload and QA workflows.</text>
  <text x="80" y="236" fill="#ecfeff" font-family="ui-monospace, monospace" font-size="20">Target size: ${formatFixtureBytes(targetBytes)}</text>
</svg>`;
}

export function buildSvgFixture(targetBytes: number) {
  const padded = padSvgToTarget(buildBaseSvgText(targetBytes), targetBytes);
  return new Blob([padded], { type: 'image/svg+xml' });
}

async function blobFromCanvas(canvas: HTMLCanvasElement, mimeType: string, quality?: number) {
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error(`Unable to render ${mimeType} fixture in this browser.`));
        return;
      }
      resolve(blob);
    }, mimeType, quality);
  });
}

async function buildRasterImageFixture(targetBytes: number, format: 'png' | 'jpeg') {
  const scale = Math.min(4, Math.max(1, Math.sqrt(targetBytes / (256 * 1024))));
  const width = Math.round(960 * scale);
  const height = Math.round(640 * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas 2D context is not available in this browser.');
  }

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#084c61');
  gradient.addColorStop(0.55, '#177e89');
  gradient.addColorStop(1, '#ffc857');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const imageData = context.createImageData(width, height);
  for (let index = 0; index < imageData.data.length; index += 4) {
    const pixelIndex = index / 4;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    imageData.data[index] = (x * 13 + y * 7) % 255;
    imageData.data[index + 1] = (x * 3 + y * 17) % 255;
    imageData.data[index + 2] = (x * 19 + y * 5) % 255;
    imageData.data[index + 3] = 255;
  }
  context.putImageData(imageData, 0, 0);

  context.fillStyle = 'rgba(255,255,255,0.86)';
  context.font = `${Math.round(42 * scale)}px system-ui`;
  context.fillText('Utility Hub Fixture', 48 * scale, 84 * scale);
  context.font = `${Math.round(22 * scale)}px ui-monospace, monospace`;
  context.fillText(`Target ${formatFixtureBytes(targetBytes)}`, 48 * scale, 126 * scale);

  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const previewBlob = await blobFromCanvas(canvas, mimeType, format === 'jpeg' ? 0.92 : undefined);
  return {
    blob: padBlobToTarget(previewBlob, targetBytes, 0),
    previewBlob,
  };
}

function buildPcmSamples(durationSeconds: number, sampleRate: number) {
  const totalSamples = Math.max(1, Math.floor(durationSeconds * sampleRate));
  const samples = new Int16Array(totalSamples);

  for (let index = 0; index < totalSamples; index += 1) {
    const time = index / sampleRate;
    const sample = Math.sin(2 * Math.PI * 220 * time) * 0.55 + Math.sin(2 * Math.PI * 330 * time) * 0.2;
    samples[index] = Math.max(-1, Math.min(1, sample)) * 32767;
  }

  return samples;
}

export function buildWavFixture(targetBytes: number) {
  const safeTarget = Math.max(44 + 2048, targetBytes);
  const dataBytes = Math.max(2048, safeTarget - 44 - ((safeTarget - 44) % 2));
  const sampleRate = 22050;
  const channelCount = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * channelCount * (bitsPerSample / 8);
  const durationSeconds = dataBytes / byteRate;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, channelCount * (bitsPerSample / 8), true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataBytes, true);

  for (let index = 0; index < dataBytes / 2; index += 1) {
    const time = index / sampleRate;
    const sample = Math.sin(2 * Math.PI * 220 * time) * 0.55 + Math.sin(2 * Math.PI * 330 * time) * 0.2;
    view.setInt16(44 + index * 2, Math.max(-1, Math.min(1, sample)) * 32767, true);
  }

  return {
    blob: new Blob([buffer], { type: 'audio/wav' }),
    durationSeconds,
  };
}

async function buildMp3Fixture(targetBytes: number) {
  const sampleRate = 44100;
  const kbps = 128;
  const durationSeconds = Math.min(12, Math.max(4, targetBytes / (128 * 1024)));
  const samples = buildPcmSamples(durationSeconds, sampleRate);
  const encoder = new Mp3Encoder(1, sampleRate, kbps);
  const chunks: Uint8Array[] = [];
  const sampleBlockSize = 1152;

  for (let index = 0; index < samples.length; index += sampleBlockSize) {
    const block = samples.subarray(index, index + sampleBlockSize);
    const encoded = encoder.encodeBuffer(block);
    if (encoded.length > 0) chunks.push(Uint8Array.from(encoded));
  }

  const flush = encoder.flush();
  if (flush.length > 0) chunks.push(Uint8Array.from(flush));

  const previewBlob = new Blob(
    chunks.map((chunk) => {
      const copy = new Uint8Array(chunk.byteLength);
      copy.set(chunk);
      return copy.buffer;
    }),
    { type: 'audio/mpeg' },
  );
  return {
    blob: padBlobToTarget(previewBlob, targetBytes, 0),
    previewBlob,
    durationSeconds,
  };
}

export function estimateVideoPlan(targetBytes: number) {
  const durationSeconds = targetBytes <= 256 * 1024 ? 2 : targetBytes <= 1024 * 1024 ? 4 : targetBytes <= 5 * 1024 * 1024 ? 6 : 8;
  const bitsPerSecond = Math.max(280_000, Math.floor((targetBytes * 8) / durationSeconds));
  return {
    durationSeconds,
    bitsPerSecond,
    width: 640,
    height: 360,
    fps: 24,
  };
}

export async function buildVideoFixture(targetBytes: number, format: 'webm' | 'mp4' = 'webm') {
  const plan = estimateVideoPlan(targetBytes);
  const canvas = document.createElement('canvas');
  canvas.width = plan.width;
  canvas.height = plan.height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context is not available in this browser.');
  }

  const stream = canvas.captureStream(plan.fps);
  const mimeCandidates = format === 'mp4'
    ? ['video/mp4;codecs=h264', 'video/mp4']
    : ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  const mimeType = mimeCandidates.find((candidate) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(candidate));

  if (!mimeType) {
    throw new Error(format === 'mp4'
      ? 'MP4 generation is not supported in this browser. Use WebM here or try a browser/runtime that exposes MP4 recording.'
      : 'WebM generation is not supported in this browser.');
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: plan.bitsPerSecond,
  });

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  const startedAt = performance.now();
  let stopped = false;

  const drawFrame = (timestamp: number) => {
    if (stopped) return;
    const elapsed = (timestamp - startedAt) / 1000;
    const progress = Math.min(1, elapsed / plan.durationSeconds);

    context.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#084c61');
    gradient.addColorStop(0.55, '#177e89');
    gradient.addColorStop(1, '#ffc857');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let index = 0; index < 18; index += 1) {
      const wave = Math.sin(progress * 8 + index * 0.45);
      context.fillStyle = `hsla(${182 + index * 5}, 80%, ${38 + (index % 4) * 8}%, 0.28)`;
      context.fillRect(28 + index * 30, 180 + wave * 34, 22, 130 + wave * 40);
    }

    context.fillStyle = '#ffffff';
    context.font = '700 28px system-ui';
    context.fillText('Utility Hub Video Fixture', 32, 56);
    context.font = '18px ui-monospace, monospace';
    context.fillText(`Target size: ${formatFixtureBytes(targetBytes)}`, 32, 92);
    context.fillText(`Elapsed: ${elapsed.toFixed(1)}s / ${plan.durationSeconds}s`, 32, 120);

    const orbX = 120 + progress * (canvas.width - 240);
    context.fillStyle = '#db3a34';
    context.beginPath();
    context.arc(orbX, 270 + Math.sin(progress * Math.PI * 4) * 60, 48, 0, Math.PI * 2);
    context.fill();

    if (elapsed < plan.durationSeconds) {
      requestAnimationFrame(drawFrame);
    } else {
      stopped = true;
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const finished = new Promise<Blob>((resolve, reject) => {
    recorder.onerror = () => reject(new Error('MediaRecorder failed while generating the video fixture.'));
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
  });

  recorder.start(250);
  requestAnimationFrame(drawFrame);

  const previewBlob = await finished;
  return {
    blob: padBlobToTarget(previewBlob, targetBytes, 0),
    previewBlob,
    durationSeconds: plan.durationSeconds,
    mimeType,
  };
}

async function buildPdfFixture(targetBytes: number) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let y = 72;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('Utility Hub Fixture', 56, y);
  y += 34;
  doc.setFont('courier', 'normal');
  doc.setFontSize(12);

  const lines = Math.max(40, Math.round(targetBytes / 600));
  for (let index = 0; index < lines; index += 1) {
    if (y > 760) {
      doc.addPage();
      y = 72;
    }
    doc.text(`Row ${index + 1}: Local PDF fixture for upload QA, previews, boundary tests, and attachment validation.`, 56, y);
    y += 18;
  }

  const previewBlob = doc.output('blob');
  return {
    blob: padBlobToTarget(previewBlob, targetBytes, 0x0a),
    previewBlob,
    previewText: `${lines} PDF lines across ${doc.getNumberOfPages()} pages`,
  };
}

function buildCsvFixture(targetBytes: number) {
  const header = 'id,name,team,scenario,sizeHint\n';
  let body = '';
  let row = 1;

  while (textEncoder.encode(header + body).length < targetBytes) {
    body += `${row},fixture-${row},platform,upload-boundary,${formatFixtureBytes(targetBytes)}\n`;
    row += 1;
  }

  const csv = (header + body).slice(0, targetBytes);
  const blob = new Blob([csv], { type: 'text/csv' });
  return {
    blob,
    previewText: csv.split('\n').slice(0, 6).join('\n'),
  };
}

async function buildXlsxFixture(targetBytes: number) {
  const rows: Array<Record<string, string | number>> = [];
  let lastBlob = new Blob([]);

  for (let index = 1; index <= 5000; index += 1) {
    rows.push({
      id: index,
      file_name: `fixture-${index}`,
      workflow: 'upload-boundary',
      size_hint: formatFixtureBytes(targetBytes),
      owner: 'utility-hub',
    });

    if (index % 100 === 0) {
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Fixtures');
      const array = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
      lastBlob = new Blob([array], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      if (lastBlob.size >= Math.min(targetBytes, 2 * 1024 * 1024)) break;
    }
  }

  const previewBlob = lastBlob;
  return {
    blob: padBlobToTarget(previewBlob, targetBytes, 0),
    previewBlob,
    previewText: `Workbook with ${rows.length} rows in sheet "Fixtures"`,
  };
}

export async function generateFixture(kind: FixtureKind, format: FixtureFormat, targetBytes: number): Promise<GeneratedFixture> {
  const option = getFixtureFormatOption(kind, format);
  const fileName = createFixtureFileName(kind, format, targetBytes, option.extension);

  if (kind === 'image' && format === 'svg') {
    const blob = buildSvgFixture(targetBytes);
    return {
      blob,
      fileName,
      kind,
      format,
      mimeType: option.mimeType,
      targetBytes,
      actualBytes: blob.size,
    };
  }

  if (kind === 'image' && (format === 'png' || format === 'jpeg')) {
    const generated = await buildRasterImageFixture(targetBytes, format);
    return {
      blob: generated.blob,
      previewBlob: generated.previewBlob,
      fileName,
      kind,
      format,
      mimeType: option.mimeType,
      targetBytes,
      actualBytes: generated.blob.size,
    };
  }

  if (kind === 'audio' && format === 'wav') {
    const generated = buildWavFixture(targetBytes);
    return {
      blob: generated.blob,
      fileName,
      kind,
      format,
      mimeType: option.mimeType,
      targetBytes,
      actualBytes: generated.blob.size,
      durationSeconds: generated.durationSeconds,
    };
  }

  if (kind === 'audio' && format === 'mp3') {
    const generated = await buildMp3Fixture(targetBytes);
    return {
      blob: generated.blob,
      previewBlob: generated.previewBlob,
      fileName,
      kind,
      format,
      mimeType: option.mimeType,
      targetBytes,
      actualBytes: generated.blob.size,
      durationSeconds: generated.durationSeconds,
    };
  }

  if (kind === 'video' && (format === 'webm' || format === 'mp4')) {
    const generated = await buildVideoFixture(targetBytes, format);
    return {
      blob: generated.blob,
      previewBlob: generated.previewBlob,
      fileName,
      kind,
      format,
      mimeType: generated.mimeType,
      targetBytes,
      actualBytes: generated.blob.size,
      durationSeconds: generated.durationSeconds,
    };
  }

  if (kind === 'document' && format === 'pdf') {
    const generated = await buildPdfFixture(targetBytes);
    return {
      blob: generated.blob,
      previewBlob: generated.previewBlob,
      previewText: generated.previewText,
      fileName,
      kind,
      format,
      mimeType: option.mimeType,
      targetBytes,
      actualBytes: generated.blob.size,
    };
  }

  if (kind === 'document' && format === 'csv') {
    const generated = buildCsvFixture(targetBytes);
    return {
      blob: generated.blob,
      previewText: generated.previewText,
      fileName,
      kind,
      format,
      mimeType: option.mimeType,
      targetBytes,
      actualBytes: generated.blob.size,
    };
  }

  if (kind === 'document' && format === 'xlsx') {
    const generated = await buildXlsxFixture(targetBytes);
    return {
      blob: generated.blob,
      previewBlob: generated.previewBlob,
      previewText: generated.previewText,
      fileName,
      kind,
      format,
      mimeType: option.mimeType,
      targetBytes,
      actualBytes: generated.blob.size,
    };
  }

  throw new Error(`Unsupported fixture combination: ${kind}/${format}`);
}

export function createFixtureFileName(kind: FixtureKind, format: FixtureFormat, targetBytes: number, extension: string) {
  return `utility-hub-${kind}-${format}-${Math.round(targetBytes / 1024)}kb.${extension}`;
}
