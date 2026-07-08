import { BarChart3, Blocks, Building2, Factory, FileSearch, Gauge, PackageSearch, Sigma, Table2, Wrench, Zap, type LucideIcon } from 'lucide-react';
import { categories, tools, type ToolDefinition, type ToolCategory } from './tools';

export interface IndustryWorkspaceSection {
  id: string;
  title: string;
  description: string;
  toolIds: string[];
}

export interface IndustryWorkspace {
  slug: string;
  title: string;
  shortTitle: string;
  audience: string;
  path: string;
  collectionPath?: string;
  subtitle: string;
  description: string;
  searchPlaceholder: string;
  ctaLabel: string;
  icon: LucideIcon;
  toolIds: string[];
  sections: IndustryWorkspaceSection[];
  aliases?: string[];
}

export interface IndustryWorkspaceToolLink extends ToolDefinition {
  workspacePath: string;
}

const toolLookup = new Map(tools.map((tool) => [tool.id, tool]));
const toolCategories = categories.filter(
  (category): category is Exclude<ToolCategory, 'All tools'> => category !== 'All tools',
);

function uniqueToolIds(toolIds: string[]) {
  return Array.from(new Set(toolIds));
}

const mechanicalWorkspaceToolIds = [
  'tolerance-stackup-analyzer',
  'hole-shaft-fit-calculator',
  'bom-diff-checker',
  'drawing-revision-diff-checker',
  'pressure-drop-head-loss-calculator',
  'bearing-life-calculator',
  'gear-ratio-calculator',
  'belt-drive-calculator',
  'mechanical-formula-finder',
];

const civilWorkspaceToolIds = [
  'drawing-revision-diff-checker',
  'pressure-drop-head-loss-calculator',
  'material-takeoff-carbon-estimator',
  'boq-diff-checker',
  'site-handover-builder',
  'earthworks-balance-calculator',
  'invert-slope-calculator',
  'civil-formula-finder',
];

const electricalWorkspaceToolIds = [
  'voltage-drop-calculator',
  'cable-sizing-assistant',
  'conduit-fill-calculator',
  'panel-schedule-builder',
  'breaker-protection-checker',
  'lighting-load-calculator',
  'motor-starting-current-calculator',
  'electrical-formula-finder',
];

function buildWorkspaceSections(toolIds: string[]) {
  return toolCategories
    .map((category) => {
      const sectionToolIds = toolIds.filter((toolId) => toolLookup.get(toolId)?.category === category);
      if (sectionToolIds.length === 0) {
        return null;
      }

      const section: IndustryWorkspaceSection = {
            id: category.toLowerCase(),
            title: category,
            description: `Tools grouped under ${category.toLowerCase()} for recurring day-to-day technology workflows.`,
            toolIds: sectionToolIds,
          };

      return section;
    })
    .filter((section): section is IndustryWorkspaceSection => section !== null);
}

export const mechanicalWorkspace: IndustryWorkspace = {
  slug: 'mechanical',
  title: 'Mechanical Engineering Workspace',
  shortTitle: 'Mechanical',
  audience: 'Mechanical, manufacturing, and design engineers',
  path: '/workspaces/mechanical',
  collectionPath: '/collections/mechanical-manufacturing',
  subtitle: 'Mechanical-first browser tools for fit checks, design review, formula lookup, and recurring shop-floor calculations.',
  description:
    'A focused mechanical workspace that keeps dimensional review, revision checks, and recurring calculations together so engineers do not have to jump through unrelated utility categories first.',
  searchPlaceholder: 'Search mechanical tools',
  ctaLabel: 'Mechanical workspace',
  icon: Factory,
  toolIds: mechanicalWorkspaceToolIds,
  sections: [
    {
      id: 'fit-and-tolerance',
      title: 'Fit and tolerance checks',
      description: 'Start here when stack-ups, fits, and quick dimensional decisions are slowing design or review.',
      toolIds: ['tolerance-stackup-analyzer', 'hole-shaft-fit-calculator'],
    },
    {
      id: 'release-and-revision',
      title: 'Release and revision review',
      description: 'Use these when BOM changes, drawing revisions, and release notes need a cleaner comparison surface.',
      toolIds: ['bom-diff-checker', 'drawing-revision-diff-checker'],
    },
    {
      id: 'calculation-support',
      title: 'Calculation support',
      description: 'Keep recurring fluid and design-reference calculations close to the review workflow instead of buried in spreadsheets or PDFs.',
      toolIds: ['pressure-drop-head-loss-calculator', 'mechanical-formula-finder'],
    },
    {
      id: 'motion-and-drive-checks',
      title: 'Motion and drive checks',
      description: 'Use these when bearing life, gear ratio, or belt layout questions need a quick browser-local sanity check before deeper design work.',
      toolIds: ['bearing-life-calculator', 'gear-ratio-calculator', 'belt-drive-calculator'],
    },
  ],
  aliases: ['/industries/mechanical'],
};

export const civilWorkspace: IndustryWorkspace = {
  slug: 'civil',
  title: 'Civil Engineering Workspace',
  shortTitle: 'Civil',
  audience: 'Civil, site, and construction engineers',
  path: '/workspaces/civil',
  collectionPath: '/collections/civil-construction',
  subtitle: 'Civil-first browser tools for revision review, quantity comparison, hydraulic checks, and takeoff sanity checks.',
  description:
    'A focused civil workspace that keeps drawings, quantities, hydraulics, and formula lookup in one browser-local home without dragging in unrelated utilities.',
  searchPlaceholder: 'Search civil tools',
  ctaLabel: 'Civil workspace',
  icon: Building2,
  toolIds: civilWorkspaceToolIds,
  sections: [
    {
      id: 'revision-and-quantity',
      title: 'Revision and quantity review',
      description: 'Start here when plan notes, BOQs, or quantity exports need a quick comparison before the next coordination step.',
      toolIds: ['drawing-revision-diff-checker', 'boq-diff-checker'],
    },
    {
      id: 'hydraulic-checks',
      title: 'Hydraulic and pipe checks',
      description: 'Use this when water, drainage, or transfer-line checks need a quick browser-local sense check.',
      toolIds: ['pressure-drop-head-loss-calculator'],
    },
    {
      id: 'takeoff-and-carbon',
      title: 'Takeoff and carbon',
      description: 'Keep early quantity comparisons and embodied-carbon estimates close to the tender or concept workflow.',
      toolIds: ['material-takeoff-carbon-estimator'],
    },
    {
      id: 'formula-lookup',
      title: 'Formula lookup',
      description: 'Use this when a quick civil formula reference is faster than digging through old notes or handbook tabs.',
      toolIds: ['civil-formula-finder'],
    },
    {
      id: 'field-handover',
      title: 'Field handover',
      description: 'Use this when rough civil site notes need to become a cleaner handover with actions, urgent items, and markdown output.',
      toolIds: ['site-handover-builder'],
    },
    {
      id: 'earthworks-and-levels',
      title: 'Earthworks and levels',
      description: 'Use this when cut/fill balances or invert and slope checks need a quick browser-local planning surface.',
      toolIds: ['earthworks-balance-calculator', 'invert-slope-calculator'],
    },
  ],
  aliases: ['/industries/civil'],
};

export const electricalWorkspace: IndustryWorkspace = {
  slug: 'electrical',
  title: 'Electrical & Power Workspace',
  shortTitle: 'Electrical',
  audience: 'Electrical, MEP, and power engineers',
  path: '/workspaces/electrical',
  collectionPath: '/collections/electrical-power',
  subtitle: 'Electrical-first browser tools for voltage drop, cable sizing, conduit fill, panel review, and formula lookup.',
  description:
    'A focused electrical workspace that keeps load checks, cable sizing, conduit fill, panel schedules, and formula lookup in one browser-local home without the generic catalog noise.',
  searchPlaceholder: 'Search electrical tools',
  ctaLabel: 'Electrical workspace',
  icon: Zap,
  toolIds: electricalWorkspaceToolIds,
  sections: [
    {
      id: 'load-and-cable-checks',
      title: 'Load, cable, and lighting checks',
      description: 'Start here when current, drop limits, lighting loads, and routing decisions need a quick browser-local sanity check.',
      toolIds: ['voltage-drop-calculator', 'cable-sizing-assistant', 'conduit-fill-calculator', 'lighting-load-calculator'],
    },
    {
      id: 'panel-review',
      title: 'Panel review',
      description: 'Use this when circuit loads, spare ways, or phase balance need a cleaner schedule view.',
      toolIds: ['panel-schedule-builder'],
    },
    {
      id: 'formula-lookup',
      title: 'Formula lookup',
      description: 'Keep recurring electrical equations close to the review workflow instead of buried in old notes or tabs.',
      toolIds: ['electrical-formula-finder'],
    },
    {
      id: 'protection-and-starting',
      title: 'Protection and starting',
      description: 'Use this when breaker selection or motor start checks need a quick local screen before a deeper study.',
      toolIds: ['breaker-protection-checker', 'motor-starting-current-calculator'],
    },
  ],
  aliases: ['/industries/electrical', '/industries/electrical-power'],
};

const industrySpecificToolIds = uniqueToolIds([
  ...mechanicalWorkspaceToolIds,
  ...civilWorkspaceToolIds,
  ...electricalWorkspaceToolIds,
]);

const technologyToolIds = tools
  .filter((tool) => !industrySpecificToolIds.includes(tool.id))
  .map((tool) => tool.id);

export const technologyWorkspace: IndustryWorkspace = {
  slug: 'technology',
  title: 'Technology Workspace',
  shortTitle: 'Technology',
  audience: 'Developers, platform teams, QA, delivery leads, and technical reviewers',
  path: '/workspaces/technology',
  collectionPath: '/collections',
  subtitle: 'Technology-first browser tools for delivery workflows, review loops, data cleanup, API work, and practical day-to-day engineering support.',
  description:
    'A focused technology workspace that keeps software delivery tools together so teams can search, transform, inspect, and review without starting from a generic utility catalog.',
  searchPlaceholder: 'Search technology tools',
  ctaLabel: 'Technology workspace',
  icon: Blocks,
  toolIds: technologyToolIds,
  sections: buildWorkspaceSections(technologyToolIds),
};

export const workspaces = [technologyWorkspace, mechanicalWorkspace, civilWorkspace, electricalWorkspace];

function matchesWorkspacePath(workspace: IndustryWorkspace, pathname: string) {
  if (pathname === workspace.path) {
    return true;
  }

  if (workspace.aliases?.includes(pathname)) {
    return true;
  }

  if (workspace.slug === 'technology') {
    return workspace.toolIds.some((toolId) => toolLookup.get(toolId)?.path === pathname);
  }

  return pathname.startsWith(`/workspaces/${workspace.slug}/tools/`) || pathname.startsWith(`/industries/${workspace.slug}/tools/`);
}

export function getIndustryWorkspaceBySlug(slug: string) {
  return workspaces.find((workspace) => workspace.slug === slug);
}

export function getIndustryWorkspaceByPathname(pathname: string) {
  return workspaces.find((workspace) => matchesWorkspacePath(workspace, pathname));
}

export function getIndustryToolPath(workspaceSlug: string, toolId: string) {
  const workspace = getIndustryWorkspaceBySlug(workspaceSlug);
  const tool = toolLookup.get(toolId);
  if (!workspace) {
    return tool?.path ?? `/tools/${toolId}`;
  }

  if (workspace.slug === 'technology') {
    return tool?.path ?? '/';
  }

  return `/workspaces/${workspaceSlug}/tools/${toolId}`;
}

export function getIndustryWorkspaceTools(workspace: IndustryWorkspace): IndustryWorkspaceToolLink[] {
  return workspace.toolIds.flatMap((toolId) => {
    const tool = toolLookup.get(toolId);
    return tool
      ? [
          {
            ...tool,
            workspacePath: getIndustryToolPath(workspace.slug, tool.id),
          },
        ]
      : [];
  });
}

export const mechanicalWorkspaceHighlights = [
  {
    title: 'Open the dimensional checks first',
    body: 'Tolerance Stack-Up Analyzer and Hole/Shaft Fit Calculator are the fastest value tools for active design decisions, quoting, and review.',
    icon: Sigma,
  },
  {
    title: 'Review changes before release',
    body: 'BOM Diff Checker and Drawing Revision Diff Checker reduce the manual compare work that usually gets spread across spreadsheets, PDFs, and email threads.',
    icon: FileSearch,
  },
  {
    title: 'Keep recurring formulas within reach',
    body: 'Pressure Drop and Mechanical Formula Finder cover the repetitive calculation lookup work that engineers repeatedly redo or re-search.',
    icon: Gauge,
  },
  {
    title: 'Stay mechanical-only here',
    body: 'This workspace deliberately hides unrelated utilities so mechanical engineers see only the tools that clearly belong to their workflow.',
    icon: PackageSearch,
  },
];

export const civilWorkspaceHighlights = [
  {
    title: 'Keep revision review close',
    body: 'Drawing Revision Diff Checker and BOQ Diff Checker help civil teams spot what changed in notes, schedules, and quantity exports before anything becomes rework.',
    icon: FileSearch,
  },
  {
    title: 'Run fast hydraulic checks',
    body: 'Pressure Drop & Head Loss Calculator gives a lightweight browser-local answer for water, drainage, and transfer-line checks.',
    icon: Gauge,
  },
  {
    title: 'Compare takeoff scenarios locally',
    body: 'Material Takeoff + Carbon Estimator keeps tender-stage quantities and embodied-carbon comparisons easy to read and easy to share.',
    icon: BarChart3,
  },
  {
    title: 'Stay civil-only here',
    body: 'This workspace deliberately hides unrelated utilities so civil engineers only see the tools that clearly match their work.',
    icon: PackageSearch,
  },
];

export const electricalWorkspaceHighlights = [
  {
    title: 'Start with the load checks first',
    body: 'Voltage Drop Calculator, Cable Sizing Assistant, and Conduit Fill Calculator cover the quick planning questions that usually happen before a deeper design review.',
    icon: Gauge,
  },
  {
    title: 'Keep the panel view readable',
    body: 'Panel Schedule Builder turns a small circuit list into phase totals, spare ways, and a cleaner review surface.',
    icon: Table2,
  },
  {
    title: 'Keep recurring formulas close',
    body: 'Electrical Formula Finder shortens the lookup work for the common equations engineers keep reusing in notes and spreadsheets.',
    icon: PackageSearch,
  },
  {
    title: 'Stay electrical-only here',
    body: 'This workspace deliberately hides unrelated utilities so electrical users only see tools that clearly match their workflow.',
    icon: Zap,
  },
];

export const technologyWorkspaceHighlights = [
  {
    title: 'Start with the work, not the file type',
    body: 'The technology workspace keeps API review, formatting, validation, conversion, and delivery support tools together so teams can move faster without hunting through a generic catalog.',
    icon: Wrench,
  },
  {
    title: 'Keep the biggest workflow clusters close',
    body: 'Formatters, encoders, converters, security checks, and developer utilities stay grouped in one workspace where the search bar and sidebar follow the same scope.',
    icon: Blocks,
  },
  {
    title: 'Stay browser-local by default',
    body: 'Payloads, logs, snippets, configs, and notes can stay on the page instead of bouncing into random third-party tools during delivery work.',
    icon: Gauge,
  },
  {
    title: 'Branch into industry workspaces when needed',
    body: 'Mechanical and civil workspaces now sit alongside technology so people can switch context without dragging unrelated tools into the sidebar or search results.',
    icon: BarChart3,
  },
];
