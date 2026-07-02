import { expect, test } from '@playwright/test';
import { gotoTool } from './utils/tool-bdd';

test.describe('BDD Tool Journeys', () => {
  test.describe('Structured payload tools', () => {
    test('Given JSON Formatter when a valid payload is prettified then readable json is produced without runtime errors', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/json-formatter', 'JSON Formatter');
      const input = main.locator('textarea').first();
      const output = main.locator('.editor-textarea--output');

      await input.fill('{"service":"utility-hub","features":["diff","markdown"],"ready":true}');
      await main.getByRole('button', { name: /prettify/i }).click();

      await expect(output).toHaveValue('{\n  "service": "utility-hub",\n  "features": [\n    "diff",\n    "markdown"\n  ],\n  "ready": true\n}');
      await assertNoConsoleErrors();
    });

    test('Given JSON Formatter when malformed json is pasted then a clear validation error is shown and output does not become garbage', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/json-formatter', 'JSON Formatter');
      const input = main.locator('textarea').first();
      const output = main.locator('.editor-textarea--output');

      await input.fill('{"broken": true,,}');

      await expect(main.locator('.editor-error')).toContainText(/invalid json|unexpected token/i);
      await expect(output).toHaveCount(0);
      await assertNoConsoleErrors();
    });

    test('Given CSV JSON Studio when invalid json is supplied in json-to-csv mode then the tool blocks the conversion safely', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/csv-json-studio', 'CSV JSON Studio');
      const input = main.locator('textarea').first();

      await main.getByRole('button', { name: /^JSON to CSV$/i }).click();
      await input.fill('{"not":"an array"}');

      await expect(main.locator('.editor-error')).toContainText(/json array|unable to convert|array/i);
      await assertNoConsoleErrors();
    });
  });

  test.describe('Encoding and decoding tools', () => {
    test('Given Base64 Studio when valid text is encoded and decoded then the round-trip preserves the original value', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/base64-studio', 'Base64 Studio');
      const input = main.locator('textarea').first();
      const output = main.locator('.editor-textarea--output');

      await input.fill('Privacy-first browser tools');
      await expect(output).toHaveValue('UHJpdmFjeS1maXJzdCBicm93c2VyIHRvb2xz');

      await main.getByRole('button', { name: /^Decode$/i }).click();
      await input.fill('UHJpdmFjeS1maXJzdCBicm93c2VyIHRvb2xz');
      await expect(output).toHaveValue('Privacy-first browser tools');
      await assertNoConsoleErrors();
    });

    test('Given Base64 Studio when invalid base64 is decoded then the tool surfaces a user-safe error state', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/base64-studio', 'Base64 Studio');
      const input = main.locator('textarea').first();

      await main.getByRole('button', { name: /^Decode$/i }).click();
      await input.fill('not-valid-base64***');

      await expect(main.locator('.editor-error')).toContainText(/could not be decoded|conversion error|invalid/i);
      await assertNoConsoleErrors();
    });

    test('Given Query String Studio when invalid query json is supplied then the failure is visible instead of silently producing bad output', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/query-string-studio', 'Query String Studio');
      const input = main.locator('textarea').first();

      await input.fill('{"broken": }');
      await expect(main.locator('.editor-error')).toContainText(/invalid|unexpected token|conversion/i);
      await assertNoConsoleErrors();
    });
  });

  test.describe('Time conversion tools', () => {
    test('Given Timestamp Converter when a microsecond epoch is pasted then the unit is detected and practical formats are rendered', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/timestamp-converter', 'Timestamp Converter');
      const input = main.getByLabel('Timestamp input');

      await input.fill('1718625600123456');

      await expect(main.locator('.stat-card').filter({ hasText: /Detected unit/i })).toContainText(/microseconds/i);
      await expect(main.locator('.timestamp-output__item').filter({ hasText: /ISO 8601 \/ RFC 3339/i })).toContainText(/2024-06-17T12:00:00.123Z/i);
      await expect(main.locator('.insight-row').filter({ hasText: /Precision note/i })).toBeVisible();
      await assertNoConsoleErrors();
    });

    test('Given Date Difference Calculator when two timestamps are compared then the exact gap is visible in days and hours', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/date-difference-calculator', 'Date Difference Calculator');

      await main.getByLabel('Start date input').fill('1718625600');
      await main.getByLabel('End date input').fill('1718712000');

      await expect(main.locator('.stat-card').filter({ hasText: /Direction/i })).toContainText(/End is later/i);
      await expect(main.locator('.stat-card').filter({ hasText: /Hours/i })).toContainText('24');
      await expect(main.locator('.stat-card').filter({ hasText: /Days/i })).toContainText('1');
      await assertNoConsoleErrors();
    });

    test('Given Expiry Time Calculator when a duration is added then the resulting expiry timestamp is surfaced clearly', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/expiry-time-calculator', 'Expiry Time Calculator');

      await main.getByLabel('Base time input').fill('1718625600');
      await main.getByLabel('Offset amount input').fill('90');
      await main.getByRole('button', { name: 'minutes' }).click();

      await expect(main.locator('.stat-card').filter({ hasText: /Unix seconds/i })).toContainText('1718631000');
      await expect(main.locator('.timestamp-output__item').filter({ hasText: /Result time/i })).toContainText(/2024-06-17T13:30:00.000Z/i);
      await assertNoConsoleErrors();
    });

    test('Given Timestamp Batch Inspector when mixed epochs are pasted then valid and invalid rows are separated safely', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/timestamp-batch-inspector', 'Timestamp Batch Inspector');

      await main.getByLabel('Timestamp batch input').fill('1718625600\n1718625600123\nbad-value');

      await expect(main.locator('.stat-card').filter({ hasText: /Valid/i })).toContainText('2');
      await expect(main.locator('.stat-card').filter({ hasText: /Invalid/i })).toContainText('1');
      await expect(main.locator('.timestamp-output__item').filter({ hasText: /bad-value/i })).toContainText(/valid unix timestamp/i);
      await assertNoConsoleErrors();
    });

    test('Given Time Zone Converter when a UTC release time is pasted then common zone views are rendered', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/time-zone-converter', 'Time Zone Converter');

      await main.getByLabel('Time zone converter input').fill('2026-07-02T09:00:00Z');

      await expect(main.locator('.timestamp-output__item').filter({ hasText: /UTC/i })).toContainText(/Jul|2026|UTC/i);
      await expect(main.locator('.timestamp-output__item').filter({ hasText: /Australia\/Brisbane/i })).toBeVisible();
      await assertNoConsoleErrors();
    });

    test('Given Relative Time Calculator when a future deadline is entered then the tool shows a human relative window', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/relative-time-calculator', 'Relative Time Calculator');

      await main.getByLabel('Relative time input').fill('2099-01-01T00:00:00Z');

      await expect(main.locator('.stat-card').filter({ hasText: /Direction/i })).toContainText(/future/i);
      await expect(main.locator('.stat-card').filter({ hasText: /Relative/i })).toContainText(/in/i);
      await assertNoConsoleErrors();
    });
  });

  test.describe('Security tools', () => {
    test('Given Secret Redactor when api keys and emails are pasted then sensitive values are masked while structure remains readable', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/secret-redactor', 'Secret Redactor');
      const input = main.locator('textarea').first();
      const output = main.locator('.editor-textarea--output');

      await input.fill('OPENAI_API_KEY=sk-prod-secret-token\nContact: dev@example.com');

      await expect(output).toHaveValue(/\[REDACTED_API_KEY\]/);
      await expect(output).toHaveValue(/\[REDACTED_EMAIL\]/);
      await assertNoConsoleErrors();
    });

    test('Given JWT Expiry Checker when a malformed token is pasted then the user sees a clear problem instead of fake metadata', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/jwt-expiry-checker', 'JWT Expiry Checker');
      const input = main.locator('textarea').first();

      await input.fill('abc.def');

      await expect(main.locator('.editor-error')).toContainText(/token|decode|invalid/i);
      await assertNoConsoleErrors();
    });

    test('Given HTTP Header Inspector when risky headers are pasted then security findings are highlighted for the user', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/http-header-inspector', 'HTTP Header Inspector');
      const input = main.locator('textarea').first();

      await input.fill('HTTP/2 200\ncontent-type: application/json\naccess-control-allow-origin: *');

      await expect(main.locator('.insight-row').filter({ hasText: /wildcard cors origin detected/i })).toBeVisible();
      await assertNoConsoleErrors();
    });
  });

  test.describe('Comparison and reviewer tools', () => {
    test('Given Text Diff Checker when text is unchanged then the view reports stable content instead of fake deltas', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/text-diff-checker', 'Text Diff Checker');
      const inputs = main.locator('textarea');

      await inputs.nth(0).fill('one\ntwo\nthree');
      await inputs.nth(1).fill('one\ntwo\nthree');

      await expect(main.locator('.pr-diff')).toBeVisible();
      await expect(main.locator('.diff-summary__pill').filter({ hasText: /unchanged/i })).toBeVisible();
      await assertNoConsoleErrors();
    });

    test('Given Markdown Studio when aligned cli output is pasted then markdown table output and preview stay in sync', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/markdown-studio', 'Markdown Studio');
      const input = main.locator('textarea').first();
      const output = main.locator('.editor-textarea--output');

      await input.fill('Tool                 Category   Privacy\nMarkdown Studio      Developer  Local');

      await expect(output).toHaveValue(/\| Tool \| Category \| Privacy \|/);
      await expect(main.locator('.markdown-preview__table')).toContainText('Markdown Studio');
      await assertNoConsoleErrors();
    });
  });

  test.describe('Generator tools', () => {
    test('Given Planning Poker when the scrum master and a participant use the same room then story progression and re-estimation stay synchronized', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/planning-poker', 'Planning Poker');

      await main.getByRole('button', { name: /Create shared room/i }).click();
      await expect(page).toHaveURL(/room=/);
      await expect(main.getByLabel('Current story')).toContainText(/PBI 1423/i);

      await main.locator('.planning-poker-history-card').filter({ hasText: /PBI 1450/i }).getByRole('button', { name: /Estimate now/i }).click();
      await expect(main.getByLabel('Current story')).toContainText(/PBI 1450/i);

      await main.locator('.planning-poker-history-card').filter({ hasText: /PBI 1472/i }).getByRole('button', { name: /Remove/i }).click();
      await expect(main.locator('.planning-poker-history-card').filter({ hasText: /PBI 1472/i })).toHaveCount(0);

      const roomUrl = page.url();
      const participantPage = await page.context().newPage();
      const participantConsoleErrors: string[] = [];
      participantPage.on('console', (message) => {
        if (message.type() === 'error') {
          participantConsoleErrors.push(message.text());
        }
      });

      await participantPage.goto(roomUrl, { waitUntil: 'domcontentloaded' });
      const participantMain = participantPage.getByRole('main');
      await participantMain.getByRole('combobox').selectOption({ label: 'Sam' });
      await participantMain.getByRole('button', { name: /Join room/i }).click();
      await expect(participantMain.getByText(/Vote as Sam/i)).toBeVisible();
      await expect(participantMain.getByLabel('Current story')).toContainText(/PBI 1450/i);

      await participantPage.close();
      const rejoinedPage = await page.context().newPage();
      const rejoinedConsoleErrors: string[] = [];
      rejoinedPage.on('console', (message) => {
        if (message.type() === 'error') {
          rejoinedConsoleErrors.push(message.text());
        }
      });
      await rejoinedPage.goto(roomUrl, { waitUntil: 'domcontentloaded' });
      const rejoinedMain = rejoinedPage.getByRole('main');
      await expect(rejoinedMain.getByText(/Vote as Sam/i)).toBeVisible();
      await expect(rejoinedMain.getByLabel('Current story')).toContainText(/PBI 1450/i);

      await rejoinedMain.getByRole('button', { name: /^5$/i }).click();
      await expect(rejoinedMain.locator('.stat-card').filter({ hasText: /Your vote/i })).toContainText('5');

      await expect(main.locator('.planning-poker-participant').filter({ hasText: /Sam/i })).toContainText(/Vote locked/i);
      await main.getByRole('button', { name: /Reveal votes/i }).click();
      await rejoinedMain.getByRole('button', { name: /Refresh/i }).click();
      await expect(rejoinedMain.locator('.chip').filter({ hasText: /^5/ })).toBeVisible();
      await expect(rejoinedMain.locator('.planning-poker-vote-bucket').filter({ hasText: /Sam/ })).toContainText('Sam');

      await main.getByLabel(/Scrum Master final estimate/i).selectOption('5');
      await main.getByRole('button', { name: /Finalize estimate/i }).click();

      await expect(main.getByLabel('Current story')).toContainText(/PBI 1423/i);
      await rejoinedMain.getByRole('button', { name: /Refresh/i }).click();
      await expect(rejoinedMain.getByLabel('Current story')).toContainText(/PBI 1423/i);

      await main.getByRole('button', { name: /Re-estimate/i }).first().click();
      await expect(main.getByLabel('Current story')).toContainText(/PBI 1450/i);
      await expect(main.getByLabel('Current story')).toContainText(/Round 2/i);

      expect(participantConsoleErrors).toEqual([]);
      expect(rejoinedConsoleErrors).toEqual([]);
      await rejoinedPage.close();
      await assertNoConsoleErrors();
    });

    test('Given Password Generator when the user requests a password then a non-placeholder value is generated with visible strength feedback', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/password-generator', 'Password Generator');

      await main.getByRole('button', { name: /generate/i }).click();

      await expect(main.locator('.password-output')).not.toContainText('Generate a password');
      await expect(main.locator('.strength-meter__fill')).toBeVisible();
      await assertNoConsoleErrors();
    });

    test('Given Release Note Generator when bullet changes are pasted then the tool turns them into a usable release-note block', async ({
      page,
    }) => {
      const { main, assertNoConsoleErrors } = await gotoTool(page, '/release-note-generator', 'Release Note Generator');
      const input = main.locator('textarea').first();
      const output = main.locator('.editor-textarea--output');

      await input.fill('- Added AI workbench tools\n- Fixed dark theme contrast');

      await expect(output).toHaveValue(/## Release notes/);
      await expect(output).toHaveValue(/- Added AI workbench tools/);
      await assertNoConsoleErrors();
    });
  });
});
