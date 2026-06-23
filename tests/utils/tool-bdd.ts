import { expect, type Locator, type Page } from '@playwright/test';

export async function gotoTool(page: Page, path: string, heading: string) {
  const consoleMessages: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleMessages.push(message.text());
    }
  });

  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();

  return {
    main: page.getByRole('main'),
    assertNoConsoleErrors: async () => {
      expect(consoleMessages).toEqual([]);
    },
  };
}

export async function expectEditorError(main: Locator, pattern: RegExp | string) {
  await expect(main.locator('.editor-error')).toContainText(pattern);
}
