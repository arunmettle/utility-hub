import { format } from 'date-fns';
import * as CryptoJS from 'crypto-js';
import { md5 } from 'js-md5';
import { sha256 } from 'js-sha256';
import { sha512 } from 'js-sha512';

export type TransformResult<T> = {
  error: string;
  output: T;
};

export type Base64Mode = 'encode' | 'decode';
export type DataUrlMode = 'text-to-data-url' | 'data-url-to-text';
export type UrlMode = 'encode' | 'decode';
export type JsonLinesMode = 'jsonl-to-array' | 'array-to-jsonl';
export type LineDeduplicationMode = 'preserve-order' | 'sort-ascending';

export type HashType = 'md5' | 'sha256' | 'sha512';

export type CaseType =
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'CONSTANT_CASE'
  | 'Title Case'
  | 'Sentence case'
  | 'lower case'
  | 'UPPER CASE';

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface PasswordStrength {
  label: 'Not generated' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  width: string;
  tone: string;
}

export interface TimestampDetails {
  detectedUnit: TimestampUnit;
  iso: string;
  rfc3339: string;
  rfc2822: string;
  utc: string;
  local: string;
  relative: string;
  unixSeconds: number;
  unixMilliseconds: number;
  unixMicroseconds: string;
  unixNanoseconds: string;
  precisionNote?: string;
}

export type TimestampUnit = 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds';
export type DurationUnit = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';

export interface DateDifferenceReport {
  startIso: string;
  endIso: string;
  startLocal: string;
  endLocal: string;
  direction: 'same' | 'forward' | 'backward';
  human: string;
  milliseconds: string;
  seconds: string;
  minutes: string;
  hours: string;
  days: string;
  weeks: string;
}

export interface TimestampOffsetReport {
  baseIso: string;
  baseLocal: string;
  resultIso: string;
  resultLocal: string;
  direction: 'add' | 'subtract';
  amount: string;
  unit: DurationUnit;
  deltaHuman: string;
  unixSeconds: number;
  unixMilliseconds: number;
  unixMicroseconds: string;
  unixNanoseconds: string;
}

export interface TimestampBatchRow {
  raw: string;
  detectedUnit?: TimestampUnit;
  iso?: string;
  local?: string;
  relative?: string;
  error?: string;
}

export interface TimestampBatchReport {
  totalLines: number;
  validCount: number;
  invalidCount: number;
  rows: TimestampBatchRow[];
}

export interface TimeZoneConversionRow {
  timeZone: string;
  label: string;
  formatted: string;
  dayPeriod: string;
}

export interface TimeZoneConversionReport {
  sourceIso: string;
  sourceLocal: string;
  rows: TimeZoneConversionRow[];
}

export interface RelativeTimeReport {
  targetIso: string;
  targetLocal: string;
  relative: string;
  direction: 'past' | 'future' | 'now';
  human: string;
  milliseconds: string;
  seconds: string;
  minutes: string;
  hours: string;
  days: string;
  weeks: string;
}

export interface DecodedJwtToken {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export interface JwtAnalysis {
  warnings: string[];
  info: string[];
}

export interface RegexFlags {
  g: boolean;
  i: boolean;
  m: boolean;
  s: boolean;
}

export interface RegexMatch {
  text: string;
  index: number;
  groups: string[];
}

export type HmacType = 'sha256' | 'sha512';

export type QueryMode = 'encode' | 'decode';
export type CredentialMode = 'encode' | 'decode';
export type CharacterCodeMode = 'encode' | 'decode';

export interface QueryValueMap {
  [key: string]: string | string[];
}

export interface HmacResult {
  sha256: string;
  sha512: string;
}

export interface ApiKeyFingerprintReport {
  masked: string;
  fingerprint: string;
  length: number;
  likelyProvider: string;
}

export interface SriHashReport {
  sha256: string;
  sha384: string;
  sha512: string;
}

export interface CorsPolicyReport {
  allowedOrigin: string;
  allowCredentials: boolean;
  allowMethods: string[];
  allowHeaders: string[];
  findings: HeaderFinding[];
  risk: 'low' | 'medium' | 'high';
}

export interface SecurityTxtReport {
  fields: string[];
  contacts: string[];
  expires: string;
  findings: HeaderFinding[];
}

export interface OpenRedirectReport {
  target: string;
  host: string;
  protocol: string;
  findings: HeaderFinding[];
  isRelativeTarget: boolean;
}

export interface PasswordPolicyReport {
  minimumLength: number | null;
  requirements: string[];
  findings: HeaderFinding[];
  score: number;
}

export interface SignedUrlReport {
  provider: string;
  parameters: string[];
  expirySummary: string;
  findings: HeaderFinding[];
}

export interface GitignoreTemplateReport {
  output: string;
  sections: string[];
}

export interface PaletteReport {
  values: Array<{ label: string; hex: string }>;
}

export interface FakeUserReport {
  values: Array<{ name: string; email: string; role: string }>;
}

export interface ReleaseNoteReport {
  markdown: string;
  bulletCount: number;
}

export interface TestCaseTitleReport {
  values: string[];
}

export interface JsonPointerReport {
  found: boolean;
  value: string;
}

export interface UrlPatternReport {
  matched: boolean;
  normalizedPattern: string;
  parameters: Array<{ key: string; value: string }>;
}

export interface SemverRangeReport {
  isMatch: boolean;
  normalizedRange: string;
  reasons: string[];
}

export interface HttpStatusRuleReport {
  isMatch: boolean;
  normalizedRule: string;
  reasons: string[];
}

export type CsvJsonMode = 'csv-to-json' | 'json-to-csv';

export interface DiffLine {
  kind: 'unchanged' | 'added' | 'removed';
  value: string;
}

export interface DiffFragment {
  kind: 'unchanged' | 'added' | 'removed';
  value: string;
}

export interface CommitSuggestion {
  label: string;
  message: string;
  rationale: string;
}

export interface ParsedDiffInput {
  files: string[];
  addedLines: string[];
  removedLines: string[];
  changedPaths: string[];
}

export interface DockerFinding {
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
}

export interface DockerOptimizationReport {
  score: number;
  findings: DockerFinding[];
  optimizedDockerfile: string;
}

export interface ActionsJobSummary {
  name: string;
  hasRunsOn: boolean;
  hasSteps: boolean;
  stepCount: number;
}

export interface ActionsValidationReport {
  triggers: string[];
  jobs: ActionsJobSummary[];
  findings: DockerFinding[];
}

export interface DependencyEntry {
  name: string;
  version: string;
  ecosystem: 'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies';
}

export interface DependencyVisualizationReport {
  packageName: string;
  version: string;
  totals: Record<DependencyEntry['ecosystem'], number>;
  entries: DependencyEntry[];
  duplicateNames: string[];
  scripts: string[];
}

export interface BundleAsset {
  name: string;
  bytes: number;
  type: 'javascript' | 'stylesheet' | 'html' | 'image' | 'font' | 'other';
}

export interface BundleSizeReport {
  assets: BundleAsset[];
  totalBytes: number;
  estimatedTextGzipBytes: number;
  largestAsset: BundleAsset | null;
  byType: Record<BundleAsset['type'], number>;
}

export interface CurlConversionReport {
  method: string;
  url: string;
  headers: Array<{ key: string; value: string }>;
  body: string;
  warnings: string[];
  fetchSnippet: string;
  axiosSnippet: string;
  pythonSnippet: string;
}

export interface SemverRecommendationReport {
  currentVersion: string;
  patch: string;
  minor: string;
  major: string;
  recommendedLevel: 'patch' | 'minor' | 'major';
  recommendedVersion: string;
  rationale: string;
  signals: string[];
}

export interface BreakingChangeFinding {
  path: string;
  kind: 'removed' | 'type-changed' | 'added';
  oldType?: string;
  newType?: string;
}

export interface BreakingChangeReport {
  compatibilityScore: number;
  breakingFindings: BreakingChangeFinding[];
  nonBreakingFindings: BreakingChangeFinding[];
}

export interface HeaderFinding {
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
}

export interface HeaderInspectionReport {
  headers: Array<{ key: string; value: string }>;
  securityScore: number;
  findings: HeaderFinding[];
  cacheSummary: string;
  corsSummary: string;
}

export interface CronFieldSummary {
  label: string;
  expression: string;
  description: string;
}

export interface CronExplanationReport {
  description: string;
  fields: CronFieldSummary[];
  nextRuns: string[];
}

export interface DockerComposeServiceSummary {
  name: string;
  image: string;
  hasBuild: boolean;
  portCount: number;
  hasHealthcheck: boolean;
  hasRestart: boolean;
}

export interface DockerComposeReport {
  serviceCount: number;
  services: DockerComposeServiceSummary[];
  findings: DockerFinding[];
  score: number;
}

export interface OpenApiSummaryReport {
  title: string;
  version: string;
  serverCount: number;
  pathCount: number;
  operationCount: number;
  methods: Record<string, number>;
  tags: string[];
  securitySchemes: string[];
}

export interface MarkdownTableReport {
  markdown: string;
  rowCount: number;
  columnCount: number;
}

export type MarkdownInputFormat =
  | 'markdown'
  | 'pipe-table'
  | 'box-table'
  | 'whitespace-table'
  | 'csv'
  | 'json-array'
  | 'plain-text';

export interface MarkdownStudioReport {
  markdown: string;
  detectedFormat: MarkdownInputFormat;
  rowCount: number;
  columnCount: number;
  notes: string[];
}

export interface JsonLinesReport {
  normalizedJsonl: string;
  prettyJsonArray: string;
  rowCount: number;
  uniqueKeyCount: number;
}

export interface EnvEntryReport {
  key: string;
  valuePreview: string;
  hasValue: boolean;
  secretLike: boolean;
}

export interface EnvInspectionReport {
  entries: EnvEntryReport[];
  duplicateKeys: string[];
  invalidLines: string[];
  secretLikeCount: number;
}

export interface AnsiCleanReport {
  cleaned: string;
  removedSequences: number;
  lineCount: number;
}

export interface MarkdownChecklistReport {
  markdown: string;
  itemCount: number;
  checkedCount: number;
}

export interface LineDeduplicationReport {
  output: string;
  uniqueCount: number;
  removedCount: number;
}

export interface JsonPathExplorerReport {
  path: string;
  found: boolean;
  value: string;
  valueType: string;
  availableKeys: string[];
}

export interface HeaderDiffReport {
  added: string[];
  removed: string[];
  changed: Array<{ key: string; left: string; right: string }>;
}

export interface HarRequestSummaryReport {
  requestCount: number;
  domainCount: number;
  methods: Record<string, number>;
  requests: Array<{ method: string; url: string; status: number; domain: string }>;
}

export interface WebhookPayloadInspectionReport {
  eventName: string;
  topLevelKeys: Array<{ key: string; type: string }>;
  nestedObjectCount: number;
  arrayCount: number;
}

export interface LogLevelAnalysisReport {
  counts: Record<'error' | 'warn' | 'info' | 'debug', number>;
  totalLines: number;
  findings: string[];
}

export interface UuidExtractionReport {
  uuids: string[];
  uniqueCount: number;
}

export interface LinkExtractionReport {
  urls: string[];
  emails: string[];
}

export interface SecretRedactionReport {
  redacted: string;
  replacements: number;
}

export interface ApiErrorFormattingReport {
  markdown: string;
  title: string;
  statusCode: string;
  detailCount: number;
}

export type BinaryTextMode = 'encode' | 'decode';
export type MorseCodeMode = 'encode' | 'decode';

export interface NumberBaseReport {
  binary: string;
  octal: string;
  decimal: string;
  hexadecimal: string;
}

export interface NanoIdReport {
  values: string[];
}

export interface LoremIpsumReport {
  output: string;
  paragraphCount: number;
  wordCount: number;
}

export interface CookieSecurityReport {
  cookies: Array<{ name: string; secure: boolean; httpOnly: boolean; sameSite: string }>;
  findings: HeaderFinding[];
}

export interface CspPolicyReport {
  directives: Array<{ key: string; value: string }>;
  findings: HeaderFinding[];
}

export interface JwtExpiryReport {
  expiresAt: string;
  issuedAt: string;
  status: string;
}

export interface RegexReplaceReport {
  output: string;
  replacements: number;
}

export interface EmailValidationReport {
  valid: string[];
  invalid: string[];
}

export interface JsonComparisonReport {
  added: string[];
  removed: string[];
  changed: string[];
}

export type LineEndingMode = 'lf' | 'crlf';
export type TabSpaceMode = 'tabs-to-spaces' | 'spaces-to-tabs';
export type ListJsonMode = 'list-to-json' | 'json-to-list';

export interface ByteSizeConversionReport {
  bytes: string;
  kilobytes: string;
  megabytes: string;
  gigabytes: string;
}

export interface ColorConversionReport {
  hex: string;
  rgb: string;
  hsl: string;
}

export interface PassphraseReport {
  values: string[];
}

export interface RandomNumberReport {
  values: number[];
}

export interface UsernameReport {
  values: string[];
}

export interface ApiTokenReport {
  values: string[];
}

export interface JsonSchemaGenerationReport {
  schema: string;
  rootType: string;
  propertyCount: number;
}

const crockfordBase32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const uppercaseCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseCharacters = 'abcdefghijklmnopqrstuvwxyz';
const numberCharacters = '0123456789';
const symbolCharacters = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export function transformJson(value: string, spacing: number): TransformResult<string> {
  if (!value.trim()) {
    return { error: '', output: '' };
  }

  try {
    const parsed = JSON.parse(value);
    return { error: '', output: JSON.stringify(parsed, null, spacing) };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Invalid JSON payload.',
      output: '',
    };
  }
}

export function transformBase64(value: string, mode: Base64Mode): TransformResult<string> {
  if (!value) {
    return { error: '', output: '' };
  }

  try {
    if (mode === 'encode') {
      return {
        error: '',
        output: btoa(String.fromCharCode(...textEncoder.encode(value))),
      };
    }

    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return {
      error: '',
      output: textDecoder.decode(bytes),
    };
  } catch {
    return {
      error: mode === 'encode' ? 'Unable to encode the supplied text.' : 'That Base64 payload could not be decoded.',
      output: '',
    };
  }
}

export function transformUrl(value: string, mode: UrlMode): TransformResult<string> {
  if (!value) {
    return { error: '', output: '' };
  }

  try {
    return {
      error: '',
      output: mode === 'encode' ? encodeURIComponent(value) : decodeURIComponent(value),
    };
  } catch {
    return {
      error: mode === 'decode' ? 'Invalid URL-encoded string.' : 'Unable to encode the provided text.',
      output: '',
    };
  }
}

export function generateHashes(value: string): Record<HashType, string> {
  if (!value) {
    return { md5: '', sha256: '', sha512: '' };
  }

  return {
    md5: md5(value),
    sha256: sha256(value),
    sha512: sha512(value),
  };
}

function splitWords(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function capitalizeWord(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function convertCase(value: string, type: CaseType): string {
  if (!value.trim()) return '';

  const words = splitWords(value);
  const lowerWords = words.map((word) => word.toLowerCase());

  switch (type) {
    case 'camelCase':
      return lowerWords
        .map((word, index) => (index === 0 ? word : capitalizeWord(word)))
        .join('');
    case 'PascalCase':
      return lowerWords.map(capitalizeWord).join('');
    case 'snake_case':
      return lowerWords.join('_');
    case 'kebab-case':
      return lowerWords.join('-');
    case 'CONSTANT_CASE':
      return lowerWords.join('_').toUpperCase();
    case 'Title Case':
      return lowerWords.map(capitalizeWord).join(' ');
    case 'Sentence case': {
      const sentence = lowerWords.join(' ');
      return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }
    case 'lower case':
      return lowerWords.join(' ');
    case 'UPPER CASE':
      return lowerWords.join(' ').toUpperCase();
  }
}

const timestampInputError = 'Enter a valid Unix timestamp in seconds, milliseconds, microseconds, or nanoseconds.';
const maxDateMilliseconds = 8_640_000_000_000_000n;

const durationMillisecondsByUnit: Record<DurationUnit, number> = {
  milliseconds: 1,
  seconds: 1_000,
  minutes: 60_000,
  hours: 3_600_000,
  days: 86_400_000,
  weeks: 604_800_000,
  months: 2_592_000_000,
  years: 31_536_000_000,
};

function formatDecimal(value: number, digits = 4) {
  if (!Number.isFinite(value)) return '0';
  if (digits === 0) return Math.round(value).toString();
  const rounded = value.toFixed(digits).replace(/\.?0+$/, '');
  return rounded === '-0' ? '0' : rounded;
}

function formatQuantity(value: number, singular: string, plural = `${singular}s`) {
  const rendered = formatDecimal(value);
  return `${rendered} ${rendered === '1' ? singular : plural}`;
}

function formatDateInTimeZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(date);
}

function getDayPeriod(date: Date, timeZone: string) {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      hour12: false,
    }).format(date),
  );

  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function formatRelativeTimestamp(targetMilliseconds: number, referenceMilliseconds: number) {
  const deltaSeconds = Math.round((targetMilliseconds - referenceMilliseconds) / 1000);
  if (deltaSeconds === 0) return 'now';

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'always' });
  const absoluteSeconds = Math.abs(deltaSeconds);

  if (absoluteSeconds < 60) return formatter.format(deltaSeconds, 'second');

  const deltaMinutes = Math.round(deltaSeconds / 60);
  if (Math.abs(deltaMinutes) < 60) return formatter.format(deltaMinutes, 'minute');

  const deltaHours = Math.round(deltaMinutes / 60);
  if (Math.abs(deltaHours) < 24) return formatter.format(deltaHours, 'hour');

  const deltaDays = Math.round(deltaHours / 24);
  if (Math.abs(deltaDays) < 7) return formatter.format(deltaDays, 'day');

  const deltaWeeks = Math.round(deltaDays / 7);
  if (Math.abs(deltaWeeks) < 5) return formatter.format(deltaWeeks, 'week');

  const deltaMonths = Math.round(deltaDays / 30);
  if (Math.abs(deltaMonths) < 12) return formatter.format(deltaMonths, 'month');

  const deltaYears = Math.round(deltaDays / 365);
  return formatter.format(deltaYears, 'year');
}

function formatAbsoluteDuration(milliseconds: number) {
  if (milliseconds === 0) return '0 seconds';

  const absoluteSeconds = Math.abs(milliseconds) / 1000;
  if (absoluteSeconds < 60) return formatQuantity(absoluteSeconds, 'second');

  const absoluteMinutes = absoluteSeconds / 60;
  if (absoluteMinutes < 60) return formatQuantity(absoluteMinutes, 'minute');

  const absoluteHours = absoluteMinutes / 60;
  if (absoluteHours < 24) return formatQuantity(absoluteHours, 'hour');

  const absoluteDays = absoluteHours / 24;
  if (absoluteDays < 7) return formatQuantity(absoluteDays, 'day');

  const absoluteWeeks = absoluteDays / 7;
  if (absoluteWeeks < 5) return formatQuantity(absoluteWeeks, 'week');

  if (absoluteDays < 365) return formatQuantity(absoluteDays / 30, 'month');

  return formatQuantity(absoluteDays / 365, 'year');
}

function detectTimestampUnit(value: bigint): TimestampUnit | null {
  const digits = value.toString().replace('-', '').length;
  if (digits <= 10) return 'seconds';
  if (digits <= 13) return 'milliseconds';
  if (digits <= 16) return 'microseconds';
  if (digits <= 19) return 'nanoseconds';
  return null;
}

function parseUnixTimestampValue(value: string) {
  const trimmed = value.trim();
  if (!/^-?\d+$/.test(trimmed)) {
    return { error: timestampInputError, output: null as null };
  }

  let raw: bigint;
  try {
    raw = BigInt(trimmed);
  } catch {
    return { error: timestampInputError, output: null as null };
  }

  const detectedUnit = detectTimestampUnit(raw);
  if (!detectedUnit) {
    return { error: timestampInputError, output: null as null };
  }

  const divisor = detectedUnit === 'microseconds' ? 1_000n : detectedUnit === 'nanoseconds' ? 1_000_000n : 1n;
  const unixMillisecondsBigInt =
    detectedUnit === 'seconds'
      ? raw * 1_000n
      : detectedUnit === 'milliseconds'
        ? raw
        : raw / divisor;

  if (unixMillisecondsBigInt > maxDateMilliseconds || unixMillisecondsBigInt < -maxDateMilliseconds) {
    return { error: timestampInputError, output: null as null };
  }

  const date = new Date(Number(unixMillisecondsBigInt));
  if (Number.isNaN(date.getTime())) {
    return { error: timestampInputError, output: null as null };
  }

  return {
    error: '',
    output: {
      raw,
      date,
      detectedUnit,
      unixMillisecondsBigInt,
      precisionNote:
        detectedUnit === 'microseconds' && raw % 1_000n !== 0n
          ? 'Calendar output is rounded down to the nearest millisecond because browsers render dates at millisecond precision.'
          : detectedUnit === 'nanoseconds' && raw % 1_000_000n !== 0n
            ? 'Calendar output is rounded down to the nearest millisecond because browsers render dates at millisecond precision.'
            : undefined,
    },
  };
}

function parseFlexibleDateValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return { error: 'Enter a valid timestamp or date value.', output: null as null };
  }

  if (/^-?\d+$/.test(trimmed)) {
    const parsedTimestamp = parseUnixTimestampValue(trimmed);
    if (parsedTimestamp.error || !parsedTimestamp.output) {
      return { error: 'Enter a valid timestamp or date value.', output: null as null };
    }

    return {
      error: '',
      output: {
        date: parsedTimestamp.output.date,
        source: 'timestamp' as const,
      },
    };
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return { error: 'Enter a valid timestamp or date value.', output: null as null };
  }

  return {
    error: '',
    output: {
      date,
      source: 'date' as const,
    },
  };
}

export function parseTimestamp(value: string, referenceTime = Date.now()): TransformResult<TimestampDetails | null> {
  if (!value.trim()) {
    return { error: '', output: null };
  }

  const parsed = parseUnixTimestampValue(value);
  if (parsed.error || !parsed.output) {
    return {
      error: timestampInputError,
      output: null,
    };
  }

  const { date, detectedUnit, precisionNote } = parsed.output;
  const unixMilliseconds = date.getTime();
  const unixSeconds = Math.floor(unixMilliseconds / 1000);
  const unixMicroseconds = `${BigInt(unixMilliseconds) * 1_000n}`;
  const unixNanoseconds = `${BigInt(unixMilliseconds) * 1_000_000n}`;

  return {
    error: '',
    output: {
      detectedUnit,
      iso: date.toISOString(),
      rfc3339: date.toISOString(),
      rfc2822: date.toUTCString(),
      utc: date.toUTCString(),
      local: format(date, 'PPpp'),
      relative: formatRelativeTimestamp(unixMilliseconds, referenceTime),
      unixSeconds,
      unixMilliseconds,
      unixMicroseconds,
      unixNanoseconds,
      precisionNote,
    },
  };
}

export function buildPasswordCharset(options: PasswordOptions) {
  let charset = '';
  if (options.includeUppercase) charset += uppercaseCharacters;
  if (options.includeLowercase) charset += lowercaseCharacters;
  if (options.includeNumbers) charset += numberCharacters;
  if (options.includeSymbols) charset += symbolCharacters;
  return charset;
}

export function generatePassword(options: PasswordOptions, randomValues?: Uint32Array): string {
  const charset = buildPasswordCharset(options);
  if (!charset) return '';

  const values = randomValues ?? crypto.getRandomValues(new Uint32Array(options.length));
  return Array.from(values, (value) => charset[value % charset.length]).join('');
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { label: 'Not generated', width: '0%', tone: '#E2E8F0' };

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (password.length >= 16) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { label: 'Weak', width: '25%', tone: '#DC2626' };
  if (strength <= 4) return { label: 'Fair', width: '50%', tone: '#D97706' };
  if (strength <= 5) return { label: 'Good', width: '75%', tone: '#0058be' };
  return { label: 'Strong', width: '100%', tone: '#059669' };
}

function decodeBase64UrlSegment(value: string) {
  const normalized = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=');

  return atob(normalized);
}

export function decodeJwtToken(token: string): TransformResult<DecodedJwtToken | null> {
  if (!token.trim()) {
    return { error: '', output: null };
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT tokens must contain header, payload, and signature segments.');
    }

    const [headerSegment, payloadSegment, signature] = parts;
    const parseSegment = (value: string) => JSON.parse(decodeBase64UrlSegment(value)) as Record<string, unknown>;

    return {
      error: '',
      output: {
        header: parseSegment(headerSegment),
        payload: parseSegment(payloadSegment),
        signature,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Invalid JWT token.',
      output: null,
    };
  }
}

export function analyzeJwtToken(decoded: DecodedJwtToken, now = Date.now()): JwtAnalysis {
  const warnings: string[] = [];
  const info: string[] = [];
  const payload = decoded.payload as Record<string, number | string | undefined>;
  const header = decoded.header as Record<string, string | undefined>;

  if (payload.exp) {
    const expiration = new Date(Number(payload.exp) * 1000);
    if (expiration.getTime() < now) {
      warnings.push(`Token expired on ${expiration.toLocaleString()}.`);
    } else {
      info.push(`Token expires on ${expiration.toLocaleString()}.`);
    }
  }

  if (payload.iat) {
    info.push(`Token issued on ${new Date(Number(payload.iat) * 1000).toLocaleString()}.`);
  }

  if (header.alg === 'none') {
    warnings.push('The token uses the "none" algorithm and should not be trusted.');
  }

  return { warnings, info };
}

export function formatRegexFlags(flags: RegexFlags) {
  return Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => flag)
    .join('');
}

export function analyzeRegex(pattern: string, flags: RegexFlags, testString: string): TransformResult<RegexMatch[]> {
  if (!pattern || !testString) {
    return { error: '', output: [] };
  }

  try {
    const regex = new RegExp(pattern, formatRegexFlags(flags));
    const matches: RegexMatch[] = [];

    if (flags.g) {
      let match: RegExpExecArray | null;

      while ((match = regex.exec(testString)) !== null) {
        matches.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1).filter((group): group is string => typeof group === 'string'),
        });

        if (match.index === regex.lastIndex) {
          regex.lastIndex += 1;
        }
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        matches.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1).filter((group): group is string => typeof group === 'string'),
        });
      }
    }

    return { error: '', output: matches };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Invalid regular expression.',
      output: [],
    };
  }
}

export function encodeHtmlEntities(value: string) {
  if (!value) return '';

  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function decodeHtmlEntities(value: string) {
  if (!value) return '';

  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

export function transformHtmlEntities(value: string, mode: QueryMode): TransformResult<string> {
  if (!value) {
    return { error: '', output: '' };
  }

  return {
    error: '',
    output: mode === 'encode' ? encodeHtmlEntities(value) : decodeHtmlEntities(value),
  };
}

export function generateUuidList(count: number) {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

function encodeBase32(value: number, length: number) {
  let output = '';
  let remainder = value;

  for (let index = 0; index < length; index += 1) {
    output = crockfordBase32[remainder % 32] + output;
    remainder = Math.floor(remainder / 32);
  }

  return output;
}

export function generateUlid(timestamp = Date.now(), randomValues?: Uint8Array) {
  const timePart = encodeBase32(timestamp, 10);
  const randomBytes = randomValues ?? crypto.getRandomValues(new Uint8Array(16));

  let accumulator = 0n;
  for (const value of randomBytes) {
    accumulator = (accumulator << 8n) | BigInt(value);
  }

  let randomPart = '';
  for (let index = 0; index < 16; index += 1) {
    const charIndex = Number(accumulator & 31n);
    randomPart = crockfordBase32[charIndex] + randomPart;
    accumulator >>= 5n;
  }

  return `${timePart}${randomPart}`;
}

export function generateUlidList(count: number, randomBytesList?: Uint8Array[]) {
  return Array.from({ length: count }, (_, index) => generateUlid(Date.now() + index, randomBytesList?.[index]));
}

export function generateHmacs(message: string, secret: string): HmacResult {
  if (!message || !secret) {
    return { sha256: '', sha512: '' };
  }

  return {
    sha256: CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Hex),
    sha512: CryptoJS.HmacSHA512(message, secret).toString(CryptoJS.enc.Hex),
  };
}

function normalizeQueryMap(value: unknown): QueryValueMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Enter a JSON object with string values or arrays of strings.');
  }

  const entries = Object.entries(value as Record<string, unknown>);
  return Object.fromEntries(
    entries.map(([key, entryValue]) => {
      if (Array.isArray(entryValue)) {
        return [key, entryValue.map((item) => String(item))];
      }

      return [key, String(entryValue)];
    }),
  );
}

export function transformQueryParams(value: string, mode: QueryMode): TransformResult<string> {
  if (!value.trim()) {
    return { error: '', output: '' };
  }

  try {
    if (mode === 'encode') {
      const parsed = normalizeQueryMap(JSON.parse(value));
      const params = new URLSearchParams();

      for (const [key, entryValue] of Object.entries(parsed)) {
        if (Array.isArray(entryValue)) {
          entryValue.forEach((item) => params.append(key, item));
        } else {
          params.append(key, entryValue);
        }
      }

      return { error: '', output: params.toString() };
    }

    const params = new URLSearchParams(value.startsWith('?') ? value.slice(1) : value);
    const queryMap: QueryValueMap = {};

    for (const [key, entryValue] of params.entries()) {
      const existing = queryMap[key];
      if (typeof existing === 'undefined') {
        queryMap[key] = entryValue;
      } else if (Array.isArray(existing)) {
        existing.push(entryValue);
      } else {
        queryMap[key] = [existing, entryValue];
      }
    }

    return {
      error: '',
      output: JSON.stringify(queryMap, null, 2),
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : mode === 'encode'
            ? 'Unable to encode the provided JSON object.'
            : 'Unable to decode the provided query string.',
      output: '',
    };
  }
}

export function transformHex(value: string, mode: QueryMode): TransformResult<string> {
  if (!value) {
    return { error: '', output: '' };
  }

  try {
    if (mode === 'encode') {
      return {
        error: '',
        output: Array.from(textEncoder.encode(value), (byte) => byte.toString(16).padStart(2, '0')).join(' '),
      };
    }

    const normalized = value.replace(/\s+/g, '').trim();
    if (normalized.length % 2 !== 0 || /[^0-9a-f]/i.test(normalized)) {
      throw new Error('Enter valid hexadecimal byte pairs to decode.');
    }

    const bytes = new Uint8Array(
      normalized.match(/.{1,2}/g)?.map((chunk) => Number.parseInt(chunk, 16)) ?? [],
    );
    return {
      error: '',
      output: textDecoder.decode(bytes),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to transform the provided hexadecimal value.',
      output: '',
    };
  }
}

export function slugifyText(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function transformUnicodeEscapes(value: string, mode: QueryMode): TransformResult<string> {
  if (!value) {
    return { error: '', output: '' };
  }

  try {
    if (mode === 'encode') {
      return {
        error: '',
        output: Array.from(value, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`).join(''),
      };
    }

    return {
      error: '',
      output: value.replace(/\\u([0-9a-fA-F]{4})/g, (_, hexValue: string) =>
        String.fromCharCode(Number.parseInt(hexValue, 16)),
      ),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to transform unicode escapes.',
      output: '',
    };
  }
}

function escapeCsvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function parseCsvRows(value: string) {
  const rows: string[][] = [];
  let currentCell = '';
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const nextChar = value[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        index += 1;
      }
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell);
  rows.push(currentRow);

  return rows.filter((row) => row.some((cell) => cell.length > 0));
}

export function transformCsvJson(value: string, mode: CsvJsonMode): TransformResult<string> {
  if (!value.trim()) {
    return { error: '', output: '' };
  }

  try {
    if (mode === 'csv-to-json') {
      const [headerRow, ...dataRows] = parseCsvRows(value);
      if (!headerRow || headerRow.length === 0) {
        throw new Error('Enter CSV with a header row.');
      }

      const output = dataRows.map((row) =>
        Object.fromEntries(headerRow.map((key, index) => [key, row[index] ?? ''])),
      );

      return {
        error: '',
        output: JSON.stringify(output, null, 2),
      };
    }

    const parsed = JSON.parse(value) as Array<Record<string, unknown>>;
    if (!Array.isArray(parsed) || parsed.length === 0 || typeof parsed[0] !== 'object' || parsed[0] === null) {
      throw new Error('Enter a JSON array of objects to convert into CSV.');
    }

    const headers = Array.from(new Set(parsed.flatMap((item) => Object.keys(item))));
    const rows = [
      headers.join(','),
      ...parsed.map((item) => headers.map((header) => escapeCsvCell(String(item[header] ?? ''))).join(',')),
    ];

    return {
      error: '',
      output: rows.join('\n'),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to transform the provided CSV or JSON input.',
      output: '',
    };
  }
}

function buildDiffMatrix(left: string[], right: string[]) {
  const matrix = Array.from({ length: left.length + 1 }, () => Array.from({ length: right.length + 1 }, () => 0));

  for (let leftIndex = left.length - 1; leftIndex >= 0; leftIndex -= 1) {
    for (let rightIndex = right.length - 1; rightIndex >= 0; rightIndex -= 1) {
      if (left[leftIndex] === right[rightIndex]) {
        matrix[leftIndex][rightIndex] = matrix[leftIndex + 1][rightIndex + 1] + 1;
      } else {
        matrix[leftIndex][rightIndex] = Math.max(matrix[leftIndex + 1][rightIndex], matrix[leftIndex][rightIndex + 1]);
      }
    }
  }

  return matrix;
}

export function diffText(left: string, right: string): DiffLine[] {
  const leftLines = left.split(/\r?\n/);
  const rightLines = right.split(/\r?\n/);
  const matrix = buildDiffMatrix(leftLines, rightLines);
  const output: DiffLine[] = [];

  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < leftLines.length && rightIndex < rightLines.length) {
    if (leftLines[leftIndex] === rightLines[rightIndex]) {
      output.push({ kind: 'unchanged', value: leftLines[leftIndex] });
      leftIndex += 1;
      rightIndex += 1;
      continue;
    }

    if (matrix[leftIndex + 1][rightIndex] >= matrix[leftIndex][rightIndex + 1]) {
      output.push({ kind: 'removed', value: leftLines[leftIndex] });
      leftIndex += 1;
    } else {
      output.push({ kind: 'added', value: rightLines[rightIndex] });
      rightIndex += 1;
    }
  }

  while (leftIndex < leftLines.length) {
    output.push({ kind: 'removed', value: leftLines[leftIndex] });
    leftIndex += 1;
  }

  while (rightIndex < rightLines.length) {
    output.push({ kind: 'added', value: rightLines[rightIndex] });
    rightIndex += 1;
  }

  return output.filter((line) => !(line.kind === 'unchanged' && line.value === '' && output.length === 1));
}

function tokenizeInlineDiff(value: string) {
  return value.match(/\s+|[^\s]+/g) ?? [];
}

export function diffInlineText(left: string, right: string): { left: DiffFragment[]; right: DiffFragment[] } {
  const leftTokens = tokenizeInlineDiff(left);
  const rightTokens = tokenizeInlineDiff(right);
  const matrix = buildDiffMatrix(leftTokens, rightTokens);
  const leftOutput: DiffFragment[] = [];
  const rightOutput: DiffFragment[] = [];

  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < leftTokens.length && rightIndex < rightTokens.length) {
    if (leftTokens[leftIndex] === rightTokens[rightIndex]) {
      leftOutput.push({ kind: 'unchanged', value: leftTokens[leftIndex] });
      rightOutput.push({ kind: 'unchanged', value: rightTokens[rightIndex] });
      leftIndex += 1;
      rightIndex += 1;
      continue;
    }

    if (matrix[leftIndex + 1][rightIndex] >= matrix[leftIndex][rightIndex + 1]) {
      leftOutput.push({ kind: 'removed', value: leftTokens[leftIndex] });
      leftIndex += 1;
    } else {
      rightOutput.push({ kind: 'added', value: rightTokens[rightIndex] });
      rightIndex += 1;
    }
  }

  while (leftIndex < leftTokens.length) {
    leftOutput.push({ kind: 'removed', value: leftTokens[leftIndex] });
    leftIndex += 1;
  }

  while (rightIndex < rightTokens.length) {
    rightOutput.push({ kind: 'added', value: rightTokens[rightIndex] });
    rightIndex += 1;
  }

  return { left: leftOutput, right: rightOutput };
}

function detectCommitType(summary: string) {
  if (/\b(test|spec|coverage|vitest|playwright)\b/.test(summary)) return 'test';
  if (/\b(doc|readme|comment|guide|copy deck)\b/.test(summary)) return 'docs';
  if (/\b(refactor|cleanup|rename|restructure|simplify)\b/.test(summary)) return 'refactor';
  if (/\b(build|deps|dependency|version|release|ci|workflow|docker|bundle)\b/.test(summary)) return 'chore';
  if (/\b(add|enable|implement|create|support|introduce|launch)\b/.test(summary)) return 'feat';
  return 'fix';
}

function detectCommitScope(summary: string) {
  if (/\bgithub actions|workflow|ci\b/.test(summary)) return 'ci';
  if (/\bdocker|container\b/.test(summary)) return 'docker';
  if (/\bbundle|asset|vite\b/.test(summary)) return 'build';
  if (/\bdependency|package\.json|npm|pnpm|yarn\b/.test(summary)) return 'deps';
  if (/\btheme|sidebar|layout|button|ui|css|page|screen|tool\b/.test(summary)) return 'ui';
  if (/\bauth|token|jwt|security\b/.test(summary)) return 'security';
  return 'app';
}

function detectCommitScopeFromFiles(files: string[]) {
  const normalized = files.join(' ').toLowerCase();
  if (normalized.includes('.github/workflows')) return 'ci';
  if (normalized.includes('dockerfile')) return 'docker';
  if (normalized.includes('qasettings') || normalized.includes('/configuration/qa')) return 'qa';
  if (normalized.includes('package.json') || normalized.includes('pnpm-lock') || normalized.includes('package-lock') || normalized.includes('yarn.lock')) return 'deps';
  if (normalized.includes('src/tools/textdiffchecker') || normalized.includes('text-diff')) return 'diff';
  if (normalized.includes('sidebar')) return 'sidebar';
  if (normalized.includes('theme')) return 'theme';
  if (normalized.includes('auth') || normalized.includes('jwt')) return 'auth';
  if (normalized.includes('test') || normalized.includes('spec')) return 'test';

  const srcMatch = normalized.match(/src\/(?:tools|components|pages)\/([a-z0-9-_.]+)/);
  if (srcMatch) {
    return srcMatch[1]
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[^a-z0-9]+/g, '-');
  }

  return 'app';
}

function detectCommitTypeFromFilesAndLines(files: string[], addedLines: string[], removedLines: string[]) {
  const normalizedFiles = files.join(' ').toLowerCase();
  const normalizedLines = [...addedLines, ...removedLines].join(' ').toLowerCase();

  if (normalizedFiles.includes('.github/workflows')) return 'ci';
  if (normalizedFiles.includes('dockerfile')) return 'chore';
  if (/featureenabled|enabled\s*=>\s*true|launchdarkly|_preferences\.get/i.test([...addedLines, ...removedLines].join(' '))) return 'feat';
  if (/baseurl\s*=|apimkey\s*=|scope\s*=|azureidentityclientid\s*=|accesskey\s*=|endpoint\s*=/i.test(addedLines.join(' '))) return 'chore';
  if (normalizedFiles.includes('test') || normalizedFiles.includes('spec') || normalizedLines.includes('playwright') || normalizedLines.includes('vitest')) return 'test';
  if (normalizedFiles.includes('readme') || normalizedFiles.includes('.md')) return 'docs';
  if (normalizedFiles.includes('package.json') || normalizedFiles.includes('pnpm-lock') || normalizedFiles.includes('package-lock') || normalizedFiles.includes('yarn.lock')) return 'chore';
  if (/\b(add|create|introduce|implement|enable)\b/.test(normalizedLines)) return 'feat';
  if (/\b(remove|delete|drop)\b/.test(normalizedLines)) return 'refactor';
  if (/\b(fix|correct|prevent|resolve|restore)\b/.test(normalizedLines)) return 'fix';

  return 'fix';
}

function inferSubjectFromDiff(files: string[], scope: string, addedLines: string[], removedLines: string[]) {
  const normalizedFiles = files.join(' ').toLowerCase();
  const addedText = addedLines.join(' ').toLowerCase();
  const removedText = removedLines.join(' ').toLowerCase();
  const mergedText = `${addedText} ${removedText}`;

  const countSubstring = (value: string, fragment: string) => value.split(fragment).length - 1;

  const touchesGitignore = normalizedFiles.includes('.gitignore');
  const touchesQaSettings = normalizedFiles.includes('qasettings');
  const touchesFeatureFlags =
    /featureenabled|enabled\s*=>\s*true|launchdarkly|_preferences\.get/i.test(mergedText);
  const touchesCredentialsOrEndpoints =
    /baseurl\s*=|apimkey\s*=|scope\s*=|azureidentityclientid\s*=|accesskey\s*=|endpoint\s*=/i.test(addedLines.join(' '));
  const railMentions = countSubstring(mergedText, 'rail');
  const lateralMentions = countSubstring(mergedText, 'lateral');
  const gangMentions = countSubstring(mergedText, 'gang');

  if (normalizedFiles.includes('.github/workflows')) return 'tighten workflow checks';
  if (normalizedFiles.includes('dockerfile')) return 'improve container build hygiene';
  if (normalizedFiles.includes('package.json') || normalizedFiles.includes('pnpm-lock') || normalizedFiles.includes('package-lock') || normalizedFiles.includes('yarn.lock')) return 'update dependency metadata';
  if (scope === 'diff') return 'refine side-by-side diff review layout';
  if (scope === 'sidebar') return 'polish sidebar interaction flow';
  if (scope === 'theme') return 'improve theme contrast and toggle behavior';
  if (touchesQaSettings && touchesFeatureFlags && (railMentions > 0 || lateralMentions > 0)) {
    return 'configure qa settings and enable rail-related feature flags';
  }
  if (touchesQaSettings && touchesCredentialsOrEndpoints) {
    return 'populate qa environment settings';
  }
  if (touchesFeatureFlags && railMentions > 0 && lateralMentions > 0) {
    return 'enable rail and lateral stability feature flags';
  }
  if (touchesFeatureFlags && railMentions > 0) {
    return 'enable rail feature flags';
  }
  if (touchesFeatureFlags && gangMentions > 0) {
    return 'update gang time feature flags';
  }
  if (touchesGitignore && touchesQaSettings) {
    return 'update qa configuration files and ignore local agent assets';
  }

  const changedIdentifiers = [...addedLines, ...removedLines]
    .map((line) => line.match(/\b[A-Za-z][A-Za-z0-9_-]{2,}\b/g) ?? [])
    .flat()
    .filter((token) => !['const', 'return', 'import', 'from', 'className', 'function', 'button', 'div'].includes(token.toLowerCase()));

  const primaryToken = changedIdentifiers[0]?.toLowerCase();
  if (primaryToken && /\b(add|create|introduce|implement|enable)\b/.test(addedText)) {
    return `add ${primaryToken} support`;
  }

  if (primaryToken && /\b(remove|delete|drop)\b/.test(removedText)) {
    return `remove old ${primaryToken} path`;
  }

  if (primaryToken && /\b(fix|correct|prevent|resolve|restore)\b/.test(`${addedText} ${removedText}`)) {
    return `fix ${primaryToken} behavior`;
  }

  return `update ${scope} workflow`;
}

function parseDiffInput(value: string): ParsedDiffInput | null {
  if (!/(^diff --git )|(^@@ )|(^\+\+\+ )|(^--- )/m.test(value)) {
    return null;
  }

  const files: string[] = [];
  const addedLines: string[] = [];
  const removedLines: string[] = [];
  const changedPaths: string[] = [];

  for (const line of value.split(/\r?\n/)) {
    if (line.startsWith('diff --git ')) {
      const match = line.match(/^diff --git a\/(.+?) b\/(.+)$/);
      if (match) {
        files.push(match[2]);
      }
      continue;
    }

    if (line.startsWith('+++ b/')) {
      changedPaths.push(line.slice(6).trim());
      continue;
    }

    if (line.startsWith('+') && !line.startsWith('+++')) {
      const next = line.slice(1).trim();
      if (next) addedLines.push(next);
      continue;
    }

    if (line.startsWith('-') && !line.startsWith('---')) {
      const next = line.slice(1).trim();
      if (next) removedLines.push(next);
    }
  }

  const uniqueFiles = Array.from(new Set([...files, ...changedPaths]));

  return {
    files: uniqueFiles,
    changedPaths,
    addedLines,
    removedLines,
  };
}

function toSentenceCase(value: string) {
  const trimmed = value.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function generateCommitSuggestions(value: string): TransformResult<CommitSuggestion[]> {
  const normalized = value.trim();
  if (!normalized) {
    return { error: '', output: [] };
  }

  const parsedDiff = parseDiffInput(normalized);
  if (parsedDiff) {
    if (parsedDiff.files.length === 0 && parsedDiff.addedLines.length === 0 && parsedDiff.removedLines.length === 0) {
      return { error: 'Paste a real unified diff or a short summary so the tool has enough context.', output: [] };
    }

    const scope = detectCommitScopeFromFiles(parsedDiff.files);
    const type = detectCommitTypeFromFilesAndLines(parsedDiff.files, parsedDiff.addedLines, parsedDiff.removedLines);
    const subject = inferSubjectFromDiff(parsedDiff.files, scope, parsedDiff.addedLines, parsedDiff.removedLines);
    const primary = `${type}(${scope}): ${subject}`;
    const fileSummary =
      parsedDiff.files.length > 0 ? parsedDiff.files.slice(0, 2).join(', ') : 'the pasted diff';
    const fileCountSuffix = parsedDiff.files.length > 2 ? ` and ${parsedDiff.files.length - 2} more files` : '';

    return {
      error: '',
      output: [
        {
          label: 'Conventional commit',
          message: primary,
          rationale: `Parsed pasted diff input from ${fileSummary}${fileCountSuffix} and inferred ${type}/${scope} from the changed files and hunks.`,
        },
        {
          label: 'Release note style',
          message: `${type}: ${toSentenceCase(subject)}`,
          rationale: 'A flatter message shape for teams that prefer short squash-merge summaries.',
        },
        {
          label: 'Detailed team style',
          message: `${primary}\n\n- Reviewed ${parsedDiff.files.length || 1} changed file${parsedDiff.files.length === 1 ? '' : 's'}\n- Derived from pasted git diff output`,
          rationale: 'Adds a small body so reviewers understand that the message came from diff context rather than free-form notes.',
        },
      ],
    };
  }

  const summaryLine = normalized
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .find(Boolean);

  if (!summaryLine) {
    return { error: 'Add a short summary or diff notes to generate commit messages.', output: [] };
  }

  const summary = summaryLine.toLowerCase();
  const type = detectCommitType(summary);
  const scope = detectCommitScope(summary);
  const subject = summaryLine
    .replace(/\b(fix|fixed|fixes|add|added|adding|implement|implemented|implementing|enable|enabled|enabling)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.$/, '');

  const normalizedSubject = (subject || summaryLine).toLowerCase();
  const primary = `${type}(${scope}): ${normalizedSubject}`;
  const capitalizedSubject = toSentenceCase(normalizedSubject);

  return {
    error: '',
    output: [
      {
        label: 'Conventional commit',
        message: primary,
        rationale: `Detected a ${type} change touching ${scope} based on the diff notes you provided.`,
      },
      {
        label: 'Release note style',
        message: `${type}: ${capitalizedSubject}`,
        rationale: 'A flatter format that still keeps the intent explicit for changelogs and squash merges.',
      },
      {
        label: 'Detailed team style',
        message: `${primary}\n\n- ${capitalizedSubject}\n- Keep the workflow private and browser-first`,
        rationale: 'Adds a short body for teams that prefer extra merge context in the commit message.',
      },
    ],
  };
}

export function analyzeDockerfile(value: string): TransformResult<DockerOptimizationReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const findings: DockerFinding[] = [];

  if (!/^FROM\s+/m.test(source)) {
    return {
      error: 'A Dockerfile needs at least one FROM instruction.',
      output: null,
    };
  }

  if (/FROM\s+[^\s]+:latest\b/i.test(source)) {
    findings.push({
      severity: 'medium',
      title: 'Pin the base image more tightly',
      detail: 'Using the latest tag makes rebuilds drift over time. Prefer a versioned image tag.',
    });
  }

  if (/RUN\s+npm\s+install\b/i.test(source) && !/RUN\s+npm\s+ci\b/i.test(source)) {
    findings.push({
      severity: 'medium',
      title: 'Prefer npm ci for repeatable installs',
      detail: 'npm ci is more deterministic for CI and image builds when a lockfile exists.',
    });
  }

  if (/apt-get\s+install/i.test(source) && !/rm -rf \/var\/lib\/apt\/lists/i.test(source)) {
    findings.push({
      severity: 'medium',
      title: 'Clean apt metadata after install',
      detail: 'Removing /var/lib/apt/lists keeps layers smaller after apt-get install commands.',
    });
  }

  if (/RUN\s+npm\s+run\s+build/i.test(source) && !/FROM[\s\S]+AS\s+\w+/i.test(source)) {
    findings.push({
      severity: 'low',
      title: 'Consider a multi-stage build',
      detail: 'Build steps and runtime layers can often be split to keep production images leaner.',
    });
  }

  if (!/^USER\s+/m.test(source)) {
    findings.push({
      severity: 'medium',
      title: 'Drop root where possible',
      detail: 'Running as a non-root user reduces blast radius for runtime issues.',
    });
  }

  if (!/^HEALTHCHECK\s+/m.test(source)) {
    findings.push({
      severity: 'low',
      title: 'Add a health check',
      detail: 'A HEALTHCHECK improves container observability and orchestration feedback.',
    });
  }

  const score = Math.max(0, 100 - findings.reduce((total, finding) => total + (finding.severity === 'high' ? 25 : finding.severity === 'medium' ? 15 : 8), 0));

  let optimizedDockerfile = source.replace(/\bRUN\s+npm\s+install\b/g, 'RUN npm ci');
  if (/node:/i.test(source) && !/^USER\s+/m.test(optimizedDockerfile)) {
    optimizedDockerfile = `${optimizedDockerfile}\n\nUSER node`;
  }
  if (/apt-get\s+install/i.test(optimizedDockerfile) && !/rm -rf \/var\/lib\/apt\/lists/i.test(optimizedDockerfile)) {
    optimizedDockerfile = optimizedDockerfile.replace(
      /(apt-get\s+install[^\n]*)/i,
      '$1 && rm -rf /var/lib/apt/lists/*',
    );
  }

  return {
    error: '',
    output: {
      score,
      findings,
      optimizedDockerfile,
    },
  };
}

export function validateGitHubActions(value: string): TransformResult<ActionsValidationReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const findings: DockerFinding[] = [];
  const triggers: string[] = [];
  const jobs: ActionsJobSummary[] = [];
  const lines = source.split(/\r?\n/);

  if (!/^name:/m.test(source)) {
    findings.push({ severity: 'low', title: 'Workflow name is missing', detail: 'A name helps reviewers identify the workflow quickly in pull requests.' });
  }

  if (!/^on:/m.test(source)) {
    findings.push({ severity: 'high', title: 'Trigger section is missing', detail: 'GitHub Actions workflows need an on: block to define when they run.' });
  } else {
    for (const line of lines) {
      const triggerMatch = line.match(/^\s{2}([A-Za-z_][\w-]*):\s*$/);
      if (triggerMatch && triggers.length < 12) {
        triggers.push(triggerMatch[1]);
      }
    }
  }

  if (!/^jobs:/m.test(source)) {
    findings.push({ severity: 'high', title: 'Jobs section is missing', detail: 'A workflow without jobs cannot execute any steps.' });
  } else {
    let currentJob: ActionsJobSummary | null = null;
    let inJobsSection = false;

    for (const line of lines) {
      if (/^jobs:\s*$/i.test(line)) {
        inJobsSection = true;
        continue;
      }

      if (inJobsSection && /^[^\s]/.test(line)) {
        if (currentJob) jobs.push(currentJob);
        currentJob = null;
        inJobsSection = false;
      }

      if (!inJobsSection) continue;

      const jobMatch = line.match(/^ {2}([A-Za-z0-9_-]+):\s*$/);
      if (jobMatch) {
        if (currentJob) jobs.push(currentJob);
        currentJob = { name: jobMatch[1], hasRunsOn: false, hasSteps: false, stepCount: 0 };
        continue;
      }

      if (!currentJob) continue;

      if (/^\s{4}runs-on:/i.test(line)) currentJob.hasRunsOn = true;
      if (/^\s{4}steps:/i.test(line)) currentJob.hasSteps = true;
      if (/^\s{6}-\s+(name:|uses:|run:)/i.test(line)) currentJob.stepCount += 1;
    }

    if (currentJob) jobs.push(currentJob);
  }

  for (const job of jobs) {
    if (!job.hasRunsOn) {
      findings.push({ severity: 'high', title: `Job "${job.name}" is missing runs-on`, detail: 'Each job should declare a runner such as ubuntu-latest or windows-latest.' });
    }

    if (!job.hasSteps) {
      findings.push({ severity: 'high', title: `Job "${job.name}" has no steps`, detail: 'Without steps the job has nothing to execute.' });
    }
  }

  if (!/uses:\s+actions\/checkout@/i.test(source)) {
    findings.push({ severity: 'medium', title: 'Checkout step not found', detail: 'Most CI workflows need actions/checkout before they can build or test repository code.' });
  }

  if (!/^permissions:/m.test(source)) {
    findings.push({ severity: 'low', title: 'Permissions are implicit', detail: 'Declaring permissions explicitly makes workflow access clearer and tighter.' });
  }

  if (!/timeout-minutes:/i.test(source)) {
    findings.push({ severity: 'low', title: 'No timeout configured', detail: 'Adding timeout-minutes helps stop hanging jobs from burning CI time.' });
  }

  return {
    error: '',
    output: {
      triggers,
      jobs,
      findings,
    },
  };
}

type DependencyMapKey = DependencyEntry['ecosystem'];

function collectDependencyEntries(input: Record<string, unknown>, ecosystem: DependencyMapKey) {
  const section = input[ecosystem];
  if (!section || typeof section !== 'object' || Array.isArray(section)) return [] as DependencyEntry[];

  return Object.entries(section as Record<string, unknown>)
    .map(([name, version]) => ({
      name,
      version: String(version),
      ecosystem,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function visualizeDependencies(value: string): TransformResult<DependencyVisualizationReport | null> {
  if (!value.trim()) {
    return { error: '', output: null };
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const entries = (['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'] as DependencyMapKey[])
      .flatMap((ecosystem) => collectDependencyEntries(parsed, ecosystem));

    const totals = {
      dependencies: entries.filter((entry) => entry.ecosystem === 'dependencies').length,
      devDependencies: entries.filter((entry) => entry.ecosystem === 'devDependencies').length,
      peerDependencies: entries.filter((entry) => entry.ecosystem === 'peerDependencies').length,
      optionalDependencies: entries.filter((entry) => entry.ecosystem === 'optionalDependencies').length,
    };

    const counts = new Map<string, number>();
    for (const entry of entries) {
      counts.set(entry.name, (counts.get(entry.name) ?? 0) + 1);
    }

    const duplicateNames = Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([name]) => name)
      .sort();

    const scripts =
      parsed.scripts && typeof parsed.scripts === 'object' && !Array.isArray(parsed.scripts)
        ? Object.keys(parsed.scripts as Record<string, unknown>).sort()
        : [];

    return {
      error: '',
      output: {
        packageName: typeof parsed.name === 'string' ? parsed.name : 'Unnamed package',
        version: typeof parsed.version === 'string' ? parsed.version : '0.0.0',
        totals,
        entries,
        duplicateNames,
        scripts,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to parse the provided package manifest.',
      output: null,
    };
  }
}

function parseBundleBytes(value: string) {
  const match = value.trim().match(/^([\d.]+)\s*(b|kb|kib|mb|mib|gb|gib)?$/i);
  if (!match) return null;

  const amount = Number.parseFloat(match[1]);
  const unit = (match[2] ?? 'b').toLowerCase();

  const multipliers: Record<string, number> = {
    b: 1,
    kb: 1000,
    kib: 1024,
    mb: 1000 * 1000,
    mib: 1024 * 1024,
    gb: 1000 * 1000 * 1000,
    gib: 1024 * 1024 * 1024,
  };

  return Math.round(amount * (multipliers[unit] ?? 1));
}

function detectAssetType(name: string): BundleAsset['type'] {
  if (/\.(m?js|cjs|ts|tsx)$/i.test(name)) return 'javascript';
  if (/\.(css|scss|sass|less)$/i.test(name)) return 'stylesheet';
  if (/\.(html|htm)$/i.test(name)) return 'html';
  if (/\.(png|jpg|jpeg|gif|svg|webp|avif)$/i.test(name)) return 'image';
  if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) return 'font';
  return 'other';
}

export function calculateBundleSize(value: string): TransformResult<BundleSizeReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const assets: BundleAsset[] = [];

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const csvMatch = line.match(/^([^,]+),\s*([^,]+)$/);
    const spacedMatch = line.match(/^(.+?)\s+(\d+(?:\.\d+)?\s*(?:b|kb|kib|mb|mib|gb|gib)?)$/i);
    const parsed = csvMatch ?? spacedMatch;

    if (!parsed) {
      return {
        error: `Could not parse bundle line: "${line}". Use "file.js, 12kb" or "file.js 12kb".`,
        output: null,
      };
    }

    const name = parsed[1].trim();
    const bytes = parseBundleBytes(parsed[2]);

    if (!bytes) {
      return {
        error: `Could not read the size for "${name}".`,
        output: null,
      };
    }

    assets.push({
      name,
      bytes,
      type: detectAssetType(name),
    });
  }

  const totalBytes = assets.reduce((sum, asset) => sum + asset.bytes, 0);
  const byType = {
    javascript: assets.filter((asset) => asset.type === 'javascript').reduce((sum, asset) => sum + asset.bytes, 0),
    stylesheet: assets.filter((asset) => asset.type === 'stylesheet').reduce((sum, asset) => sum + asset.bytes, 0),
    html: assets.filter((asset) => asset.type === 'html').reduce((sum, asset) => sum + asset.bytes, 0),
    image: assets.filter((asset) => asset.type === 'image').reduce((sum, asset) => sum + asset.bytes, 0),
    font: assets.filter((asset) => asset.type === 'font').reduce((sum, asset) => sum + asset.bytes, 0),
    other: assets.filter((asset) => asset.type === 'other').reduce((sum, asset) => sum + asset.bytes, 0),
  };
  const textAssetBytes = byType.javascript + byType.stylesheet + byType.html;

  return {
    error: '',
    output: {
      assets: [...assets].sort((left, right) => right.bytes - left.bytes),
      totalBytes,
      estimatedTextGzipBytes: Math.round(textAssetBytes * 0.3),
      largestAsset: assets.length > 0 ? [...assets].sort((left, right) => right.bytes - left.bytes)[0] : null,
      byType,
    },
  };
}

function tokenizeShellCommand(value: string) {
  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];

    if (quote) {
      if (char === quote) {
        quote = null;
      } else if (char === '\\' && quote === '"' && index + 1 < value.length) {
        current += value[index + 1];
        index += 1;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    if (char === '\\' && index + 1 < value.length) {
      current += value[index + 1];
      index += 1;
      continue;
    }

    current += char;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

function escapeJsonString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function convertCurlToCode(value: string): TransformResult<CurlConversionReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const normalized = source.replace(/\\\r?\n/g, ' ');
  const tokens = tokenizeShellCommand(normalized);
  if (tokens[0] !== 'curl') {
    return {
      error: 'Start the command with curl so the converter can understand the request shape.',
      output: null,
    };
  }

  const headers: Array<{ key: string; value: string }> = [];
  const warnings: string[] = [];
  let method = '';
  let url = '';
  let body = '';

  for (let index = 1; index < tokens.length; index += 1) {
    const token = tokens[index];
    const next = tokens[index + 1] ?? '';

    if ((token === '-X' || token === '--request') && next) {
      method = next.toUpperCase();
      index += 1;
      continue;
    }

    if ((token === '-H' || token === '--header') && next) {
      const separatorIndex = next.indexOf(':');
      if (separatorIndex > -1) {
        headers.push({
          key: next.slice(0, separatorIndex).trim(),
          value: next.slice(separatorIndex + 1).trim(),
        });
      }
      index += 1;
      continue;
    }

    if (
      token === '-d' ||
      token === '--data' ||
      token === '--data-raw' ||
      token === '--data-binary' ||
      token === '--data-ascii'
    ) {
      body = next;
      index += 1;
      continue;
    }

    if (token === '--url' && next) {
      url = next;
      index += 1;
      continue;
    }

    if ((token === '-u' || token === '--user') && next) {
      warnings.push('Basic auth credentials were detected. Review the generated snippet before sharing it.');
      index += 1;
      continue;
    }

    if (token === '--compressed') {
      warnings.push('The original cURL command requested compressed responses. That behavior is handled automatically by most client libraries.');
      continue;
    }

    if (!token.startsWith('-') && /^https?:\/\//i.test(token)) {
      url = token;
    }
  }

  if (!url) {
    return {
      error: 'A request URL was not found in the cURL command.',
      output: null,
    };
  }

  const resolvedMethod = method || (body ? 'POST' : 'GET');
  const headerBlock =
    headers.length > 0
      ? `  headers: {\n${headers.map((header) => `    "${escapeJsonString(header.key)}": "${escapeJsonString(header.value)}",`).join('\n')}\n  },\n`
      : '';
  const bodyBlock = body ? `  body: ${JSON.stringify(body)},\n` : '';
  const axiosConfigParts = [
    `  method: '${resolvedMethod.toLowerCase()}',`,
    `  url: '${url.replace(/'/g, "\\'")}',`,
  ];

  if (headers.length > 0) {
    axiosConfigParts.push(
      `  headers: { ${headers
        .map((header) => `'${header.key.replace(/'/g, "\\'")}': '${header.value.replace(/'/g, "\\'")}'`)
        .join(', ')} },`,
    );
  }

  if (body) {
    axiosConfigParts.push(`  data: ${JSON.stringify(body)},`);
  }

  const pythonHeaderBlock =
    headers.length > 0
      ? `headers = {\n${headers.map((header) => `    "${escapeJsonString(header.key)}": "${escapeJsonString(header.value)}",`).join('\n')}\n}\n\n`
      : '';
  const pythonBodyBlock = body ? `data = ${JSON.stringify(body)}\n\n` : '';
  const pythonHeadersArgument = headers.length > 0 ? ', headers=headers' : '';
  const pythonBodyArgument = body ? `${pythonHeadersArgument ? '' : ','} data=data` : '';

  return {
    error: '',
    output: {
      method: resolvedMethod,
      url,
      headers,
      body,
      warnings,
      fetchSnippet: `const response = await fetch('${url.replace(/'/g, "\\'")}', {\n  method: '${resolvedMethod}',\n${headerBlock}${bodyBlock}});\n\nconst text = await response.text();\nconsole.log(text);`,
      axiosSnippet: `const response = await axios({\n${axiosConfigParts.join('\n')}\n});\n\nconsole.log(response.data);`,
      pythonSnippet: `import requests\n\n${pythonHeaderBlock}${pythonBodyBlock}response = requests.request(\n    "${resolvedMethod}",\n    "${escapeJsonString(url)}"${pythonHeadersArgument}${pythonBodyArgument}\n)\n\nprint(response.text)`,
    },
  };
}

const sqlKeywords = [
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'ORDER BY',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'FULL JOIN',
  'JOIN',
  'ON',
  'AND',
  'OR',
  'UNION',
  'UNION ALL',
];

export function formatSqlQuery(value: string): TransformResult<string> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: '' };
  }

  let formatted = source.replace(/\s+/g, ' ');
  for (const keyword of sqlKeywords.sort((left, right) => right.length - left.length)) {
    const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    formatted = formatted.replace(regex, `\n${keyword}`);
  }

  formatted = formatted
    .replace(/\n(AND|OR)\b/g, '\n  $1')
    .replace(/\n(ON)\b/g, '\n  $1')
    .replace(/\n+/g, '\n')
    .trim();

  return {
    error: '',
    output: formatted,
  };
}

function parseSemver(value: string) {
  const match = value.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;

  return {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2], 10),
    patch: Number.parseInt(match[3], 10),
  };
}

function bumpSemver(version: { major: number; minor: number; patch: number }, level: 'patch' | 'minor' | 'major') {
  if (level === 'major') return `${version.major + 1}.0.0`;
  if (level === 'minor') return `${version.major}.${version.minor + 1}.0`;
  return `${version.major}.${version.minor}.${version.patch + 1}`;
}

export function calculateSemanticVersion(currentVersion: string, notes: string): TransformResult<SemverRecommendationReport | null> {
  const parsedVersion = parseSemver(currentVersion);
  if (!parsedVersion) {
    return {
      error: 'Enter a semantic version in the form major.minor.patch.',
      output: null,
    };
  }

  const summary = notes.trim().toLowerCase();
  const signals: string[] = [];
  let recommendedLevel: 'patch' | 'minor' | 'major' = 'patch';

  if (/\bbreaking\b|\bmajor\b|\bremove(d)?\b|\brename(d)?\b|\bdeprecat(e|ed)\b/.test(summary)) {
    recommendedLevel = 'major';
    signals.push('Detected breaking-change language in the notes.');
  } else if (/\bfeat\b|\bfeature\b|\badd(ed)?\b|\bintroduc(e|ed)\b|\bnew\b/.test(summary)) {
    recommendedLevel = 'minor';
    signals.push('Detected new feature language in the notes.');
  } else if (summary) {
    signals.push('Defaulted to a patch bump because the notes describe a compatible change.');
  } else {
    signals.push('No notes were provided, so the recommendation stays on patch by default.');
  }

  return {
    error: '',
    output: {
      currentVersion,
      patch: bumpSemver(parsedVersion, 'patch'),
      minor: bumpSemver(parsedVersion, 'minor'),
      major: bumpSemver(parsedVersion, 'major'),
      recommendedLevel,
      recommendedVersion: bumpSemver(parsedVersion, recommendedLevel),
      rationale:
        recommendedLevel === 'major'
          ? 'Use a major bump when consumers are likely to change code or configuration to adopt this release.'
          : recommendedLevel === 'minor'
            ? 'Use a minor bump for backward-compatible features that add capability without breaking existing integrations.'
            : 'Use a patch bump for fixes, internal refactors, or compatible improvements.',
      signals,
    },
  };
}

function detectJsonType(value: unknown): string {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

function flattenJsonShape(value: unknown, currentPath = '$'): Record<string, string> {
  const type = detectJsonType(value);
  const shape: Record<string, string> = { [currentPath]: type };

  if (type === 'object' && value && typeof value === 'object') {
    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      Object.assign(shape, flattenJsonShape(nestedValue, `${currentPath}.${key}`));
    }
  }

  if (type === 'array' && Array.isArray(value)) {
    const firstItem = value[0];
    if (typeof firstItem !== 'undefined') {
      Object.assign(shape, flattenJsonShape(firstItem, `${currentPath}[]`));
    }
  }

  return shape;
}

export function detectBreakingChanges(previousText: string, nextText: string): TransformResult<BreakingChangeReport | null> {
  if (!previousText.trim() || !nextText.trim()) {
    return { error: '', output: null };
  }

  try {
    const previousValue = JSON.parse(previousText) as unknown;
    const nextValue = JSON.parse(nextText) as unknown;
    const previousShape = flattenJsonShape(previousValue);
    const nextShape = flattenJsonShape(nextValue);

    const breakingFindings: BreakingChangeFinding[] = [];
    const nonBreakingFindings: BreakingChangeFinding[] = [];

    for (const [path, previousType] of Object.entries(previousShape)) {
      const nextType = nextShape[path];
      if (typeof nextType === 'undefined') {
        if (path !== '$') {
          breakingFindings.push({ path, kind: 'removed', oldType: previousType });
        }
        continue;
      }

      if (nextType !== previousType) {
        breakingFindings.push({ path, kind: 'type-changed', oldType: previousType, newType: nextType });
      }
    }

    for (const [path, nextType] of Object.entries(nextShape)) {
      if (!(path in previousShape) && path !== '$') {
        nonBreakingFindings.push({ path, kind: 'added', newType: nextType });
      }
    }

    return {
      error: '',
      output: {
        compatibilityScore: Math.max(0, 100 - breakingFindings.length * 22 - nonBreakingFindings.length * 4),
        breakingFindings,
        nonBreakingFindings,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Enter valid JSON payloads on both sides.',
      output: null,
    };
  }
}

export function inspectHttpHeaders(value: string): TransformResult<HeaderInspectionReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const headers = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^HTTP\/\d/i.test(line))
    .map((line) => {
      const separatorIndex = line.indexOf(':');
      return separatorIndex > -1
        ? { key: line.slice(0, separatorIndex).trim(), value: line.slice(separatorIndex + 1).trim() }
        : null;
    })
    .filter((entry): entry is { key: string; value: string } => entry !== null);

  if (headers.length === 0) {
    return {
      error: 'Paste raw response headers in the form "Header-Name: value".',
      output: null,
    };
  }

  const lowerCaseMap = new Map(headers.map((header) => [header.key.toLowerCase(), header.value]));
  const findings: HeaderFinding[] = [];

  const requiredSecurityHeaders = [
    ['content-security-policy', 'Content Security Policy is missing', 'A CSP helps reduce the impact of script injection and third-party asset drift.'],
    ['strict-transport-security', 'Strict-Transport-Security is missing', 'HSTS helps keep repeat traffic on HTTPS after the first secure visit.'],
    ['x-content-type-options', 'X-Content-Type-Options is missing', 'nosniff prevents some content-type confusion issues in browsers.'],
    ['referrer-policy', 'Referrer-Policy is missing', 'Referrer-Policy helps control what navigation context is leaked to downstream requests.'],
    ['permissions-policy', 'Permissions-Policy is missing', 'Permissions-Policy narrows access to browser capabilities such as camera and microphone.'],
  ] as const;

  for (const [key, title, detail] of requiredSecurityHeaders) {
    if (!lowerCaseMap.has(key)) {
      findings.push({ severity: key === 'content-security-policy' || key === 'strict-transport-security' ? 'high' : 'medium', title, detail });
    }
  }

  const corsValue = lowerCaseMap.get('access-control-allow-origin');
  if (corsValue === '*') {
    findings.push({
      severity: 'medium',
      title: 'Wildcard CORS origin detected',
      detail: 'A wildcard Access-Control-Allow-Origin header is convenient, but it can be too broad for authenticated or internal APIs.',
    });
  }

  if (!lowerCaseMap.has('cache-control')) {
    findings.push({
      severity: 'low',
      title: 'Cache-Control is missing',
      detail: 'Explicit cache rules make edge behavior and browser freshness easier to reason about.',
    });
  }

  return {
    error: '',
    output: {
      headers,
      securityScore: Math.max(0, 100 - findings.reduce((total, finding) => total + (finding.severity === 'high' ? 20 : finding.severity === 'medium' ? 12 : 6), 0)),
      findings,
      cacheSummary: lowerCaseMap.get('cache-control') ?? 'No explicit cache-control header found.',
      corsSummary: corsValue ? `CORS allows ${corsValue}.` : 'No Access-Control-Allow-Origin header detected.',
    },
  };
}

function parseCronPart(part: string, min: number, max: number) {
  const values = new Set<number>();

  const addRange = (start: number, end: number, step = 1) => {
    for (let value = start; value <= end; value += step) {
      values.add(value);
    }
  };

  for (const chunk of part.split(',')) {
    const trimmedChunk = chunk.trim();
    if (!trimmedChunk) continue;

    if (trimmedChunk === '*') {
      addRange(min, max);
      continue;
    }

    if (trimmedChunk.startsWith('*/')) {
      const step = Number.parseInt(trimmedChunk.slice(2), 10);
      if (!Number.isInteger(step) || step <= 0) throw new Error(`Invalid step value "${trimmedChunk}".`);
      addRange(min, max, step);
      continue;
    }

    const rangeStepMatch = trimmedChunk.match(/^(\d+)-(\d+)\/(\d+)$/);
    if (rangeStepMatch) {
      const start = Number.parseInt(rangeStepMatch[1], 10);
      const end = Number.parseInt(rangeStepMatch[2], 10);
      const step = Number.parseInt(rangeStepMatch[3], 10);
      if (start < min || end > max || start > end || step <= 0) throw new Error(`Invalid range "${trimmedChunk}".`);
      addRange(start, end, step);
      continue;
    }

    const rangeMatch = trimmedChunk.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = Number.parseInt(rangeMatch[1], 10);
      const end = Number.parseInt(rangeMatch[2], 10);
      if (start < min || end > max || start > end) throw new Error(`Invalid range "${trimmedChunk}".`);
      addRange(start, end);
      continue;
    }

    const numericValue = Number.parseInt(trimmedChunk, 10);
    if (!Number.isInteger(numericValue) || numericValue < min || numericValue > max) {
      throw new Error(`Invalid cron value "${trimmedChunk}".`);
    }
    values.add(numericValue);
  }

  return values;
}

function describeCronPart(part: string, label: string) {
  if (part === '*') return `${label} can be any value`;
  if (part.startsWith('*/')) return `${label} repeats every ${part.slice(2)} units`;
  if (part.includes(',')) return `${label} uses a list of values: ${part}`;
  if (part.includes('-')) return `${label} uses a range: ${part}`;
  return `${label} is fixed at ${part}`;
}

export function explainCronExpression(value: string, fromDate = new Date()): TransformResult<CronExplanationReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const parts = source.split(/\s+/);
  if (parts.length !== 5) {
    return {
      error: 'Use the standard 5-field cron shape: minute hour day month weekday.',
      output: null,
    };
  }

  try {
    const minuteSet = parseCronPart(parts[0], 0, 59);
    const hourSet = parseCronPart(parts[1], 0, 23);
    const daySet = parseCronPart(parts[2], 1, 31);
    const monthSet = parseCronPart(parts[3], 1, 12);
    const weekdaySet = parseCronPart(parts[4], 0, 6);

    const cursor = new Date(fromDate);
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);

    const nextRuns: string[] = [];
    const maxIterations = 60 * 24 * 366;

    for (let iteration = 0; iteration < maxIterations && nextRuns.length < 5; iteration += 1) {
      if (
        minuteSet.has(cursor.getMinutes()) &&
        hourSet.has(cursor.getHours()) &&
        daySet.has(cursor.getDate()) &&
        monthSet.has(cursor.getMonth() + 1) &&
        weekdaySet.has(cursor.getDay())
      ) {
        nextRuns.push(format(cursor, 'PPpp'));
      }

      cursor.setMinutes(cursor.getMinutes() + 1);
    }

    return {
      error: '',
      output: {
        description: `Runs when minute matches ${parts[0]}, hour matches ${parts[1]}, day-of-month matches ${parts[2]}, month matches ${parts[3]}, and weekday matches ${parts[4]}.`,
        fields: [
          { label: 'Minute', expression: parts[0], description: describeCronPart(parts[0], 'Minute') },
          { label: 'Hour', expression: parts[1], description: describeCronPart(parts[1], 'Hour') },
          { label: 'Day of month', expression: parts[2], description: describeCronPart(parts[2], 'Day of month') },
          { label: 'Month', expression: parts[3], description: describeCronPart(parts[3], 'Month') },
          { label: 'Weekday', expression: parts[4], description: describeCronPart(parts[4], 'Weekday') },
        ],
        nextRuns,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Invalid cron expression.',
      output: null,
    };
  }
}

export function analyzeDockerCompose(value: string): TransformResult<DockerComposeReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  if (!/^services:\s*$/m.test(source)) {
    return {
      error: 'A docker-compose file needs a top-level services block.',
      output: null,
    };
  }

  const lines = source.split(/\r?\n/);
  const services: DockerComposeServiceSummary[] = [];
  const findings: DockerFinding[] = [];
  let inServices = false;
  let currentService: DockerComposeServiceSummary | null = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, '  ');

    if (/^services:\s*$/i.test(line.trim())) {
      inServices = true;
      continue;
    }

    if (!inServices) continue;

    const serviceMatch = line.match(/^ {2}([A-Za-z0-9_-]+):\s*$/);
    if (serviceMatch) {
      if (currentService) services.push(currentService);
      currentService = {
        name: serviceMatch[1],
        image: '',
        hasBuild: false,
        portCount: 0,
        hasHealthcheck: false,
        hasRestart: false,
      };
      continue;
    }

    if (!currentService) continue;

    if (/^ {4}image:\s*/i.test(line)) {
      currentService.image = line.replace(/^ {4}image:\s*/i, '').trim();
    }
    if (/^ {4}build:\s*/i.test(line)) {
      currentService.hasBuild = true;
    }
    if (/^ {4}healthcheck:\s*$/i.test(line)) {
      currentService.hasHealthcheck = true;
    }
    if (/^ {4}restart:\s*/i.test(line)) {
      currentService.hasRestart = true;
    }
    if (/^ {6}-\s*/.test(line)) {
      currentService.portCount += 1;
    }
    if (/^ {4}privileged:\s*true/i.test(line)) {
      findings.push({
        severity: 'high',
        title: `Service "${currentService.name}" runs in privileged mode`,
        detail: 'Privileged containers should be rare because they weaken container isolation significantly.',
      });
    }
  }

  if (currentService) services.push(currentService);

  for (const service of services) {
    if (service.image && /:latest$/i.test(service.image)) {
      findings.push({
        severity: 'medium',
        title: `Service "${service.name}" uses the latest tag`,
        detail: 'Pinned image versions make deployments easier to reproduce and roll back.',
      });
    }
    if (!service.hasHealthcheck) {
      findings.push({
        severity: 'low',
        title: `Service "${service.name}" has no healthcheck`,
        detail: 'A healthcheck helps orchestrators and local operators understand whether the service is ready.',
      });
    }
    if (!service.hasRestart) {
      findings.push({
        severity: 'low',
        title: `Service "${service.name}" has no restart policy`,
        detail: 'Restart policies can improve resilience for long-running local and staging workloads.',
      });
    }
  }

  return {
    error: '',
    output: {
      serviceCount: services.length,
      services,
      findings,
      score: Math.max(0, 100 - findings.reduce((total, finding) => total + (finding.severity === 'high' ? 20 : finding.severity === 'medium' ? 12 : 6), 0)),
    },
  };
}

const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

export function summarizeOpenApi(value: string): TransformResult<OpenApiSummaryReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  try {
    const parsed = JSON.parse(source) as Record<string, unknown>;
    const info = (parsed.info && typeof parsed.info === 'object' ? parsed.info : {}) as Record<string, unknown>;
    const paths = (parsed.paths && typeof parsed.paths === 'object' ? parsed.paths : {}) as Record<string, Record<string, unknown>>;
    const methods = Object.fromEntries(httpMethods.map((method) => [method.toUpperCase(), 0])) as Record<string, number>;
    const tagSet = new Set<string>();

    for (const pathConfig of Object.values(paths)) {
      if (!pathConfig || typeof pathConfig !== 'object') continue;
      for (const [method, operation] of Object.entries(pathConfig)) {
        if (!httpMethods.includes(method.toLowerCase())) continue;
        methods[method.toUpperCase()] += 1;
        const tags = (operation as Record<string, unknown>).tags;
        if (Array.isArray(tags)) {
          for (const tag of tags) tagSet.add(String(tag));
        }
      }
    }

    const securitySchemes =
      parsed.components &&
      typeof parsed.components === 'object' &&
      (parsed.components as Record<string, unknown>).securitySchemes &&
      typeof (parsed.components as Record<string, unknown>).securitySchemes === 'object'
        ? Object.keys((parsed.components as Record<string, { securitySchemes?: Record<string, unknown> }>).securitySchemes ?? {})
        : [];

    return {
      error: '',
      output: {
        title: typeof info.title === 'string' ? info.title : 'OpenAPI document',
        version: typeof info.version === 'string' ? info.version : 'unknown',
        serverCount: Array.isArray(parsed.servers) ? parsed.servers.length : 0,
        pathCount: Object.keys(paths).length,
        operationCount: Object.values(methods).reduce((sum, count) => sum + count, 0),
        methods,
        tags: Array.from(tagSet).sort(),
        securitySchemes,
      },
    };
  } catch {
    const pathMatches = source.match(/^  \/[^\n:]+:\s*$/gm) ?? [];
    const methodMatches = source.match(/^    (get|post|put|patch|delete|options|head):\s*$/gim) ?? [];
    const titleMatch = source.match(/^\s*title:\s*(.+)$/m);
    const versionMatch = source.match(/^\s*version:\s*(.+)$/m);
    const securitySchemesMatch = source.match(/^\s{4}([A-Za-z0-9_-]+):\s*$/gm) ?? [];

    if (pathMatches.length === 0 && methodMatches.length === 0) {
      return {
        error: 'Paste an OpenAPI JSON document or a YAML spec with info and paths blocks.',
        output: null,
      };
    }

    const methods = Object.fromEntries(httpMethods.map((method) => [method.toUpperCase(), 0])) as Record<string, number>;
    for (const match of methodMatches) {
      const method = match.trim().replace(':', '').toUpperCase();
      methods[method] += 1;
    }

    return {
      error: '',
      output: {
        title: titleMatch?.[1]?.trim() ?? 'OpenAPI document',
        version: versionMatch?.[1]?.trim() ?? 'unknown',
        serverCount: (source.match(/^\s*-\s*url:\s*/gm) ?? []).length,
        pathCount: pathMatches.length,
        operationCount: methodMatches.length,
        methods,
        tags: Array.from(new Set((source.match(/^\s*- [A-Za-z0-9 _-]+$/gm) ?? []).map((entry) => entry.replace(/^\s*-\s*/, '').trim()))),
        securitySchemes: Array.from(
          new Set(
            securitySchemesMatch
              .map((entry) => entry.trim().replace(':', ''))
              .filter((entry) => !httpMethods.includes(entry.toLowerCase()) && !entry.startsWith('/')),
          ),
        ),
      },
    };
  }
}

function toMarkdownTableRows(rows: string[][]) {
  if (rows.length === 0) {
    return { markdown: '', rowCount: 0, columnCount: 0 };
  }

  const headers = rows[0];
  const bodyRows = rows.slice(1);
  const divider = headers.map(() => '---');
  const markdown = [
    `| ${headers.join(' | ')} |`,
    `| ${divider.join(' | ')} |`,
    ...bodyRows.map((row) => `| ${headers.map((_, index) => row[index] ?? '').join(' | ')} |`),
  ].join('\n');

  return {
    markdown,
    rowCount: bodyRows.length,
    columnCount: headers.length,
  };
}

function normalizeMarkdownWhitespace(value: string) {
  return value
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '  ')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .map((line) => line.replace(/^(\s*)[•●◦▪▸–—]\s+/, '$1- '))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function rowsToMarkdownStudioReport(
  rows: string[][],
  detectedFormat: MarkdownInputFormat,
  notes: string[],
): MarkdownStudioReport {
  const table = toMarkdownTableRows(
    rows.map((row) => row.map((cell) => cell.trim().replace(/\s+/g, ' '))),
  );

  return {
    markdown: table.markdown,
    detectedFormat,
    rowCount: table.rowCount,
    columnCount: table.columnCount,
    notes,
  };
}

function parsePipeTableRows(source: string) {
  const lines = source
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2 || !lines.every((line) => line.includes('|'))) {
    return null;
  }

  const rows = lines
    .map((line) => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim()))
    .filter((row) => row.length >= 2);

  if (rows.length < 2) {
    return null;
  }

  const headerCount = rows[0].length;
  if (!rows.every((row) => row.length === headerCount)) {
    return null;
  }

  const dividerPattern = /^:?-{3,}:?$/;
  const hasDivider = rows[1].every((cell) => dividerPattern.test(cell));

  return hasDivider ? [rows[0], ...rows.slice(2)] : rows;
}

function parseBoxDrawingTableRows(source: string) {
  const contentRows = source
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.includes('│'))
    .map((line) => line.split('│').map((cell) => cell.trim()).filter((cell) => cell.length > 0));

  if (contentRows.length < 2) {
    return null;
  }

  const headerCount = contentRows[0].length;
  if (headerCount < 2 || !contentRows.every((row) => row.length === headerCount)) {
    return null;
  }

  return contentRows;
}

function parseWhitespaceTableRows(source: string) {
  const lines = source
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return null;
  }

  const rows = lines
    .map((line) => line.split(/\s{2,}|\t+/).map((cell) => cell.trim()).filter(Boolean))
    .filter((row) => row.length >= 2);

  if (rows.length < 2) {
    return null;
  }

  const headerCount = rows[0].length;
  if (headerCount < 2 || !rows.every((row) => row.length === headerCount)) {
    return null;
  }

  return rows;
}

function looksLikeCsv(source: string) {
  const lines = source
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length > 1 && lines.every((line) => line.includes(','));
}

function looksLikeMarkdown(source: string) {
  return /(^#{1,6}\s)|(^[-*+]\s)|(^\d+\.\s)|(```)|(^>\s)|(\|.+\|)/m.test(source);
}

export function buildMarkdownTable(value: string): TransformResult<MarkdownTableReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  try {
    if (source.startsWith('[')) {
      const parsed = JSON.parse(source) as Array<Record<string, unknown>>;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Provide a JSON array with at least one row object.');
      }

      const headers = Array.from(new Set(parsed.flatMap((row) => Object.keys(row))));
      const rows = [
        headers,
        ...parsed.map((row) => headers.map((header) => String(row[header] ?? ''))),
      ];
      const table = toMarkdownTableRows(rows);
      return { error: '', output: table };
    }

    const rows = parseCsvRows(source);
    const table = toMarkdownTableRows(rows);
    return { error: '', output: table };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Use CSV rows or a JSON array of objects to build a markdown table.',
      output: null,
    };
  }
}

export function buildMarkdownStudio(value: string): TransformResult<MarkdownStudioReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  try {
    if (source.startsWith('[')) {
      const tableResult = buildMarkdownTable(source);
      if (tableResult.error || !tableResult.output) {
        throw new Error(tableResult.error || 'Provide a valid JSON array of objects.');
      }

      return {
        error: '',
        output: {
          markdown: tableResult.output.markdown,
          detectedFormat: 'json-array',
          rowCount: tableResult.output.rowCount,
          columnCount: tableResult.output.columnCount,
          notes: ['Detected a JSON array and converted it into a markdown table.'],
        },
      };
    }

    if (looksLikeCsv(source)) {
      const tableResult = buildMarkdownTable(source);
      if (tableResult.error || !tableResult.output) {
        throw new Error(tableResult.error || 'Provide valid CSV rows.');
      }

      return {
        error: '',
        output: {
          markdown: tableResult.output.markdown,
          detectedFormat: 'csv',
          rowCount: tableResult.output.rowCount,
          columnCount: tableResult.output.columnCount,
          notes: ['Detected CSV rows and converted them into a markdown table.'],
        },
      };
    }

    const boxTableRows = parseBoxDrawingTableRows(source);
    if (boxTableRows) {
      return {
        error: '',
        output: rowsToMarkdownStudioReport(boxTableRows, 'box-table', [
          'Detected a boxed CLI table and converted it into GitHub-friendly markdown.',
        ]),
      };
    }

    const pipeTableRows = parsePipeTableRows(source);
    if (pipeTableRows) {
      return {
        error: '',
        output: rowsToMarkdownStudioReport(pipeTableRows, 'pipe-table', [
          'Detected a pipe-style table and normalized it into clean markdown.',
        ]),
      };
    }

    const whitespaceTableRows = parseWhitespaceTableRows(source);
    if (whitespaceTableRows) {
      return {
        error: '',
        output: rowsToMarkdownStudioReport(whitespaceTableRows, 'whitespace-table', [
          'Detected aligned text columns and converted them into a markdown table.',
        ]),
      };
    }

    const normalized = normalizeMarkdownWhitespace(source);
    return {
      error: '',
      output: {
        markdown: normalized,
        detectedFormat: looksLikeMarkdown(normalized) ? 'markdown' : 'plain-text',
        rowCount: 0,
        columnCount: 0,
        notes: [
          looksLikeMarkdown(normalized)
            ? 'Detected markdown content and cleaned spacing, bullets, and blank lines.'
            : 'Kept the text as markdown-friendly plain content and normalized spacing.',
        ],
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to format the markdown content.',
      output: null,
    };
  }
}

export function transformJsonLines(value: string, mode: JsonLinesMode): TransformResult<JsonLinesReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  try {
    if (mode === 'jsonl-to-array') {
      const rows = source
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line) as Record<string, unknown>);

      const keySet = new Set(rows.flatMap((row) => Object.keys(row)));
      return {
        error: '',
        output: {
          normalizedJsonl: rows.map((row) => JSON.stringify(row)).join('\n'),
          prettyJsonArray: JSON.stringify(rows, null, 2),
          rowCount: rows.length,
          uniqueKeyCount: keySet.size,
        },
      };
    }

    const parsed = JSON.parse(source) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error('Provide a JSON array when converting array data into JSONL.');
    }

    const rows = parsed as Array<Record<string, unknown>>;
    const keySet = new Set(rows.flatMap((row) => Object.keys(row)));
    return {
      error: '',
      output: {
        normalizedJsonl: rows.map((row) => JSON.stringify(row)).join('\n'),
        prettyJsonArray: JSON.stringify(rows, null, 2),
        rowCount: rows.length,
        uniqueKeyCount: keySet.size,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to convert the JSON Lines input.',
      output: null,
    };
  }
}

function maskEnvValue(value: string) {
  if (!value) {
    return '(empty)';
  }

  if (value.length <= 6) {
    return `${value.slice(0, 1)}***`;
  }

  return `${value.slice(0, 2)}***${value.slice(-2)}`;
}

export function inspectEnvFile(value: string): TransformResult<EnvInspectionReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const entries: EnvEntryReport[] = [];
  const invalidLines: string[] = [];
  const counts = new Map<string, number>();
  const secretPattern = /(token|secret|password|key|dsn|auth|private)/i;

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) {
      invalidLines.push(trimmed);
      continue;
    }

    const [, key, rawValue] = match;
    const normalizedValue = rawValue.replace(/^['"]|['"]$/g, '');
    const secretLike = secretPattern.test(key);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    entries.push({
      key,
      valuePreview: secretLike ? maskEnvValue(normalizedValue) : normalizedValue || '(empty)',
      hasValue: normalizedValue.length > 0,
      secretLike,
    });
  }

  return {
    error: '',
    output: {
      entries,
      duplicateKeys: Array.from(counts.entries())
        .filter(([, count]) => count > 1)
        .map(([key]) => key),
      invalidLines,
      secretLikeCount: entries.filter((entry) => entry.secretLike).length,
    },
  };
}

export function cleanAnsiOutput(value: string): TransformResult<AnsiCleanReport | null> {
  const source = value;
  if (!source.trim()) {
    return { error: '', output: null };
  }

  const ansiPattern = /\u001B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\u0007]*(?:\u0007|\u001B\\))/g;
  const removedSequences = (source.match(ansiPattern) ?? []).length;
  const cleaned = source
    .replace(ansiPattern, '')
    .replace(/\r/g, '')
    .replace(/\u0008/g, '')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    error: '',
    output: {
      cleaned,
      removedSequences,
      lineCount: cleaned ? cleaned.split('\n').length : 0,
    },
  };
}

export function buildMarkdownChecklist(value: string): TransformResult<MarkdownChecklistReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const items = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const checked = /^\[(x|X)\]\s+/.test(line);
      const normalized = line
        .replace(/^[-*+]\s+/, '')
        .replace(/^\[(?: |x|X)\]\s+/, '')
        .replace(/^\d+\.\s+/, '');

      return {
        checked,
        text: normalized,
      };
    });

  return {
    error: '',
    output: {
      markdown: items.map((item) => `- [${item.checked ? 'x' : ' '}] ${item.text}`).join('\n'),
      itemCount: items.length,
      checkedCount: items.filter((item) => item.checked).length,
    },
  };
}

export function deduplicateLines(value: string, mode: LineDeduplicationMode): TransformResult<LineDeduplicationReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const unique = Array.from(new Set(lines));
  const finalLines = mode === 'sort-ascending' ? [...unique].sort((left, right) => left.localeCompare(right)) : unique;

  return {
    error: '',
    output: {
      output: finalLines.join('\n'),
      uniqueCount: finalLines.length,
      removedCount: lines.length - unique.length,
    },
  };
}

function parseHeaderBlock(value: string) {
  const headers = new Map<string, string>();

  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      if (/^HTTP\/\d/i.test(line)) {
        return;
      }

      const separatorIndex = line.indexOf(':');
      if (separatorIndex < 1) {
        return;
      }

      const key = line.slice(0, separatorIndex).trim().toLowerCase();
      const headerValue = line.slice(separatorIndex + 1).trim();
      headers.set(key, headerValue);
    });

  return headers;
}

export function exploreJsonPath(input: string, path: string): TransformResult<JsonPathExplorerReport | null> {
  if (!input.trim()) {
    return { error: '', output: null };
  }

  try {
    const parsed = JSON.parse(input) as unknown;
    const normalizedPath = path.trim().replace(/\[(\d+)\]/g, '.$1').replace(/^\./, '');
    const segments = normalizedPath ? normalizedPath.split('.').filter(Boolean) : [];
    let current: unknown = parsed;

    for (const segment of segments) {
      if (current === null || current === undefined) {
        current = undefined;
        break;
      }

      if (Array.isArray(current)) {
        current = current[Number(segment)];
      } else if (typeof current === 'object') {
        current = (current as Record<string, unknown>)[segment];
      } else {
        current = undefined;
      }
    }

    const found = segments.length === 0 ? true : current !== undefined;
    const currentValue = segments.length === 0 ? parsed : current;
    const valueType = Array.isArray(currentValue) ? 'array' : currentValue === null ? 'null' : typeof currentValue;
    const availableKeys =
      currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue)
        ? Object.keys(currentValue as Record<string, unknown>)
        : [];

    return {
      error: '',
      output: {
        path: normalizedPath || '(root)',
        found,
        value: found ? JSON.stringify(currentValue, null, 2) : '',
        valueType,
        availableKeys,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to inspect the JSON payload.',
      output: null,
    };
  }
}

export function diffHeaders(left: string, right: string): TransformResult<HeaderDiffReport | null> {
  const leftHeaders = parseHeaderBlock(left);
  const rightHeaders = parseHeaderBlock(right);

  const keys = new Set([...leftHeaders.keys(), ...rightHeaders.keys()]);
  const added: string[] = [];
  const removed: string[] = [];
  const changed: Array<{ key: string; left: string; right: string }> = [];

  for (const key of keys) {
    const leftValue = leftHeaders.get(key);
    const rightValue = rightHeaders.get(key);

    if (leftValue === undefined && rightValue !== undefined) {
      added.push(key);
    } else if (leftValue !== undefined && rightValue === undefined) {
      removed.push(key);
    } else if (leftValue !== rightValue && leftValue !== undefined && rightValue !== undefined) {
      changed.push({ key, left: leftValue, right: rightValue });
    }
  }

  return { error: '', output: { added, removed, changed } };
}

export function summarizeHarRequests(value: string): TransformResult<HarRequestSummaryReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  try {
    const parsed = JSON.parse(source) as { log?: { entries?: Array<{ request?: { method?: string; url?: string }; response?: { status?: number } }> } };
    const entries = parsed.log?.entries ?? [];
    const requests = entries
      .map((entry) => {
        const url = entry.request?.url ?? '';
        const method = (entry.request?.method ?? 'GET').toUpperCase();
        const status = entry.response?.status ?? 0;
        const domain = (() => {
          try {
            return new URL(url).host;
          } catch {
            return 'unknown';
          }
        })();

        return { method, url, status, domain };
      })
      .filter((entry) => entry.url);

    const methods = requests.reduce<Record<string, number>>((acc, request) => {
      acc[request.method] = (acc[request.method] ?? 0) + 1;
      return acc;
    }, {});

    return {
      error: '',
      output: {
        requestCount: requests.length,
        domainCount: new Set(requests.map((request) => request.domain)).size,
        methods,
        requests,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to parse the HAR payload.',
      output: null,
    };
  }
}

function valueKind(value: unknown) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

export function inspectWebhookPayload(value: string): TransformResult<WebhookPayloadInspectionReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  try {
    const parsed = JSON.parse(source) as Record<string, unknown>;
    const topLevelKeys = Object.keys(parsed).map((key) => ({ key, type: valueKind(parsed[key]) }));
    const nestedObjectCount = Object.values(parsed).filter((entry) => entry && typeof entry === 'object' && !Array.isArray(entry)).length;
    const arrayCount = Object.values(parsed).filter(Array.isArray).length;
    const eventName =
      [parsed.type, parsed.event, parsed.eventType, parsed.topic]
        .find((candidate) => typeof candidate === 'string' && candidate.trim().length > 0) as string | undefined;

    return {
      error: '',
      output: {
        eventName: eventName ?? 'unknown-event',
        topLevelKeys,
        nestedObjectCount,
        arrayCount,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to inspect the webhook payload.',
      output: null,
    };
  }
}

export function convertSqlResultToMarkdown(value: string): TransformResult<MarkdownTableReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const rows = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !/^[-+|]+$/.test(line))
    .map((line) => line.split(/\t+|\s{2,}/).map((cell) => cell.trim()).filter(Boolean))
    .filter((row) => row.length >= 2);

  if (rows.length < 2) {
    return { error: 'Paste a tab-separated or aligned SQL result with a header row and at least one data row.', output: null };
  }

  const columnCount = rows[0].length;
  if (!rows.every((row) => row.length === columnCount)) {
    return { error: 'Each detected row must have the same number of columns.', output: null };
  }

  return { error: '', output: toMarkdownTableRows(rows) };
}

export function analyzeLogLevels(value: string): TransformResult<LogLevelAnalysisReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const lines = source.split(/\r?\n/).filter(Boolean);
  const counts = {
    error: 0,
    warn: 0,
    info: 0,
    debug: 0,
  } as Record<'error' | 'warn' | 'info' | 'debug', number>;

  for (const line of lines) {
    const normalized = line.toLowerCase();
    if (/\berror\b/.test(normalized)) counts.error += 1;
    if (/\bwarn(?:ing)?\b/.test(normalized)) counts.warn += 1;
    if (/\binfo\b/.test(normalized)) counts.info += 1;
    if (/\bdebug\b/.test(normalized)) counts.debug += 1;
  }

  const findings: string[] = [];
  if (counts.error > 0) findings.push(`${counts.error} error lines detected.`);
  if (counts.warn > 0) findings.push(`${counts.warn} warning lines detected.`);
  if (findings.length === 0) findings.push('No common log levels were detected in the pasted output.');

  return { error: '', output: { counts, totalLines: lines.length, findings } };
}

export function extractUuids(value: string): TransformResult<UuidExtractionReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const matches = source.match(/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi) ?? [];
  const uuids = Array.from(new Set(matches));
  return { error: '', output: { uuids, uniqueCount: uuids.length } };
}

export function extractLinksAndEmails(value: string): TransformResult<LinkExtractionReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  const urls = Array.from(new Set(source.match(/\bhttps?:\/\/[^\s)>"']+/gi) ?? []));
  const emails = Array.from(new Set(source.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) ?? []));
  return { error: '', output: { urls, emails } };
}

export function redactSecrets(value: string): TransformResult<SecretRedactionReport | null> {
  const source = value;
  if (!source.trim()) {
    return { error: '', output: null };
  }

  const patterns = [
    /\bsk-[A-Za-z0-9_-]{8,}\b/g,
    /\bgh[pousr]_[A-Za-z0-9]{10,}\b/g,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    /\b(?:Bearer\s+)?[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  ];

  let redacted = source;
  let replacements = 0;
  for (const pattern of patterns) {
    redacted = redacted.replace(pattern, (match) => {
      replacements += 1;
      if (match.includes('@')) return '[REDACTED_EMAIL]';
      if (match.startsWith('sk-')) return '[REDACTED_API_KEY]';
      if (match.startsWith('gh')) return '[REDACTED_GITHUB_TOKEN]';
      return '[REDACTED_SECRET]';
    });
  }

  return { error: '', output: { redacted, replacements } };
}

export function formatApiError(value: string): TransformResult<ApiErrorFormattingReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  try {
    const parsed = JSON.parse(source) as Record<string, unknown>;
    const title = String(parsed.message ?? parsed.error ?? parsed.title ?? 'API error');
    const statusCode = String(parsed.status ?? parsed.statusCode ?? parsed.code ?? 'unknown');
    const details = Object.entries(parsed).filter(([key]) => !['message', 'error', 'title', 'status', 'statusCode', 'code'].includes(key));
    const markdown = [
      `## ${title}`,
      '',
      `- Status: \`${statusCode}\``,
      ...details.map(([key, entry]) => `- ${key}: \`${typeof entry === 'string' ? entry : JSON.stringify(entry)}\``),
    ].join('\n');

    return {
      error: '',
      output: {
        markdown,
        title,
        statusCode,
        detailCount: details.length,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to format the API error payload.',
      output: null,
    };
  }
}

function prettyMarkup(value: string) {
  const normalized = value
    .replace(/>\s+</g, '><')
    .replace(/(>)(<)(\/*)/g, '$1\n$2$3')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let indent = 0;
  const lines: string[] = [];
  for (const rawLine of normalized) {
    const line = rawLine.trim();
    if (/^<\//.test(line)) {
      indent = Math.max(indent - 1, 0);
    }

    lines.push(`${'  '.repeat(indent)}${line}`);

    if (
      /^<[^!?/][^>]*[^/]?>$/.test(line) &&
      !/<\/[^>]+>$/.test(line) &&
      !/^<.*\/>$/.test(line)
    ) {
      indent += 1;
    }
  }

  return lines.join('\n');
}

export function formatXml(value: string): TransformResult<string> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: '' };
  }

  if (!source.startsWith('<') || !source.endsWith('>')) {
    return { error: 'Paste XML content starting and ending with tags.', output: '' };
  }

  return { error: '', output: prettyMarkup(source) };
}

export function formatHtml(value: string): TransformResult<string> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: '' };
  }

  if (!source.startsWith('<') || !source.includes('>')) {
    return { error: 'Paste HTML markup to format.', output: '' };
  }

  return { error: '', output: prettyMarkup(source) };
}

export function formatCssStylesheet(value: string): TransformResult<string> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: '' };
  }

  const formatted = source
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/g, ''))
    .join('\n')
    .replace(/\n  \n/g, '\n')
    .trim();

  return { error: '', output: formatted };
}

export function formatMarkdownDocument(value: string): TransformResult<string> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: '' };
  }

  return { error: '', output: normalizeMarkdownWhitespace(source) };
}

export function transformRot13(value: string): TransformResult<string> {
  if (!value) {
    return { error: '', output: '' };
  }

  return {
    error: '',
    output: value.replace(/[a-zA-Z]/g, (char) => {
      const base = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
    }),
  };
}

export function transformBinaryText(value: string, mode: BinaryTextMode): TransformResult<string> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: '' };
  }

  try {
    if (mode === 'encode') {
      return {
        error: '',
        output: Array.from(source)
          .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' '),
      };
    }

    const decoded = source
      .split(/\s+/)
      .filter(Boolean)
      .map((chunk) => {
        if (!/^[01]{8}$/.test(chunk)) {
          throw new Error('Use 8-bit binary groups separated by spaces when decoding.');
        }
        return String.fromCharCode(Number.parseInt(chunk, 2));
      })
      .join('');

    return { error: '', output: decoded };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to convert binary text.', output: '' };
  }
}

const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function transformBase32(value: string, mode: Base64Mode): TransformResult<string> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: '' };
  }

  try {
    if (mode === 'encode') {
      const bytes = new TextEncoder().encode(source);
      let bits = '';
      for (const byte of bytes) {
        bits += byte.toString(2).padStart(8, '0');
      }

      while (bits.length % 5 !== 0) {
        bits += '0';
      }

      let output = '';
      for (let index = 0; index < bits.length; index += 5) {
        output += base32Alphabet[Number.parseInt(bits.slice(index, index + 5), 2)];
      }

      while (output.length % 8 !== 0) {
        output += '=';
      }

      return { error: '', output };
    }

    const cleaned = source.toUpperCase().replace(/=+$/g, '');
    let bits = '';
    for (const char of cleaned) {
      const charIndex = base32Alphabet.indexOf(char);
      if (charIndex < 0) {
        throw new Error('Base32 input may only contain A-Z, 2-7, and optional padding.');
      }
      bits += charIndex.toString(2).padStart(5, '0');
    }

    const bytes: number[] = [];
    for (let index = 0; index + 8 <= bits.length; index += 8) {
      bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
    }

    return { error: '', output: new TextDecoder().decode(new Uint8Array(bytes)) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to convert Base32 content.', output: '' };
  }
}

const morseAlphabet: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
};

export function transformMorseCode(value: string, mode: MorseCodeMode): TransformResult<string> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: '' };
  }

  if (mode === 'encode') {
    return {
      error: '',
      output: source
        .toUpperCase()
        .split('')
        .map((char) => {
          if (char === ' ') return '/';
          return morseAlphabet[char] ?? '?';
        })
        .join(' '),
    };
  }

  const reverseMap = Object.fromEntries(Object.entries(morseAlphabet).map(([key, morse]) => [morse, key]));
  return {
    error: '',
    output: source
      .split(' ')
      .map((token) => {
        if (token === '/') return ' ';
        return reverseMap[token] ?? '?';
      })
      .join(''),
  };
}

export function convertNumberBases(value: string, inputBase: 2 | 8 | 10 | 16): TransformResult<NumberBaseReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  try {
    const parsed = BigInt(parseInt(source, inputBase));
    return {
      error: '',
      output: {
        binary: parsed.toString(2),
        octal: parsed.toString(8),
        decimal: parsed.toString(10),
        hexadecimal: parsed.toString(16).toUpperCase(),
      },
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to convert the number across bases.', output: null };
  }
}

const romanMap: Array<[number, string]> = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

export function convertRomanNumeral(value: string): TransformResult<string> {
  const source = value.trim().toUpperCase();
  if (!source) {
    return { error: '', output: '' };
  }

  if (/^\d+$/.test(source)) {
    let number = Number.parseInt(source, 10);
    if (number <= 0 || number >= 4000) {
      return { error: 'Use a number between 1 and 3999.', output: '' };
    }

    let roman = '';
    for (const [amount, symbol] of romanMap) {
      while (number >= amount) {
        roman += symbol;
        number -= amount;
      }
    }

    return { error: '', output: roman };
  }

  const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let index = 0; index < source.length; index += 1) {
    const current = values[source[index]];
    const next = values[source[index + 1]];
    if (!current) {
      return { error: 'Use only valid Roman numeral characters.', output: '' };
    }
    total += next && current < next ? -current : current;
  }

  return { error: '', output: String(total) };
}

function randomFromAlphabet(length: number, alphabet: string) {
  const chars = new Uint8Array(length);
  crypto.getRandomValues(chars);
  return Array.from(chars, (value) => alphabet[value % alphabet.length]).join('');
}

export function generateNanoIds(count: number, length: number): TransformResult<NanoIdReport | null> {
  if (count <= 0 || length <= 0) {
    return { error: 'Use positive values for count and length.', output: null };
  }

  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  return {
    error: '',
    output: {
      values: Array.from({ length: count }, () => randomFromAlphabet(length, alphabet)),
    },
  };
}

const loremWords = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');

export function generateLoremIpsum(paragraphs: number): TransformResult<LoremIpsumReport | null> {
  if (paragraphs <= 0) {
    return { error: 'Choose at least one paragraph.', output: null };
  }

  const blocks = Array.from({ length: paragraphs }, (_, paragraphIndex) => {
    const wordCount = 28 + (paragraphIndex % 3) * 6;
    const words = Array.from({ length: wordCount }, (_, index) => loremWords[(index + paragraphIndex * 5) % loremWords.length]);
    const sentence = `${words.join(' ')}.`;
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  });

  return {
    error: '',
    output: {
      output: blocks.join('\n\n'),
      paragraphCount: blocks.length,
      wordCount: blocks.join(' ').split(/\s+/).filter(Boolean).length,
    },
  };
}

export function inspectCookieSecurity(value: string): TransformResult<CookieSecurityReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  const cookies = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^set-cookie:/i.test(line))
    .map((line) => line.replace(/^set-cookie:\s*/i, ''))
    .map((line) => {
      const [nameValue, ...attributes] = line.split(';').map((part) => part.trim());
      const [name] = nameValue.split('=');
      const secure = attributes.some((attribute) => /^secure$/i.test(attribute));
      const httpOnly = attributes.some((attribute) => /^httponly$/i.test(attribute));
      const sameSite = attributes.find((attribute) => /^samesite=/i.test(attribute))?.split('=')[1] ?? 'missing';
      return { name, secure, httpOnly, sameSite };
    });

  const findings: HeaderFinding[] = [];
  for (const cookie of cookies) {
    if (!cookie.secure) findings.push({ severity: 'high', title: `${cookie.name} missing Secure`, detail: 'Transmit cookies over HTTPS only when using Secure.' });
    if (!cookie.httpOnly) findings.push({ severity: 'medium', title: `${cookie.name} missing HttpOnly`, detail: 'HttpOnly helps reduce client-side script access to cookies.' });
    if (cookie.sameSite === 'missing') findings.push({ severity: 'medium', title: `${cookie.name} missing SameSite`, detail: 'SameSite can reduce cross-site request exposure.' });
  }

  return { error: '', output: { cookies, findings } };
}

export function inspectCspPolicy(value: string): TransformResult<CspPolicyReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  const directives = source
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [key, ...rest] = part.split(/\s+/);
      return { key, value: rest.join(' ') };
    });

  const map = new Map(directives.map((directive) => [directive.key, directive.value]));
  const findings: HeaderFinding[] = [];
  if (!map.has('default-src')) findings.push({ severity: 'high', title: 'Missing default-src', detail: 'A baseline default-src directive is usually expected in a CSP policy.' });
  if (!map.has('object-src')) findings.push({ severity: 'medium', title: 'Missing object-src', detail: 'Set object-src to none unless legacy plugin content is required.' });
  if (!map.has('base-uri')) findings.push({ severity: 'medium', title: 'Missing base-uri', detail: 'base-uri can reduce abuse of injected base tags.' });
  if ((map.get('script-src') ?? '').includes("'unsafe-inline'")) findings.push({ severity: 'high', title: 'script-src allows unsafe-inline', detail: 'Inline scripts weaken CSP protections and are best avoided.' });

  return { error: '', output: { directives, findings } };
}

export function inspectJwtExpiry(value: string): TransformResult<JwtExpiryReport | null> {
  const decoded = decodeJwtToken(value);
  if (decoded.error || !decoded.output) {
    return { error: decoded.error, output: null };
  }

  const payload = decoded.output.payload;
  const exp = typeof payload.exp === 'number' ? payload.exp : null;
  const iat = typeof payload.iat === 'number' ? payload.iat : null;
  const nowSeconds = Math.floor(Date.now() / 1000);
  const status = exp === null ? 'No exp claim' : exp < nowSeconds ? 'Expired' : 'Active';

  return {
    error: '',
    output: {
      expiresAt: exp ? new Date(exp * 1000).toISOString() : 'missing',
      issuedAt: iat ? new Date(iat * 1000).toISOString() : 'missing',
      status,
    },
  };
}

export function runRegexReplace(pattern: string, replacement: string, text: string, flags: string): TransformResult<RegexReplaceReport | null> {
  if (!pattern) return { error: '', output: null };

  try {
    const expression = new RegExp(pattern, flags);
    const matches = text.match(new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`)) ?? [];
    return {
      error: '',
      output: {
        output: text.replace(expression, replacement),
        replacements: matches.length,
      },
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Invalid regex pattern.', output: null };
  }
}

export function validateEmailAddresses(value: string): TransformResult<EmailValidationReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const valid: string[] = [];
  const invalid: string[] = [];

  source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).forEach((entry) => {
    if (emailPattern.test(entry)) valid.push(entry);
    else invalid.push(entry);
  });

  return { error: '', output: { valid, invalid } };
}

function flattenJsonPaths(value: unknown, prefix = ''): Map<string, string> {
  const output = new Map<string, string>();
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flattenJsonPaths(item, `${prefix}[${index}]`).forEach((nestedValue, nestedKey) => output.set(nestedKey, nestedValue));
    });
    return output;
  }
  if (value && typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (nested && typeof nested === 'object') {
        flattenJsonPaths(nested, path).forEach((nestedValue, nestedKey) => output.set(nestedKey, nestedValue));
      } else {
        output.set(path, JSON.stringify(nested));
      }
    });
    return output;
  }
  output.set(prefix || '(root)', JSON.stringify(value));
  return output;
}

export function compareJsonValues(left: string, right: string): TransformResult<JsonComparisonReport | null> {
  const leftSource = left.trim();
  const rightSource = right.trim();
  if (!leftSource || !rightSource) return { error: '', output: null };

  try {
    const leftMap = flattenJsonPaths(JSON.parse(leftSource));
    const rightMap = flattenJsonPaths(JSON.parse(rightSource));
    const keys = new Set([...leftMap.keys(), ...rightMap.keys()]);
    const added: string[] = [];
    const removed: string[] = [];
    const changed: string[] = [];

    for (const key of keys) {
      const leftValue = leftMap.get(key);
      const rightValue = rightMap.get(key);
      if (leftValue === undefined && rightValue !== undefined) added.push(key);
      else if (leftValue !== undefined && rightValue === undefined) removed.push(key);
      else if (leftValue !== rightValue) changed.push(key);
    }

    return { error: '', output: { added, removed, changed } };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to compare the JSON values.', output: null };
  }
}

export function convertByteSize(value: string, unit: 'bytes' | 'kb' | 'mb' | 'gb'): TransformResult<ByteSizeConversionReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  const parsed = Number(source);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return { error: 'Enter a non-negative number for byte conversion.', output: null };
  }

  const bytes =
    unit === 'bytes' ? parsed :
      unit === 'kb' ? parsed * 1024 :
        unit === 'mb' ? parsed * 1024 * 1024 :
          parsed * 1024 * 1024 * 1024;

  return {
    error: '',
    output: {
      bytes: bytes.toFixed(0),
      kilobytes: (bytes / 1024).toFixed(4),
      megabytes: (bytes / (1024 * 1024)).toFixed(4),
      gigabytes: (bytes / (1024 * 1024 * 1024)).toFixed(6),
    },
  };
}

function clampColor(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function rgbToHsl(red: number, green: number, blue: number) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
  }

  return {
    h: Math.round(hue * 60 < 0 ? hue * 60 + 360 : hue * 60),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function hslToRgb(hue: number, saturation: number, lightness: number) {
  const s = saturation / 100;
  const l = lightness / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - chroma / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) [r, g, b] = [chroma, x, 0];
  else if (hue < 120) [r, g, b] = [x, chroma, 0];
  else if (hue < 180) [r, g, b] = [0, chroma, x];
  else if (hue < 240) [r, g, b] = [0, x, chroma];
  else if (hue < 300) [r, g, b] = [x, 0, chroma];
  else [r, g, b] = [chroma, 0, x];

  return {
    r: clampColor((r + m) * 255),
    g: clampColor((g + m) * 255),
    b: clampColor((b + m) * 255),
  };
}

export function convertColorFormats(value: string): TransformResult<ColorConversionReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  try {
    let red = 0;
    let green = 0;
    let blue = 0;

    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(source)) {
      const hex = source.slice(1);
      const normalized = hex.length === 3 ? hex.split('').map((char) => `${char}${char}`).join('') : hex;
      red = Number.parseInt(normalized.slice(0, 2), 16);
      green = Number.parseInt(normalized.slice(2, 4), 16);
      blue = Number.parseInt(normalized.slice(4, 6), 16);
    } else if (/^rgb\(/i.test(source)) {
      const match = source.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
      if (!match) throw new Error('Use rgb(r, g, b) when converting RGB colors.');
      red = clampColor(Number(match[1]));
      green = clampColor(Number(match[2]));
      blue = clampColor(Number(match[3]));
    } else if (/^hsl\(/i.test(source)) {
      const match = source.match(/^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i);
      if (!match) throw new Error('Use hsl(h, s%, l%) when converting HSL colors.');
      const rgb = hslToRgb(Number(match[1]) % 360, Number(match[2]), Number(match[3]));
      red = rgb.r;
      green = rgb.g;
      blue = rgb.b;
    } else {
      throw new Error('Paste a hex, rgb(...), or hsl(...) color value.');
    }

    const hsl = rgbToHsl(red, green, blue);
    return {
      error: '',
      output: {
        hex: `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`.toUpperCase(),
        rgb: `rgb(${red}, ${green}, ${blue})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      },
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to convert the color value.', output: null };
  }
}

export function convertLineEndings(value: string, mode: LineEndingMode): TransformResult<string> {
  if (!value) return { error: '', output: '' };
  const normalized = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return { error: '', output: mode === 'lf' ? normalized : normalized.replace(/\n/g, '\r\n') };
}

export function convertTabsAndSpaces(value: string, mode: TabSpaceMode, size: number): TransformResult<string> {
  if (!value) return { error: '', output: '' };
  const width = Number.isFinite(size) && size > 0 ? Math.floor(size) : 2;
  if (mode === 'tabs-to-spaces') {
    return { error: '', output: value.replace(/\t/g, ' '.repeat(width)) };
  }
  const pattern = new RegExp(` {${width}}`, 'g');
  return { error: '', output: value.replace(pattern, '\t') };
}

export function transformListJson(value: string, mode: ListJsonMode): TransformResult<string> {
  const source = value.trim();
  if (!source) return { error: '', output: '' };

  try {
    if (mode === 'list-to-json') {
      const items = source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      return { error: '', output: JSON.stringify(items, null, 2) };
    }

    const parsed = JSON.parse(source) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error('Provide a JSON array when converting JSON to a line list.');
    }
    return { error: '', output: parsed.map((entry) => String(entry)).join('\n') };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to convert between list and JSON array.', output: '' };
  }
}

const passphraseWords = 'anchor maple orbit kernel velvet copper signal drift canyon pixel ember lotus spruce ember comet tide lantern glacier branch fable rocket meadow summit harbor pebble delta'.split(' ');

export function generatePassphrases(count: number, wordsPerPhrase: number): TransformResult<PassphraseReport | null> {
  if (count <= 0 || wordsPerPhrase <= 0) {
    return { error: 'Use positive values for count and words per phrase.', output: null };
  }

  return {
    error: '',
    output: {
      values: Array.from({ length: count }, (_, phraseIndex) =>
        Array.from({ length: wordsPerPhrase }, (_, wordIndex) => passphraseWords[(phraseIndex * 3 + wordIndex * 5) % passphraseWords.length]).join('-'),
      ),
    },
  };
}

export function generateRandomNumbers(count: number, min: number, max: number): TransformResult<RandomNumberReport | null> {
  if (count <= 0 || !Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    return { error: 'Provide a positive count and a valid min/max range.', output: null };
  }

  return {
    error: '',
    output: {
      values: Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min),
    },
  };
}

export function generateUsernames(seed: string, count: number): TransformResult<UsernameReport | null> {
  const source = seed.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'utility';
  if (count <= 0) {
    return { error: 'Use a positive count for username generation.', output: null };
  }

  const suffixes = ['dev', 'lab', 'forge', 'pilot', 'stack', 'flow', 'node', 'grid', 'loop', 'dock'];
  return {
    error: '',
    output: {
      values: Array.from({ length: count }, (_, index) => `${source}-${suffixes[index % suffixes.length]}${index + 1}`),
    },
  };
}

export function generateApiTokens(count: number, length: number, prefix: string): TransformResult<ApiTokenReport | null> {
  if (count <= 0 || length <= 0) {
    return { error: 'Use positive values for count and token length.', output: null };
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return {
    error: '',
    output: {
      values: Array.from({ length: count }, () => `${prefix}${prefix ? '_' : ''}${randomFromAlphabet(length, alphabet)}`),
    },
  };
}

const base58Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function encodeBytesToBase58(bytes: Uint8Array) {
  if (bytes.length === 0) return '';

  let value = 0n;
  for (const byte of bytes) {
    value = (value << 8n) + BigInt(byte);
  }

  let output = '';
  while (value > 0n) {
    const remainder = Number(value % 58n);
    value /= 58n;
    output = base58Alphabet[remainder] + output;
  }

  let leadingZeroes = 0;
  while (leadingZeroes < bytes.length && bytes[leadingZeroes] === 0) {
    output = `1${output}`;
    leadingZeroes += 1;
  }

  return output || '1';
}

function decodeBase58ToBytes(value: string) {
  let decoded = 0n;
  for (const character of value) {
    const index = base58Alphabet.indexOf(character);
    if (index === -1) {
      throw new Error('That Base58 payload contains unsupported characters.');
    }
    decoded = decoded * 58n + BigInt(index);
  }

  const bytes: number[] = [];
  while (decoded > 0n) {
    bytes.unshift(Number(decoded & 255n));
    decoded >>= 8n;
  }

  for (const character of value) {
    if (character === '1') {
      bytes.unshift(0);
    } else {
      break;
    }
  }

  return Uint8Array.from(bytes);
}

function encodeBytesToBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

function decodeBase64ToBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function parseRawHeaders(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.includes(':'))
    .map((line) => {
      const index = line.indexOf(':');
      return {
        key: line.slice(0, index).trim().toLowerCase(),
        value: line.slice(index + 1).trim(),
      };
    });
}

function guessApiKeyProvider(value: string) {
  if (/^sk-[A-Za-z0-9]/.test(value)) return 'OpenAI-style secret key';
  if (/^gh[pousr]_[A-Za-z0-9]/.test(value)) return 'GitHub token';
  if (/^AKIA[0-9A-Z]{16}$/.test(value)) return 'AWS access key';
  if (/^AIza[0-9A-Za-z\-_]{20,}$/.test(value)) return 'Google API key';
  if (/^xox[baprs]-/.test(value)) return 'Slack token';
  return 'Unknown token format';
}

export function transformBase58(value: string, mode: Base64Mode): TransformResult<string> {
  if (!value) return { error: '', output: '' };

  try {
    if (mode === 'encode') {
      return { error: '', output: encodeBytesToBase58(textEncoder.encode(value)) };
    }

    const bytes = decodeBase58ToBytes(value.trim());
    return { error: '', output: textDecoder.decode(bytes) };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to convert the Base58 payload.',
      output: '',
    };
  }
}

export function transformBase64Url(value: string, mode: Base64Mode): TransformResult<string> {
  if (!value) return { error: '', output: '' };

  try {
    if (mode === 'encode') {
      return {
        error: '',
        output: encodeBytesToBase64(textEncoder.encode(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''),
      };
    }

    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return { error: '', output: textDecoder.decode(decodeBase64ToBytes(padded)) };
  } catch {
    return {
      error: mode === 'decode' ? 'That Base64 URL payload could not be decoded.' : 'Unable to encode the supplied text.',
      output: '',
    };
  }
}

export function transformQuotedPrintable(value: string, mode: Base64Mode): TransformResult<string> {
  if (!value) return { error: '', output: '' };

  try {
    if (mode === 'encode') {
      const bytes = textEncoder.encode(value);
      const output = Array.from(bytes, (byte) => {
        if (byte === 9 || (byte >= 33 && byte <= 60) || (byte >= 62 && byte <= 126)) {
          return String.fromCharCode(byte);
        }
        if (byte === 10) return '\n';
        if (byte === 13) return '\r';
        return `=${byte.toString(16).toUpperCase().padStart(2, '0')}`;
      }).join('');
      return { error: '', output };
    }

    const normalized = value.replace(/=\r?\n/g, '');
    const bytes: number[] = [];

    for (let index = 0; index < normalized.length; index += 1) {
      const character = normalized[index];
      if (character === '=' && /^[A-Fa-f0-9]{2}$/.test(normalized.slice(index + 1, index + 3))) {
        bytes.push(Number.parseInt(normalized.slice(index + 1, index + 3), 16));
        index += 2;
      } else {
        bytes.push(...textEncoder.encode(character));
      }
    }

    return { error: '', output: textDecoder.decode(Uint8Array.from(bytes)) };
  } catch {
    return { error: 'Unable to convert the quoted-printable payload.', output: '' };
  }
}

export function transformDataUrl(value: string, mode: DataUrlMode): TransformResult<string> {
  if (!value) return { error: '', output: '' };

  try {
    if (mode === 'text-to-data-url') {
      return {
        error: '',
        output: `data:text/plain;charset=utf-8;base64,${encodeBytesToBase64(textEncoder.encode(value))}`,
      };
    }

    const match = value.match(/^data:([^,]*?),(.*)$/s);
    if (!match) {
      throw new Error('Paste a valid data URL to decode.');
    }
    const [, metadata, payload] = match;
    const output = /;base64/i.test(metadata) ? textDecoder.decode(decodeBase64ToBytes(payload)) : decodeURIComponent(payload);
    return { error: '', output };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to decode the data URL.', output: '' };
  }
}

export function transformBasicAuth(value: string, mode: CredentialMode): TransformResult<string> {
  if (!value) return { error: '', output: '' };

  try {
    if (mode === 'encode') {
      if (!value.includes(':')) {
        throw new Error('Enter credentials in the form username:password.');
      }
      return { error: '', output: `Basic ${encodeBytesToBase64(textEncoder.encode(value))}` };
    }

    const payload = value.replace(/^Basic\s+/i, '').trim();
    return { error: '', output: textDecoder.decode(decodeBase64ToBytes(payload)) };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to convert the Basic Auth payload.',
      output: '',
    };
  }
}

export function transformCharacterCodes(value: string, mode: CharacterCodeMode): TransformResult<string> {
  if (!value) return { error: '', output: '' };

  try {
    if (mode === 'encode') {
      return {
        error: '',
        output: Array.from(value, (character) => String(character.codePointAt(0))).join(' '),
      };
    }

    const codePoints = value
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => Number.parseInt(item, 10));

    if (codePoints.some((item) => !Number.isFinite(item))) {
      throw new Error('Provide decimal character codes separated by spaces or commas.');
    }

    return { error: '', output: String.fromCodePoint(...codePoints) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to convert the character codes.', output: '' };
  }
}

export function inspectApiKeyFingerprint(value: string): TransformResult<ApiKeyFingerprintReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  return {
    error: '',
    output: {
      masked: source.length <= 8 ? `${source[0] ?? ''}***` : `${source.slice(0, 4)}${'*'.repeat(Math.max(4, source.length - 8))}${source.slice(-4)}`,
      fingerprint: sha256(source).slice(0, 16),
      length: source.length,
      likelyProvider: guessApiKeyProvider(source),
    },
  };
}

export function generateSriHashes(value: string): TransformResult<SriHashReport | null> {
  if (!value) return { error: '', output: null };

  const wordArray = CryptoJS.lib.WordArray.create(textEncoder.encode(value) as unknown as number[]);
  return {
    error: '',
    output: {
      sha256: `sha256-${CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(wordArray))}`,
      sha384: `sha384-${CryptoJS.enc.Base64.stringify(CryptoJS.SHA384(wordArray))}`,
      sha512: `sha512-${CryptoJS.enc.Base64.stringify(CryptoJS.SHA512(wordArray))}`,
    },
  };
}

export function inspectCorsPolicy(value: string): TransformResult<CorsPolicyReport | null> {
  const headers = parseRawHeaders(value);
  if (headers.length === 0) return { error: '', output: null };

  const find = (key: string) => headers.find((header) => header.key === key)?.value ?? '';
  const allowedOrigin = find('access-control-allow-origin');
  const allowCredentials = /^true$/i.test(find('access-control-allow-credentials'));
  const allowMethods = find('access-control-allow-methods').split(',').map((item) => item.trim()).filter(Boolean);
  const allowHeaders = find('access-control-allow-headers').split(',').map((item) => item.trim()).filter(Boolean);
  const findings: HeaderFinding[] = [];

  if (!allowedOrigin) {
    findings.push({ severity: 'medium', title: 'Missing Access-Control-Allow-Origin', detail: 'Browsers will block cross-origin access if the allow-origin header is absent.' });
  }
  if (allowedOrigin === '*' && allowCredentials) {
    findings.push({ severity: 'high', title: 'Wildcard origin with credentials', detail: 'Credentialed cross-origin requests should never be paired with a wildcard origin.' });
  } else if (allowedOrigin === '*') {
    findings.push({ severity: 'medium', title: 'Wildcard origin detected', detail: 'A wildcard origin is often broader than necessary for authenticated or internal endpoints.' });
  }
  if (allowCredentials && !headers.some((header) => header.key === 'vary' && /origin/i.test(header.value))) {
    findings.push({ severity: 'low', title: 'Missing Vary: Origin', detail: 'Caches can behave unexpectedly for credentialed CORS responses without Vary: Origin.' });
  }

  return {
    error: '',
    output: {
      allowedOrigin,
      allowCredentials,
      allowMethods,
      allowHeaders,
      findings,
      risk: findings.some((finding) => finding.severity === 'high') ? 'high' : findings.some((finding) => finding.severity === 'medium') ? 'medium' : 'low',
    },
  };
}

export function inspectSecurityTxt(value: string): TransformResult<SecurityTxtReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  const entries = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf(':');
      return index === -1 ? null : { key: line.slice(0, index).trim(), value: line.slice(index + 1).trim() };
    })
    .filter((entry): entry is { key: string; value: string } => Boolean(entry));

  const fields = entries.map((entry) => entry.key);
  const contacts = entries.filter((entry) => entry.key.toLowerCase() === 'contact').map((entry) => entry.value);
  const expires = entries.find((entry) => entry.key.toLowerCase() === 'expires')?.value ?? '';
  const findings: HeaderFinding[] = [];

  if (contacts.length === 0) {
    findings.push({ severity: 'high', title: 'Missing Contact field', detail: 'A security.txt file should provide at least one contact method for reporting vulnerabilities.' });
  }
  if (!expires) {
    findings.push({ severity: 'medium', title: 'Missing Expires field', detail: 'Adding an expiry date helps consumers know whether the security.txt file is still maintained.' });
  }

  return { error: '', output: { fields, contacts, expires, findings } };
}

export function inspectOpenRedirect(value: string, allowlist = ''): TransformResult<OpenRedirectReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  try {
    const allowedHosts = allowlist.split(/[\s,]+/).map((item) => item.trim().toLowerCase()).filter(Boolean);
    let target = source;

    if (/^https?:\/\//i.test(source)) {
      const url = new URL(source);
      target = url.searchParams.get('next') ?? url.searchParams.get('redirect') ?? url.searchParams.get('url') ?? source;
    }

    const isRelativeTarget = /^\//.test(target) && !/^\/\//.test(target);
    const url = isRelativeTarget ? new URL(`https://placeholder.local${target}`) : new URL(target);
    const findings: HeaderFinding[] = [];

    if (/^(javascript|data):/i.test(target)) {
      findings.push({ severity: 'high', title: 'Unsafe redirect scheme', detail: 'javascript: and data: schemes should never be allowed as redirect targets.' });
    }
    if (/^\/\//.test(target)) {
      findings.push({ severity: 'high', title: 'Protocol-relative redirect target', detail: 'Protocol-relative targets can bypass naive host validation checks.' });
    }
    if (!isRelativeTarget && allowedHosts.length > 0 && !allowedHosts.includes(url.host.toLowerCase())) {
      findings.push({ severity: 'medium', title: 'Target is outside the allowlist', detail: 'External redirect targets should be checked against an explicit host allowlist.' });
    }

    return {
      error: '',
      output: {
        target,
        host: isRelativeTarget ? 'relative-path' : url.host,
        protocol: isRelativeTarget ? 'relative' : url.protocol.replace(':', ''),
        findings,
        isRelativeTarget,
      },
    };
  } catch {
    return { error: 'Paste a valid redirect target or a URL containing a next/redirect parameter.', output: null };
  }
}

export function inspectPasswordPolicy(value: string): TransformResult<PasswordPolicyReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  const minimumLengthMatch = source.match(/(?:minimum|min)\s*(?:length)?\s*(?:of|:)?\s*(\d{1,2})/i) ?? source.match(/(\d{1,2})\s*(?:characters|chars)/i);
  const minimumLength = minimumLengthMatch ? Number.parseInt(minimumLengthMatch[1], 10) : null;
  const requirements = [
    /uppercase|capital/i.test(source) ? 'Uppercase letter' : '',
    /lowercase/i.test(source) ? 'Lowercase letter' : '',
    /number|digit/i.test(source) ? 'Number' : '',
    /symbol|special character|punctuation/i.test(source) ? 'Symbol' : '',
    /passphrase/i.test(source) ? 'Passphrase wording' : '',
  ].filter(Boolean);
  const findings: HeaderFinding[] = [];

  if (!minimumLength || minimumLength < 12) {
    findings.push({ severity: 'medium', title: 'Minimum length under 12 or unspecified', detail: 'Modern guidance usually starts at 12+ characters for reusable account passwords.' });
  }
  if (!/multi-factor|mfa|2fa/i.test(source)) {
    findings.push({ severity: 'low', title: 'No MFA mention', detail: 'Pairing password guidance with MFA expectations usually improves practical account security.' });
  }
  if (/rotate every|expire every|change every/i.test(source)) {
    findings.push({ severity: 'low', title: 'Mandatory rotation detected', detail: 'Frequent forced rotation can backfire unless there is evidence of compromise.' });
  }

  return {
    error: '',
    output: {
      minimumLength,
      requirements,
      findings,
      score: Math.max(0, Math.min(100, (minimumLength ?? 8) * 5 + requirements.length * 10 - findings.length * 8)),
    },
  };
}

export function inspectSignedUrl(value: string): TransformResult<SignedUrlReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  try {
    const url = new URL(source);
    const parameters = Array.from(url.searchParams.keys());
    const findings: HeaderFinding[] = [];

    let provider = 'Generic signed URL';
    let expirySummary = 'No expiry parameter recognized';

    if (url.searchParams.has('X-Amz-Expires')) {
      provider = 'AWS S3 presigned URL';
      const seconds = Number(url.searchParams.get('X-Amz-Expires'));
      expirySummary = Number.isFinite(seconds) ? `${seconds} seconds from signature time` : 'AWS expiry present';
      if (seconds > 86400) {
        findings.push({ severity: 'medium', title: 'Long AWS presign duration', detail: 'Long-lived presigned URLs increase the exposure window if the link leaks.' });
      }
    } else if (url.searchParams.has('se')) {
      provider = 'Azure SAS URL';
      expirySummary = url.searchParams.get('se') ?? expirySummary;
    } else if (url.searchParams.has('Expires')) {
      provider = 'Google or generic signed URL';
      expirySummary = url.searchParams.get('Expires') ?? expirySummary;
    }

    if (!parameters.some((parameter) => /expires|x-amz-expires|se/i.test(parameter))) {
      findings.push({ severity: 'medium', title: 'No obvious expiry parameter', detail: 'Signed URLs should usually have an explicit and reviewable expiry window.' });
    }

    return { error: '', output: { provider, parameters, expirySummary, findings } };
  } catch {
    return { error: 'Paste a valid signed URL to inspect.', output: null };
  }
}

export function buildGitignoreTemplate(value: string): TransformResult<GitignoreTemplateReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  const requested = new Set(
    source
      .split(/[\r\n,]+/)
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  );

  const templates: Record<string, string[]> = {
    node: ['node_modules/', 'dist/', '.env.local', '.env.*.local', 'coverage/'],
    python: ['__pycache__/', '*.pyc', '.venv/', '.pytest_cache/'],
    dotnet: ['bin/', 'obj/', '*.user', '*.suo'],
    vscode: ['.vscode/*', '!.vscode/extensions.json', '!.vscode/settings.json'],
    logs: ['*.log', 'npm-debug.log*', 'yarn-debug.log*'],
  };

  const sections = Object.keys(templates).filter((key) => requested.has(key));
  if (sections.length === 0) {
    return { error: 'Use known section names like node, python, dotnet, vscode, or logs.', output: null };
  }

  const output = sections
    .map((section) => [`# ${section.toUpperCase()}`, ...templates[section], ''].join('\n'))
    .join('\n')
    .trim();

  return { error: '', output: { output, sections } };
}

export function formatIniDocument(value: string): TransformResult<string> {
  const source = value.trim();
  if (!source) return { error: '', output: '' };

  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^\[.+\]$/.test(line)) return line;
      const match = line.match(/^([^=:#]+)\s*[:=]\s*(.*)$/);
      return match ? `${match[1].trim()} = ${match[2].trim()}` : line;
    });

  return { error: '', output: lines.join('\n') };
}

export function formatHttpRequest(value: string): TransformResult<string> {
  const source = value.trim();
  if (!source) return { error: '', output: '' };

  const [requestLine = '', ...rest] = source.split(/\r?\n/);
  const methodMatch = requestLine.match(/^([A-Z]+)\s+(\S+)(?:\s+HTTP\/[0-9.]+)?$/i);
  const lines: string[] = [];

  if (methodMatch) {
    lines.push(`${methodMatch[1].toUpperCase()} ${methodMatch[2]}`);
  } else {
    lines.push(requestLine.trim());
  }

  const headers: string[] = [];
  const body: string[] = [];
  let reachedBody = false;

  for (const rawLine of rest) {
    const line = rawLine.trim();
    if (!reachedBody && line.includes(':')) {
      const index = line.indexOf(':');
      headers.push(`${line.slice(0, index).trim()}: ${line.slice(index + 1).trim()}`);
      continue;
    }
    if (line === '' && !reachedBody) {
      reachedBody = true;
      continue;
    }
    reachedBody = true;
    if (line) body.push(line);
  }

  headers.sort((left, right) => left.localeCompare(right));
  if (headers.length > 0) lines.push(...headers);
  if (body.length > 0) {
    lines.push('');
    const joinedBody = body.join('\n');
    const jsonAttempt = transformJson(joinedBody, 2);
    lines.push(jsonAttempt.error ? joinedBody : jsonAttempt.output);
  }

  return { error: '', output: lines.join('\n') };
}

export function formatStackTrace(value: string): TransformResult<string> {
  const source = value.trim();
  if (!source) return { error: '', output: '' };

  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^at\s+/, '').replace(/\s+/g, ' '));

  return {
    error: '',
    output: lines.map((line, index) => `${String(index + 1).padStart(2, '0')}. ${line}`).join('\n'),
  };
}

export function convertDelimitedText(value: string, sourceDelimiter: string, targetDelimiter: string): TransformResult<string> {
  const source = value.trim();
  if (!source) return { error: '', output: '' };

  const from = sourceDelimiter === 'tab' ? '\t' : sourceDelimiter;
  const to = targetDelimiter === 'tab' ? '\t' : targetDelimiter;
  const rows = source.split(/\r?\n/).map((line) => line.split(from).map((cell) => cell.trim()));
  return { error: '', output: rows.map((row) => row.join(to)).join('\n') };
}

export function convertDurationUnits(value: string, unit: DurationUnit): TransformResult<Record<string, string> | null> {
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount)) {
    return { error: 'Enter a valid duration value.', output: null };
  }

  const milliseconds = amount * durationMillisecondsByUnit[unit];

  return {
    error: '',
    output: {
      milliseconds: formatDecimal(milliseconds, 0),
      seconds: formatDecimal(milliseconds / durationMillisecondsByUnit.seconds),
      minutes: formatDecimal(milliseconds / durationMillisecondsByUnit.minutes),
      hours: formatDecimal(milliseconds / durationMillisecondsByUnit.hours),
      days: formatDecimal(milliseconds / durationMillisecondsByUnit.days),
      weeks: formatDecimal(milliseconds / durationMillisecondsByUnit.weeks),
      months: formatDecimal(milliseconds / durationMillisecondsByUnit.months),
      years: formatDecimal(milliseconds / durationMillisecondsByUnit.years),
    },
  };
}

export function calculateDateDifference(startValue: string, endValue: string): TransformResult<DateDifferenceReport | null> {
  if (!startValue.trim() && !endValue.trim()) {
    return { error: '', output: null };
  }

  const start = parseFlexibleDateValue(startValue);
  if (start.error || !start.output) {
    return { error: 'Enter a valid start timestamp or date.', output: null };
  }

  const end = parseFlexibleDateValue(endValue);
  if (end.error || !end.output) {
    return { error: 'Enter a valid end timestamp or date.', output: null };
  }

  const startDate = start.output.date;
  const endDate = end.output.date;
  const differenceMilliseconds = endDate.getTime() - startDate.getTime();
  const absoluteMilliseconds = Math.abs(differenceMilliseconds);

  return {
    error: '',
    output: {
      startIso: startDate.toISOString(),
      endIso: endDate.toISOString(),
      startLocal: format(startDate, 'PPpp'),
      endLocal: format(endDate, 'PPpp'),
      direction: differenceMilliseconds === 0 ? 'same' : differenceMilliseconds > 0 ? 'forward' : 'backward',
      human: formatAbsoluteDuration(absoluteMilliseconds),
      milliseconds: formatDecimal(absoluteMilliseconds, 0),
      seconds: formatDecimal(absoluteMilliseconds / durationMillisecondsByUnit.seconds),
      minutes: formatDecimal(absoluteMilliseconds / durationMillisecondsByUnit.minutes),
      hours: formatDecimal(absoluteMilliseconds / durationMillisecondsByUnit.hours),
      days: formatDecimal(absoluteMilliseconds / durationMillisecondsByUnit.days),
      weeks: formatDecimal(absoluteMilliseconds / durationMillisecondsByUnit.weeks),
    },
  };
}

export function calculateTimestampOffset(
  baseValue: string,
  amountValue: string,
  unit: DurationUnit,
  direction: 'add' | 'subtract',
): TransformResult<TimestampOffsetReport | null> {
  if (!baseValue.trim() && !amountValue.trim()) {
    return { error: '', output: null };
  }

  const base = parseFlexibleDateValue(baseValue);
  if (base.error || !base.output) {
    return { error: 'Enter a valid base timestamp or date.', output: null };
  }

  const amount = Number.parseFloat(amountValue);
  if (!Number.isFinite(amount)) {
    return { error: 'Enter a valid duration amount.', output: null };
  }

  const signedAmount = direction === 'add' ? amount : -amount;
  const deltaMilliseconds = signedAmount * durationMillisecondsByUnit[unit];
  const resultDate = new Date(base.output.date.getTime() + deltaMilliseconds);
  if (Number.isNaN(resultDate.getTime())) {
    return { error: 'The calculated result is outside the browser date range.', output: null };
  }

  const unixMilliseconds = resultDate.getTime();

  return {
    error: '',
    output: {
      baseIso: base.output.date.toISOString(),
      baseLocal: format(base.output.date, 'PPpp'),
      resultIso: resultDate.toISOString(),
      resultLocal: format(resultDate, 'PPpp'),
      direction,
      amount: formatDecimal(amount),
      unit,
      deltaHuman: formatAbsoluteDuration(Math.abs(deltaMilliseconds)),
      unixSeconds: Math.floor(unixMilliseconds / 1000),
      unixMilliseconds,
      unixMicroseconds: `${BigInt(unixMilliseconds) * 1_000n}`,
      unixNanoseconds: `${BigInt(unixMilliseconds) * 1_000_000n}`,
    },
  };
}

export function inspectTimestampBatch(value: string, referenceTime = Date.now()): TransformResult<TimestampBatchReport | null> {
  if (!value.trim()) {
    return { error: '', output: null };
  }

  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { error: '', output: null };
  }

  const rows = lines.map((raw) => {
    const parsed = parseTimestamp(raw, referenceTime);
    if (parsed.error || !parsed.output) {
      return { raw, error: parsed.error || timestampInputError };
    }

    return {
      raw,
      detectedUnit: parsed.output.detectedUnit,
      iso: parsed.output.iso,
      local: parsed.output.local,
      relative: parsed.output.relative,
    };
  });

  const validCount = rows.filter((row) => !row.error).length;
  const invalidCount = rows.length - validCount;

  return {
    error: '',
    output: {
      totalLines: rows.length,
      validCount,
      invalidCount,
      rows,
    },
  };
}

export function convertTimeZones(value: string, timeZones: string[]): TransformResult<TimeZoneConversionReport | null> {
  if (!value.trim()) {
    return { error: '', output: null };
  }

  const parsed = parseFlexibleDateValue(value);
  if (parsed.error || !parsed.output) {
    return { error: 'Enter a valid timestamp or date value.', output: null };
  }

  const uniqueZones = Array.from(new Set(timeZones.filter(Boolean)));
  if (uniqueZones.length === 0) {
    return { error: 'Choose at least one time zone.', output: null };
  }

  try {
    const rows = uniqueZones.map((timeZone) => ({
      timeZone,
      label: timeZone.replaceAll('_', ' '),
      formatted: formatDateInTimeZone(parsed.output!.date, timeZone),
      dayPeriod: getDayPeriod(parsed.output!.date, timeZone),
    }));

    return {
      error: '',
      output: {
        sourceIso: parsed.output.date.toISOString(),
        sourceLocal: format(parsed.output.date, 'PPpp'),
        rows,
      },
    };
  } catch {
    return { error: 'One or more time zones are not supported in this browser.', output: null };
  }
}

export function calculateRelativeTime(value: string, referenceTime = Date.now()): TransformResult<RelativeTimeReport | null> {
  if (!value.trim()) {
    return { error: '', output: null };
  }

  const parsed = parseFlexibleDateValue(value);
  if (parsed.error || !parsed.output) {
    return { error: 'Enter a valid timestamp or date value.', output: null };
  }

  const deltaMilliseconds = parsed.output.date.getTime() - referenceTime;
  const absoluteMilliseconds = Math.abs(deltaMilliseconds);

  return {
    error: '',
    output: {
      targetIso: parsed.output.date.toISOString(),
      targetLocal: format(parsed.output.date, 'PPpp'),
      relative: formatRelativeTimestamp(parsed.output.date.getTime(), referenceTime),
      direction: deltaMilliseconds === 0 ? 'now' : deltaMilliseconds < 0 ? 'past' : 'future',
      human: formatAbsoluteDuration(absoluteMilliseconds),
      milliseconds: formatDecimal(absoluteMilliseconds, 0),
      seconds: formatDecimal(absoluteMilliseconds / durationMillisecondsByUnit.seconds),
      minutes: formatDecimal(absoluteMilliseconds / durationMillisecondsByUnit.minutes),
      hours: formatDecimal(absoluteMilliseconds / durationMillisecondsByUnit.hours),
      days: formatDecimal(absoluteMilliseconds / durationMillisecondsByUnit.days),
      weeks: formatDecimal(absoluteMilliseconds / durationMillisecondsByUnit.weeks),
    },
  };
}

export function convertPathSeparators(value: string, target: 'windows' | 'posix'): TransformResult<string> {
  if (!value) return { error: '', output: '' };
  const normalized = value.replace(/\\/g, '/');
  return { error: '', output: target === 'posix' ? normalized : normalized.replace(/\//g, '\\') };
}

function clampPaletteColor(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function adjustHexColor(hex: string, amount: number) {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return `#${[red, green, blue]
    .map((channel) => clampPaletteColor(channel + amount).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

export function generateColorPalette(value: string): TransformResult<PaletteReport | null> {
  const base = convertColorFormats(value);
  if (base.error || !base.output) {
    return { error: base.error || 'Enter a valid color value.', output: null };
  }

  return {
    error: '',
    output: {
      values: [
        { label: 'Base', hex: base.output.hex },
        { label: 'Soft', hex: adjustHexColor(base.output.hex, 28) },
        { label: 'Strong', hex: adjustHexColor(base.output.hex, -28) },
        { label: 'Accent', hex: adjustHexColor(base.output.hex, 56) },
        { label: 'Deep', hex: adjustHexColor(base.output.hex, -56) },
      ],
    },
  };
}

const fakeFirstNames = ['Arun', 'Maya', 'Ivy', 'Noah', 'Luca', 'Asha', 'Nina', 'Leo'];
const fakeLastNames = ['Stone', 'Patel', 'Nguyen', 'Hart', 'Lopez', 'Khan', 'Price', 'Miller'];
const fakeRoles = ['Engineer', 'Reviewer', 'Designer', 'Analyst', 'QA'];

export function generateFakeUsers(count: number): TransformResult<FakeUserReport | null> {
  if (count <= 0) return { error: 'Use a positive count for fake users.', output: null };

  return {
    error: '',
    output: {
      values: Array.from({ length: count }, (_, index) => {
        const firstName = fakeFirstNames[index % fakeFirstNames.length];
        const lastName = fakeLastNames[(index * 2) % fakeLastNames.length];
        return {
          name: `${firstName} ${lastName}`,
          email: `${firstName}.${lastName}${index + 1}@example.test`.toLowerCase(),
          role: fakeRoles[index % fakeRoles.length],
        };
      }),
    },
  };
}

export function generateReleaseNotes(value: string): TransformResult<ReleaseNoteReport | null> {
  const items = value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);

  if (items.length === 0) return { error: '', output: null };

  return {
    error: '',
    output: {
      markdown: ['## Release notes', '', ...items.map((item) => `- ${item}`)].join('\n'),
      bulletCount: items.length,
    },
  };
}

export function generateTestCaseTitles(value: string): TransformResult<TestCaseTitleReport | null> {
  const source = value.trim();
  if (!source) return { error: '', output: null };

  return {
    error: '',
    output: {
      values: [
        `Given ${source} when valid input is provided then the expected result is shown`,
        `Given ${source} when invalid input is provided then a clear error is shown`,
        `Given ${source} when the form is reset then the default sample state returns`,
        `Given ${source} when output is generated then the result can be copied cleanly`,
      ],
    },
  };
}

function readPointerSegment(value: unknown, segment: string): unknown {
  const token = segment.replace(/~1/g, '/').replace(/~0/g, '~');
  if (Array.isArray(value)) {
    const index = Number.parseInt(token, 10);
    return Number.isInteger(index) ? value[index] : undefined;
  }
  if (value && typeof value === 'object') {
    return (value as Record<string, unknown>)[token];
  }
  return undefined;
}

export function testJsonPointer(json: string, pointer: string): TransformResult<JsonPointerReport | null> {
  const source = json.trim();
  if (!source) return { error: '', output: null };

  try {
    const parsed = JSON.parse(source) as unknown;
    if (pointer === '' || pointer === '/') {
      return { error: '', output: { found: true, value: JSON.stringify(parsed, null, 2) } };
    }

    const segments = pointer.replace(/^\//, '').split('/');
    let current: unknown = parsed;
    for (const segment of segments) {
      current = readPointerSegment(current, segment);
      if (current === undefined) {
        return { error: '', output: { found: false, value: '' } };
      }
    }
    return { error: '', output: { found: true, value: typeof current === 'string' ? current : JSON.stringify(current, null, 2) } };
  } catch {
    return { error: 'Paste valid JSON before testing a JSON Pointer.', output: null };
  }
}

export function testUrlPattern(pattern: string, candidate: string): TransformResult<UrlPatternReport | null> {
  if (!pattern.trim() || !candidate.trim()) return { error: '', output: null };

  const keys: string[] = [];
  const regex = new RegExp(
    `^${pattern
      .replace(/\/:([A-Za-z0-9_]+)/g, (_, key) => {
        keys.push(key);
        return '/([^/]+)';
      })
      .replace(/\*/g, '.*')}$`,
  );
  const match = candidate.match(regex);

  return {
    error: '',
    output: {
      matched: Boolean(match),
      normalizedPattern: pattern,
      parameters: match ? keys.map((key, index) => ({ key, value: match[index + 1] ?? '' })) : [],
    },
  };
}

function parseSimpleSemver(value: string) {
  const match = value.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
}

function compareSemver(left: { major: number; minor: number; patch: number }, right: { major: number; minor: number; patch: number }) {
  if (left.major !== right.major) return left.major - right.major;
  if (left.minor !== right.minor) return left.minor - right.minor;
  return left.patch - right.patch;
}

export function testSemverRange(version: string, range: string): TransformResult<SemverRangeReport | null> {
  const parsedVersion = parseSimpleSemver(version);
  if (!parsedVersion) return { error: 'Use a semantic version like 1.2.3.', output: null };

  const normalizedRange = range.trim();
  if (!normalizedRange) return { error: '', output: null };

  const reasons: string[] = [];
  let isMatch = false;

  if (normalizedRange.startsWith('^')) {
    const base = parseSimpleSemver(normalizedRange.slice(1));
    if (!base) return { error: 'Use a valid caret range like ^1.2.3.', output: null };
    isMatch = parsedVersion.major === base.major && compareSemver(parsedVersion, base) >= 0;
    reasons.push(`Major version must stay within ${base.major}.x.x`);
  } else if (normalizedRange.startsWith('~')) {
    const base = parseSimpleSemver(normalizedRange.slice(1));
    if (!base) return { error: 'Use a valid tilde range like ~1.2.3.', output: null };
    isMatch = parsedVersion.major === base.major && parsedVersion.minor === base.minor && compareSemver(parsedVersion, base) >= 0;
    reasons.push(`Major and minor version must stay within ${base.major}.${base.minor}.x`);
  } else if (/^(>=|<=|>|<)/.test(normalizedRange)) {
    const operator = normalizedRange.match(/^(>=|<=|>|<)/)?.[1] ?? '';
    const base = parseSimpleSemver(normalizedRange.slice(operator.length));
    if (!base) return { error: 'Use a valid comparison range like >=1.2.3.', output: null };
    const comparison = compareSemver(parsedVersion, base);
    isMatch =
      (operator === '>=' && comparison >= 0) ||
      (operator === '<=' && comparison <= 0) ||
      (operator === '>' && comparison > 0) ||
      (operator === '<' && comparison < 0);
    reasons.push(`Version is checked with ${operator} ${normalizedRange.slice(operator.length)}`);
  } else {
    const exact = parseSimpleSemver(normalizedRange);
    if (!exact) return { error: 'Use a valid semantic range like ^1.2.3, ~1.2.3, or >=1.2.3.', output: null };
    isMatch = compareSemver(parsedVersion, exact) === 0;
    reasons.push('Exact semantic version match required');
  }

  return { error: '', output: { isMatch, normalizedRange, reasons } };
}

export function testHttpStatusRule(statusCode: string, rule: string): TransformResult<HttpStatusRuleReport | null> {
  const code = Number.parseInt(statusCode.trim(), 10);
  const normalizedRule = rule.trim().toLowerCase();
  if (!Number.isInteger(code)) return { error: 'Enter a valid HTTP status code.', output: null };
  if (!normalizedRule) return { error: '', output: null };

  let isMatch = false;
  const reasons: string[] = [];

  if (/^\dxx$/.test(normalizedRule)) {
    const family = Number.parseInt(normalizedRule[0], 10);
    isMatch = Math.floor(code / 100) === family;
    reasons.push(`Matches the ${family}xx response family`);
  } else if (/^\d{3}-\d{3}$/.test(normalizedRule)) {
    const [start, end] = normalizedRule.split('-').map((entry) => Number.parseInt(entry, 10));
    isMatch = code >= start && code <= end;
    reasons.push(`Matches the ${start}-${end} range`);
  } else if (/^\d{3}$/.test(normalizedRule)) {
    isMatch = code === Number.parseInt(normalizedRule, 10);
    reasons.push('Exact status code match required');
  } else {
    return { error: 'Use a rule like 2xx, 200-299, or 204.', output: null };
  }

  return { error: '', output: { isMatch, normalizedRule, reasons } };
}

function inferSchemaFromValue(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) {
    return {
      type: 'array',
      items: value.length > 0 ? inferSchemaFromValue(value[0]) : {},
    };
  }

  if (value === null) {
    return { type: 'null' };
  }

  if (typeof value === 'object') {
    const properties = Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [key, inferSchemaFromValue(nestedValue)]),
    );
    return {
      type: 'object',
      properties,
      required: Object.keys(value as Record<string, unknown>),
      additionalProperties: false,
    };
  }

  return { type: typeof value };
}

function countSchemaProperties(schema: Record<string, unknown>): number {
  if (schema.type === 'object' && schema.properties && typeof schema.properties === 'object') {
    return Object.values(schema.properties as Record<string, Record<string, unknown>>).reduce(
      (total, childSchema) => total + 1 + countSchemaProperties(childSchema),
      0,
    );
  }

  if (schema.type === 'array' && schema.items && typeof schema.items === 'object') {
    return countSchemaProperties(schema.items as Record<string, unknown>);
  }

  return 0;
}

export function generateJsonSchema(value: string): TransformResult<JsonSchemaGenerationReport | null> {
  const source = value.trim();
  if (!source) {
    return { error: '', output: null };
  }

  try {
    const parsed = JSON.parse(source) as unknown;
    const schema = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      ...inferSchemaFromValue(parsed),
    };

    return {
      error: '',
      output: {
        schema: JSON.stringify(schema, null, 2),
        rootType: detectJsonType(parsed),
        propertyCount: countSchemaProperties(schema),
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Enter valid JSON to generate a schema.',
      output: null,
    };
  }
}
