import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const resultsDirectory = path.join(process.cwd(), 'playwright-results');

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  globalSetup: './tests/global-setup.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  outputDir: path.join(resultsDirectory, 'artifacts'),
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: path.join(resultsDirectory, 'results.json') }],
  ],
  use: {
    baseURL: 'http://localhost:5175',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
