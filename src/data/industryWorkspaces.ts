import { Activity, BarChart3, Blocks, Building2, ClipboardList, Factory, FileSearch, Gauge, HeartPulse, PackageSearch, ShieldAlert, Sigma, Table2, Wrench, Zap, type LucideIcon } from 'lucide-react';
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
  'tolerance-change-impact-checker',
  'drawing-inspection-reconciler',
  'fastener-clamp-load-checker',
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
  'drainage-schedule-qa-checker',
  'boq-spec-cross-checker',
  'tender-addendum-impact-checker',
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
  'cable-schedule-qa-checker',
  'panel-revision-qa-checker',
  'load-list-reconciler',
  'voltage-drop-calculator',
  'cable-sizing-assistant',
  'conduit-fill-calculator',
  'panel-schedule-builder',
  'breaker-protection-checker',
  'lighting-load-calculator',
  'motor-starting-current-calculator',
  'electrical-formula-finder',
];

const medicalWorkspaceToolIds = [
  'clinical-handover-completeness-linter',
  'discharge-instruction-delta-audit',
  'referral-packet-checklist-builder',
  'shift-handover-builder',
  'clinical-report-diff-checker',
  'clinical-deidentifier',
];

const miningWorkspaceToolIds = [
  'dewatering-shift-log-reconciler',
  'isolation-matrix-change-checker',
  'production-shift-reconciliation-checker',
  'shift-handover-builder',
  'pressure-drop-head-loss-calculator',
  'drawing-revision-diff-checker',
];

const operationsWorkspaceToolIds = [
  'shift-commitment-reconciler',
  'work-instruction-change-checker',
  'permit-scope-change-checker',
  'shift-handover-builder',
  'drawing-revision-diff-checker',
  'secret-redactor',
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
      toolIds: ['tolerance-change-impact-checker', 'tolerance-stackup-analyzer', 'hole-shaft-fit-calculator'],
    },
    {
      id: 'release-and-revision',
      title: 'Release and revision review',
      description: 'Use these when BOM changes, drawing revisions, and release notes need a cleaner comparison surface.',
      toolIds: ['drawing-inspection-reconciler', 'bom-diff-checker', 'drawing-revision-diff-checker'],
    },
    {
      id: 'calculation-support',
      title: 'Calculation support',
      description: 'Keep recurring fluid and design-reference calculations close to the review workflow instead of buried in spreadsheets or PDFs.',
      toolIds: ['fastener-clamp-load-checker', 'pressure-drop-head-loss-calculator', 'mechanical-formula-finder'],
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
      toolIds: ['drainage-schedule-qa-checker', 'drawing-revision-diff-checker', 'boq-diff-checker'],
    },
    {
      id: 'tender-and-spec-review',
      title: 'Tender and spec review',
      description: 'Use these when BOQ references, spec links, or addendum wording needs a faster review surface before tender close.',
      toolIds: ['boq-spec-cross-checker', 'tender-addendum-impact-checker'],
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
      toolIds: ['cable-schedule-qa-checker', 'voltage-drop-calculator', 'cable-sizing-assistant', 'conduit-fill-calculator', 'lighting-load-calculator'],
    },
    {
      id: 'panel-review',
      title: 'Panel review',
      description: 'Use this when circuit loads, spare ways, or phase balance need a cleaner schedule view.',
      toolIds: ['panel-revision-qa-checker', 'panel-schedule-builder'],
    },
    {
      id: 'coordination-reconciliation',
      title: 'Coordination and reconciliation',
      description: 'Use this when load tags, panel names, or single-line assumptions need a deterministic mismatch screen.',
      toolIds: ['load-list-reconciler'],
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

export const medicalWorkspace: IndustryWorkspace = {
  slug: 'medical',
  title: 'Medical & Clinical Workspace',
  shortTitle: 'Medical',
  audience: 'Medical and clinical teams',
  path: '/workspaces/medical',
  collectionPath: '/collections/medical-clinical',
  subtitle: 'Medical-first browser tools for structured handovers, report comparison, and clinical note cleanup.',
  description:
    'A focused medical workspace that keeps handovers, report comparisons, and note de-identification together so clinicians see only the workflows that matter most.',
  searchPlaceholder: 'Search medical tools',
  ctaLabel: 'Medical workspace',
  icon: HeartPulse,
  toolIds: medicalWorkspaceToolIds,
  sections: [
    {
      id: 'handover-and-notes',
      title: 'Handover and notes',
      description: 'Start here when shift notes, ward notes, or on-call summaries need a cleaner handover surface.',
      toolIds: ['clinical-handover-completeness-linter', 'shift-handover-builder'],
    },
    {
      id: 'report-review',
      title: 'Report review',
      description: 'Use this when a clinical report or extracted note needs a quick local diff before it is shared.',
      toolIds: ['clinical-report-diff-checker', 'discharge-instruction-delta-audit'],
    },
    {
      id: 'packet-readiness',
      title: 'Packet readiness',
      description: 'Use these when referral notes or shared material need a quick structure or privacy pass before moving onward.',
      toolIds: ['referral-packet-checklist-builder', 'clinical-deidentifier'],
    },
  ],
  aliases: ['/industries/medical', '/industries/medical-clinical'],
};

export const miningWorkspace: IndustryWorkspace = {
  slug: 'mining',
  title: 'Mining & Resources Workspace',
  shortTitle: 'Mining',
  audience: 'Mining and resources teams',
  path: '/workspaces/mining',
  collectionPath: '/collections/mining-resources',
  subtitle: 'Mining-first browser tools for handover, hydraulic checks, and revision review.',
  description:
    'A focused mining workspace that keeps shift handover, water-transfer checks, and revision review close to the field workflow without unrelated tools in the way.',
  searchPlaceholder: 'Search mining tools',
  ctaLabel: 'Mining workspace',
  icon: Activity,
  toolIds: miningWorkspaceToolIds,
  sections: [
    {
      id: 'handover-and-hydraulics',
      title: 'Handover and hydraulics',
      description: 'Start here when shift notes need structure and a quick hydraulic sanity check needs to stay local.',
      toolIds: ['shift-handover-builder', 'pressure-drop-head-loss-calculator', 'dewatering-shift-log-reconciler'],
    },
    {
      id: 'revision-review',
      title: 'Revision review',
      description: 'Use this when drawing or procedure changes need a smaller text-first review surface.',
      toolIds: ['drawing-revision-diff-checker', 'isolation-matrix-change-checker'],
    },
    {
      id: 'production-reconciliation',
      title: 'Production reconciliation',
      description: 'Keep haul, plant, and shift-tally comparisons visible before totals are locked into reporting.',
      toolIds: ['production-shift-reconciliation-checker'],
    },
  ],
  aliases: ['/industries/mining', '/industries/mining-resources'],
};

export const operationsWorkspace: IndustryWorkspace = {
  slug: 'operations',
  title: 'Operations & Field Teams Workspace',
  shortTitle: 'Operations',
  audience: 'Operations and field teams',
  path: '/workspaces/operations',
  collectionPath: '/collections/operations-field-teams',
  subtitle: 'Operations-first browser tools for handovers, revision checks, and safe note cleanup.',
  description:
    'A focused operations workspace that keeps handover notes, revision review, and redaction together so field teams do not need to sift through unrelated utilities.',
  searchPlaceholder: 'Search operations tools',
  ctaLabel: 'Operations workspace',
  icon: ClipboardList,
  toolIds: operationsWorkspaceToolIds,
  sections: [
    {
      id: 'handover-and-control',
      title: 'Handover and control',
      description: 'Start here when shift notes need a cleaner handover or a shared status surface.',
      toolIds: ['shift-handover-builder', 'shift-commitment-reconciler'],
    },
    {
      id: 'revision-review',
      title: 'Revision review',
      description: 'Use this when work packs, permits, or procedures need a quick comparison before release.',
      toolIds: ['drawing-revision-diff-checker', 'work-instruction-change-checker', 'permit-scope-change-checker'],
    },
    {
      id: 'cleanup-and-packaging',
      title: 'Cleanup and packaging',
      description: 'Use this when notes need a safer first pass before they move into tickets, chat, or reports.',
      toolIds: ['secret-redactor'],
    },
  ],
  aliases: ['/industries/operations', '/industries/field-teams', '/industries/operations-field-teams'],
};

const industrySpecificToolIds = uniqueToolIds([
  ...mechanicalWorkspaceToolIds,
  ...civilWorkspaceToolIds,
  ...electricalWorkspaceToolIds,
  ...medicalWorkspaceToolIds,
  ...miningWorkspaceToolIds,
  ...operationsWorkspaceToolIds,
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

export const workspaces = [
  technologyWorkspace,
  mechanicalWorkspace,
  civilWorkspace,
  electricalWorkspace,
  medicalWorkspace,
  miningWorkspace,
  operationsWorkspace,
];

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
    title: 'Open the changed dimensions first',
    body: 'Tolerance Change Impact Checker and Tolerance Stack-Up Analyzer expose which revision actually moved the assembly window before anyone debates the spreadsheet.',
    icon: Sigma,
  },
  {
    title: 'Review release readiness as a system',
    body: 'Drawing Inspection Reconciler, BOM Diff Checker, and Drawing Revision Diff Checker close the gap between design intent and release paperwork.',
    icon: FileSearch,
  },
  {
    title: 'Keep high-friction checks within reach',
    body: 'Fastener Clamp Load Checker adds one more repeated machine-design check to the local workspace instead of hiding it in a personal workbook.',
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
    title: 'Audit the schedule before it reaches site',
    body: 'Drainage Schedule QA Checker turns one of the most repetitive civil review chores into a deterministic local screen for slope and invert issues.',
    icon: FileSearch,
  },
  {
    title: 'Cross-check tender artifacts together',
    body: 'BOQ Spec Cross Checker and Tender Addendum Impact Checker focus on the exact BOQ-versus-spec-versus-addendum friction that still burns review time.',
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
    title: 'Start with schedule QA first',
    body: 'Cable Schedule QA Checker gives electrical teams a release-oriented first pass before cable sizing decisions or procurement assumptions drift.',
    icon: Gauge,
  },
  {
    title: 'Keep revision review readable',
    body: 'Panel Revision QA Checker and Load List Reconciler make panel and single-line coordination a smaller, more trustworthy workflow.',
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

export const medicalWorkspaceHighlights = [
  {
    title: 'Start with structure, not diagnosis',
    body: 'Clinical Handover Completeness Linter keeps the medical workspace grounded in documentation quality instead of trying to act like clinical decision support.',
    icon: HeartPulse,
  },
  {
    title: 'Review instruction deltas carefully',
    body: 'Discharge Instruction Delta Audit gives draft-versus-final changes a safer, more focused review surface around medications, follow-up, and warning wording.',
    icon: FileSearch,
  },
  {
    title: 'Prepare the packet before it moves',
    body: 'Referral Packet Checklist Builder and Clinical De-Identifier help teams clean structure and privacy issues before broader sharing.',
    icon: ShieldAlert,
  },
  {
    title: 'Stay medical-only here',
    body: 'This workspace deliberately hides unrelated utilities so clinicians see only the tools that clearly fit their workflow.',
    icon: PackageSearch,
  },
];

export const miningWorkspaceHighlights = [
  {
    title: 'Treat dewatering data as reviewable',
    body: 'Dewatering Shift Log Reconciler gives mining teams a browser-local way to challenge suspicious pump and pond numbers before they drive decisions.',
    icon: ClipboardList,
  },
  {
    title: 'Keep hydraulic and field checks lightweight',
    body: 'Pressure Drop & Head Loss Calculator still supports transfer-line sanity checks, but now the workspace also covers the shift-log reconciliation pain around those systems.',
    icon: Gauge,
  },
  {
    title: 'Review revision risk before the job starts',
    body: 'Isolation Matrix Change Checker and Production Shift Reconciliation Checker extend the workspace into high-value operational review instead of generic note tooling.',
    icon: FileSearch,
  },
  {
    title: 'Stay mining-only here',
    body: 'This workspace deliberately hides unrelated utilities so mining users see only the tools that clearly match their work.',
    icon: PackageSearch,
  },
];

export const operationsWorkspaceHighlights = [
  {
    title: 'Carry actions across shifts on purpose',
    body: 'Shift Commitment Reconciler turns a vague handover problem into a concrete dropped-action check that teams can actually reuse.',
    icon: ClipboardList,
  },
  {
    title: 'Focus on operationally dangerous changes',
    body: 'Work Instruction Change Checker and Permit Scope Change Checker narrow review onto the specific wording and table fields that can change field execution.',
    icon: FileSearch,
  },
  {
    title: 'Clean notes before sharing',
    body: 'Secret Redactor helps remove obvious sensitive details before the note is pasted into a ticket, chat, or report.',
    icon: ShieldAlert,
  },
  {
    title: 'Stay operations-only here',
    body: 'This workspace deliberately hides unrelated utilities so field teams only see the tools that clearly match their workflow.',
    icon: PackageSearch,
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
