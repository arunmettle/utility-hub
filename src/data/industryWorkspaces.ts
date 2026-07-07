import { Factory, FileSearch, Gauge, PackageSearch, Sigma, type LucideIcon } from 'lucide-react';
import { tools, type ToolDefinition } from './tools';

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
  collectionPath: string;
  subtitle: string;
  description: string;
  searchPlaceholder: string;
  ctaLabel: string;
  icon: LucideIcon;
  toolIds: string[];
  sections: IndustryWorkspaceSection[];
}

export interface IndustryWorkspaceToolLink extends ToolDefinition {
  workspacePath: string;
}

const toolLookup = new Map(tools.map((tool) => [tool.id, tool]));

export const mechanicalWorkspace: IndustryWorkspace = {
  slug: 'mechanical',
  title: 'Mechanical Engineering Workspace',
  shortTitle: 'Mechanical',
  audience: 'Mechanical, manufacturing, and design engineers',
  path: '/industries/mechanical',
  collectionPath: '/collections/mechanical-manufacturing',
  subtitle: 'Mechanical-first browser tools for fit checks, design review, formula lookup, and recurring shop-floor calculations.',
  description:
    'A focused mechanical workspace that keeps dimensional review, revision checks, and recurring calculations together so engineers do not have to jump through unrelated utility categories first.',
  searchPlaceholder: 'Search mechanical tools',
  ctaLabel: 'Mechanical workspace',
  icon: Factory,
  toolIds: [
    'tolerance-stackup-analyzer',
    'hole-shaft-fit-calculator',
    'bom-diff-checker',
    'drawing-revision-diff-checker',
    'pressure-drop-head-loss-calculator',
    'mechanical-formula-finder',
  ],
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
  ],
};

const workspaces = [mechanicalWorkspace];

export function getIndustryWorkspaceBySlug(slug: string) {
  return workspaces.find((workspace) => workspace.slug === slug);
}

export function getIndustryWorkspaceByPathname(pathname: string) {
  return workspaces.find(
    (workspace) => pathname === workspace.path || pathname.startsWith(`${workspace.path}/tools/`),
  );
}

export function getIndustryToolPath(workspaceSlug: string, toolId: string) {
  return `/industries/${workspaceSlug}/tools/${toolId}`;
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
