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
export type UrlMode = 'encode' | 'decode';

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
  iso: string;
  local: string;
  unixSeconds: number;
  unixMilliseconds: number;
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

export interface QueryValueMap {
  [key: string]: string | string[];
}

export interface HmacResult {
  sha256: string;
  sha512: string;
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

export function parseTimestamp(value: string): TransformResult<TimestampDetails | null> {
  if (!value.trim()) {
    return { error: '', output: null };
  }

  const numericTimestamp = Number.parseInt(value, 10);
  if (Number.isNaN(numericTimestamp)) {
    return {
      error: 'Enter a valid Unix timestamp in seconds or milliseconds.',
      output: null,
    };
  }

  const date = numericTimestamp > 10_000_000_000 ? new Date(numericTimestamp) : new Date(numericTimestamp * 1000);
  if (Number.isNaN(date.getTime())) {
    return {
      error: 'Enter a valid Unix timestamp in seconds or milliseconds.',
      output: null,
    };
  }

  return {
    error: '',
    output: {
      iso: date.toISOString(),
      local: format(date, 'PPpp'),
      unixSeconds: Math.floor(date.getTime() / 1000),
      unixMilliseconds: date.getTime(),
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
