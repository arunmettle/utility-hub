import { tools, type ToolDefinition } from '../data/tools';

export interface GuideSection {
  title: string;
  body: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface ToolGuide {
  slug: string;
  toolId: string;
  title: string;
  summary: string;
  metaDescription: string;
  intro: string;
  whenToUse: string[];
  steps: GuideSection[];
  useCases: GuideSection[];
  mistakes: string[];
  privacyNote: string;
  faqs: GuideFaq[];
  relatedToolIds: string[];
}

const toolLookup = new Map(tools.map((tool) => [tool.id, tool]));

const authoredToolGuides: ToolGuide[] = [
  {
    slug: 'json-formatter',
    toolId: 'json-formatter',
    title: 'How to use the JSON Formatter',
    summary: 'Clean up, validate, and review API payloads locally before they land in docs, tickets, or production debugging.',
    metaDescription:
      'Learn how to use UtilityHub JSON Formatter to validate, prettify, and minify JSON locally with real API debugging and review use cases.',
    intro:
      'JSON formatting looks simple until you are working with broken webhook payloads, noisy API responses, or copied configuration blobs in the middle of a review. This guide shows the fastest way to turn messy JSON into something readable and safe to share.',
    whenToUse: [
      'You copied an API response from logs or DevTools and need to inspect it quickly.',
      'You want to validate whether a payload is valid JSON before using it in code or docs.',
      'You need to minify or prettify structured data for tickets, PRs, or config files.',
    ],
    steps: [
      {
        title: 'Paste the payload you want to inspect',
        body: 'Drop raw JSON into the input panel. UtilityHub will keep the content on the page so you can work on payloads that should not be sent to a remote formatter.',
      },
      {
        title: 'Validate the structure before doing anything else',
        body: 'If the payload is malformed, fix the syntax issues first. This is especially helpful when a webhook example or copied log line has missing quotes, trailing commas, or clipped braces.',
      },
      {
        title: 'Switch between formatted and compact output',
        body: 'Use the pretty version when you are reviewing shape and nesting. Use the minified version when you need a compact payload for test fixtures, query parameters, or API examples.',
      },
      {
        title: 'Copy the cleaned output into your next workflow',
        body: 'Once the payload is readable, move it into docs, test cases, JSON schema work, or diff review without carrying formatting noise forward.',
      },
    ],
    useCases: [
      {
        title: 'API debugging',
        body: 'When an endpoint returns a large object, a formatter helps you find the fields that matter before you start tracing logic in code.',
      },
      {
        title: 'Pull request review',
        body: 'Reviewers often need to inspect sample payloads in descriptions or comments. Formatted JSON makes hidden shape changes much easier to notice.',
      },
      {
        title: 'Webhook inspection',
        body: 'Webhook examples are often copied as one long line. Formatting them before analysis makes event names, nested objects, and changed keys far easier to compare.',
      },
    ],
    mistakes: [
      'Treating formatting as validation. Pretty output is useful, but valid JSON still needs structural checking.',
      'Sharing raw payloads without redaction when they contain IDs, emails, or tokens.',
      'Reviewing shape manually when a related schema or diff tool would be faster.',
    ],
    privacyNote:
      'Use local formatting when working with internal payloads, customer examples, or staging data that should not be pasted into unknown third-party tools.',
    faqs: [
      {
        question: 'When should I use a formatter instead of a schema tool?',
        answer:
          'Use a formatter first when readability is the problem. Move to schema generation once you already trust the sample and want a reusable contract.',
      },
      {
        question: 'What should I do if the JSON is valid but still hard to review?',
        answer:
          'Move next to JSON Path Explorer, JSON Value Comparator, or JSON Schema Generator depending on whether you need lookup, diffing, or contract inference.',
      },
    ],
    relatedToolIds: ['json-path-explorer', 'json-value-comparator', 'json-schema-generator'],
  },
  {
    slug: 'jwt-decoder',
    toolId: 'jwt-decoder',
    title: 'How to use the JWT Decoder',
    summary: 'Decode token headers and claims locally so expiry issues, risky algorithms, and missing fields are easier to inspect.',
    metaDescription:
      'Learn how to use UtilityHub JWT Decoder to inspect token headers, claims, and expiry safely with local browser-based review.',
    intro:
      'JWTs show up everywhere in authentication, support tickets, QA checks, and API debugging. The important part is usually not the whole token. It is whether the header and claims look expected, whether the token is expired, and whether anything about it looks risky.',
    whenToUse: [
      'You need to check token expiry during login or session debugging.',
      'You want to inspect issuer, audience, subject, or custom claims quickly.',
      'You are reviewing whether a token uses an unsafe or unexpected algorithm.',
    ],
    steps: [
      {
        title: 'Paste the JWT exactly as received',
        body: 'Use the complete token string so the decoder can inspect header and payload sections together.',
      },
      {
        title: 'Review the header first',
        body: 'Confirm the declared algorithm and token type. This catches obvious surprises like an unexpected algorithm before you spend time on claims.',
      },
      {
        title: 'Inspect time-based claims',
        body: 'Check issued-at, not-before, and expiry values to understand whether the token is valid yet, already expired, or far outside the expected session window.',
      },
      {
        title: 'Validate business claims against your workflow',
        body: 'Look at fields like audience, issuer, roles, tenant IDs, or scopes and compare them to what the app expected at that point in the flow.',
      },
    ],
    useCases: [
      {
        title: 'Login troubleshooting',
        body: 'When a user cannot access a route, decoded claims often reveal whether the wrong audience, tenant, or role was issued.',
      },
      {
        title: 'Session expiry review',
        body: 'Support and QA teams can check whether tokens are expiring too early or living too long without needing backend access.',
      },
      {
        title: 'Security spot checks',
        body: 'Local decoding helps teams inspect token metadata without forwarding raw tokens through extra services.',
      },
    ],
    mistakes: [
      'Assuming decode means verify. A decoder shows claims, but it does not prove the token was signed by a trusted issuer.',
      'Ignoring time zones when reading expiry values in incident reviews.',
      'Copying live tokens into shared docs without first masking or shortening them.',
    ],
    privacyNote:
      'Even when a JWT is only encoded and not encrypted, it can still contain sensitive identifiers. Local inspection reduces unnecessary exposure.',
    faqs: [
      {
        question: 'Can I trust a decoded JWT just because the payload looks correct?',
        answer:
          'No. Decoding helps with inspection, but signature verification still has to happen in the right auth flow with the correct keys.',
      },
      {
        question: 'What should I do after decoding a suspicious token?',
        answer:
          'Check the header, expiry, issuer, audience, and scopes, then compare them with the app expectations and your auth provider configuration.',
      },
    ],
    relatedToolIds: ['jwt-expiry-checker', 'base64-url-studio', 'api-key-fingerprinter'],
  },
  {
    slug: 'regex-tester',
    toolId: 'regex-tester',
    title: 'How to use the Regex Tester',
    summary: 'Preview matches, capture groups, and pattern behavior before a regex reaches code, automation, or content workflows.',
    metaDescription:
      'Learn how to use UtilityHub Regex Tester with step-by-step examples for validation, extraction, and replacement workflows.',
    intro:
      'Regex is powerful, but small pattern mistakes can create bad validations, missed matches, or destructive replacements. A local regex tester gives you a safer place to experiment before the pattern ends up in application code or automation.',
    whenToUse: [
      'You are building validation logic for forms, imports, or data cleanup.',
      'You need to extract IDs, URLs, or tagged patterns from copied text.',
      'You want to check flags and capture groups before scripting a replacement.',
    ],
    steps: [
      {
        title: 'Paste representative sample text',
        body: 'Use real examples, including edge cases, because patterns that work on toy strings often fail on production-shaped inputs.',
      },
      {
        title: 'Write the pattern and choose flags carefully',
        body: 'Start with the smallest pattern that solves the problem, then add global, multiline, or case-insensitive flags only when they are clearly needed.',
      },
      {
        title: 'Inspect the highlighted matches and captures',
        body: 'Verify not only that the expected text matches, but also that unexpected text does not match.',
      },
      {
        title: 'Promote the pattern only after checking edge cases',
        body: 'Test whitespace, punctuation, line breaks, missing values, and unusually long inputs before you move the regex into code or content operations.',
      },
    ],
    useCases: [
      {
        title: 'Email and identifier validation',
        body: 'A regex tester helps you see whether the pattern is too loose or too strict before it blocks real users or lets bad input through.',
      },
      {
        title: 'Log parsing',
        body: 'Teams often need to pull IDs, status codes, or timestamps out of noisy console output. Local testing shortens that iteration cycle.',
      },
      {
        title: 'Content cleanup',
        body: 'Editors and technical writers can test replacements on copied content before running the pattern across docs or markdown files.',
      },
    ],
    mistakes: [
      'Testing only the happy path and ignoring counterexamples.',
      'Using a broad global match when the workflow actually needs an anchored validation.',
      'Skipping replacement preview when the regex will later be used in a destructive transformation.',
    ],
    privacyNote:
      'A browser-local tester is especially helpful when the sample text includes support logs, user-submitted content, or internal identifiers.',
    faqs: [
      {
        question: 'How do I know if my regex is too broad?',
        answer:
          'Paste several negative examples and confirm they do not match. Good regex review is about false positives as much as successful matches.',
      },
      {
        question: 'What should I use after a regex test if I need replacements?',
        answer:
          'Move into Regex Replace Tester if you want to preview the final transformed output before using the pattern in a script or migration.',
      },
    ],
    relatedToolIds: ['regex-replace-tester', 'link-extractor', 'secret-redactor'],
  },
  {
    slug: 'openapi-summary',
    toolId: 'openapi-summary',
    title: 'How to use the OpenAPI Summary tool',
    summary: 'Turn large API specifications into a smaller review surface for teams working across backend, frontend, QA, and platform workflows.',
    metaDescription:
      'Learn how to use UtilityHub OpenAPI Summary to review paths, methods, tags, and security schemes from large API specs.',
    intro:
      'OpenAPI files are useful, but they are not always easy to review at full size. A summary tool helps you quickly answer practical questions like which endpoints exist, how big the surface is, and what security schemes the spec declares.',
    whenToUse: [
      'You received a new API spec and need a fast orientation pass.',
      'You want to compare whether an API change expanded or reduced the surface area.',
      'You need a compact summary for stakeholder review or implementation planning.',
    ],
    steps: [
      {
        title: 'Paste the full OpenAPI document',
        body: 'Use the raw JSON or YAML representation so the tool can count routes, methods, tags, and security definitions accurately.',
      },
      {
        title: 'Review the path and operation counts',
        body: 'This gives you a quick sense of spec size before you dive into individual endpoints.',
      },
      {
        title: 'Scan tags and security schemes',
        body: 'Tags tell you how the API is organized. Security schemes help you see how authentication is expected to work across the surface.',
      },
      {
        title: 'Use the summary to drive deeper review',
        body: 'After the orientation pass, move into detailed contract review, code generation, or breaking-change analysis with a clearer map of the API.',
      },
    ],
    useCases: [
      {
        title: 'Frontend onboarding',
        body: 'A summary helps frontend teams understand what resources and tags exist before they read every operation in detail.',
      },
      {
        title: 'Release review',
        body: 'Platform and QA teams can use a compact summary to estimate which domains of the API need regression attention.',
      },
      {
        title: 'Vendor or partner API evaluation',
        body: 'When you are deciding whether an external API is a fit, a quick summary often tells you whether the structure matches your use case.',
      },
    ],
    mistakes: [
      'Using the summary as a replacement for detailed contract review.',
      'Ignoring security schemes when evaluating an integration.',
      'Reviewing the API surface without checking for breaking field changes separately.',
    ],
    privacyNote:
      'Specs can include internal descriptions, server URLs, and examples. Local inspection is a safer first pass when the document is not public.',
    faqs: [
      {
        question: 'What should I use if I need to compare two OpenAPI versions?',
        answer:
          'Use the summary for orientation, then combine it with Breaking Change Detector or JSON comparison workflows for structural changes.',
      },
      {
        question: 'Can this replace API documentation?',
        answer:
          'No. It is a review and orientation tool, not a full documentation renderer.',
      },
    ],
    relatedToolIds: ['curl-to-code-converter', 'breaking-change-detector', 'json-schema-generator'],
  },
  {
    slug: 'secret-redactor',
    toolId: 'secret-redactor',
    title: 'How to use the Secret Redactor',
    summary: 'Mask likely secrets, tokens, and sensitive identifiers before you share logs, payloads, or debugging notes with other people.',
    metaDescription:
      'Learn how to use UtilityHub Secret Redactor to mask tokens, credentials, and sensitive strings before sharing technical text.',
    intro:
      'A lot of incidents do not start with malicious code. They start with someone sharing a log, payload, or config snippet too quickly. A redaction pass creates a safer version of the text before it moves into Slack, tickets, docs, or GitHub issues.',
    whenToUse: [
      'You need to share logs or payloads with another teammate.',
      'A support or incident workflow requires technical context but should not expose raw secrets.',
      'You want a quick mask pass before posting content in public forums or bug reports.',
    ],
    steps: [
      {
        title: 'Paste the original text into the redactor',
        body: 'Use the full snippet if possible so the masking logic has enough surrounding context to detect secret-like patterns.',
      },
      {
        title: 'Review how many replacements were made',
        body: 'A replacement count helps you sanity-check whether the tool found the likely risky values you expected it to catch.',
      },
      {
        title: 'Read the redacted version before sharing it',
        body: 'Make sure the final text still preserves enough context for debugging while hiding sensitive material.',
      },
      {
        title: 'Move the safer version into tickets, chats, or docs',
        body: 'Use the cleaned output for collaboration, and keep the original in a controlled environment only if it is still needed.',
      },
    ],
    useCases: [
      {
        title: 'Incident response',
        body: 'Engineers can share problematic requests or logs quickly without circulating raw tokens and credentials more widely than necessary.',
      },
      {
        title: 'Vendor support tickets',
        body: 'Teams often need to show error context to third parties. Redaction reduces accidental leakage while preserving the technical story.',
      },
      {
        title: 'Community help requests',
        body: 'Before asking for help on Reddit, Stack Overflow, or forums, redact first so debug context does not expose internal secrets.',
      },
    ],
    mistakes: [
      'Assuming the first redaction pass caught every sensitive value without manually reviewing the output.',
      'Sharing the original text alongside the redacted text in the same thread.',
      'Masking secrets but leaving unique user identifiers, emails, or internal URLs untouched.',
    ],
    privacyNote:
      'Redaction is one of the clearest local-first workflows because the input often contains live credentials, emails, or customer-linked identifiers.',
    faqs: [
      {
        question: 'Should I still review the result manually?',
        answer:
          'Yes. Automated redaction is a strong first pass, but you should still scan for identifiers and context-specific secrets before sharing.',
      },
      {
        question: 'What should I use if I need to compare before and after header blocks?',
        answer:
          'Use Header Diff Checker or HTTP Header Inspector after redaction if the workflow still needs a deeper review pass.',
      },
    ],
    relatedToolIds: ['api-key-fingerprinter', 'http-header-inspector', 'header-diff-checker'],
  },
];

const categoryWorkflowCopy: Record<ToolDefinition['category'], {
  workflow: string;
  input: string;
  output: string;
  privacy: string;
}> = {
  Formatters: {
    workflow: 'formatting and cleanup',
    input: 'pasted text, markup, logs, tables, or structured snippets',
    output: 'cleaner, more reviewable output',
    privacy: 'formatting often starts with copied production-like content, so keeping it local is useful before anything moves into tickets, docs, or chat',
  },
  Encoders: {
    workflow: 'encoding and decoding',
    input: 'the exact string or payload segment you need to transform',
    output: 'the encoded or decoded value you can inspect before reusing',
    privacy: 'encoded values can still contain sensitive identifiers, tokens, or customer-linked data, so local handling reduces unnecessary exposure',
  },
  Converters: {
    workflow: 'conversion',
    input: 'the source value, list, table, timestamp, path, or payload you need to translate',
    output: 'the converted result in the format your next tool or teammate expects',
    privacy: 'conversion work often touches filenames, exports, snippets, or environment-specific values that do not need to leave the browser',
  },
  Generators: {
    workflow: 'generation',
    input: 'the settings, seed text, range, or options that shape the generated result',
    output: 'fresh values ready for fixtures, demos, docs, or local testing',
    privacy: 'local generation avoids sending naming patterns, project terms, or test-data requirements to a remote helper',
  },
  Security: {
    workflow: 'security review',
    input: 'headers, tokens, policies, URLs, credentials, or security-related text you want to inspect',
    output: 'a safer summary, warning list, or masked result for the next review step',
    privacy: 'security checks frequently involve secrets, internal hosts, auth data, and customer-adjacent context, so the local-first model matters',
  },
  Testers: {
    workflow: 'testing and validation',
    input: 'representative examples, edge cases, and expected or unexpected values',
    output: 'a quick read on whether the example passes, matches, differs, or needs attention',
    privacy: 'test inputs often come from logs, support cases, payloads, or unpublished implementation details that are better kept in the browser',
  },
  Developer: {
    workflow: 'developer workflow review',
    input: 'code-adjacent text such as manifests, specs, diffs, configs, scripts, requests, logs, or generated artifacts',
    output: 'a smaller review surface that helps you decide the next engineering step',
    privacy: 'developer snippets can reveal internal package names, endpoints, build output, or architecture details, so local review is a safer first pass',
  },
  AI: {
    workflow: 'AI workflow design and review',
    input: 'prompts, outputs, traces, schemas, eval cases, source text, or scenario notes',
    output: 'a clearer artifact for prompt iteration, evaluation, safety review, or model-workflow planning',
    privacy: 'AI workflow material can include draft prompts, evaluation data, source excerpts, or internal operating instructions, so local iteration is useful',
  },
};

const categoryUseCases: Record<ToolDefinition['category'], GuideSection[]> = {
  Formatters: [
    { title: 'Debugging copied output', body: 'Clean formatting makes noisy payloads, stack traces, markup, and CLI output easier to inspect before you decide what broke.' },
    { title: 'Pull request review', body: 'Normalized snippets are easier for reviewers to scan, compare, and discuss without being distracted by spacing or wrapping.' },
    { title: 'Documentation cleanup', body: 'Use the cleaned result as a more readable example in internal docs, tickets, release notes, or support handoffs.' },
  ],
  Encoders: [
    { title: 'Payload inspection', body: 'Decode copied values before assuming what they contain, especially when they came from headers, URLs, email bodies, or tokens.' },
    { title: 'Safe fixture setup', body: 'Encode small examples locally when you need repeatable fixtures for tests, demos, or documentation.' },
    { title: 'Integration debugging', body: 'Round-trip values when a downstream system expects a specific encoding but the source text is easier to read in plain form.' },
  ],
  Converters: [
    { title: 'Moving data between tools', body: 'Convert the same information into the shape expected by another script, spreadsheet, API, document, or issue template.' },
    { title: 'Preparing fixtures', body: 'Turn rough copied examples into the format your test harness, import flow, or demo needs.' },
    { title: 'Cross-platform cleanup', body: 'Normalize values that behave differently across systems, shells, docs, or runtime environments.' },
  ],
  Generators: [
    { title: 'Fixture creation', body: 'Generate safe placeholder values when production data would be risky, noisy, or unnecessary.' },
    { title: 'Demo setup', body: 'Create realistic enough examples for walkthroughs, screenshots, QA passes, and product discussions.' },
    { title: 'Planning and drafting', body: 'Use generated options as a starting point, then trim or adapt them for the actual workflow.' },
  ],
  Security: [
    { title: 'Pre-share review', body: 'Check sensitive text before it moves into tickets, chat, pull requests, vendor support, or public forums.' },
    { title: 'Incident triage', body: 'Summarize risky headers, tokens, policy gaps, or credential-like values while keeping the original snippet close.' },
    { title: 'Security hygiene checks', body: 'Use quick local checks to spot missing controls before escalating to deeper application or infrastructure review.' },
  ],
  Testers: [
    { title: 'Validation design', body: 'Try realistic positive and negative examples before a pattern, rule, or expectation lands in code.' },
    { title: 'Regression review', body: 'Compare behavior across old and new examples to catch unintended changes before a release.' },
    { title: 'Script preparation', body: 'Preview the result locally before turning the same logic into a migration, test, or automation step.' },
  ],
  Developer: [
    { title: 'Implementation planning', body: 'Turn a large technical artifact into a smaller review surface before assigning work or writing code.' },
    { title: 'Release preparation', body: 'Summarize manifests, specs, requests, build output, and compatibility signals before shipping.' },
    { title: 'Debugging handoffs', body: 'Create cleaner evidence for issues, incidents, and teammate handoffs without exposing more context than needed.' },
  ],
  AI: [
    { title: 'Prompt iteration', body: 'Refine prompts, variables, schemas, and examples before sending work into a live model workflow.' },
    { title: 'Evaluation setup', body: 'Prepare source text, test cases, scoring rubrics, and comparisons so AI output can be reviewed consistently.' },
    { title: 'Safety review', body: 'Check for injection, leakage, unsupported claims, weak grounding, and tool-use risk before an AI workflow reaches users.' },
  ],
};

const categoryMistakes: Record<ToolDefinition['category'], string[]> = {
  Formatters: [
    'Treating cleaner formatting as proof that the underlying data is correct.',
    'Sharing formatted output before checking for secrets, emails, internal URLs, or customer-linked identifiers.',
    'Skipping the next review step when the cleaned result points to a schema, diff, or validation problem.',
  ],
  Encoders: [
    'Assuming encoded text is encrypted or safe to share.',
    'Dropping padding, separators, or copied characters before confirming the transformed value still round-trips.',
    'Reusing decoded tokens or credentials in shared screenshots, docs, or tickets.',
  ],
  Converters: [
    'Converting only the happy-path sample and missing empty values, separators, time zones, or platform-specific edge cases.',
    'Pasting converted output into production workflows without checking the target format expectations.',
    'Ignoring whether identifiers or copied rows should be redacted first.',
  ],
  Generators: [
    'Using generated placeholder data as if it were production-safe validation evidence.',
    'Forgetting to tune count, length, range, or seed options before copying the result.',
    'Generating secrets for real systems without following the owning system’s rotation and storage process.',
  ],
  Security: [
    'Treating a quick local check as a full security audit.',
    'Sharing the raw input alongside the safer output.',
    'Ignoring context-specific risks that automated heuristics cannot know about.',
  ],
  Testers: [
    'Testing only examples that should pass and forgetting counterexamples.',
    'Moving a rule into code before checking whitespace, casing, empty input, and unusually long values.',
    'Assuming a preview covers every runtime or language-specific behavior.',
  ],
  Developer: [
    'Using a summary as a substitute for reading the source artifact when the change is high risk.',
    'Forgetting that generated snippets and reviews may need project-specific edits before use.',
    'Sharing manifests, endpoints, or build output before removing sensitive internal context.',
  ],
  AI: [
    'Treating local heuristics as a definitive model-quality measurement.',
    'Testing only polished examples instead of including messy, ambiguous, or adversarial cases.',
    'Copying prompts, source text, or traces into external systems before checking policy and privacy expectations.',
  ],
};

function buildGeneratedGuide(tool: ToolDefinition): ToolGuide {
  const categoryCopy = categoryWorkflowCopy[tool.category];

  return {
    slug: tool.id,
    toolId: tool.id,
    title: `How to use the ${tool.name}`,
    summary: `${tool.description} Use this guide to run the workflow cleanly and move the result into your next review, test, or implementation step.`,
    metaDescription: `Learn how to use UtilityHub ${tool.name} for local ${categoryCopy.workflow} workflows with practical steps, privacy notes, and common mistakes to avoid.`,
    intro:
      `${tool.name} helps with ${categoryCopy.workflow} when a small copied artifact is blocking the next decision. This guide shows a practical way to use it with real work, not just a toy example.`,
    whenToUse: [
      `You need to work with ${categoryCopy.input}.`,
      `You want ${categoryCopy.output} before sharing, testing, documenting, or implementing anything else.`,
      `You are handling work that benefits from a browser-local pass before it leaves your machine.`,
    ],
    steps: [
      {
        title: 'Start with a realistic example',
        body: `Open the live ${tool.name} and use input that looks like the real thing you are reviewing. Representative examples make the result more trustworthy than a tiny sample.`,
      },
      {
        title: 'Adjust the options for the workflow',
        body: 'Use the available modes, fields, toggles, or settings to match the way the result will be used next. Keep the original nearby until the output looks right.',
      },
      {
        title: 'Review the result before copying it',
        body: 'Check warnings, counts, previews, summaries, and edge cases. The goal is to understand the output, not just produce it.',
      },
      {
        title: 'Move the cleaned result into the next step',
        body: 'Copy the reviewed output into your test, ticket, docs page, pull request, prompt, or implementation workflow once it matches the shape you need.',
      },
    ],
    useCases: categoryUseCases[tool.category],
    mistakes: categoryMistakes[tool.category],
    privacyNote:
      `UtilityHub runs this workflow in the browser for normal use. That matters because ${categoryCopy.privacy}.`,
    faqs: [
      {
        question: `What should I prepare before using ${tool.name}?`,
        answer:
          `Bring a realistic sample, expected output shape, and at least one edge case. For ${tool.category.toLowerCase()} workflows, the edge case is often what proves whether the result is useful.`,
      },
      {
        question: 'Can I use the result directly in production?',
        answer:
          'Use the result as a reviewed starting point. For production changes, still apply your normal code review, security review, testing, and approval process.',
      },
    ],
    relatedToolIds: tools
      .filter((entry) => entry.id !== tool.id && entry.category === tool.category)
      .slice(0, 3)
      .map((entry) => entry.id),
  };
}

const authoredGuideByToolId = new Map(authoredToolGuides.map((guide) => [guide.toolId, guide]));

export const toolGuides: ToolGuide[] = tools.map((tool) => authoredGuideByToolId.get(tool.id) ?? buildGeneratedGuide(tool));

export const guideBySlug = new Map(toolGuides.map((guide) => [guide.slug, guide]));
export const guideByToolId = new Map(toolGuides.map((guide) => [guide.toolId, guide]));

export function getToolById(toolId: string): ToolDefinition | undefined {
  return toolLookup.get(toolId);
}

export function getGuideForToolPath(pathname: string): ToolGuide | undefined {
  const tool = tools.find((entry) => entry.path === pathname);
  if (!tool) {
    return undefined;
  }

  return guideByToolId.get(tool.id);
}

export function getRelatedTools(guide: ToolGuide): ToolDefinition[] {
  return guide.relatedToolIds
    .map((toolId) => toolLookup.get(toolId))
    .filter((tool): tool is ToolDefinition => Boolean(tool));
}
