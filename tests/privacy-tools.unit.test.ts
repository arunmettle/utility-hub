import { describe, expect, it, vi } from 'vitest';
import {
  analyzeJwtToken,
  analyzeDockerfile,
  analyzeDockerCompose,
  analyzeRegex,
  buildMarkdownTable,
  calculateSemanticVersion,
  buildPasswordCharset,
  calculateBundleSize,
  convertCase,
  convertCurlToCode,
  decodeJwtToken,
  detectBreakingChanges,
  diffText,
  explainCronExpression,
  generateCommitSuggestions,
  generateHmacs,
  formatRegexFlags,
  generateHashes,
  generateJsonSchema,
  generatePassword,
  generateUlid,
  generateUuidList,
  getPasswordStrength,
  inspectHttpHeaders,
  formatSqlQuery,
  summarizeOpenApi,
  parseTimestamp,
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

  it('parses seconds and milliseconds timestamps', () => {
    const seconds = parseTimestamp('1718625600');
    expect(seconds.error).toBe('');
    expect(seconds.output?.unixMilliseconds).toBe(1718625600000);

    const milliseconds = parseTimestamp('1718625600000');
    expect(milliseconds.error).toBe('');
    expect(milliseconds.output?.unixSeconds).toBe(1718625600);

    expect(parseTimestamp('abc').error).toBe('Enter a valid Unix timestamp in seconds or milliseconds.');
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

  it('generates json schema from sample json', () => {
    const result = generateJsonSchema('{"id":1,"name":"Utility Hub","owner":{"team":"eng"}}');
    expect(result.error).toBe('');
    expect(result.output?.rootType).toBe('object');
    expect(result.output?.schema).toContain('"$schema"');
    expect(result.output?.schema).toContain('"owner"');
  });
});
