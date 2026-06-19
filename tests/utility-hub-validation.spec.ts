import { expect, test } from '@playwright/test';
import { toolDefinitions } from './validation-data';

const jwtSample =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dGlsaXR5LWh1YiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxODYyMjAwMCwiZXhwIjoyMDMyNjIyMDAwfQ.signature';

test('Given the home page when it loads then the catalog and sidebar render without runtime errors', async ({ page }) => {
  const consoleMessages: string[] = [];

  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      consoleMessages.push(`${message.type()}: ${message.text()}`);
    }
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle(/Cobalt/i);
  await expect(page.getByRole('heading', { level: 1, name: /Privacy-first browser tools/i })).toBeVisible();
  await expect(page.locator('#app-sidebar')).toBeVisible();
  await expect(page.locator('.tool-card')).toHaveCount(toolDefinitions.length);
  expect(consoleMessages).toEqual([]);
});

test('Given the topbar info control when it is activated then the app jumps to the faq section', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await page.getByRole('link', { name: /about cobalt/i }).click();

  await expect(page).toHaveURL(/#faq$/);
  await expect(page.locator('#faq')).toBeInViewport();
});

test('Given the theme toggle when dark mode is enabled then the shell switches to a legible high-contrast palette', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: /switch to dark theme/i }).click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: /switch to light theme/i })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(11, 18, 32)');
  await expect(page.locator('body')).toHaveCSS('color', 'rgb(239, 246, 255)');
  await expect(page.locator('.icon-button').first()).toHaveCSS('color', 'rgb(239, 246, 255)');
});

test('Given the desktop layout when the nav toggle is used then the sidebar collapses and expands smoothly', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const sidebar = page.locator('#app-sidebar');
  const mainShell = page.locator('.main-shell');
  const toggle = page.getByRole('button', { name: /close sidebar/i });

  await expect(sidebar).toBeVisible();
  await expect(mainShell).toHaveCSS('margin-left', '320px');
  await expect(page.locator('body')).toHaveCSS('overflow-x', 'hidden');

  await toggle.click();
  await expect.poll(() => sidebar.evaluate((node) => getComputedStyle(node).transform)).toContain('-320');
  await expect(mainShell).toHaveCSS('margin-left', '0px');
  await expect(page.locator('body')).toHaveCSS('overflow-x', 'hidden');

  await page.getByRole('button', { name: /open sidebar/i }).click();
  await expect.poll(() => sidebar.evaluate((node) => getComputedStyle(node).transform)).toBe('matrix(1, 0, 0, 1, 0, 0)');
  await expect(mainShell).toHaveCSS('margin-left', '320px');
  await expect(page.locator('body')).toHaveCSS('overflow-x', 'hidden');
});

test('Given a short desktop viewport when the sidebar content exceeds the height then the menu scrolls inside the themed sidebar container', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 520 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const scrollArea = page.locator('.sidebar__scroll');

  await expect(scrollArea).toHaveCSS('overflow-y', 'auto');
  await expect
    .poll(() =>
      scrollArea.evaluate((node) => {
        node.scrollTop = 120;
        return node.scrollTop;
      }),
    )
    .toBeGreaterThan(0);
});

test('Given the mobile layout when the drawer opens then accordion sections and navigation behave correctly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: /open sidebar/i }).click();
  await expect(page.locator('#app-sidebar')).toBeVisible();

  const formatterLink = page.locator('#app-sidebar').getByRole('link', { name: 'JSON Formatter', exact: true });
  await expect(formatterLink).toBeVisible();

  await page.getByRole('button', { name: /Formatters/i }).click();
  await expect(formatterLink).toBeHidden();

  await page.getByRole('button', { name: /Formatters/i }).click();
  await expect(formatterLink).toBeVisible();

  await page.locator('#app-sidebar').getByRole('link', { name: 'Base64 Studio', exact: true }).click();
  await expect(page).toHaveURL(/\/base64-studio$/);
  await expect.poll(() => page.locator('#app-sidebar').evaluate((node) => getComputedStyle(node).transform)).toContain('-320');
});

test('Given tool routes when they are visited then each tool heading is visible', async ({ page }) => {
  for (const tool of toolDefinitions) {
    await page.goto(tool.path, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1, name: tool.name })).toBeVisible();
  }
});

test('Given JSON Formatter when invalid and valid payloads are entered then errors and formatted output update correctly', async ({ page }) => {
  await page.goto('/json-formatter', { waitUntil: 'domcontentloaded' });

  const input = page.locator('textarea').first();
  const output = page.locator('.editor-textarea--output');

  await input.fill('{"broken":');
  await expect(page.getByText(/Invalid JSON/i)).toBeVisible();

  await input.fill('{"name":"utility","ready":true,"count":2}');
  await page.getByRole('button', { name: /Prettify/i }).click();
  await expect(output).toHaveValue('{\n  "name": "utility",\n  "ready": true,\n  "count": 2\n}');
});

test('Given Base64 Studio when the mode changes then text and payloads transform correctly', async ({ page }) => {
  await page.goto('/base64-studio', { waitUntil: 'domcontentloaded' });

  const input = page.locator('textarea').first();
  const output = page.locator('.editor-textarea--output');

  await input.fill('OpenAI utilities');
  await expect(output).toHaveValue('T3BlbkFJIHV0aWxpdGllcw==');

  await page.getByRole('button', { name: /^Decode$/i }).click();
  await input.fill('T3BlbkFJIHV0aWxpdGllcw==');
  await expect(output).toHaveValue('OpenAI utilities');
});

test('Given Base64 Studio when decode mode is chosen from the default encode state then starter content stays valid and no false error appears', async ({ page }) => {
  await page.goto('/base64-studio', { waitUntil: 'domcontentloaded' });

  const input = page.locator('textarea').first();
  const output = page.locator('.editor-textarea--output');

  await page.getByRole('button', { name: /^Decode$/i }).click();

  await expect(input).toHaveAttribute('placeholder', 'Paste Base64 to decode');
  await expect(input).toHaveValue('Q29iYWx0IGtlZXBzIEJhc2U2NCB3b3JrZmxvd3MgcmVhZGFibGUu');
  await expect(page.getByText(/Conversion error/i)).toHaveCount(0);
  await expect(output).toHaveValue('Cobalt keeps Base64 workflows readable.');
});

test('Given Hash Generator when text is entered then all digest panels populate', async ({ page }) => {
  await page.goto('/hash-generator', { waitUntil: 'domcontentloaded' });

  await page.locator('textarea').first().fill('utility-hub');
  const outputs = page.locator('.editor-textarea--output');

  await expect(outputs.nth(0)).toHaveValue(/b922a1565de2918237d54e85741176a1/);
  await expect(outputs.nth(1)).toHaveValue(/86ba5e42aa7b8e7d54bcc9a3dbd4d08830a7dd170a0ff19ba198d4ed6e5fba8e/);
  await expect(outputs.nth(2)).toHaveValue(/^[a-f0-9]{128}$/);
});

test('Given Password Generator when options are chosen then a password is generated with visible strength feedback', async ({ page }) => {
  await page.goto('/password-generator', { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: /Generate/i }).click();
  await expect(page.locator('.password-output')).not.toContainText('Generate a password');
  await expect(page.locator('.strength-meter__fill')).toBeVisible();
});

test('Given JWT Decoder when a token is entered then decoded segments and analysis panels render locally', async ({ page }) => {
  await page.goto('/jwt-decoder', { waitUntil: 'domcontentloaded' });

  const input = page.locator('textarea').first();
  await input.fill(jwtSample);

  await expect(page.locator('textarea').nth(1)).toHaveValue(/"alg": "HS256"/);
  await expect(page.locator('textarea').nth(2)).toHaveValue(/"role": "admin"/);
  await expect(page.locator('textarea').nth(3)).toHaveValue('signature');
});

test('Given Regex Tester when pattern and text are updated then live matches and counts refresh', async ({ page }) => {
  await page.goto('/regex-tester', { waitUntil: 'domcontentloaded' });

  await page.getByPlaceholder('(utility|hub)').fill('(hub)');
  await page.getByPlaceholder(/Paste text to evaluate/i).fill('utility hub hub');

  await expect(page.locator('.regex-preview')).toContainText('hub');
  await expect(page.getByText(/2 matches/i)).toBeVisible();
  await expect(page.locator('.timestamp-card')).toHaveCount(2);
});

test('Given QR Code Generator when content is present then the preview canvas renders', async ({ page }) => {
  await page.goto('/qr-code-generator', { waitUntil: 'domcontentloaded' });

  await page.getByPlaceholder(/Enter the content to encode/i).fill('https://example.com/utility');
  await expect(page.locator('canvas')).toBeVisible();
});

test('Given UUID Generator when the batch size changes then the generated list updates to the requested count', async ({ page }) => {
  await page.goto('/uuid-generator', { waitUntil: 'domcontentloaded' });

  await page.locator('#uuid-count').fill('3');
  await expect(page.locator('.output-row')).toHaveCount(3);
  await expect(page.locator('.output-row__value').first()).toContainText(/^[0-9a-f-]{36}$/i);
});

test('Given ULID Generator when values are shown then each generated identifier matches the ULID shape', async ({ page }) => {
  await page.goto('/ulid-generator', { waitUntil: 'domcontentloaded' });

  await page.locator('#ulid-count').fill('4');
  await expect(page.locator('.output-row')).toHaveCount(4);
  await expect(page.locator('.output-row__value').nth(0)).toContainText(/^[0-9A-HJKMNP-TV-Z]{26}$/);
});

test('Given HMAC Generator when a secret and message are entered then digest outputs populate locally', async ({ page }) => {
  await page.goto('/hmac-generator', { waitUntil: 'domcontentloaded' });

  const inputs = page.locator('textarea');
  await inputs.nth(0).fill('utility-hub-secret');
  await inputs.nth(1).fill('sign-this-message');

  const outputs = page.locator('.editor-textarea--output');
  await expect(outputs.nth(0)).toHaveValue(/^[a-f0-9]{64}$/);
  await expect(outputs.nth(1)).toHaveValue(/^[a-f0-9]{128}$/);
});

test('Given Query String Studio when modes change then starter content stays valid for each side of the conversion', async ({ page }) => {
  await page.goto('/query-string-studio', { waitUntil: 'domcontentloaded' });

  const input = page.locator('textarea').first();
  const output = page.locator('.editor-textarea--output');

  await expect(output).toHaveValue('source=utility+hub&tags=privacy&tags=local&page=1');

  await page.getByRole('button', { name: /^Decode$/i }).click();
  await expect(input).toHaveValue('source=utility+hub&tags=privacy&tags=local&page=1');
  await expect(page.getByText(/Conversion error/i)).toHaveCount(0);
  await expect(output).toHaveValue(/"source": "utility hub"/);
});

test('Given HTML Entity Studio when content is encoded and decoded then text round-trips without loss', async ({ page }) => {
  await page.goto('/html-entity-studio', { waitUntil: 'domcontentloaded' });

  const input = page.locator('textarea').first();
  const output = page.locator('.editor-textarea--output');

  await input.fill('<div class="card">Utility & Hub</div>');
  await expect(output).toHaveValue('&lt;div class=&quot;card&quot;&gt;Utility &amp; Hub&lt;/div&gt;');

  await page.getByRole('button', { name: /^Decode$/i }).click();
  await input.fill('&lt;div class=&quot;card&quot;&gt;Utility &amp; Hub&lt;/div&gt;');
  await expect(output).toHaveValue('<div class="card">Utility & Hub</div>');
});

test('Given Hex Studio when text and hexadecimal payloads are transformed then the output round-trips correctly', async ({ page }) => {
  await page.goto('/hex-studio', { waitUntil: 'domcontentloaded' });

  const input = page.locator('textarea').first();
  const output = page.locator('.editor-textarea--output');

  await input.fill('Utility Hub');
  await expect(output).toHaveValue('55 74 69 6c 69 74 79 20 48 75 62');

  await page.getByRole('button', { name: /^Decode$/i }).click();
  await input.fill('55 74 69 6c 69 74 79 20 48 75 62');
  await expect(output).toHaveValue('Utility Hub');
});

test('Given Slugify Studio when source text is entered then slug variants are produced for urls and paths', async ({ page }) => {
  await page.goto('/slugify-studio', { waitUntil: 'domcontentloaded' });

  await page.locator('textarea').first().fill('Privacy First Utility Hub');
  const outputs = page.locator('.editor-textarea--output');

  await expect(outputs.nth(0)).toHaveValue('privacy-first-utility-hub');
  await expect(outputs.nth(1)).toHaveValue('privacy_first_utility_hub');
  await expect(outputs.nth(2)).toHaveValue('/tools/privacy-first-utility-hub');
});

test('Given Unicode Escape Studio when text is encoded and decoded then the unicode content is preserved', async ({ page }) => {
  await page.goto('/unicode-escape-studio', { waitUntil: 'domcontentloaded' });

  const input = page.locator('textarea').first();
  const output = page.locator('.editor-textarea--output');

  await input.fill('Utility ✓');
  await expect(output).toHaveValue('\\u0055\\u0074\\u0069\\u006c\\u0069\\u0074\\u0079\\u0020\\u2713');

  await page.getByRole('button', { name: /^Decode$/i }).click();
  await input.fill('\\u0055\\u0074\\u0069\\u006c\\u0069\\u0074\\u0079\\u0020\\u2713');
  await expect(output).toHaveValue('Utility ✓');
});

test('Given CSV JSON Studio when the mode changes then tabular data and object arrays round-trip correctly', async ({ page }) => {
  await page.goto('/csv-json-studio', { waitUntil: 'domcontentloaded' });

  const input = page.locator('textarea').first();
  const output = page.locator('.editor-textarea--output');

  await input.fill('name,role\nUtility Hub,platform');
  await expect(output).toHaveValue(/"name": "Utility Hub"/);

  await page.getByRole('button', { name: /^JSON to CSV$/i }).click();
  await input.fill('[\n  {\n    "name": "OpenAI",\n    "role": "partner"\n  }\n]');
  await expect(output).toHaveValue('name,role\nOpenAI,partner');
});

test('Given Docker Optimizer when a loose Dockerfile is entered then findings and a tightened recipe are shown', async ({ page }) => {
  await page.goto('/docker-optimizer', { waitUntil: 'domcontentloaded' });

  await page.locator('textarea').first().fill('FROM node:latest\nRUN npm install\nCMD ["npm","start"]');
  await expect(page.locator('.editor-textarea--output')).toHaveValue(/RUN npm ci/);
  await expect(page.getByText(/Prefer npm ci for repeatable installs/i)).toBeVisible();
});

test('Given GitHub Actions Validator when workflow yaml is entered then jobs and findings are summarized clearly', async ({ page }) => {
  await page.goto('/github-actions-validator', { waitUntil: 'domcontentloaded' });

  await page.locator('textarea').first().fill('name: CI\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test');
  await expect(page.locator('.stat-card').nth(1)).toContainText('1');
  await expect(page.getByText(/Checkout step not found/i)).toBeVisible();
});

test('Given Dependency Visualizer when a package manifest is entered then grouped dependency data is surfaced', async ({ page }) => {
  await page.goto('/dependency-visualizer', { waitUntil: 'domcontentloaded' });

  await page.locator('textarea').first().fill('{\n  "name": "utility-hub",\n  "version": "1.0.0",\n  "scripts": { "dev": "vite" },\n  "dependencies": { "react": "^19.0.0" },\n  "devDependencies": { "vite": "^8.0.0" }\n}');
  await expect(page.locator('.stat-card').first()).toContainText('utility-hub');
  await expect(page.locator('.chip').first()).toContainText('react');
  await expect(page.getByText('dev', { exact: true })).toBeVisible();
});

test('Given Bundle Size Calculator when asset rows are entered then totals and largest assets are calculated', async ({ page }) => {
  await page.goto('/bundle-size-calculator', { waitUntil: 'domcontentloaded' });

  await page.locator('textarea').first().fill('app.js 10kb\nstyles.css 5kb\nlogo.svg 2kb');
  await expect(page.locator('.stat-card').first()).toContainText(/16\.6 KB|17\.0 KB|17 KB/);
  await expect(page.locator('.insight-row').first()).toContainText('app.js');
});

test('Given cURL to Code Converter when a request command is entered then fetch and python snippets are generated', async ({ page }) => {
  await page.goto('/curl-to-code-converter', { waitUntil: 'domcontentloaded' });

  await page
    .locator('textarea')
    .first()
    .fill('curl https://api.example.com/items -X POST -H "Content-Type: application/json" --data \'{"id":1}\'');

  const outputs = page.locator('.editor-textarea--output');
  await expect(outputs.nth(0)).toHaveValue(/fetch/);
  await expect(outputs.nth(2)).toHaveValue(/requests\.request/);
});

test('Given SQL Beautifier when dense sql is entered then formatted clauses are split onto readable lines', async ({ page }) => {
  await page.goto('/sql-beautifier', { waitUntil: 'domcontentloaded' });

  await page
    .locator('textarea')
    .first()
    .fill('select id, name from tools where active = true and local = true order by created_at desc');

  await expect(page.locator('.editor-textarea--output')).toHaveValue(/FROM/);
  await expect(page.locator('.editor-textarea--output')).toHaveValue(/ORDER BY/);
});

test('Given Semantic Version Calculator when feature notes are entered then a minor bump is recommended', async ({ page }) => {
  await page.goto('/semantic-version-calculator', { waitUntil: 'domcontentloaded' });

  await page.locator('#current-version').fill('1.2.3');
  await page.locator('textarea').first().fill('Add a new report export endpoint for client teams.');

  await expect(page.locator('.stat-card').first()).toContainText('1.3.0');
  await expect(page.locator('.editor-panel').filter({ hasText: /minor bump/i }).first()).toBeVisible();
});

test('Given Breaking Change Detector when fields are removed or types shift then breaking findings are shown', async ({ page }) => {
  await page.goto('/breaking-change-detector', { waitUntil: 'domcontentloaded' });

  const inputs = page.locator('textarea');
  await inputs.nth(0).fill('{"id":1,"name":"hub"}');
  await inputs.nth(1).fill('{"id":"1","workspace":"eng"}');

  await expect(page.locator('.stat-card').nth(1)).toContainText('2');
  await expect(page.getByText('$.id')).toBeVisible();
  await expect(page.getByText('$.name')).toBeVisible();
});

test('Given HTTP Header Inspector when raw headers are pasted then missing security controls are reported', async ({ page }) => {
  await page.goto('/http-header-inspector', { waitUntil: 'domcontentloaded' });

  await page.locator('textarea').first().fill('HTTP/2 200\ncontent-type: application/json\naccess-control-allow-origin: *');

  await expect(page.locator('.stat-card').first()).toContainText(/\/100/);
  await expect(page.getByText(/Wildcard CORS origin detected/i)).toBeVisible();
});

test('Given Cron Expression Explainer when a valid schedule is entered then next run previews are shown', async ({ page }) => {
  await page.goto('/cron-expression-explainer', { waitUntil: 'domcontentloaded' });

  await page.locator('#cron-expression').fill('*/30 * * * *');

  await expect(page.getByText(/repeats every 30/i)).toBeVisible();
  await expect(page.getByText(/Minute: \*\/30/i)).toBeVisible();
});

test('Given Docker Compose Auditor when service definitions are pasted then service counts and findings render', async ({ page }) => {
  await page.goto('/docker-compose-auditor', { waitUntil: 'domcontentloaded' });

  await page.locator('textarea').first().fill('services:\n  api:\n    image: node:latest\n    ports:\n      - "3000:3000"');

  await expect(page.locator('.stat-card').nth(1)).toContainText('1');
  await expect(page.getByText(/uses the latest tag/i)).toBeVisible();
});

test('Given OpenAPI Summary when a spec is entered then path and operation counts are surfaced', async ({ page }) => {
  await page.goto('/openapi-summary', { waitUntil: 'domcontentloaded' });

  await page
    .locator('textarea')
    .first()
    .fill('{"openapi":"3.1.0","info":{"title":"Utility Hub API","version":"1.0.0"},"paths":{"/tools":{"get":{"tags":["tools"]}}}}');

  await expect(page.locator('.stat-card').first()).toContainText('Utility Hub API');
  await expect(page.locator('.stat-card').nth(2)).toContainText('1');
});

test('Given Markdown Table Builder when csv rows are entered then markdown output is generated', async ({ page }) => {
  await page.goto('/markdown-table-builder', { waitUntil: 'domcontentloaded' });

  await page.locator('textarea').first().fill('name,role\nUtility Hub,platform');
  await expect(page.locator('.editor-textarea--output')).toHaveValue(/\| name \| role \|/);
});

test('Given JSON Schema Generator when a sample payload is entered then a draft schema is produced', async ({ page }) => {
  await page.goto('/json-schema-generator', { waitUntil: 'domcontentloaded' });

  await page.locator('textarea').first().fill('{"id":1,"name":"Utility Hub","owner":{"team":"eng"}}');
  await expect(page.locator('.stat-card').first()).toContainText('object');
  await expect(page.locator('.editor-textarea--output')).toHaveValue(/"\$schema"/);
});

test('Given Text Diff Checker when two text blocks diverge then a pull-request style delta view shows readable removals and additions', async ({
  page,
}) => {
  await page.goto('/text-diff-checker', { waitUntil: 'domcontentloaded' });

  const inputs = page.locator('textarea');
  await inputs.nth(0).fill('one\ntwo\nthree');
  await inputs.nth(1).fill('one\nthree\nfour');

  await expect(page.locator('.pr-diff')).toBeVisible();
  await expect(page.locator('.pr-diff__pane-head--removed')).toContainText(/1 removals/i);
  await expect(page.locator('.pr-diff__pane-head--added')).toContainText(/1 additions/i);
  await expect(page.locator('.pr-diff__line--removed')).toContainText('two');
  await expect(page.locator('.pr-diff__line--added')).toContainText('four');
  await expect(page.locator('.pr-diff__line--placeholder')).toHaveCount(2);
});

test('Given URL Studio when encoding and decoding values then the output updates correctly', async ({ page }) => {
  await page.goto('/url-encoder', { waitUntil: 'domcontentloaded' });

  const input = page.locator('textarea').first();
  const output = page.locator('.editor-textarea--output');

  await input.fill('user@example.com?source=utility hub');
  await expect(output).toHaveValue('user%40example.com%3Fsource%3Dutility%20hub');

  await page.getByRole('button', { name: /^Decode$/i }).click();
  await input.fill('user%40example.com%3Fsource%3Dutility%20hub');
  await expect(output).toHaveValue('user@example.com?source=utility hub');
});

test('Given Case Converter when text is entered then multiple naming formats are produced', async ({ page }) => {
  await page.goto('/case-converter', { waitUntil: 'domcontentloaded' });

  await page.locator('textarea').first().fill('utility hub tools');
  await expect(page.locator('.result-grid textarea').nth(0)).toHaveValue('utilityHubTools');
  await expect(page.locator('.result-grid textarea').nth(2)).toHaveValue('utility_hub_tools');
  await expect(page.locator('.result-grid textarea').nth(4)).toHaveValue('UTILITY_HUB_TOOLS');
});

test('Given Timestamp Converter when a timestamp is entered then local and ISO results are shown', async ({ page }) => {
  await page.goto('/timestamp-converter', { waitUntil: 'domcontentloaded' });

  await page.getByPlaceholder(/1640000000/i).fill('1718625600');
  await expect(page.locator('.timestamp-output')).toContainText('2024');
  await expect(page.locator('.timestamp-output')).toContainText('2024-06-17T12:00:00.000Z');
});
