import { expect, test, type Page } from '@playwright/test';
import { generators, toolDefinitions, type ToolDefinition } from './validation-data';
import {
  recordChecks,
  recordPageAudit,
  recordPerformanceMetric,
  type PerformanceMetric,
  type ValidationCheck,
  type ValidationSection,
} from './utils/validation-reporting';

interface DiagnosticsHandle {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  failedImageRequests: string[];
  failedFontRequests: string[];
  detach: () => void;
}

interface NavigationTimings {
  domContentLoadedMs: number | null;
  loadEventMs: number | null;
  responseEndMs: number | null;
}

const rounded = (value: number | null) => (value === null ? null : Math.round(value));

const normalizeRgb = (value: string) => value.replace(/\s+/g, '').toLowerCase();

const createDiagnostics = (page: Page): DiagnosticsHandle => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  const failedImageRequests: string[] = [];
  const failedFontRequests: string[] = [];

  const isFontRequest = (url: string, resourceType: string) =>
    resourceType === 'font' || /\.(woff2?|ttf|otf|eot)(\?|$)/i.test(url);
  const isImageRequest = (url: string, resourceType: string) =>
    resourceType === 'image' || /\.(png|jpe?g|gif|svg|webp|avif|ico)(\?|$)/i.test(url);

  const onConsole = (message: { type: () => string; text: () => string }) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  };

  const onPageError = (error: Error) => {
    pageErrors.push(error.message);
  };

  const onRequestFailed = (request: { url: () => string; resourceType: () => string; failure: () => { errorText?: string } | null }) => {
    const url = request.url();
    const message = `${request.resourceType()} ${url} (${request.failure()?.errorText ?? 'request failed'})`;
    failedRequests.push(message);

    if (isImageRequest(url, request.resourceType())) {
      failedImageRequests.push(message);
    }

    if (isFontRequest(url, request.resourceType())) {
      failedFontRequests.push(message);
    }
  };

  const onResponse = (response: { url: () => string; status: () => number; request: () => { resourceType: () => string } }) => {
    const url = response.url();
    const resourceType = response.request().resourceType();

    if (response.status() >= 400 && (isImageRequest(url, resourceType) || isFontRequest(url, resourceType))) {
      const message = `${resourceType} ${url} (${response.status()})`;
      failedRequests.push(message);

      if (isImageRequest(url, resourceType)) {
        failedImageRequests.push(message);
      }

      if (isFontRequest(url, resourceType)) {
        failedFontRequests.push(message);
      }
    }
  };

  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('requestfailed', onRequestFailed);
  page.on('response', onResponse);

  return {
    consoleErrors,
    pageErrors,
    failedRequests,
    failedImageRequests,
    failedFontRequests,
    detach: () => {
      page.off('console', onConsole);
      page.off('pageerror', onPageError);
      page.off('requestfailed', onRequestFailed);
      page.off('response', onResponse);
    },
  };
};

const readNavigationTimings = async (page: Page): Promise<NavigationTimings> =>
  page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;

    return navigation
      ? {
          domContentLoadedMs: navigation.domContentLoadedEventEnd,
          loadEventMs: navigation.loadEventEnd,
          responseEndMs: navigation.responseEnd,
        }
      : {
          domContentLoadedMs: null,
          loadEventMs: null,
          responseEndMs: null,
        };
  });

const buildCheck = (
  name: string,
  passed: boolean,
  expected: string,
  actual: string,
  pageName: string,
  url?: string,
  details?: string,
): ValidationCheck => ({
  name,
  status: passed ? 'passed' : 'failed',
  expected,
  actual,
  page: pageName,
  url,
  details,
});

const assertAndRecord = async (
  section: ValidationSection,
  checks: ValidationCheck[],
  testPage: Page,
) => {
  recordChecks(section, checks);

  for (const check of checks) {
    expect.soft(
      check.status,
      `${check.name} on ${check.page}: expected ${check.expected}, received ${check.actual}${check.details ? ` (${check.details})` : ''}`,
    ).toBe('passed');
  }

  if (checks.some((check) => check.status === 'failed')) {
    await testPage.screenshot({
      path: `playwright-results\\artifacts\\${section}-${Date.now()}.png`,
      fullPage: true,
    });
  }
};

const collectMetric = async (
  page: Page,
  pageName: string,
  pathName: string,
  diagnostics: DiagnosticsHandle,
  elapsedMs: number,
): Promise<PerformanceMetric> => {
  const timings = await readNavigationTimings(page);
  const fontStatus = await page.evaluate(async () => {
    await document.fonts.ready;
    return document.fonts.status;
  });
  const imageCount = await page.locator('img').count();

  return {
    page: pageName,
    url: pathName,
    loadTimeMs: elapsedMs,
    domContentLoadedMs: rounded(timings.domContentLoadedMs),
    loadEventMs: rounded(timings.loadEventMs),
    responseEndMs: rounded(timings.responseEndMs),
    consoleErrors: [...diagnostics.consoleErrors],
    pageErrors: [...diagnostics.pageErrors],
    failedRequests: [...diagnostics.failedRequests],
    failedImageRequests: [...diagnostics.failedImageRequests],
    failedFontRequests: [...diagnostics.failedFontRequests],
    imageCount,
    fontStatus,
  };
};

const getCopyButtonCount = async (page: Page) =>
  page.locator('button:has(svg.lucide-copy), button:has(svg.lucide-check), button:has-text("Copy"), button:has-text("Copied")').count();

test('design system compliance matches the Stitch brief', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);

  const header = page.locator('header');
  const sidebar = page.locator('aside');
  const firstToolCard = page.locator('main a.group').first();
  const searchInput = page.getByPlaceholder('Search tools, categories, and workflows');

  const [headerHeight, headerPosition, sidebarWidth, backgroundColor, toolCardRadius, interLoaded, bodyFontFamily, monoLoaded, toolTagFontFamily] =
    await Promise.all([
      header.evaluate((element) => getComputedStyle(element).height),
      header.evaluate((element) => getComputedStyle(element).position),
      sidebar.evaluate((element) => getComputedStyle(element).width),
      page.evaluate(() => getComputedStyle(document.body).backgroundColor),
      firstToolCard.evaluate((element) => getComputedStyle(element).borderRadius),
      page.evaluate(async () => {
        await document.fonts.ready;
        return document.fonts.check('16px Inter');
      }),
      page.evaluate(() => getComputedStyle(document.body).fontFamily),
      page.evaluate(async () => {
        await document.fonts.ready;
        return document.fonts.check('11px "JetBrains Mono"');
      }),
      page.locator('.tool-tag').first().evaluate((element) => getComputedStyle(element).fontFamily),
    ]);

  const initialChecks: ValidationCheck[] = [
    buildCheck('Header height is 64px', headerHeight === '64px', '64px', headerHeight, 'Home', '/'),
    buildCheck('Sidebar width is 280px', sidebarWidth === '280px', '280px', sidebarWidth, 'Home', '/'),
    buildCheck(
      'Background color is Stitch light background',
      normalizeRgb(backgroundColor) === normalizeRgb('rgb(248, 249, 251)'),
      'rgb(248, 249, 251)',
      backgroundColor,
      'Home',
      '/',
    ),
    buildCheck('Top navbar is fixed', headerPosition === 'fixed', 'fixed', headerPosition, 'Home', '/'),
    buildCheck('Tool cards have 16px radius', toolCardRadius === '16px', '16px', toolCardRadius, 'Home', '/'),
    buildCheck(
      'Inter font is loaded and used',
      interLoaded && bodyFontFamily.includes('Inter'),
      'Inter loaded and present in body font-family',
      `${interLoaded ? 'loaded' : 'not loaded'}; ${bodyFontFamily}`,
      'Home',
      '/',
    ),
    buildCheck(
      'JetBrains Mono is loaded and used for category tags',
      monoLoaded && toolTagFontFamily.includes('JetBrains Mono'),
      'JetBrains Mono loaded and present in tool tag font-family',
      `${monoLoaded ? 'loaded' : 'not loaded'}; ${toolTagFontFamily}`,
      'Home',
      '/',
    ),
    buildCheck(
      'Header search input exists for desktop layout',
      await searchInput.isVisible(),
      'visible search input',
      (await searchInput.isVisible()) ? 'visible' : 'hidden',
      'Home',
      '/',
    ),
  ];

  await page.goto('/json-formatter', { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');

  const primaryButton = page.locator('.button-primary').first();
  const activeSidebarItem = page.locator('aside a[href="/json-formatter"]').first();

  const [primaryColor, activeBorderWidth, activeBorderColor, activeBackground] = await Promise.all([
    primaryButton.evaluate((element) => getComputedStyle(element).backgroundColor),
    activeSidebarItem.evaluate((element) => getComputedStyle(element).borderLeftWidth),
    activeSidebarItem.evaluate((element) => getComputedStyle(element).borderLeftColor),
    activeSidebarItem.evaluate((element) => getComputedStyle(element).backgroundColor),
  ]);

  const followUpChecks: ValidationCheck[] = [
    buildCheck(
      'Primary color is #0058be',
      normalizeRgb(primaryColor) === normalizeRgb('rgb(0, 88, 190)'),
      'rgb(0, 88, 190)',
      primaryColor,
      'JSON Formatter',
      '/json-formatter',
    ),
    buildCheck(
      'Active sidebar item uses a 4px left border',
      activeBorderWidth === '4px' && normalizeRgb(activeBorderColor) === normalizeRgb('rgb(0, 88, 190)'),
      '4px border-left in rgb(0, 88, 190)',
      `${activeBorderWidth}; ${activeBorderColor}`,
      'JSON Formatter',
      '/json-formatter',
    ),
    buildCheck(
      'Active sidebar item uses a light blue background',
      normalizeRgb(activeBackground) === normalizeRgb('rgb(219, 234, 254)'),
      'rgb(219, 234, 254)',
      activeBackground,
      'JSON Formatter',
      '/json-formatter',
    ),
  ];

  await assertAndRecord('design', [...initialChecks, ...followUpChecks], page);
});

test('layout and structure expose the expected navigation shell', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');

  const header = page.locator('header');
  const logo = page.getByRole('link', { name: /utility hub/i });
  const toolLinks = page.locator('aside a[href^="/"]');
  const toolGrid = page.locator('main a.group');
  const darkModeToggle = page.getByRole('button', { name: /toggle dark mode/i });
  const searchInput = page.getByPlaceholder('Search tools, categories, and workflows');

  const checks: ValidationCheck[] = [
    buildCheck(
      'Fixed navbar is visible',
      (await header.isVisible()) && (await header.evaluate((element) => getComputedStyle(element).position)) === 'fixed',
      'visible fixed header',
      (await header.isVisible()) ? 'visible' : 'hidden',
      'Home',
      '/',
    ),
    buildCheck(
      'Sidebar contains 10 tool links',
      (await toolLinks.count()) === 10,
      '10 links',
      `${await toolLinks.count()} links`,
      'Home',
      '/',
    ),
    buildCheck(
      'Home page displays a tool grid',
      (await toolGrid.count()) === 10,
      '10 visible tool cards',
      `${await toolGrid.count()} visible tool cards`,
      'Home',
      '/',
    ),
    buildCheck(
      'Search bar is present in the header',
      await searchInput.isVisible(),
      'visible search field',
      (await searchInput.isVisible()) ? 'visible' : 'hidden',
      'Home',
      '/',
    ),
    buildCheck(
      'Dark mode toggle exists',
      await darkModeToggle.isVisible(),
      'visible dark mode toggle',
      (await darkModeToggle.isVisible()) ? 'visible' : 'hidden',
      'Home',
      '/',
    ),
    buildCheck(
      'Logo is visible',
      await logo.isVisible(),
      'visible logo',
      (await logo.isVisible()) ? 'visible' : 'hidden',
      'Home',
      '/',
    ),
  ];

  await assertAndRecord('layout', checks, page);
});

test('functionality works across navigation, filters, and tool routes', async ({ page }) => {
  const functionalityChecks: ValidationCheck[] = [];

  for (const tool of toolDefinitions) {
    const diagnostics = createDiagnostics(page);
    const startedAt = Date.now();

    await page.goto(tool.path, { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    const elapsedMs = Date.now() - startedAt;
    const copyButtonCount = await getCopyButtonCount(page);
    const headingVisible = await page.getByRole('heading', { level: 1, name: tool.name }).isVisible();
    const bodyText = (await page.locator('body').textContent()) ?? '';
    const has404Text = /404|not found/i.test(bodyText);
    const metric = await collectMetric(page, tool.name, tool.path, diagnostics, elapsedMs);

    recordPerformanceMetric(metric);
    recordPageAudit({
      page: tool.name,
      path: tool.path,
      loaded: headingVisible && !has404Text,
      copyButtonFound: copyButtonCount > 0,
      notes: [
        `Load time: ${elapsedMs}ms`,
        ...(diagnostics.consoleErrors.length > 0 ? diagnostics.consoleErrors.map((entry) => `Console error: ${entry}`) : []),
        ...(diagnostics.pageErrors.length > 0 ? diagnostics.pageErrors.map((entry) => `Page error: ${entry}`) : []),
      ],
    });

    functionalityChecks.push(
      buildCheck(
        `${tool.name} page loads without a 404`,
        headingVisible && !has404Text,
        'tool page heading visible and no 404 content',
        headingVisible && !has404Text ? 'loaded' : 'missing heading or 404 text detected',
        tool.name,
        tool.path,
      ),
      buildCheck(
        `${tool.name} exposes a copy button`,
        !tool.expectsCopyButton || copyButtonCount > 0,
        'at least one copy control on the page',
        `${copyButtonCount} copy controls`,
        tool.name,
        tool.path,
      ),
      buildCheck(
        `${tool.name} loads within 3 seconds`,
        elapsedMs < 3_000,
        '< 3000ms',
        `${elapsedMs}ms`,
        tool.name,
        tool.path,
      ),
      buildCheck(
        `${tool.name} logs no console or page errors`,
        diagnostics.consoleErrors.length === 0 && diagnostics.pageErrors.length === 0,
        '0 console errors and 0 page errors',
        `${diagnostics.consoleErrors.length} console / ${diagnostics.pageErrors.length} page errors`,
        tool.name,
        tool.path,
      ),
    );

    diagnostics.detach();
  }

  await page.goto('/', { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');

  for (const tool of toolDefinitions) {
    await page.locator('aside').getByRole('link', { name: new RegExp(tool.name, 'i') }).click();
    await expect(page).toHaveURL(new RegExp(`${tool.path}$`));
    functionalityChecks.push(
      buildCheck(
        `Sidebar navigation reaches ${tool.name}`,
        page.url().endsWith(tool.path),
        tool.path,
        page.url(),
        tool.name,
        tool.path,
      ),
    );
  }

  await page.getByRole('link', { name: /utility hub/i }).click();
  await expect(page).toHaveURL(/\/$/);

  const searchInput = page.getByPlaceholder('Search tools, categories, and workflows');
  await searchInput.fill('json');

  functionalityChecks.push(
    buildCheck(
      'Search filters tools to JSON Formatter',
      (await page.locator('main a.group').count()) === 1 && (await page.getByRole('link', { name: /json formatter/i }).count()) >= 1,
      '1 matching tool card for JSON Formatter',
      `${await page.locator('main a.group').count()} visible cards`,
      'Home',
      '/',
    ),
  );

  await searchInput.fill('zzzz-no-match');
  functionalityChecks.push(
    buildCheck(
      'Search shows an empty-state when nothing matches',
      await page.getByText('No tools match your current filters.').isVisible(),
      'visible empty-state message',
      (await page.getByText('No tools match your current filters.').isVisible()) ? 'visible' : 'hidden',
      'Home',
      '/',
    ),
  );

  await searchInput.fill('');
  const generatorsFilter = page.getByRole('button', { name: 'Generators' });
  await generatorsFilter.scrollIntoViewIfNeeded();
  await generatorsFilter.click({ force: true });

  const generatorCards = page.locator('main a.group');
  const generatorCardNames = await generatorCards.locator('h3').allTextContents();

  functionalityChecks.push(
    buildCheck(
      'Category filter limits the grid to Generator tools',
      (await generatorCards.count()) === generators.length && generators.every((tool) => generatorCardNames.includes(tool)),
      `${generators.length} generator cards`,
      `${await generatorCards.count()} cards: ${generatorCardNames.join(', ')}`,
      'Home',
      '/',
    ),
  );

  const darkModeToggle = page.getByRole('button', { name: /toggle dark mode/i });
  const initialDarkMode = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await darkModeToggle.click();
  await expect
    .poll(async () => page.evaluate(() => document.documentElement.classList.contains('dark')))
    .toBe(!initialDarkMode);

  functionalityChecks.push(
    buildCheck(
      'Dark mode toggle updates the document theme class',
      (await page.evaluate(() => document.documentElement.classList.contains('dark'))) !== initialDarkMode,
      `dark class toggles from ${initialDarkMode}`,
      `${await page.evaluate(() => document.documentElement.classList.contains('dark'))}`,
      'Home',
      '/',
    ),
  );

  await assertAndRecord('functionality', functionalityChecks, page);
});

test('responsive layout adapts between mobile and desktop', async ({ page }) => {
  const checks: ValidationCheck[] = [];

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');

  const mobileToggle = page.getByRole('button', { name: /toggle navigation/i });
  const sidebar = page.locator('aside');
  const mobileSidebarBox = await sidebar.boundingBox();

  checks.push(
    buildCheck(
      'Mobile layout hides the sidebar off-canvas by default',
      mobileSidebarBox !== null && mobileSidebarBox.x < 0,
      'sidebar x-position below 0',
      mobileSidebarBox ? `x=${Math.round(mobileSidebarBox.x)}` : 'no sidebar box',
      'Home (mobile)',
      '/',
    ),
    buildCheck(
      'Mobile layout shows the hamburger menu',
      await mobileToggle.isVisible(),
      'visible hamburger button',
      (await mobileToggle.isVisible()) ? 'visible' : 'hidden',
      'Home (mobile)',
      '/',
    ),
  );

  await mobileToggle.click();
  await expect(sidebar).toBeVisible();
  const openSidebarBox = await sidebar.boundingBox();

  checks.push(
    buildCheck(
      'Hamburger button reveals the sidebar on mobile',
      openSidebarBox !== null && openSidebarBox.x >= 0,
      'sidebar x-position at or above 0',
      openSidebarBox ? `x=${Math.round(openSidebarBox.x)}` : 'no sidebar box',
      'Home (mobile)',
      '/',
    ),
  );

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');

  const desktopSidebarBox = await sidebar.boundingBox();
  const desktopToggleVisible = await mobileToggle.isVisible().catch(() => false);

  checks.push(
    buildCheck(
      'Desktop layout keeps the full sidebar visible',
      desktopSidebarBox !== null && desktopSidebarBox.x >= 0 && Math.round(desktopSidebarBox.width) === 280,
      'visible 280px sidebar',
      desktopSidebarBox ? `x=${Math.round(desktopSidebarBox.x)}, width=${Math.round(desktopSidebarBox.width)}` : 'no sidebar box',
      'Home (desktop)',
      '/',
    ),
    buildCheck(
      'Desktop layout hides the hamburger trigger',
      !desktopToggleVisible,
      'hamburger hidden',
      desktopToggleVisible ? 'visible' : 'hidden',
      'Home (desktop)',
      '/',
    ),
  );

  await assertAndRecord('responsive', checks, page);
});

test('performance and resource loading remain healthy on first load', async ({ page }) => {
  const diagnostics = createDiagnostics(page);
  const startedAt = Date.now();

  await page.goto('/', { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');

  const elapsedMs = Date.now() - startedAt;
  const metric = await collectMetric(page, 'Home', '/', diagnostics, elapsedMs);
  recordPerformanceMetric(metric);

  const allImagesLoaded = await page.locator('img').evaluateAll((images) =>
    images.every((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0),
  );

  const checks: ValidationCheck[] = [
    buildCheck('Home page loads in under 3 seconds', elapsedMs < 3_000, '< 3000ms', `${elapsedMs}ms`, 'Home', '/'),
    buildCheck(
      'Home page has no console errors',
      diagnostics.consoleErrors.length === 0 && diagnostics.pageErrors.length === 0,
      '0 console errors and 0 page errors',
      `${diagnostics.consoleErrors.length} console / ${diagnostics.pageErrors.length} page errors`,
      'Home',
      '/',
    ),
    buildCheck(
      'Image requests do not fail',
      diagnostics.failedImageRequests.length === 0 && allImagesLoaded,
      '0 failed image requests and all rendered images loaded',
      `${diagnostics.failedImageRequests.length} failed image requests across ${metric.imageCount} rendered images`,
      'Home',
      '/',
    ),
    buildCheck(
      'Font requests do not fail and fonts report loaded',
      diagnostics.failedFontRequests.length === 0 && metric.fontStatus === 'loaded',
      '0 failed font requests and document.fonts.status === loaded',
      `${diagnostics.failedFontRequests.length} failed font requests; status=${metric.fontStatus}`,
      'Home',
      '/',
    ),
  ];

  diagnostics.detach();
  await assertAndRecord('performance', checks, page);
});
