import fs from 'node:fs';
import path from 'node:path';

export type ValidationSection = 'design' | 'layout' | 'functionality' | 'responsive' | 'performance';
export type ValidationStatus = 'passed' | 'failed';

export interface ValidationCheck {
  name: string;
  status: ValidationStatus;
  expected: string;
  actual: string;
  page: string;
  url?: string;
  details?: string;
}

export interface PerformanceMetric {
  page: string;
  url: string;
  loadTimeMs: number;
  domContentLoadedMs: number | null;
  loadEventMs: number | null;
  responseEndMs: number | null;
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  failedImageRequests: string[];
  failedFontRequests: string[];
  imageCount: number;
  fontStatus: string;
}

export interface PageAudit {
  page: string;
  path: string;
  loaded: boolean;
  copyButtonFound: boolean;
  notes: string[];
}

interface ValidationSummary {
  generatedAt: string;
  baseURL: string;
  sections: Record<ValidationSection, ValidationCheck[]>;
  performanceMetrics: PerformanceMetric[];
  pageAudits: PageAudit[];
}

const resultsDirectory = path.join(process.cwd(), 'playwright-results');
const summaryPath = path.join(resultsDirectory, 'validation-summary.json');

const createEmptySummary = (): ValidationSummary => ({
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

const ensureResultsDirectory = () => {
  fs.mkdirSync(resultsDirectory, { recursive: true });
};

const readSummary = (): ValidationSummary => {
  ensureResultsDirectory();

  if (!fs.existsSync(summaryPath)) {
    const emptySummary = createEmptySummary();
    fs.writeFileSync(summaryPath, JSON.stringify(emptySummary, null, 2));
    return emptySummary;
  }

  return JSON.parse(fs.readFileSync(summaryPath, 'utf8')) as ValidationSummary;
};

const writeSummary = (summary: ValidationSummary) => {
  ensureResultsDirectory();
  summary.generatedAt = new Date().toISOString();
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
};

export const resetValidationSummary = () => {
  writeSummary(createEmptySummary());
};

export const recordChecks = (section: ValidationSection, checks: ValidationCheck[]) => {
  const summary = readSummary();
  summary.sections[section].push(...checks);
  writeSummary(summary);
};

export const recordPerformanceMetric = (metric: PerformanceMetric) => {
  const summary = readSummary();
  summary.performanceMetrics.push(metric);
  writeSummary(summary);
};

export const recordPageAudit = (audit: PageAudit) => {
  const summary = readSummary();
  summary.pageAudits.push(audit);
  writeSummary(summary);
};

export const getValidationSummaryPath = () => summaryPath;
