import { spawnSync } from 'node:child_process';
import path from 'node:path';

const repoRoot = process.cwd();
const npmRunner = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const testResult = spawnSync(npmRunner, ['run', 'test:e2e'], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
});

const reportResult = spawnSync(process.execPath, [path.join('scripts', 'generate-playwright-validation-report.mjs')], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
});

if ((reportResult.status ?? 0) !== 0) {
  process.exit(reportResult.status ?? 1);
}

process.exit(testResult.status ?? 1);
