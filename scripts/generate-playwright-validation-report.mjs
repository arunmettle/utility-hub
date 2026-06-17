import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const resultsDirectory = path.join(repoRoot, 'playwright-results');
const summaryPath = path.join(resultsDirectory, 'validation-summary.json');
const resultsPath = path.join(resultsDirectory, 'results.json');
const reportPath = path.resolve(repoRoot, '..', 'PLAYWRIGHT-VALIDATION.md');
const stripAnsi = (value) => value.replace(/\u001b\[[0-9;]*m/g, '');

const readJson = (filePath, fallbackValue) =>
  fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : fallbackValue;

const collectFailedTests = (suiteNode, failures = []) => {
  if (Array.isArray(suiteNode?.specs)) {
    for (const spec of suiteNode.specs) {
      for (const test of spec.tests ?? []) {
        for (const result of test.results ?? []) {
          if (result.status !== 'passed') {
            failures.push({
              title: spec.title,
              projectName: test.projectName ?? 'unknown',
              status: result.status ?? test.status ?? 'unknown',
              duration: result.duration ?? 0,
              errors: (result.errors ?? []).map((error) => stripAnsi(error.message ?? error.value ?? JSON.stringify(error)).split('\n')[0]),
              attachments: (result.attachments ?? []).filter((attachment) => attachment.path),
            });
          }
        }
      }
    }
  }

  for (const childSuite of suiteNode?.suites ?? []) {
    collectFailedTests(childSuite, failures);
  }

  return failures;
};

const summary = readJson(summaryPath, {
  generatedAt: new Date().toISOString(),
  baseURL: 'http://localhost:5175',
  sections: {
    design: [],
    layout: [],
    functionality: [],
    responsive: [],
    performance: [],
  },
  performanceMetrics: [],
  pageAudits: [],
});
const results = readJson(resultsPath, { suites: [] });

const sectionTitles = {
  design: 'Design System Compliance',
  layout: 'Layout & Structure',
  functionality: 'Functionality',
  responsive: 'Responsive Design',
  performance: 'Performance',
};

const allChecks = Object.entries(summary.sections).flatMap(([section, checks]) =>
  checks.map((check) => ({ ...check, section })),
);
const failedChecks = allChecks.filter((check) => check.status === 'failed');
const designChecks = summary.sections.design ?? [];
const designPassed = designChecks.filter((check) => check.status === 'passed').length;
const designScore = designChecks.length === 0 ? 0 : Math.round((designPassed / designChecks.length) * 100);
const performanceMetrics = summary.performanceMetrics ?? [];
const averageLoadMs =
  performanceMetrics.length === 0
    ? 0
    : Math.round(performanceMetrics.reduce((total, metric) => total + metric.loadTimeMs, 0) / performanceMetrics.length);
const routesUnderTarget = performanceMetrics.filter((metric) => metric.loadTimeMs < 3_000).length;
const pageAudits = summary.pageAudits ?? [];
const failedTests = (results.suites ?? []).flatMap((suite) => collectFailedTests(suite, []));

const screenshotLines = failedTests.flatMap((failure) =>
  failure.attachments
    .filter((attachment) => attachment.contentType === 'image/png')
    .map((attachment) => {
      const relativeAttachmentPath = path.relative(path.dirname(reportPath), attachment.path);
      return `- ${failure.title} (${failure.status}): \`${relativeAttachmentPath}\``;
    }),
);

const issueLines =
  failedChecks.length === 0
    ? ['- No compliance issues were detected by the Playwright suite.']
    : failedChecks.map(
        (check) =>
          `- [${sectionTitles[check.section]}] ${check.name} on ${check.page}: expected ${check.expected}; actual ${check.actual}${
            check.details ? ` (${check.details})` : ''
          }`,
      );

const sectionLines = Object.entries(summary.sections).map(([section, checks]) => {
  const passed = checks.filter((check) => check.status === 'passed').length;
  const failed = checks.length - passed;
  return `### ${sectionTitles[section]}\n- Passed: ${passed}\n- Failed: ${failed}\n`;
});

const performanceTableRows =
  performanceMetrics.length === 0
    ? '| No metrics captured | - | - | - | - | - |'
    : performanceMetrics
        .map(
          (metric) =>
            `| ${metric.page} | ${metric.loadTimeMs} | ${metric.domContentLoadedMs ?? 'n/a'} | ${metric.consoleErrors.length + metric.pageErrors.length} | ${metric.failedFontRequests.length} | ${metric.failedImageRequests.length} |`,
        )
        .join('\n');

const pageAuditRows =
  pageAudits.length === 0
    ? '| No page audits captured | - | - | - |'
    : pageAudits
        .map(
          (audit) =>
            `| ${audit.page} | ${audit.path} | ${audit.loaded ? 'Yes' : 'No'} | ${audit.copyButtonFound ? 'Yes' : 'No'} |`,
        )
        .join('\n');

const report = `# Playwright Validation Report

- Generated: ${summary.generatedAt}
- Base URL: ${summary.baseURL}
- Playwright project: Chromium

## Executive Summary

- Design compliance score: **${designScore}%** (${designPassed}/${designChecks.length} checks passed)
- Total validation checks: **${allChecks.length}**
- Issues found: **${failedChecks.length}**
- Average captured load time: **${averageLoadMs}ms**
- Routes under 3s target: **${routesUnderTarget}/${performanceMetrics.length}**

## Section Results

${sectionLines.join('\n')}
## Performance Metrics

| Page | Load (ms) | DOMContentLoaded (ms) | Console/Page Errors | Font Failures | Image Failures |
| --- | ---: | ---: | ---: | ---: | ---: |
${performanceTableRows}

## Tool Page Audit

| Page | Route | Loaded | Copy Button Found |
| --- | --- | --- | --- |
${pageAuditRows}

## Issues Found

${issueLines.join('\n')}

## Failure Screenshots

${screenshotLines.length > 0 ? screenshotLines.join('\n') : '- No failure screenshots were generated.'}

## Playwright Test Failures

${
  failedTests.length > 0
    ? failedTests
        .map((failure) => {
          const errorText = failure.errors.length > 0 ? failure.errors.join(' | ') : 'No explicit error message captured.';
          return `- ${failure.title} [${failure.projectName}] - ${failure.status} (${failure.duration}ms): ${errorText}`;
        })
        .join('\n')
    : '- No failed Playwright tests.'
}
`;

fs.writeFileSync(reportPath, report);
console.log(`Validation report written to ${reportPath}`);
