import { describe, expect, it, vi } from 'vitest';
import {
  analyzeJwtToken,
  analyzeDockerfile,
  analyzeDockerCompose,
  analyzeRegex,
  analyzeLogLevels,
  buildGitignoreTemplate,
  calculateDateDifference,
  calculateRelativeTime,
  calculateTimestampOffset,
  generateSriHashes,
  compareJsonValues,
  convertDelimitedText,
  convertDurationUnits,
  convertTimeZones,
  convertByteSize,
  convertNumberBases,
  convertPathSeparators,
  convertColorFormats,
  convertLineEndings,
  buildMarkdownChecklist,
  buildMarkdownStudio,
  buildMarkdownTable,
  convertTabsAndSpaces,
  cleanAnsiOutput,
  calculateSemanticVersion,
  buildPasswordCharset,
  calculateBundleSize,
  convertCase,
  convertCurlToCode,
  convertRomanNumeral,
  convertSqlResultToMarkdown,
  deduplicateLines,
  decodeJwtToken,
  diffHeaders,
  detectBreakingChanges,
  diffText,
  explainCronExpression,
  exploreJsonPath,
  extractLinksAndEmails,
  extractUuids,
  generateCommitSuggestions,
  generateHmacs,
  formatRegexFlags,
  generateHashes,
  generateApiTokens,
  generateColorPalette,
  generateFakeUsers,
  generateJsonSchema,
  generatePassphrases,
  generatePassword,
  generateRandomNumbers,
  generateReleaseNotes,
  generateTestCaseTitles,
  generateUlid,
  generateUsernames,
  generateUuidList,
  getPasswordStrength,
  inspectEnvFile,
  inspectCookieSecurity,
  inspectCspPolicy,
  inspectHttpHeaders,
  inspectJwtExpiry,
  inspectWebhookPayload,
  formatSqlQuery,
  inspectApiKeyFingerprint,
  inspectCorsPolicy,
  formatCssStylesheet,
  formatHtml,
  formatMarkdownDocument,
  inspectOpenRedirect,
  inspectPasswordPolicy,
  inspectSecurityTxt,
  inspectSignedUrl,
  formatHttpRequest,
  formatIniDocument,
  formatStackTrace,
  formatXml,
  formatApiError,
  redactSecrets,
  summarizeOpenApi,
  summarizeHarRequests,
  transformBase32,
  transformBase58,
  transformBinaryText,
  transformBasicAuth,
  transformCharacterCodes,
  transformDataUrl,
  transformJsonLines,
  transformListJson,
  transformMorseCode,
  transformQuotedPrintable,
  transformRot13,
  runRegexReplace,
  parseTimestamp,
  inspectTimestampBatch,
  testHttpStatusRule,
  testJsonPointer,
  testSemverRange,
  testUrlPattern,
  validateEmailAddresses,
  generateLoremIpsum,
  generateNanoIds,
  slugifyText,
  transformCsvJson,
  transformHtmlEntities,
  transformBase64,
  transformHex,
  transformJson,
  transformQueryParams,
  transformUnicodeEscapes,
  transformUrl,
  validateGitHubActions,
  visualizeDependencies,
} from '../src/lib/privacyTools';

describe('privacyTools', () => {
  it('formats valid JSON and surfaces invalid JSON errors', () => {
    expect(transformJson('{"hello":"world"}', 2)).toEqual({
      error: '',
      output: '{\n  "hello": "world"\n}',
    });

    expect(transformJson('{"hello"', 2).error.length).toBeGreaterThan(0);
  });

  it('encodes and decodes Base64 payloads', () => {
    const encoded = transformBase64('OpenAI utilities', 'encode');
    expect(encoded.error).toBe('');
    expect(encoded.output).toBe('T3BlbkFJIHV0aWxpdGllcw==');

    const decoded = transformBase64(encoded.output, 'decode');
    expect(decoded).toEqual({ error: '', output: 'OpenAI utilities' });
  });

  it('encodes and decodes URL payloads', () => {
    const encoded = transformUrl('user@example.com?source=utility hub', 'encode');
    expect(encoded.output).toBe('user%40example.com%3Fsource%3Dutility%20hub');
    expect(transformUrl(encoded.output, 'decode').output).toBe('user@example.com?source=utility hub');
  });

  it('generates deterministic hashes', () => {
    const hashes = generateHashes('utility-hub');
    expect(hashes.md5).toBe('b922a1565de2918237d54e85741176a1');
    expect(hashes.sha256).toBe('86ba5e42aa7b8e7d54bcc9a3dbd4d08830a7dd170a0ff19ba198d4ed6e5fba8e');
    expect(hashes.sha512).toContain('d774');
    expect(hashes.sha512.length).toBe(128);
  });

  it('converts text into common naming conventions', () => {
    expect(convertCase('utility hub tools', 'camelCase')).toBe('utilityHubTools');
    expect(convertCase('utility hub tools', 'PascalCase')).toBe('UtilityHubTools');
    expect(convertCase('utility hub tools', 'snake_case')).toBe('utility_hub_tools');
    expect(convertCase('UtilityHubTools', 'kebab-case')).toBe('utility-hub-tools');
    expect(convertCase('utility hub tools', 'CONSTANT_CASE')).toBe('UTILITY_HUB_TOOLS');
    expect(convertCase('utility hub tools', 'Title Case')).toBe('Utility Hub Tools');
  });

  it('parses seconds, milliseconds, microseconds, and nanoseconds timestamps', () => {
    const seconds = parseTimestamp('1718625600', Date.UTC(2024, 5, 16, 12, 0, 0));
    expect(seconds.error).toBe('');
    expect(seconds.output?.detectedUnit).toBe('seconds');
    expect(seconds.output?.unixMilliseconds).toBe(1718625600000);
    expect(seconds.output?.relative).toBe('in 1 day');

    const milliseconds = parseTimestamp('1718625600000');
    expect(milliseconds.error).toBe('');
    expect(milliseconds.output?.detectedUnit).toBe('milliseconds');
    expect(milliseconds.output?.unixSeconds).toBe(1718625600);

    const microseconds = parseTimestamp('1718625600123456');
    expect(microseconds.error).toBe('');
    expect(microseconds.output?.detectedUnit).toBe('microseconds');
    expect(microseconds.output?.unixMilliseconds).toBe(1718625600123);
    expect(microseconds.output?.precisionNote).toContain('rounded down');

    const nanoseconds = parseTimestamp('1718625600123456789');
    expect(nanoseconds.error).toBe('');
    expect(nanoseconds.output?.detectedUnit).toBe('nanoseconds');
    expect(nanoseconds.output?.unixMilliseconds).toBe(1718625600123);

    expect(parseTimestamp('abc').error).toBe('Enter a valid Unix timestamp in seconds, milliseconds, microseconds, or nanoseconds.');
  });

  it('builds secure password output from options and random values', () => {
    const options = {
      length: 4,
      includeUppercase: true,
      includeLowercase: false,
      includeNumbers: false,
      includeSymbols: false,
    };

    expect(buildPasswordCharset(options)).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(generatePassword(options, new Uint32Array([0, 1, 2, 25]))).toBe('ABCZ');
  });

  it('scores password strength meaningfully', () => {
    expect(getPasswordStrength('')).toEqual({ label: 'Not generated', width: '0%', tone: '#E2E8F0' });
    expect(getPasswordStrength('short')).toMatchObject({ label: 'Weak' });
    expect(getPasswordStrength('Longer123')).toMatchObject({ label: 'Fair' });
    expect(getPasswordStrength('VeryStrong#Password123')).toMatchObject({ label: 'Strong', width: '100%' });
  });

  it('decodes JWT tokens and surfaces expiry or algorithm warnings', () => {
    const token =
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1dGlsaXR5LWh1YiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.signature';

    const decoded = decodeJwtToken(token);
    expect(decoded.error).toBe('');
    expect(decoded.output?.payload.sub).toBe('utility-hub');

    const analysis = analyzeJwtToken(decoded.output!, new Date('2026-01-01T00:00:00.000Z').getTime());
    expect(analysis.warnings.some((warning) => warning.includes('expired'))).toBe(true);
    expect(analysis.warnings.some((warning) => warning.includes('"none"'))).toBe(true);
    expect(analysis.info.some((item) => item.includes('issued'))).toBe(true);
  });

  it('finds regex matches and reports invalid patterns', () => {
    const flags = { g: true, i: true, m: false, s: false };
    expect(formatRegexFlags(flags)).toBe('gi');

    const analysis = analyzeRegex('(utility)', flags, 'Utility hub utility');
    expect(analysis.error).toBe('');
    expect(analysis.output).toHaveLength(2);
    expect(analysis.output[0]).toMatchObject({ text: 'Utility', index: 0, groups: ['Utility'] });

    expect(analyzeRegex('(', flags, 'Utility').error).toContain('Invalid');
  });

  it('encodes and decodes HTML entities', () => {
    const source = '<button class="primary">Utility & Hub</button>';
    const encoded = transformHtmlEntities(source, 'encode');
    expect(encoded.output).toBe('&lt;button class=&quot;primary&quot;&gt;Utility &amp; Hub&lt;/button&gt;');
    expect(transformHtmlEntities(encoded.output, 'decode').output).toBe(source);
  });

  it('encodes and decodes query string payloads', () => {
    const source = '{\n  "source": "utility hub",\n  "tags": ["privacy", "local"]\n}';
    const encoded = transformQueryParams(source, 'encode');
    expect(encoded.error).toBe('');
    expect(encoded.output).toBe('source=utility+hub&tags=privacy&tags=local');

    const decoded = transformQueryParams(encoded.output, 'decode');
    expect(decoded.output).toContain('"source": "utility hub"');
    expect(decoded.output).toContain('"tags": [');
  });

  it('generates deterministic ULIDs and UUID lists', () => {
    const ulid = generateUlid(1718625600000, new Uint8Array(16).fill(1));
    expect(ulid).toHaveLength(26);
    expect(ulid).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);

    const uuidSpy = vi.spyOn(globalThis.crypto, 'randomUUID');
    uuidSpy.mockReturnValueOnce('00000000-0000-4000-8000-000000000001');
    uuidSpy.mockReturnValueOnce('00000000-0000-4000-8000-000000000002');

    expect(generateUuidList(2)).toEqual([
      '00000000-0000-4000-8000-000000000001',
      '00000000-0000-4000-8000-000000000002',
    ]);

    uuidSpy.mockRestore();
  });

  it('generates deterministic HMAC values', () => {
    const result = generateHmacs('sign-this-message', 'utility-hub-secret');
    expect(result.sha256).toHaveLength(64);
    expect(result.sha512).toHaveLength(128);
    expect(result.sha256).toBe('ae85349d0c70eebcbb32adcbe3fa5afb84e2bce978456a9fbc98076db2828bc0');
    expect(result.sha512).toBe(
      '778872c8faa3ae893b106d0cc87b5e4480573fe886d7b1f3e6181d7982094e71e535a545e4c0ac723540940b267ec5e5caa553511929bec906b3a42ac3df6777',
    );
  });

  it('encodes and decodes hexadecimal text', () => {
    const encoded = transformHex('Utility Hub', 'encode');
    expect(encoded.output).toBe('55 74 69 6c 69 74 79 20 48 75 62');
    expect(transformHex(encoded.output, 'decode').output).toBe('Utility Hub');
  });

  it('slugifies text safely', () => {
    expect(slugifyText('Privacy First Utility Hub')).toBe('privacy-first-utility-hub');
    expect(slugifyText('Crème brûlée utilities')).toBe('creme-brulee-utilities');
  });

  it('encodes and decodes unicode escapes', () => {
    const encoded = transformUnicodeEscapes('Utility ✓', 'encode');
    expect(encoded.output).toBe('\\u0055\\u0074\\u0069\\u006c\\u0069\\u0074\\u0079\\u0020\\u2713');
    expect(transformUnicodeEscapes(encoded.output, 'decode').output).toBe('Utility ✓');
  });

  it('converts csv and json payloads', () => {
    const csv = 'name,role\nUtility Hub,platform\nOpenAI,partner';
    const json = transformCsvJson(csv, 'csv-to-json');
    expect(json.output).toContain('"name": "Utility Hub"');
    expect(json.output).toContain('"role": "partner"');

    const roundTrip = transformCsvJson(json.output, 'json-to-csv');
    expect(roundTrip.output).toContain('name,role');
    expect(roundTrip.output).toContain('OpenAI,partner');
  });

  it('builds a line diff with added and removed rows', () => {
    const diff = diffText('one\ntwo\nthree', 'one\nthree\nfour');
    expect(diff).toEqual([
      { kind: 'unchanged', value: 'one' },
      { kind: 'removed', value: 'two' },
      { kind: 'unchanged', value: 'three' },
      { kind: 'added', value: 'four' },
    ]);
  });

  it('generates commit message suggestions from rough change notes', () => {
    const result = generateCommitSuggestions('fix sidebar toggle transition for desktop ui');
    expect(result.error).toBe('');
    expect(result.output[0].message).toContain('fix(ui):');
    expect(result.output).toHaveLength(3);
  });

  it('generates commit suggestions from pasted git diff input', () => {
    const diffInput = `diff --git a/src/components/AppShell.tsx b/src/components/AppShell.tsx
index 1111111..2222222 100644
--- a/src/components/AppShell.tsx
+++ b/src/components/AppShell.tsx
@@ -1,4 +1,4 @@
-const isOpen = true;
+const isOpen = false;`;

    const result = generateCommitSuggestions(diffInput);
    expect(result.error).toBe('');
    expect(result.output[0].message).toContain('(appshell)');
    expect(result.output[0].rationale).toContain('Parsed pasted diff input');
  });

  it('generates more substantial commit suggestions for qa config and feature-flag diffs', () => {
    const diffInput = `diff --git a/PaperlessMaintainer.Application/Configuration/QaSettings.cs b/PaperlessMaintainer.Application/Configuration/QaSettings.cs
index 1..2 100644
--- a/PaperlessMaintainer.Application/Configuration/QaSettings.cs
+++ b/PaperlessMaintainer.Application/Configuration/QaSettings.cs
@@ -1,3 +1,3 @@
-            BaseUrl = "#{BASE_URL_QA}#",
+            BaseUrl = "https://test.api.example.com",
diff --git a/PaperlessMaintainerMAUI/Services/AppState.cs b/PaperlessMaintainerMAUI/Services/AppState.cs
index 1..2 100644
--- a/PaperlessMaintainerMAUI/Services/AppState.cs
+++ b/PaperlessMaintainerMAUI/Services/AppState.cs
@@ -1,3 +1,3 @@
-        public bool IsRailFeatureEnabled => _preferences.Get(LD_RAIL_MIGRATION_KEY, false);
+        public bool IsRailFeatureEnabled => true;// _preferences.Get(LD_RAIL_MIGRATION_KEY, false);
-        public bool IsLateralStabilityEnabled => _preferences.Get(LD_LATERAL_STABILITY_KEY, false);
+        public bool IsLateralStabilityEnabled => true;// _preferences.Get(LD_LATERAL_STABILITY_KEY, false);`;

    const result = generateCommitSuggestions(diffInput);
    expect(result.error).toBe('');
    expect(result.output[0].message).toContain('qa');
    expect(result.output[0].message).toContain('configure qa settings and enable rail-related feature flags');
  });

  it('analyzes Dockerfiles and suggests safer output', () => {
    const result = analyzeDockerfile('FROM node:latest\nRUN npm install\nCMD ["npm","start"]');
    expect(result.error).toBe('');
    expect(result.output?.findings.some((finding) => finding.title.includes('npm ci'))).toBe(true);
    expect(result.output?.optimizedDockerfile).toContain('RUN npm ci');
  });

  it('validates GitHub Actions workflow structure', () => {
    const result = validateGitHubActions(`name: CI\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test`);
    expect(result.error).toBe('');
    expect(result.output?.jobs[0]).toMatchObject({ name: 'test', hasRunsOn: true });
    expect(result.output?.findings.some((finding) => finding.title.includes('Checkout step'))).toBe(true);
  });

  it('visualizes dependency groups from package manifests', () => {
    const result = visualizeDependencies(`{"name":"utility-hub","version":"1.0.0","dependencies":{"react":"^19.0.0"},"devDependencies":{"vite":"^8.0.0"},"scripts":{"dev":"vite"}}`);
    expect(result.error).toBe('');
    expect(result.output?.totals.dependencies).toBe(1);
    expect(result.output?.scripts).toEqual(['dev']);
  });

  it('calculates bundle totals from simple asset lists', () => {
    const result = calculateBundleSize('app.js 10kb\nstyles.css 5kb\nlogo.svg 2kb');
    expect(result.error).toBe('');
    expect(result.output?.totalBytes).toBe(17000);
    expect(result.output?.largestAsset?.name).toBe('app.js');
    expect(result.output?.byType.javascript).toBe(10000);
  });

  it('converts curl commands into starter snippets', () => {
    const result = convertCurlToCode(
      'curl https://api.example.com/items -X POST -H "Content-Type: application/json" --data \'{"id":1}\'',
    );
    expect(result.error).toBe('');
    expect(result.output?.method).toBe('POST');
    expect(result.output?.fetchSnippet).toContain('fetch');
    expect(result.output?.axiosSnippet).toContain('axios');
    expect(result.output?.pythonSnippet).toContain('requests.request');
  });

  it('formats sql into a more readable layout', () => {
    const result = formatSqlQuery('select id, name from tools where active = true order by created_at desc');
    expect(result.error).toBe('');
    expect(result.output).toContain('\nFROM');
    expect(result.output).toContain('\nWHERE');
    expect(result.output).toContain('\nORDER BY');
  });

  it('recommends semantic versions from release notes', () => {
    const result = calculateSemanticVersion('1.2.3', 'Add a new export endpoint for reports');
    expect(result.error).toBe('');
    expect(result.output?.recommendedLevel).toBe('minor');
    expect(result.output?.recommendedVersion).toBe('1.3.0');
  });

  it('detects breaking json shape changes', () => {
    const result = detectBreakingChanges('{"id":1,"name":"hub"}', '{"id":"1","workspace":"eng"}');
    expect(result.error).toBe('');
    expect(result.output?.breakingFindings.some((finding) => finding.path === '$.id')).toBe(true);
    expect(result.output?.breakingFindings.some((finding) => finding.path === '$.name')).toBe(true);
    expect(result.output?.nonBreakingFindings.some((finding) => finding.path === '$.workspace')).toBe(true);
  });

  it('inspects headers for security and cors findings', () => {
    const result = inspectHttpHeaders('HTTP/2 200\ncontent-type: application/json\naccess-control-allow-origin: *');
    expect(result.error).toBe('');
    expect(result.output?.headers).toHaveLength(2);
    expect(result.output?.findings.some((finding) => finding.title.includes('Wildcard CORS'))).toBe(true);
  });

  it('explains cron expressions and previews next runs', () => {
    const result = explainCronExpression('*/30 * * * *', new Date('2026-06-19T00:00:00.000Z'));
    expect(result.error).toBe('');
    expect(result.output?.fields[0].description).toContain('repeats every 30');
    expect(result.output?.nextRuns.length).toBeGreaterThan(0);
  });

  it('audits docker compose services', () => {
    const result = analyzeDockerCompose('services:\n  api:\n    image: node:latest\n    ports:\n      - "3000:3000"');
    expect(result.error).toBe('');
    expect(result.output?.serviceCount).toBe(1);
    expect(result.output?.findings.some((finding) => finding.title.includes('latest tag'))).toBe(true);
  });

  it('summarizes openapi documents', () => {
    const result = summarizeOpenApi(
      '{"openapi":"3.1.0","info":{"title":"Utility Hub API","version":"1.0.0"},"paths":{"/tools":{"get":{"tags":["tools"]}}}}',
    );
    expect(result.error).toBe('');
    expect(result.output?.title).toBe('Utility Hub API');
    expect(result.output?.operationCount).toBe(1);
    expect(result.output?.tags).toContain('tools');
  });

  it('builds markdown tables from csv rows', () => {
    const result = buildMarkdownTable('name,role\nUtility Hub,platform');
    expect(result.error).toBe('');
    expect(result.output?.markdown).toContain('| name | role |');
    expect(result.output?.markdown).toContain('| Utility Hub | platform |');
  });

  it('converts aligned cli table output into markdown', () => {
    const result = buildMarkdownStudio('Tool                    Category   Privacy\nMarkdown Studio         Developer  Local only');
    expect(result.error).toBe('');
    expect(result.output?.detectedFormat).toBe('whitespace-table');
    expect(result.output?.markdown).toContain('| Tool | Category | Privacy |');
    expect(result.output?.markdown).toContain('| Markdown Studio | Developer | Local only |');
  });

  it('normalizes markdown bullets without forcing table conversion', () => {
    const result = buildMarkdownStudio('• one\n• two');
    expect(result.error).toBe('');
    expect(result.output?.detectedFormat).toBe('markdown');
    expect(result.output?.markdown).toBe('- one\n- two');
  });

  it('converts jsonl into a pretty json array', () => {
    const result = transformJsonLines('{"tool":"markdown-studio"}\n{"tool":"prompt-studio"}', 'jsonl-to-array');
    expect(result.error).toBe('');
    expect(result.output?.rowCount).toBe(2);
    expect(result.output?.prettyJsonArray).toContain('"tool": "markdown-studio"');
  });

  it('inspects env files for duplicates and invalid lines', () => {
    const result = inspectEnvFile('API_BASE_URL=https://one\nAPI_BASE_URL=https://two\nOPENAI_API_KEY=sk-test\nINVALID LINE');
    expect(result.error).toBe('');
    expect(result.output?.duplicateKeys).toContain('API_BASE_URL');
    expect(result.output?.invalidLines).toContain('INVALID LINE');
    expect(result.output?.secretLikeCount).toBe(1);
  });

  it('removes ansi sequences from terminal output', () => {
    const result = cleanAnsiOutput('\u001b[32mSUCCESS\u001b[0m\n\u001b[31mERROR\u001b[0m');
    expect(result.error).toBe('');
    expect(result.output?.cleaned).toBe('SUCCESS\nERROR');
    expect(result.output?.removedSequences).toBeGreaterThan(0);
  });

  it('builds markdown checklists from mixed note lines', () => {
    const result = buildMarkdownChecklist('ship docs\n[x] verify tests\n- deploy');
    expect(result.error).toBe('');
    expect(result.output?.markdown).toContain('- [ ] ship docs');
    expect(result.output?.markdown).toContain('- [x] verify tests');
    expect(result.output?.checkedCount).toBe(1);
  });

  it('deduplicates lines while preserving first occurrence order', () => {
    const result = deduplicateLines('markdown\nprompt\nmarkdown\ndiff', 'preserve-order');
    expect(result.error).toBe('');
    expect(result.output?.output).toBe('markdown\nprompt\ndiff');
    expect(result.output?.removedCount).toBe(1);
  });

  it('explores a nested json path', () => {
    const result = exploreJsonPath('{"event":{"actor":{"name":"Arun"}}}', 'event.actor.name');
    expect(result.error).toBe('');
    expect(result.output?.found).toBe(true);
    expect(result.output?.value).toContain('Arun');
  });

  it('diffs two header blocks', () => {
    const result = diffHeaders('cache-control: private\nx-frame-options: DENY', 'cache-control: public\ncontent-security-policy: self');
    expect(result.error).toBe('');
    expect(result.output?.added).toContain('content-security-policy');
    expect(result.output?.removed).toContain('x-frame-options');
    expect(result.output?.changed[0]?.key).toBe('cache-control');
  });

  it('summarizes har requests', () => {
    const result = summarizeHarRequests('{"log":{"entries":[{"request":{"method":"GET","url":"https://api.example.com/tools"},"response":{"status":200}}]}}');
    expect(result.error).toBe('');
    expect(result.output?.requestCount).toBe(1);
    expect(result.output?.domainCount).toBe(1);
  });

  it('inspects webhook payload structure', () => {
    const result = inspectWebhookPayload('{"type":"deployment.finished","data":{"project":"utility-hub"},"attempts":[1]}');
    expect(result.error).toBe('');
    expect(result.output?.eventName).toBe('deployment.finished');
    expect(result.output?.arrayCount).toBe(1);
  });

  it('converts aligned sql output into markdown', () => {
    const result = convertSqlResultToMarkdown('name    category\nMarkdown Studio    Developer');
    expect(result.error).toBe('');
    expect(result.output?.markdown).toContain('| name | category |');
  });

  it('analyzes common log levels', () => {
    const result = analyzeLogLevels('[ERROR] one\n[WARN] two\n[INFO] three');
    expect(result.error).toBe('');
    expect(result.output?.counts.error).toBe(1);
    expect(result.output?.counts.warn).toBe(1);
  });

  it('extracts uuids from text', () => {
    const result = extractUuids('id a4f03f9f-4cf6-4da6-a68f-bb3b3a41ad5a and a4f03f9f-4cf6-4da6-a68f-bb3b3a41ad5a');
    expect(result.error).toBe('');
    expect(result.output?.uniqueCount).toBe(1);
  });

  it('extracts urls and emails from text', () => {
    const result = extractLinksAndEmails('Visit https://example.com and email arun@example.com');
    expect(result.error).toBe('');
    expect(result.output?.urls).toContain('https://example.com');
    expect(result.output?.emails).toContain('arun@example.com');
  });

  it('redacts secrets and email addresses', () => {
    const result = redactSecrets('OPENAI_API_KEY=sk-test-secret-token\nContact arun@example.com');
    expect(result.error).toBe('');
    expect(result.output?.redacted).toContain('[REDACTED_API_KEY]');
    expect(result.output?.redacted).toContain('[REDACTED_EMAIL]');
  });

  it('formats an api error payload into markdown', () => {
    const result = formatApiError('{"status":422,"message":"Validation failed","field":"email"}');
    expect(result.error).toBe('');
    expect(result.output?.markdown).toContain('## Validation failed');
    expect(result.output?.statusCode).toBe('422');
  });

  it('masks and fingerprints api keys', () => {
    const result = inspectApiKeyFingerprint('sk-test-demo-secret-key');
    expect(result.error).toBe('');
    expect(result.output?.masked).toContain('sk-t');
    expect(result.output?.fingerprint.length).toBe(16);
  });

  it('generates sri hashes', () => {
    const result = generateSriHashes('console.log("utility hub");');
    expect(result.error).toBe('');
    expect(result.output?.sha256).toContain('sha256-');
    expect(result.output?.sha384).toContain('sha384-');
    expect(result.output?.sha512).toContain('sha512-');
  });

  it('inspects risky cors policy combinations', () => {
    const result = inspectCorsPolicy('access-control-allow-origin: *\naccess-control-allow-credentials: true');
    expect(result.error).toBe('');
    expect(result.output?.risk).toBe('high');
    expect(result.output?.findings.some((finding) => finding.title.includes('Wildcard origin with credentials'))).toBe(true);
  });

  it('inspects security.txt content', () => {
    const result = inspectSecurityTxt('Contact: mailto:security@example.com\nExpires: 2027-01-01T00:00:00Z');
    expect(result.error).toBe('');
    expect(result.output?.contacts[0]).toContain('mailto:security@example.com');
    expect(result.output?.expires).toContain('2027');
  });

  it('detects external redirect targets', () => {
    const result = inspectOpenRedirect('https://app.example.com/login?next=https://evil.example.net/phish', 'app.example.com');
    expect(result.error).toBe('');
    expect(result.output?.host).toBe('evil.example.net');
    expect(result.output?.findings.length).toBeGreaterThan(0);
  });

  it('scores password policy guidance', () => {
    const result = inspectPasswordPolicy('Passwords must be at least 12 characters and include uppercase, lowercase, number, and symbol. MFA is required.');
    expect(result.error).toBe('');
    expect(result.output?.minimumLength).toBe(12);
    expect(result.output?.requirements).toContain('Uppercase letter');
  });

  it('inspects signed url expiry hints', () => {
    const result = inspectSignedUrl('https://bucket.s3.amazonaws.com/file.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=86400&X-Amz-Signature=abc');
    expect(result.error).toBe('');
    expect(result.output?.provider).toContain('AWS');
    expect(result.output?.parameters).toContain('X-Amz-Expires');
  });

  it('flags signed urls without an obvious expiry parameter and rejects invalid url input', () => {
    const noExpiry = inspectSignedUrl('https://bucket.s3.amazonaws.com/file.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=abc');
    expect(noExpiry.error).toBe('');
    expect(noExpiry.output?.findings.some((finding) => finding.title === 'No obvious expiry parameter')).toBe(true);

    expect(inspectSignedUrl('not a url')).toEqual({
      error: 'Paste a valid signed URL to inspect.',
      output: null,
    });
  });

  it('formats xml into indented lines', () => {
    const result = formatXml('<root><item>one</item></root>');
    expect(result.error).toBe('');
    expect(result.output).toContain('<root>');
    expect(result.output).toContain('  <item>one</item>');
  });

  it('formats html into readable markup', () => {
    const result = formatHtml('<section><p>Hello</p></section>');
    expect(result.error).toBe('');
    expect(result.output).toContain('<section>');
  });

  it('formats compact css into multiple lines', () => {
    const result = formatCssStylesheet('.card{display:grid;color:#177e89}');
    expect(result.error).toBe('');
    expect(result.output).toContain('display:grid;');
    expect(result.output).toContain('\n}');
  });

  it('normalizes markdown bullets and spacing', () => {
    const result = formatMarkdownDocument('• one\n\n\n• two');
    expect(result.error).toBe('');
    expect(result.output).toBe('- one\n\n- two');
  });

  it('applies rot13 reversibly', () => {
    const encoded = transformRot13('utility');
    expect(encoded.output).toBe('hgvyvgl');
    expect(transformRot13(encoded.output).output).toBe('utility');
  });

  it('encodes and decodes binary text', () => {
    const encoded = transformBinaryText('A', 'encode');
    expect(encoded.output).toBe('01000001');
    expect(transformBinaryText(encoded.output, 'decode').output).toBe('A');
  });

  it('encodes and decodes base32 text', () => {
    const encoded = transformBase32('hi', 'encode');
    expect(encoded.error).toBe('');
    expect(transformBase32(encoded.output, 'decode').output).toBe('hi');
  });

  it('encodes and decodes base58 text', () => {
    const encoded = transformBase58('hello', 'encode');
    expect(encoded.error).toBe('');
    expect(transformBase58(encoded.output, 'decode').output).toBe('hello');
  });

  it('encodes and decodes quoted printable text', () => {
    const encoded = transformQuotedPrintable('Olé utility hub', 'encode');
    expect(encoded.error).toBe('');
    expect(encoded.output).toContain('=C3=A9');
    expect(transformQuotedPrintable(encoded.output, 'decode').output).toBe('Olé utility hub');
  });

  it('encodes and decodes data urls', () => {
    const encoded = transformDataUrl('Utility Hub', 'text-to-data-url');
    expect(encoded.error).toBe('');
    expect(encoded.output).toContain('data:text/plain');
    expect(transformDataUrl(encoded.output, 'data-url-to-text').output).toBe('Utility Hub');
  });

  it('encodes and decodes basic auth pairs', () => {
    const encoded = transformBasicAuth('demo:secret', 'encode');
    expect(encoded.error).toBe('');
    expect(encoded.output).toContain('Basic ');
    expect(transformBasicAuth(encoded.output, 'decode').output).toBe('demo:secret');
  });

  it('encodes and decodes character codes', () => {
    const encoded = transformCharacterCodes('ABC', 'encode');
    expect(encoded.error).toBe('');
    expect(encoded.output).toBe('65 66 67');
    expect(transformCharacterCodes(encoded.output, 'decode').output).toBe('ABC');
  });

  it('encodes and decodes morse text', () => {
    const encoded = transformMorseCode('SOS', 'encode');
    expect(encoded.output).toBe('... --- ...');
    expect(transformMorseCode(encoded.output, 'decode').output).toBe('SOS');
  });

  it('converts number bases from decimal', () => {
    const result = convertNumberBases('255', 10);
    expect(result.error).toBe('');
    expect(result.output?.binary).toBe('11111111');
    expect(result.output?.hexadecimal).toBe('FF');
  });

  it('converts roman numerals in both directions', () => {
    expect(convertRomanNumeral('42').output).toBe('XLII');
    expect(convertRomanNumeral('XLII').output).toBe('42');
  });

  it('generates nano ids to requested count', () => {
    const result = generateNanoIds(3, 10);
    expect(result.error).toBe('');
    expect(result.output?.values).toHaveLength(3);
    expect(result.output?.values[0].length).toBe(10);
  });

  it('generates lorem ipsum paragraphs', () => {
    const result = generateLoremIpsum(2);
    expect(result.error).toBe('');
    expect(result.output?.paragraphCount).toBe(2);
    expect(result.output?.wordCount).toBeGreaterThan(10);
  });

  it('inspects cookie security flags', () => {
    const result = inspectCookieSecurity('Set-Cookie: session=abc; Path=/; HttpOnly; Secure; SameSite=Lax\nSet-Cookie: prefs=dark; Path=/');
    expect(result.error).toBe('');
    expect(result.output?.cookies).toHaveLength(2);
    expect(result.output?.findings.length).toBeGreaterThan(0);
  });

  it('inspects csp policy findings', () => {
    const result = inspectCspPolicy(`default-src 'self'; script-src 'self' 'unsafe-inline'`);
    expect(result.error).toBe('');
    expect(result.output?.findings.some((finding) => finding.title.includes('unsafe-inline'))).toBe(true);
  });

  it('extracts jwt expiry metadata', () => {
    const result = inspectJwtExpiry('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dGlsaXR5LWh1YiIsImlhdCI6MTcxODYyMjAwMCwiZXhwIjoyMDMyNjIyMDAwfQ.signature');
    expect(result.error).toBe('');
    expect(result.output?.status).toBe('Active');
  });

  it('runs regex replacement previews', () => {
    const result = runRegexReplace('\\s+', '-', 'utility hub tools', 'g');
    expect(result.error).toBe('');
    expect(result.output?.output).toBe('utility-hub-tools');
    expect(result.output?.replacements).toBe(2);
  });

  it('validates email addresses line by line', () => {
    const result = validateEmailAddresses('arun@example.com\ninvalid@localhost');
    expect(result.error).toBe('');
    expect(result.output?.valid).toContain('arun@example.com');
    expect(result.output?.invalid).toContain('invalid@localhost');
  });

  it('converts byte sizes across common units', () => {
    const result = convertByteSize('1024', 'bytes');
    expect(result.error).toBe('');
    expect(result.output?.kilobytes).toBe('1.0000');
    expect(result.output?.megabytes).toBe('0.0010');
  });

  it('converts colors between hex rgb and hsl', () => {
    const result = convertColorFormats('#177E89');
    expect(result.error).toBe('');
    expect(result.output?.hex).toBe('#177E89');
    expect(result.output?.rgb).toBe('rgb(23, 126, 137)');
    expect(result.output?.hsl).toContain('hsl(');
  });

  it('normalizes line endings', () => {
    const result = convertLineEndings('one\r\ntwo', 'lf');
    expect(result.error).toBe('');
    expect(result.output).toBe('one\ntwo');
  });

  it('converts tabs into spaces and spaces into tabs', () => {
    expect(convertTabsAndSpaces('\tone', 'tabs-to-spaces', 2).output).toBe('  one');
    expect(convertTabsAndSpaces('    one', 'spaces-to-tabs', 2).output).toBe('\t\tone');
  });

  it('converts line lists to json arrays and back again', () => {
    const toJson = transformListJson('alpha\nbeta', 'list-to-json');
    expect(toJson.error).toBe('');
    expect(toJson.output).toContain('"alpha"');

    const toList = transformListJson('["alpha","beta"]', 'json-to-list');
    expect(toList.error).toBe('');
    expect(toList.output).toBe('alpha\nbeta');
  });

  it('generates passphrases with the requested counts', () => {
    const result = generatePassphrases(3, 4);
    expect(result.error).toBe('');
    expect(result.output?.values).toHaveLength(3);
    expect(result.output?.values[0].split('-')).toHaveLength(4);
  });

  it('generates bounded random integers', () => {
    const result = generateRandomNumbers(5, 10, 20);
    expect(result.error).toBe('');
    expect(result.output?.values).toHaveLength(5);
    expect(result.output?.values.every((value) => value >= 10 && value <= 20)).toBe(true);
  });

  it('generates username suggestions from a seed phrase', () => {
    const result = generateUsernames('utility hub', 4);
    expect(result.error).toBe('');
    expect(result.output?.values).toHaveLength(4);
    expect(result.output?.values[0]).toMatch(/utility|hub/);
  });

  it('generates token-like strings with the given prefix', () => {
    const result = generateApiTokens(2, 16, 'uh');
    expect(result.error).toBe('');
    expect(result.output?.values).toHaveLength(2);
    expect(result.output?.values[0]).toMatch(/^uh_/);
  });

  it('builds gitignore templates from section names', () => {
    const result = buildGitignoreTemplate('node\nlogs');
    expect(result.error).toBe('');
    expect(result.output?.output).toContain('node_modules/');
    expect(result.output?.sections).toContain('logs');
  });

  it('rejects unknown gitignore section names clearly', () => {
    expect(buildGitignoreTemplate('terraformish')).toEqual({
      error: 'Use known section names like node, python, dotnet, vscode, or logs.',
      output: null,
    });
  });

  it('converts data urls to and from plain text and rejects invalid payloads', () => {
    const encoded = transformDataUrl('Utility Hub', 'text-to-data-url');
    expect(encoded.error).toBe('');
    expect(encoded.output).toContain('data:text/plain;charset=utf-8;base64,');

    const decoded = transformDataUrl(encoded.output, 'data-url-to-text');
    expect(decoded).toEqual({ error: '', output: 'Utility Hub' });

    expect(transformDataUrl('not-a-data-url', 'data-url-to-text').error).toBe('Paste a valid data URL to decode.');
  });

  it('builds markdown studio output from json arrays and plain text inputs', () => {
    const table = buildMarkdownStudio('[{"tool":"markdown-studio","category":"developer"}]');
    expect(table.error).toBe('');
    expect(table.output?.detectedFormat).toBe('json-array');
    expect(table.output?.markdown).toContain('| tool | category |');

    const plain = buildMarkdownStudio('Utility Hub keeps prompt and markdown workflows local.');
    expect(plain.error).toBe('');
    expect(plain.output?.detectedFormat).toBe('plain-text');
  });

  it('converts json lines in both directions and rejects non-array array-to-jsonl input', () => {
    const jsonl = transformJsonLines('{"tool":"markdown"}\n{"tool":"prompt"}', 'jsonl-to-array');
    expect(jsonl.error).toBe('');
    expect(jsonl.output?.rowCount).toBe(2);

    const array = transformJsonLines('[{"tool":"markdown"},{"tool":"prompt"}]', 'array-to-jsonl');
    expect(array.error).toBe('');
    expect(array.output?.normalizedJsonl.split('\n')).toHaveLength(2);

    expect(transformJsonLines('{"tool":"markdown"}', 'array-to-jsonl').error).toBe(
      'Provide a JSON array when converting array data into JSONL.',
    );
  });

  it('inspects env files including duplicate keys invalid lines and masked secret-like values', () => {
    const result = inspectEnvFile('API_URL=https://example.test\nOPENAI_API_KEY=sk-secret-demo\nAPI_URL=https://second.test\nINVALID LINE');
    expect(result.error).toBe('');
    expect(result.output?.duplicateKeys).toEqual(['API_URL']);
    expect(result.output?.invalidLines).toEqual(['INVALID LINE']);
    expect(result.output?.entries.find((entry) => entry.key === 'OPENAI_API_KEY')?.valuePreview).toContain('***');
  });

  it('cleans ansi control codes and collapses excessive blank lines', () => {
    const result = cleanAnsiOutput('\u001b[32mOK\u001b[0m\r\n\r\n\r\n\u001b[31mFAIL\u001b[0m  ');
    expect(result.error).toBe('');
    expect(result.output?.cleaned).toBe('OK\n\nFAIL');
    expect(result.output?.removedSequences).toBeGreaterThan(0);
  });

  it('builds markdown checklists from mixed bullet and checkbox input', () => {
    const result = buildMarkdownChecklist('ship docs\n[x] verify tests\n- deploy');
    expect(result.error).toBe('');
    expect(result.output?.markdown).toContain('- [ ] ship docs');
    expect(result.output?.markdown).toContain('- [x] verify tests');
    expect(result.output?.checkedCount).toBe(1);
  });

  it('redacts multiple secret formats and counts replacements', () => {
    const result = redactSecrets('sk-secret-demo-key github ghp_1234567890ABCDE user@example.com abcdefghijklmnopqrstuvwx.yyyyyyyyyy.zzzzzzzzzz');
    expect(result.error).toBe('');
    expect(result.output?.redacted).toContain('[REDACTED_API_KEY]');
    expect(result.output?.redacted).toContain('[REDACTED_GITHUB_TOKEN]');
    expect(result.output?.redacted).toContain('[REDACTED_EMAIL]');
    expect(result.output?.redacted).toContain('[REDACTED_SECRET]');
    expect(result.output?.replacements).toBeGreaterThanOrEqual(4);
  });

  it('formats api error payloads and surfaces parsing failures for invalid bodies', () => {
    const result = formatApiError('{"status":422,"message":"Validation failed","field":"email"}');
    expect(result.error).toBe('');
    expect(result.output?.statusCode).toBe('422');
    expect(result.output?.detailCount).toBe(1);

    expect(formatApiError('{oops').error.length).toBeGreaterThan(0);
  });

  it('formats ini style documents', () => {
    const result = formatIniDocument('[app]\nname=utility-hub\nmode: local');
    expect(result.error).toBe('');
    expect(result.output).toContain('name = utility-hub');
    expect(result.output).toContain('mode = local');
  });

  it('formats raw http requests', () => {
    const result = formatHttpRequest('post https://api.example.com/tools\ncontent-type: application/json\n\n{"tool":"markdown"}');
    expect(result.error).toBe('');
    expect(result.output).toContain('POST https://api.example.com/tools');
    expect(result.output).toContain('"tool": "markdown"');
  });

  it('formats stack traces into numbered lines', () => {
    const result = formatStackTrace('Error: failed\n    at saveFile (app.ts:42:9)');
    expect(result.error).toBe('');
    expect(result.output).toContain('01. Error: failed');
    expect(result.output).toContain('02. saveFile');
  });

  it('converts delimited rows between formats', () => {
    const result = convertDelimitedText('name,role\nUtility Hub,platform', ',', 'tab');
    expect(result.error).toBe('');
    expect(result.output).toContain('\t');
  });

  it('preserves non-standard http request lines while still sorting headers and body blocks', () => {
    const result = formatHttpRequest('custom request line\nz-header: last\na-header: first\n\nplain body');
    expect(result.error).toBe('');
    expect(result.output).toBe('custom request line\na-header: first\nz-header: last\n\nplain body');
  });

  it('converts durations across common units', () => {
    const result = convertDurationUnits('90', 'seconds');
    expect(result.error).toBe('');
    expect(result.output?.milliseconds).toBe('90000');
    expect(result.output?.minutes).toBe('1.5');
    expect(result.output?.days).toBe('0.001');
  });

  it('converts days and weeks into longer human-readable units', () => {
    const result = convertDurationUnits('14', 'days');
    expect(result.error).toBe('');
    expect(result.output?.hours).toBe('336');
    expect(result.output?.weeks).toBe('2');
    expect(result.output?.months).toBe('0.4667');
  });

  it('rejects invalid duration values', () => {
    expect(convertDurationUnits('abc', 'minutes').error).toBe('Enter a valid duration value.');
  });

  it('calculates the difference between two timestamps or date strings', () => {
    const result = calculateDateDifference('1718625600', '2024-06-18T12:00:00.000Z');
    expect(result.error).toBe('');
    expect(result.output?.direction).toBe('forward');
    expect(result.output?.hours).toBe('24');
    expect(result.output?.days).toBe('1');
    expect(result.output?.human).toBe('1 day');
  });

  it('calculates an expiry time by adding a duration to a base timestamp', () => {
    const result = calculateTimestampOffset('1718625600', '90', 'minutes', 'add');
    expect(result.error).toBe('');
    expect(result.output?.resultIso).toBe('2024-06-17T13:30:00.000Z');
    expect(result.output?.unixSeconds).toBe(1718631000);
    expect(result.output?.deltaHuman).toBe('1.5 hours');
  });

  it('inspects a mixed batch of timestamps line by line', () => {
    const result = inspectTimestampBatch(['1718625600', '1718625600123', 'nope'].join('\n'), Date.UTC(2024, 5, 17, 12, 0, 0));
    expect(result.error).toBe('');
    expect(result.output?.totalLines).toBe(3);
    expect(result.output?.validCount).toBe(2);
    expect(result.output?.invalidCount).toBe(1);
    expect(result.output?.rows[0]).toMatchObject({ detectedUnit: 'seconds', iso: '2024-06-17T12:00:00.000Z' });
    expect(result.output?.rows[2].error).toBe('Enter a valid Unix timestamp in seconds, milliseconds, microseconds, or nanoseconds.');
  });

  it('renders a time across preset time zones', () => {
    const result = convertTimeZones('2026-07-02T09:00:00Z', ['UTC', 'Australia/Brisbane']);
    expect(result.error).toBe('');
    expect(result.output?.rows).toHaveLength(2);
    expect(result.output?.rows[0].formatted).toContain('UTC');
    expect(result.output?.rows[1].timeZone).toBe('Australia/Brisbane');
  });

  it('calculates relative time from now', () => {
    const result = calculateRelativeTime('2026-07-03T09:00:00.000Z', Date.UTC(2026, 6, 2, 9, 0, 0));
    expect(result.error).toBe('');
    expect(result.output?.direction).toBe('future');
    expect(result.output?.relative).toBe('in 1 day');
    expect(result.output?.days).toBe('1');
    expect(result.output?.human).toBe('1 day');
  });

  it('converts path separators', () => {
    const result = convertPathSeparators('src\\tools\\JsonFormatter.tsx', 'posix');
    expect(result.error).toBe('');
    expect(result.output).toBe('src/tools/JsonFormatter.tsx');
    expect(convertPathSeparators('src/tools/JsonFormatter.tsx', 'windows').output).toBe('src\\tools\\JsonFormatter.tsx');
  });

  it('generates color palettes from a base color', () => {
    const result = generateColorPalette('#177E89');
    expect(result.error).toBe('');
    expect(result.output?.values).toHaveLength(5);
    expect(result.output?.values[0].hex).toBe('#177E89');
  });

  it('returns a clear validation error when palette generation receives an invalid color', () => {
    expect(generateColorPalette('not-a-color')).toEqual({
      error: 'Paste a hex, rgb(...), or hsl(...) color value.',
      output: null,
    });
  });

  it('generates fake users for fixtures', () => {
    const result = generateFakeUsers(3);
    expect(result.error).toBe('');
    expect(result.output?.values).toHaveLength(3);
    expect(result.output?.values[0].email).toContain('@example.test');
  });

  it('rejects invalid counts for generated fixture-style helper data', () => {
    expect(generateNanoIds(0, 10).error).toBe('Use positive values for count and length.');
    expect(generateFakeUsers(0).error).toBe('Use a positive count for fake users.');
  });

  it('generates release notes from bullets', () => {
    const result = generateReleaseNotes('- Added Base58 Studio\n- Fixed sidebar');
    expect(result.error).toBe('');
    expect(result.output?.markdown).toContain('## Release notes');
    expect(result.output?.bulletCount).toBe(2);
  });

  it('generates test case titles from a feature phrase', () => {
    const result = generateTestCaseTitles('the markdown table builder');
    expect(result.error).toBe('');
    expect(result.output?.values[0]).toContain('Given the markdown table builder');
    expect(result.output?.values).toHaveLength(4);
  });

  it('tests json pointers against payloads', () => {
    const result = testJsonPointer('{"event":{"actor":{"name":"Arun"}}}', '/event/actor/name');
    expect(result.error).toBe('');
    expect(result.output?.found).toBe(true);
    expect(result.output?.value).toContain('Arun');
  });

  it('covers root, missing, and invalid json pointer cases', () => {
    const root = testJsonPointer('{"event":{"actor":{"name":"Arun"}}}', '/');
    expect(root.error).toBe('');
    expect(root.output?.found).toBe(true);
    expect(root.output?.value).toContain('"event"');

    const missing = testJsonPointer('{"event":{"actor":{"name":"Arun"}}}', '/event/actor/id');
    expect(missing.error).toBe('');
    expect(missing.output).toEqual({ found: false, value: '' });

    expect(testJsonPointer('{oops', '/event').error).toBe('Paste valid JSON before testing a JSON Pointer.');
  });

  it('supports array indices and escaped json pointer tokens', () => {
    const arrayIndex = testJsonPointer('{"items":["zero","one"]}', '/items/1');
    expect(arrayIndex.error).toBe('');
    expect(arrayIndex.output?.found).toBe(true);
    expect(arrayIndex.output?.value).toBe('one');

    const escaped = testJsonPointer('{"a/b":{"~key":"ok"}}', '/a~1b/~0key');
    expect(escaped.error).toBe('');
    expect(escaped.output?.found).toBe(true);
    expect(escaped.output?.value).toBe('ok');
  });

  it('returns not found when a json pointer tries to drill into a primitive value', () => {
    const primitive = testJsonPointer('"utility"', '/0');
    expect(primitive.error).toBe('');
    expect(primitive.output).toEqual({ found: false, value: '' });
  });

  it('tests url patterns and extracts params', () => {
    const result = testUrlPattern('/tools/:toolId/run', '/tools/json-formatter/run');
    expect(result.error).toBe('');
    expect(result.output?.matched).toBe(true);
    expect(result.output?.parameters[0]).toEqual({ key: 'toolId', value: 'json-formatter' });
  });

  it('handles unmatched url patterns without raising errors', () => {
    const result = testUrlPattern('/tools/:toolId/run', '/docs/json-formatter/run');
    expect(result.error).toBe('');
    expect(result.output?.matched).toBe(false);
    expect(result.output?.parameters).toEqual([]);
  });

  it('tests semantic version ranges', () => {
    const result = testSemverRange('1.4.2', '^1.2.3');
    expect(result.error).toBe('');
    expect(result.output?.isMatch).toBe(true);
  });

  it('covers tilde, comparison, exact, and empty semantic version range modes', () => {
    const tilde = testSemverRange('1.2.9', '~1.2.3');
    expect(tilde.error).toBe('');
    expect(tilde.output?.isMatch).toBe(true);
    expect(tilde.output?.reasons[0]).toContain('1.2.x');

    const comparison = testSemverRange('2.0.0', '>=1.9.9');
    expect(comparison.error).toBe('');
    expect(comparison.output?.isMatch).toBe(true);
    expect(comparison.output?.reasons[0]).toContain('>=');

    const exact = testSemverRange('1.2.3', '1.2.3');
    expect(exact.error).toBe('');
    expect(exact.output?.isMatch).toBe(true);
    expect(exact.output?.reasons[0]).toContain('Exact semantic version match required');

    expect(testSemverRange('1.2.3', '   ')).toEqual({ error: '', output: null });
  });

  it('surfaces invalid semver inputs and comparison ranges clearly', () => {
    expect(testSemverRange('abc', '^1.2.3').error).toBe('Use a semantic version like 1.2.3.');
    expect(testSemverRange('1.2.3', '^abc').error).toBe('Use a valid caret range like ^1.2.3.');
  });

  it('tests http status rules', () => {
    const result = testHttpStatusRule('204', '2xx');
    expect(result.error).toBe('');
    expect(result.output?.isMatch).toBe(true);
  });

  it('covers status range, exact-match, and empty http status rules', () => {
    const range = testHttpStatusRule('204', '200-299');
    expect(range.error).toBe('');
    expect(range.output?.isMatch).toBe(true);
    expect(range.output?.reasons[0]).toContain('200-299');

    const exact = testHttpStatusRule('204', '204');
    expect(exact.error).toBe('');
    expect(exact.output?.isMatch).toBe(true);
    expect(exact.output?.reasons[0]).toContain('Exact status code match required');

    expect(testHttpStatusRule('204', '   ')).toEqual({ error: '', output: null });
  });

  it('surfaces invalid status rules clearly', () => {
    expect(testHttpStatusRule('oops', '2xx').error).toBe('Enter a valid HTTP status code.');
    expect(testHttpStatusRule('204', 'success').error).toBe('Use a rule like 2xx, 200-299, or 204.');
  });

  it('inspects cors policies, security txt, redirect targets, password policies, and signed urls for risky states', () => {
    const cors = inspectCorsPolicy('access-control-allow-origin: *\naccess-control-allow-credentials: true');
    expect(cors.error).toBe('');
    expect(cors.output?.risk).toBe('high');
    expect(cors.output?.findings.some((finding) => finding.title.includes('Wildcard origin with credentials'))).toBe(true);

    const securityTxt = inspectSecurityTxt('Expires: 2027-01-01T00:00:00.000Z');
    expect(securityTxt.error).toBe('');
    expect(securityTxt.output?.findings.some((finding) => finding.title.includes('Missing Contact'))).toBe(true);

    const redirect = inspectOpenRedirect('https://app.example.test/login?next=https://evil.example.com/phish', 'app.example.test');
    expect(redirect.error).toBe('');
    expect(redirect.output?.host).toBe('evil.example.com');
    expect(redirect.output?.findings.some((finding) => finding.title.includes('allowlist'))).toBe(true);

    const policy = inspectPasswordPolicy('Minimum length 8 characters. Rotate every 30 days.');
    expect(policy.error).toBe('');
    expect(policy.output?.findings.some((finding) => finding.title.includes('Minimum length'))).toBe(true);
    expect(policy.output?.findings.some((finding) => finding.title.includes('Mandatory rotation'))).toBe(true);

    const signed = inspectSignedUrl('https://bucket.s3.amazonaws.com/file.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=172800&X-Amz-Signature=abc');
    expect(signed.error).toBe('');
    expect(signed.output?.provider).toBe('AWS S3 presigned URL');
    expect(signed.output?.findings.some((finding) => finding.title.includes('Long AWS presign duration'))).toBe(true);
  });

  it('rejects invalid number-base conversion input', () => {
    expect(convertNumberBases('2', 2).error.length).toBeGreaterThan(0);
  });

  it('covers invalid and edge parser cases across several privacy helpers', () => {
    expect(transformBase32('INVALID*', 'decode').error).toBe('Base32 input may only contain A-Z, 2-7, and optional padding.');
    expect(transformCharacterCodes('65, nope', 'decode').error).toBe('Provide decimal character codes separated by spaces or commas.');
    expect(transformBasicAuth('demo-only', 'encode').error).toBe('Enter credentials in the form username:password.');
    expect(convertRomanNumeral('4000').error).toBe('Use a number between 1 and 3999.');
    expect(convertRomanNumeral('ABCD').error).toBe('Use only valid Roman numeral characters.');
    expect(convertColorFormats('not-a-color').error).toBe('Paste a hex, rgb(...), or hsl(...) color value.');
  });

  it('covers helper states for jwt expiry, token generation, regex replacement, and random ranges', () => {
    const noExpiry = inspectJwtExpiry('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dGlsaXR5LWh1YiJ9.signature');
    expect(noExpiry.error).toBe('');
    expect(noExpiry.output?.status).toBe('No exp claim');

    const tokenNoPrefix = generateApiTokens(1, 8, '');
    expect(tokenNoPrefix.error).toBe('');
    expect(tokenNoPrefix.output?.values[0]).not.toContain('_');

    const regex = runRegexReplace('(', '-', 'utility hub', 'g');
    expect(regex.error.length).toBeGreaterThan(0);

    expect(generateRandomNumbers(2, 20, 10).error).toBe('Provide a positive count and a valid min/max range.');
  });

  it('compares json values by path', () => {
    const result = compareJsonValues('{"flags":{"beta":false}}', '{"flags":{"beta":true},"region":"au"}');
    expect(result.error).toBe('');
    expect(result.output?.changed).toContain('flags.beta');
    expect(result.output?.added).toContain('region');
  });

  it('generates json schema from sample json', () => {
    const result = generateJsonSchema('{"id":1,"name":"Utility Hub","owner":{"team":"eng"}}');
    expect(result.error).toBe('');
    expect(result.output?.rootType).toBe('object');
    expect(result.output?.schema).toContain('"$schema"');
    expect(result.output?.schema).toContain('"owner"');
  });

  it('generates json schema for arrays and reports empty or invalid schema input clearly', () => {
    const arrayResult = generateJsonSchema('[{"name":"Utility Hub","flags":["local"]}]');
    expect(arrayResult.error).toBe('');
    expect(arrayResult.output?.rootType).toBe('array');
    expect(arrayResult.output?.propertyCount).toBeGreaterThan(1);
    expect(arrayResult.output?.schema).toContain('"type": "array"');

    const emptyArray = generateJsonSchema('[]');
    expect(emptyArray.error).toBe('');
    expect(emptyArray.output?.schema).toContain('"items": {}');

    const nullResult = generateJsonSchema('null');
    expect(nullResult.error).toBe('');
    expect(nullResult.output?.rootType).toBe('null');
    expect(nullResult.output?.propertyCount).toBe(0);
    expect(nullResult.output?.schema).toContain('"type": "null"');

    expect(generateJsonSchema('   ')).toEqual({ error: '', output: null });
    expect(generateJsonSchema('{oops').error.length).toBeGreaterThan(0);
  });
});
