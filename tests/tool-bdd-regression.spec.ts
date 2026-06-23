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
