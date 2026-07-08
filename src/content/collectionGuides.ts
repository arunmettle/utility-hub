export interface CollectionGuideSection {
  title: string;
  body: string;
  toolIds: string[];
}

export interface CollectionGuideContent {
  summary: string;
  intro: string;
  useCases: string[];
  sections: CollectionGuideSection[];
  closing: string;
}

export const collectionGuideBySlug = new Map<string, CollectionGuideContent>([
  [
    'civil-construction',
    {
      summary: 'A civil and construction collection for revision review, hydraulic checks, takeoff comparisons, and clearer formula lookup.',
      intro:
        'Civil and construction teams often work across drawings, BOQ exports, takeoffs, hydraulic checks, and quick engineering formulas that are too important for guesswork but too small for heavyweight software every time. This collection gives those recurring tasks a lighter browser-local home.',
      useCases: [
        'You need to compare revision text from drawings, notes, or schedules before a coordination meeting.',
        'You want a fast pressure-drop or head-loss sense check during concept, tender, or site troubleshooting work.',
        'You need to compare quantities or estimate embodied carbon from a simple export before a tender review.',
      ],
      sections: [
        {
          title: 'Review revisions before they become rework',
          body: 'Drawing Revision Diff Checker helps compare extracted notes, callouts, and schedule fragments so teams can focus on what actually changed.',
          toolIds: ['drawing-revision-diff-checker'],
        },
        {
          title: 'Handle quick hydraulic checks locally',
          body: 'Pressure Drop & Head Loss Calculator covers the fast sanity-check workflow that often happens before a model or formal calc pack is updated.',
          toolIds: ['pressure-drop-head-loss-calculator'],
        },
        {
          title: 'Compare takeoffs and embodied carbon',
          body: 'Material Takeoff + Carbon Estimator turns simple quantity rows into a readable carbon comparison before the work moves into heavier estimating software.',
          toolIds: ['material-takeoff-carbon-estimator'],
        },
        {
          title: 'Spot quantity export changes',
          body: 'BOQ / Quantity Diff Checker helps isolate added, removed, and changed rows across export revisions so spreadsheet review is less error-prone.',
          toolIds: ['boq-diff-checker'],
        },
        {
          title: 'Keep formulas close at hand',
          body: 'Civil Formula Finder gives a clean lookup surface for common hydraulics, earthworks, concrete, and geometry relations that often get buried in notes.',
          toolIds: ['civil-formula-finder'],
        },
      ],
      closing:
        'For civil and construction teams, the value is speed with less leakage: smaller jobs stay lightweight, local, and easier to share cleanly.',
    },
  ],
  [
    'mechanical-manufacturing',
    {
      summary: 'A mechanical-native toolkit for tolerance stacks, fits, BOM changes, revision review, formula lookup, and recurring design calculations.',
      intro:
        'Mechanical engineering work often happens in the gap between expensive CAD/CAE suites and ad hoc spreadsheets. This collection focuses on the repetitive calculation and review workflows that engineers already do in Excel, PDFs, and macros, but in a cleaner browser-local form.',
      useCases: [
        'You need to build or review a tolerance stack without inheriting another messy workbook.',
        'You want to compare two BOM or drawing revisions before release.',
        'You need a fast fit or pressure-drop sanity check before stepping into heavier tools.',
      ],
      sections: [
        {
          title: 'Own the Excel-heavy tolerance work',
          body: 'Tolerance Stack-Up Analyzer and Hole/Shaft Fit Calculator cover the dimensional-analysis work that often ends up scattered across spreadsheets, hand calcs, and handbook lookups.',
          toolIds: ['tolerance-stackup-analyzer', 'hole-shaft-fit-calculator'],
        },
        {
          title: 'Review release changes faster',
          body: 'BOM Diff Checker and Drawing Revision Diff Checker reduce the manual comparison work around released parts, changed quantities, and updated notes.',
          toolIds: ['bom-diff-checker', 'drawing-revision-diff-checker'],
        },
        {
          title: 'Handle recurring design calculations without opening heavyweight software',
          body: 'Pressure Drop & Head Loss Calculator gives a quick browser-local answer for one recurring sizing check, while Mechanical Formula Finder shortens the formula lookup work that still lives in old notes, textbooks, and personal files.',
          toolIds: ['pressure-drop-head-loss-calculator', 'mechanical-formula-finder'],
        },
      ],
      closing:
        'For mechanical teams, the wedge is not replacing CAD. It is making the spreadsheet-and-review layer around CAD faster, clearer, and easier to trust.',
    },
  ],
  [
    'electrical-power',
    {
      summary: 'A practical electrical collection for revision spotting, outage handovers, and cleaner field-ready artifacts.',
      intro:
        'Electrical teams work with revision-heavy schedules, panel notes, permits, outage planning, and field observations that often need structure more than they need another bulky platform.',
      useCases: [
        'You are checking what changed between two extracted single-line or panel-related notes.',
        'You need a tighter shift or outage handover with risk visibility preserved.',
        'You want to prepare cleaner issue evidence before it lands in a work pack or incident review.',
      ],
      sections: [
        {
          title: 'Reduce manual revision scanning',
          body: 'Drawing Revision Diff Checker is useful when schedules or revision notes change in small but important ways.',
          toolIds: ['drawing-revision-diff-checker'],
        },
        {
          title: 'Keep handovers focused on what matters',
          body: 'Shift Handover Builder structures pending actions, safety risks, and operational notes so the next shift gets a clearer picture faster.',
          toolIds: ['shift-handover-builder'],
        },
        {
          title: 'Clean field notes before sharing',
          body: 'This first version stays focused on revision review and handover. More electrical-native tools like panel schedule checks belong in the next phase.',
          toolIds: [],
        },
      ],
      closing:
        'This collection helps electrical teams spend less time reformatting context and more time resolving the real issue behind the work.',
    },
  ],
  [
    'medical-clinical',
    {
      summary: 'A privacy-first clinical starting point focused on structured handovers instead of generic reused utilities.',
      intro:
        'Medical and clinical teams often need fast, structured communication, but that does not mean every generic text or security utility belongs in their toolkit. Right now the strongest fit is a handover-focused workflow, so this collection stays intentionally narrow until more truly clinical-native tools are added.',
      useCases: [
        'You need to convert rough ward, on-call, or imaging notes into a cleaner handover.',
      ],
      sections: [
        {
          title: 'Structure the shift handover first',
          body: 'Shift Handover Builder is the anchor workflow here because it turns rough notes into grouped actions, urgent items, and a cleaner markdown summary.',
          toolIds: ['shift-handover-builder'],
        },
      ],
      closing:
        'For clinical teams, a thinner but honest collection is better than a broader one filled with tools that do not match how clinicians actually describe their work.',
    },
  ],
  [
    'mining-resources',
    {
      summary: 'A mining and resources collection for shift control, dewatering checks, revision review, and incident-ready notes.',
      intro:
        'Mining work is operational, shift-based, and document-heavy. Teams regularly need quick calculations, cleaner handovers, and better revision visibility without passing site details through extra systems.',
      useCases: [
        'You are managing shift handovers across operations, maintenance, and safety teams.',
        'You need a fast dewatering or transfer-line pressure check during troubleshooting.',
        'You want extracted revision notes from drawings or procedures to be easier to compare.',
      ],
      sections: [
        {
          title: 'Treat handover as a first-class workflow',
          body: 'Shift Handover Builder gives supervisors and crews a faster way to convert rough shift notes into clearer actions and risk highlights.',
          toolIds: ['shift-handover-builder'],
        },
        {
          title: 'Keep hydraulic checks lightweight',
          body: 'Pressure Drop & Head Loss Calculator is a practical first-wave fit for mining because water transfer and dewatering checks happen often and benefit from local execution.',
          toolIds: ['pressure-drop-head-loss-calculator'],
        },
        {
          title: 'Compare what changed before the job starts',
          body: 'Drawing Revision Diff Checker helps with procedure, permit, and drawing-pack review before the change reaches the field.',
          toolIds: ['drawing-revision-diff-checker'],
        },
      ],
      closing:
        'For mining teams, the collection is strongest where field practicality and information sensitivity overlap.',
    },
  ],
  [
    'operations-field-teams',
    {
      summary: 'A field-oriented collection for structured shift communication, revision comparison, and cleaner work-pack notes.',
      intro:
        'Operations teams often inherit the messiest inputs: rough notes, version drift, job packs, follow-ups, and timestamps. This collection is about making those artifacts more useful before they create downstream confusion.',
      useCases: [
        'You need a cleaner shift handover with pending actions and risk items separated clearly.',
        'You are comparing two procedures, permits, or note sets and only care about what changed.',
        'You want field notes to become a shareable checklist or table without more manual formatting.',
      ],
      sections: [
        {
          title: 'Structure operational context quickly',
          body: 'Shift Handover Builder helps turn freeform notes into a format the next shift can act on immediately.',
          toolIds: ['shift-handover-builder'],
        },
        {
          title: 'Focus reviews on change instead of noise',
          body: 'Drawing Revision Diff Checker creates a smaller review surface for procedures, permits, and extracted revision notes.',
          toolIds: ['drawing-revision-diff-checker'],
        },
        {
          title: 'Package rough notes into cleaner artifacts',
          body: 'Secret Redactor helps the handover or work-pack output stay safer to share when sensitive identifiers or internal references appear in the notes.',
          toolIds: ['secret-redactor'],
        },
      ],
      closing:
        'This collection is useful whenever operational work is slowed down less by missing systems and more by messy inputs between systems.',
    },
  ],
  [
    'web-designers',
    {
      summary: 'A browser-local collection for design polish, lightweight asset prep, and cleaner handoff material.',
      intro:
        'Web designers often bounce between color work, placeholder copy, links, markdown fragments, and review-ready assets. This collection keeps those small jobs in one place so layout work keeps moving without opening a stack of heavyweight apps.',
      useCases: [
        'You need color, copy, and link cleanup while building or reviewing a page.',
        'You want quick placeholder content or a shareable asset for a design review.',
        'You are preparing handoff material and want the text and supporting assets to look cleaner.',
      ],
      sections: [
        {
          title: 'Polish content before it reaches the layout',
          body: 'Markdown Studio, Markdown Table Builder, Lorem Ipsum Generator, and Link Extractor help turn rough content into cleaner blocks that are easier to place inside a page or a prototype.',
          toolIds: ['markdown-studio', 'markdown-table-builder', 'lorem-ipsum-generator', 'link-extractor'],
        },
        {
          title: 'Move faster on visual system work',
          body: 'Color Palette Generator, Color Format Converter, and Slugify Studio reduce the repetitive cleanup that happens when colors, labels, and asset names need to stay consistent across files and handoff notes.',
          toolIds: ['color-palette-generator', 'color-format-converter', 'slugify-studio'],
        },
        {
          title: 'Create light review assets without leaving the browser',
          body: 'QR Code Generator, Video to GIF Studio, and HTML Entity Studio are useful when a review needs a quick scannable asset, a simple motion snippet, or encoded content for embed-heavy work.',
          toolIds: ['qr-code-generator', 'video-to-gif-studio', 'html-entity-studio'],
        },
      ],
      closing:
        'For design teams, the value is not one big workflow. It is the ability to remove ten small sources of friction that slow down iteration and handoff every day.',
    },
  ],
  [
    'web-developers',
    {
      summary: 'A practical toolkit for request shaping, route checks, payload cleanup, and everyday browser-side development work.',
      intro:
        'Web developers regularly deal with messy payloads, copied request blocks, route patterns, and quick string transformations that are too small for an IDE task but still worth doing properly. This collection shortens that gap.',
      useCases: [
        'You are moving between frontend and backend work and need to inspect copied payloads quickly.',
        'You want to validate a route, request example, or regex before using it in code.',
        'You need a one-screen utility that removes friction without sending data to an external service.',
      ],
      sections: [
        {
          title: 'Clean the raw inputs before implementation starts',
          body: 'JSON Formatter, HTTP Request Formatter, Curl to Code Converter, and Query String Studio make copied examples easier to trust, review, and reuse during feature work.',
          toolIds: ['json-formatter', 'http-request-formatter', 'curl-to-code-converter', 'query-string-studio'],
        },
        {
          title: 'Check patterns and routing logic quickly',
          body: 'Regex Tester and URL Pattern Tester are useful when route handling or validation logic is still changing and you want confidence before it lands in code.',
          toolIds: ['regex-tester', 'url-pattern-tester'],
        },
        {
          title: 'Handle the small but constant cleanup tasks',
          body: 'Case Converter, Timestamp Converter, Gitignore Builder, and OpenAPI Summary help with the repetitive formatting and documentation-adjacent work that surrounds implementation.',
          toolIds: ['case-converter', 'timestamp-converter', 'gitignore-builder', 'openapi-summary'],
        },
      ],
      closing:
        'For web developers, this collection works best as a fast staging area between copied source material and production code.',
    },
  ],
  [
    'frontend-developers',
    {
      summary: 'A frontend-focused set for UI-facing formatting, delivery review, route checks, and browser-side security context.',
      intro:
        'Frontend work is full of small fragments that have to be cleaned, compared, and checked before they reach the UI. This collection helps with those moments without pulling you out of the browser.',
      useCases: [
        'You are reviewing app-facing text, markup, routes, or tokens before they land in the UI.',
        'You want to compare outputs or format code fragments while implementing a screen.',
        'You need lightweight browser security checks during frontend delivery work.',
      ],
      sections: [
        {
          title: 'Keep UI-facing code and content tidy',
          body: 'HTML Formatter, CSS Formatter, Markdown Formatter, and Text Diff Checker help when copied snippets or content blocks need a cleaner shape before they are committed or reviewed.',
          toolIds: ['html-formatter', 'css-formatter', 'markdown-formatter', 'text-diff-checker'],
        },
        {
          title: 'Handle design-to-code details with less churn',
          body: 'Color Format Converter, Color Palette Generator, and URL Pattern Tester cover the little details that often slow down polish, routing, and component-level cleanup.',
          toolIds: ['color-format-converter', 'color-palette-generator', 'url-pattern-tester'],
        },
        {
          title: 'Add delivery and browser security awareness',
          body: 'JWT Decoder, Bundle Size Calculator, and CSP Policy Inspector are helpful when a frontend change touches auth, payload weight, or security headers at the browser edge.',
          toolIds: ['jwt-decoder', 'bundle-size-calculator', 'csp-policy-inspector'],
        },
      ],
      closing:
        'This collection is useful when frontend work is not blocked by large architecture decisions, but by dozens of tiny cleanup and review tasks around the UI.',
    },
  ],
  [
    'backend-developers',
    {
      summary: 'A backend toolkit for API review, schema checks, contract drift, auth inspection, and integration debugging.',
      intro:
        'Backend teams spend a surprising amount of time on copied payloads, specs, headers, auth details, and breaking-change questions. This collection groups those jobs into a faster local workflow.',
      useCases: [
        'You are debugging an API issue across payloads, headers, and contracts.',
        'You want to inspect auth or signing details without moving sensitive values around.',
        'You need to summarize or compare API behavior before shipping a change.',
      ],
      sections: [
        {
          title: 'Understand requests, responses, and specs faster',
          body: 'JSON Formatter, OpenAPI Summary, Curl to Code Converter, and Webhook Payload Inspector help backend engineers turn messy integration data into something readable and actionable.',
          toolIds: ['json-formatter', 'openapi-summary', 'curl-to-code-converter', 'webhook-payload-inspector'],
        },
        {
          title: 'Check structure and compatibility before it becomes a production issue',
          body: 'JSON Schema Generator, Semantic Version Calculator, and Breaking Change Detector are useful when a contract is evolving and you want to reduce surprise for consumers.',
          toolIds: ['json-schema-generator', 'semantic-version-calculator', 'breaking-change-detector'],
        },
        {
          title: 'Inspect auth, headers, and signing details locally',
          body: 'HTTP Header Inspector, JWT Expiry Checker, and HMAC Generator help with the operational side of backend work when the question is not the business logic but the transport details around it.',
          toolIds: ['http-header-inspector', 'jwt-expiry-checker', 'hmac-generator'],
        },
      ],
      closing:
        'For backend teams, the strongest use of this collection is during integration work, incident review, and any change where contract clarity matters.',
    },
  ],
  [
    'business-analysts',
    {
      summary: 'A structured-output toolkit for turning rough extracts into tables, notes, checklists, and stakeholder-ready summaries.',
      intro:
        'Business analysts often sit between raw technical material and the polished artifacts other teams need. This collection helps convert copied output into cleaner planning, comparison, and communication formats.',
      useCases: [
        'You need to turn rough notes or extracts into a cleaner artifact for review.',
        'You want to compare versions of scope, output, or requirements with less noise.',
        'You are translating technical details into tables and summaries for stakeholders.',
      ],
      sections: [
        {
          title: 'Create planning and review artifacts quickly',
          body: 'Markdown Checklist Builder, Markdown Table Builder, Release Note Generator, and Markdown Studio are useful when the job is to convert working notes into something the team can act on.',
          toolIds: ['markdown-checklist-builder', 'markdown-table-builder', 'release-note-generator', 'markdown-studio'],
        },
        {
          title: 'Compare inputs before decisions are made',
          body: 'Text Diff Checker and Query String Studio help when a change is small but important and you need to see exactly what moved.',
          toolIds: ['text-diff-checker', 'query-string-studio'],
        },
        {
          title: 'Reshape extracts into stakeholder-friendly formats',
          body: 'CSV JSON Studio, SQL Result to Markdown Table, Link Extractor, and Test Case Title Generator are useful when the source material is technical but the output needs to be easier to read and share.',
          toolIds: ['csv-json-studio', 'sql-result-to-markdown-table', 'link-extractor', 'test-case-title-generator'],
        },
      ],
      closing:
        'This collection helps analysts spend less time cleaning source material and more time clarifying the decision that needs to be made.',
    },
  ],
  [
    'manual-testers',
    {
      summary: 'A manual testing collection for fixture prep, evidence cleanup, request review, and defect-ready comparisons.',
      intro:
        'Manual testers frequently need to explain what happened, show the evidence cleanly, and compare expected and actual behavior without losing detail. This collection supports those workflows directly.',
      useCases: [
        'You are preparing bug evidence from headers, payloads, or HAR files.',
        'You need realistic fixtures or cleaner examples for a test run.',
        'You want to compare outputs quickly before writing up a defect.',
      ],
      sections: [
        {
          title: 'Turn noisy evidence into cleaner defect material',
          body: 'Text Diff Checker, Header Diff Checker, HAR Request Extractor, and Webhook Payload Inspector are especially useful when bug evidence exists but is still too messy to share well.',
          toolIds: ['text-diff-checker', 'header-diff-checker', 'har-request-extractor', 'webhook-payload-inspector'],
        },
        {
          title: 'Inspect response details without extra setup',
          body: 'HTTP Status Tester, JSON Path Explorer, and Log Level Analyzer help testers isolate the part of the response or log output that matters most to the issue.',
          toolIds: ['http-status-tester', 'json-path-explorer', 'log-level-analyzer'],
        },
        {
          title: 'Generate better examples and titles for test work',
          body: 'Media Fixture Generator, Email Validator, and Test Case Title Generator save time when the missing piece is a clean input, a plausible file, or a clearer way to name the scenario.',
          toolIds: ['media-fixture-generator', 'email-validator', 'test-case-title-generator'],
        },
      ],
      closing:
        'For manual QA, the main value is stronger evidence quality with less ad hoc cleanup outside the browser.',
    },
  ],
  [
    'automation-testers',
    {
      summary: 'A compact automation-testing toolkit for patterns, assertions, CI wiring, and fixture-friendly request data.',
      intro:
        'Automation teams often need to validate a pattern or payload before it becomes code, and they need to do it repeatedly. This collection keeps those fast checks close to the browser.',
      useCases: [
        'You are testing selectors, replacements, routes, or data paths before hard-coding them.',
        'You want to validate workflow files and request examples around an automated run.',
        'You need fixtures and comparisons that are easier to reason about during regression work.',
      ],
      sections: [
        {
          title: 'Test patterns before they become brittle code',
          body: 'Regex Tester, Regex Replace Tester, JSON Pointer Tester, and URL Pattern Tester help uncover bad assumptions early, before they are embedded inside a suite.',
          toolIds: ['regex-tester', 'regex-replace-tester', 'json-pointer-tester', 'url-pattern-tester'],
        },
        {
          title: 'Compare outputs and request data with less friction',
          body: 'JSON Value Comparator, HAR Request Extractor, and HTTP Request Formatter help when assertions or mocks are failing and the copied source material needs cleanup first.',
          toolIds: ['json-value-comparator', 'har-request-extractor', 'http-request-formatter'],
        },
        {
          title: 'Check the workflow around the automation',
          body: 'GitHub Actions Validator, Media Fixture Generator, and Semver Range Tester are useful when the test code itself is fine but the surrounding CI, fixture, or dependency setup still needs review.',
          toolIds: ['github-actions-validator', 'media-fixture-generator', 'semver-range-tester'],
        },
      ],
      closing:
        'This collection helps automation engineers shorten the path from copied failure context to a more reliable test change.',
    },
  ],
  [
    'performance-testers',
    {
      summary: 'A practical collection for reading timings, shaping raw results, and summarizing performance findings clearly.',
      intro:
        'Performance work usually begins with raw logs, timings, payload sizes, and response fragments that are not yet ready for discussion. This collection helps turn that output into something teams can reason about faster.',
      useCases: [
        'You are interpreting raw results from a performance run.',
        'You need to convert timings, sizes, or extracts into a more readable summary.',
        'You want to prepare performance findings for engineering review without spreadsheet-heavy cleanup.',
      ],
      sections: [
        {
          title: 'Make raw metrics easier to read',
          body: 'Byte Size Converter, Duration Converter, Timestamp Converter, and Bundle Size Calculator help when a result set is technically correct but still awkward to interpret quickly.',
          toolIds: ['byte-size-converter', 'duration-converter', 'timestamp-converter', 'bundle-size-calculator'],
        },
        {
          title: 'Extract the useful parts from logs and traffic',
          body: 'Log Level Analyzer, HAR Request Extractor, and HTTP Header Inspector are useful when the goal is to isolate the signal inside a broader run artifact.',
          toolIds: ['log-level-analyzer', 'har-request-extractor', 'http-header-inspector'],
        },
        {
          title: 'Share results in a format people can act on',
          body: 'OpenAPI Summary, CSV JSON Studio, and Markdown Table Builder help shape technical findings into summaries, tables, and comparison material for the rest of the team.',
          toolIds: ['openapi-summary', 'csv-json-studio', 'markdown-table-builder'],
        },
      ],
      closing:
        'For performance teams, the collection is most valuable when results are available but the story behind those results is still hard to see.',
    },
  ],
  [
    'load-stress-testers',
    {
      summary: 'A local-first set for capacity review, timing math, comparison work, and concise run summaries under pressure.',
      intro:
        'Load and stress testing generates a lot of raw output quickly. This collection helps teams compare runs, interpret pressure points, and package the important parts for follow-up.',
      useCases: [
        'You are comparing runs where the system changed behavior under load.',
        'You need quick conversions for size, duration, and timing math during analysis.',
        'You want to summarize degraded behavior clearly for engineering or incident review.',
      ],
      sections: [
        {
          title: 'Normalize metrics before comparing runs',
          body: 'Byte Size Converter, Duration Converter, Timestamp Converter, and Markdown Table Builder are useful when the first step is simply making the numbers easier to compare.',
          toolIds: ['byte-size-converter', 'duration-converter', 'timestamp-converter', 'markdown-table-builder'],
        },
        {
          title: 'Pull useful context out of raw artifacts',
          body: 'Log Level Analyzer, Query String Studio, CSV JSON Studio, and HTTP Status Tester help turn broad test output into focused run evidence.',
          toolIds: ['log-level-analyzer', 'query-string-studio', 'csv-json-studio', 'http-status-tester'],
        },
        {
          title: 'Connect run behavior back to payload and interface shape',
          body: 'Bundle Size Calculator and OpenAPI Summary are helpful when throughput, payload shape, and interface expectations all need to be read together.',
          toolIds: ['bundle-size-calculator', 'openapi-summary'],
        },
      ],
      closing:
        'This collection helps load and stress testers move from raw pressure data to clearer decisions and better engineering follow-up.',
    },
  ],
  [
    'penetration-testers',
    {
      summary: 'A browser-local security review collection for tokens, headers, redirects, cookies, and safer reporting excerpts.',
      intro:
        'Penetration testers often need to inspect security-relevant artifacts quickly while keeping sensitive values contained. This collection is built around that type of browser-side review work.',
      useCases: [
        'You are checking tokens, headers, redirects, or cookies during web security review.',
        'You want fast visibility into common policy and auth-adjacent issues.',
        'You need safer excerpts for reporting and collaboration after the finding is identified.',
      ],
      sections: [
        {
          title: 'Inspect auth and session artifacts locally',
          body: 'JWT Decoder, JWT Expiry Checker, Cookie Security Inspector, and Secret Redactor help when session and token details need to be understood without spreading raw values further.',
          toolIds: ['jwt-decoder', 'jwt-expiry-checker', 'cookie-security-inspector', 'secret-redactor'],
        },
        {
          title: 'Review browser-facing security posture quickly',
          body: 'CORS Policy Inspector, CSP Policy Inspector, HTTP Header Inspector, and Security.txt Inspector are useful for fast checks around common web-facing security signals.',
          toolIds: ['cors-policy-inspector', 'csp-policy-inspector', 'http-header-inspector', 'security-txt-inspector'],
        },
        {
          title: 'Trace risky destinations and leaked configuration details',
          body: 'Open Redirect Checker and ENV File Inspector help when the issue is not only what the app does, but what it exposes or where it can be pushed.',
          toolIds: ['open-redirect-checker', 'env-file-inspector'],
        },
      ],
      closing:
        'For penetration testers, the collection is most useful as a fast triage and reporting aid around copied artifacts from a live assessment.',
    },
  ],
  [
    'devops-engineers',
    {
      summary: 'A delivery-focused toolkit for Docker, workflow YAML, environment review, cron hygiene, and release readiness.',
      intro:
        'DevOps work often involves checking configuration and delivery artifacts quickly before they create problems in CI, release pipelines, or runtime environments. This collection keeps those checks lightweight and local.',
      useCases: [
        'You are reviewing Docker, compose, workflow, or environment files before deployment.',
        'You need a faster way to sanity-check small infrastructure snippets during delivery work.',
        'You want to summarize config-adjacent issues clearly for teammates.',
      ],
      sections: [
        {
          title: 'Catch common delivery hygiene issues early',
          body: 'Docker Optimizer, Docker Compose Auditor, GitHub Actions Validator, and ENV File Inspector help identify obvious friction before the change hits CI or runtime.',
          toolIds: ['docker-optimizer', 'docker-compose-auditor', 'github-actions-validator', 'env-file-inspector'],
        },
        {
          title: 'Handle versioning and scheduling details with less guesswork',
          body: 'Cron Expression Explainer, Semantic Version Calculator, and Gitignore Builder are useful for the small but recurring decisions that surround release and environment work.',
          toolIds: ['cron-expression-explainer', 'semantic-version-calculator', 'gitignore-builder'],
        },
        {
          title: 'Review delivery impact beyond the config file itself',
          body: 'Bundle Size Calculator, HTTP Header Inspector, and Signed URL Inspector help when a deployment question also touches asset delivery, traffic behavior, or secure access patterns.',
          toolIds: ['bundle-size-calculator', 'http-header-inspector', 'signed-url-inspector'],
        },
      ],
      closing:
        'This collection is valuable when the work is not building infrastructure from scratch, but keeping delivery clean and predictable every day.',
    },
  ],
  [
    'secops-engineers',
    {
      summary: 'A security operations collection for secret handling, policy review, header hygiene, and auth-adjacent investigation.',
      intro:
        'SecOps teams frequently review copied headers, tokens, signed links, cookies, and other artifacts that should be understood quickly and shared carefully. This collection is built around that workflow.',
      useCases: [
        'You need to review web-facing security signals from copied config or headers.',
        'You want to mask sensitive material before it spreads across support and engineering channels.',
        'You are checking auth, policy, or exposure details without relying on an external analyzer.',
      ],
      sections: [
        {
          title: 'Protect sensitive material during investigation',
          body: 'Secret Redactor and API Key Fingerprinter help teams collaborate on real examples without carelessly passing full secrets around.',
          toolIds: ['secret-redactor', 'api-key-fingerprinter'],
        },
        {
          title: 'Inspect browser and policy signals in one place',
          body: 'Password Policy Inspector, Cookie Security Inspector, CSP Policy Inspector, CORS Policy Inspector, and HTTP Header Inspector are useful when the goal is to quickly understand posture from copied artifacts.',
          toolIds: ['password-policy-inspector', 'cookie-security-inspector', 'csp-policy-inspector', 'cors-policy-inspector', 'http-header-inspector'],
        },
        {
          title: 'Review access and disclosure paths around the edge',
          body: 'Signed URL Inspector, Open Redirect Checker, and Security.txt Inspector help when a finding touches access flows, redirect behavior, or disclosure hygiene.',
          toolIds: ['signed-url-inspector', 'open-redirect-checker', 'security-txt-inspector'],
        },
      ],
      closing:
        'For SecOps, this collection is most effective as a fast investigation layer between copied evidence and a clearer security decision.',
    },
  ],
  [
    'ai-engineers',
    {
      summary: 'A browser-local AI workflow collection for prompt changes, eval runs, schema checks, safety review, and output repair.',
      intro:
        'AI teams often have the model call already working. The friction comes from prompt drift, eval setup, schema reliability, cost awareness, and safety review. This collection groups those recurring jobs together.',
      useCases: [
        'You are iterating on prompts and need a cleaner way to compare changes.',
        'You want to validate output structure, tool-call payloads, or evaluation criteria.',
        'You need safety and quality review without creating more operational sprawl.',
      ],
      sections: [
        {
          title: 'Manage prompt iteration as a real workflow',
          body: 'Prompt Studio, Prompt Diff Checker, and Prompt Test Runner help teams move from ad hoc edits to more traceable prompt changes and testable examples.',
          toolIds: ['prompt-studio', 'prompt-diff-checker', 'prompt-test-runner'],
        },
        {
          title: 'Add structure and measurement around outputs',
          body: 'Prompt Eval Scorecard, Structured Output Schema Builder, Function Calling Schema Tester, and Token Cost Estimator are useful when the question is whether the AI workflow is actually reliable and affordable.',
          toolIds: ['prompt-eval-scorecard', 'structured-output-schema-builder', 'function-calling-schema-tester', 'token-cost-estimator'],
        },
        {
          title: 'Review failure modes and cleanup paths',
          body: 'Output Repair Studio, RAG Chunk Previewer, and Jailbreak Prompt Injection Checker help with the practical quality and safety issues that appear once prompts reach real data and real users.',
          toolIds: ['output-repair-studio', 'rag-chunk-previewer', 'jailbreak-prompt-injection-checker'],
        },
      ],
      closing:
        'This collection is strongest when AI work needs to become more repeatable, measurable, and easier to share across a team.',
    },
  ],
  [
    'product-owners',
    {
      summary: 'A product-focused collection for cleaner change notes, comparison work, stakeholder summaries, and planning artifacts.',
      intro:
        'Product owners often receive technical fragments that need to become clearer decisions, cleaner updates, and more aligned planning material. This collection supports that translation work.',
      useCases: [
        'You are turning technical change notes into something easier to discuss and prioritize.',
        'You want to compare versions of output, scope, or behavior with less noise.',
        'You need a faster path from raw inputs to stakeholder-ready communication.',
      ],
      sections: [
        {
          title: 'Shape planning and release communication quickly',
          body: 'Markdown Checklist Builder, Release Note Generator, Markdown Table Builder, and Markdown Studio help product work move from rough notes to clearer artifacts.',
          toolIds: ['markdown-checklist-builder', 'release-note-generator', 'markdown-table-builder', 'markdown-studio'],
        },
        {
          title: 'Compare changes before socializing them',
          body: 'Text Diff Checker and CSV JSON Studio are useful when the key question is what changed and whether the difference actually matters to the roadmap or release.',
          toolIds: ['text-diff-checker', 'csv-json-studio'],
        },
        {
          title: 'Bridge technical detail and product framing',
          body: 'Test Case Title Generator, Link Extractor, Slugify Studio, and OpenAPI Summary help convert technical inputs into cleaner references and shareable summaries.',
          toolIds: ['test-case-title-generator', 'link-extractor', 'slugify-studio', 'openapi-summary'],
        },
      ],
      closing:
        'For product owners, the collection helps reduce translation overhead between technical change and product-level alignment.',
    },
  ],
  [
    'scrum-masters',
    {
      summary: 'A facilitation-first toolkit for running more engaging ceremonies, keeping action items visible, and shaping delivery information from sprint systems into something the team can use.',
      intro:
        'Scrum masters usually lean less on deep technical utilities and more on tools that help them facilitate sessions, rotate participation, capture actions cleanly, and make delivery information easier for the team to understand. This collection has been reframed around that reality using the closest-fit tools already in UtilityHub.',
      useCases: [
        'You want a lightweight way to vary speaking order or select people randomly during standups, retros, or refinement sessions.',
        'You need better ceremony outputs like action trackers, working agreements, or follow-up summaries without adding more admin overhead.',
        'You are pulling sprint or delivery information out of Azure DevOps, Jira, or another ALM tool and need to reshape it into something the team can review quickly.',
      ],
      sections: [
        {
          title: 'Keep ceremonies active and participation balanced',
          body: 'Random Number Generator can be used as a simple rotation helper for speaker order, pairing order, or choosing who goes first. QR Code Generator helps you drop quick access links into live workshops so people can join a board, form, or note page without friction.',
          toolIds: ['random-number-generator', 'qr-code-generator'],
        },
        {
          title: 'Capture outcomes without creating more admin work',
          body: 'Markdown Checklist Builder, Markdown Table Builder, Markdown Studio, and Link Extractor help turn retro actions, working agreements, parking-lot items, and follow-ups into clean artifacts that can be reused in the next ceremony.',
          toolIds: ['markdown-checklist-builder', 'markdown-table-builder', 'markdown-studio', 'link-extractor'],
        },
        {
          title: 'Make sprint and ALM data easier to discuss',
          body: 'CSV JSON Studio, Release Note Generator, Timestamp Converter, and Duration Converter are useful when Azure DevOps or other ALM exports need to be turned into cleaner delivery summaries, timeline views, or sprint review notes.',
          toolIds: ['csv-json-studio', 'release-note-generator', 'timestamp-converter', 'duration-converter'],
        },
      ],
      closing:
        'This collection is a much better fit when treated as a facilitation and delivery-support toolkit. The next obvious additions for Scrum Masters should be a team spinner wheel, retro prompt generator, ceremony timer, and Azure DevOps dashboard helper.',
    },
  ],
  [
    'data-engineers-and-analysts',
    {
      summary: 'A local-first data workflow collection for tabular cleanup, SQL formatting, JSON inspection, and documentation-ready outputs.',
      intro:
        'Data engineers and analysts constantly move between CSV, JSON, JSONL, SQL, and markdown tables. This collection helps with the transformation and visibility work that surrounds those formats.',
      useCases: [
        'You are cleaning up extracts before analysis, documentation, or review.',
        'You need to move between tabular and nested formats quickly.',
        'You want a faster way to inspect structure without opening a larger data environment.',
      ],
      sections: [
        {
          title: 'Move cleanly between tabular and structured formats',
          body: 'CSV JSON Studio, Delimiter Converter, List JSON Converter, and JSON Lines Studio help when the same dataset has to be reshaped for different consumers.',
          toolIds: ['csv-json-studio', 'delimiter-converter', 'list-json-converter', 'json-lines-studio'],
        },
        {
          title: 'Inspect nested data and schema shape quickly',
          body: 'JSON Formatter and JSON Path Explorer are useful when the challenge is understanding the structure of an extract before doing anything else with it.',
          toolIds: ['json-formatter', 'json-path-explorer'],
        },
        {
          title: 'Prepare cleaner outputs for review and documentation',
          body: 'SQL Beautifier, SQL Result to Markdown Table, Markdown Table Builder, and Timestamp Converter help turn raw technical output into something easier to read and share.',
          toolIds: ['sql-beautifier', 'sql-result-to-markdown-table', 'markdown-table-builder', 'timestamp-converter'],
        },
      ],
      closing:
        'For data teams, the collection is a useful bridge between raw extract handling and clearer communication around the data.',
    },
  ],
]);

export function getCollectionGuideBySlug(slug: string) {
  return collectionGuideBySlug.get(slug);
}
