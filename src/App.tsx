import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';

type RouteComponent = LazyExoticComponent<ComponentType>;
type AppRoute = {
  path: string;
  Component: RouteComponent;
};

function lazyNamed<T extends ComponentType>(loader: () => Promise<Record<string, T>>, name: string) {
  return lazy(async () => {
    const module = await loader();
    return { default: module[name] };
  });
}

const Home = lazy(() => import('./pages/Home'));
const CollectionsIndex = lazy(() => import('./pages/CollectionsIndex'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const MechanicalWorkspacePage = lazy(() => import('./pages/MechanicalWorkspacePage'));
const CivilWorkspacePage = lazy(() => import('./pages/CivilWorkspacePage'));
const GuidesIndex = lazy(() => import('./pages/GuidesIndex'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

const JsonFormatter = lazy(() => import('./tools/JsonFormatter'));
const IniFormatter = lazy(() => import('./tools/IniFormatter'));
const HttpRequestFormatter = lazy(() => import('./tools/HttpRequestFormatter'));
const StackTraceFormatter = lazy(() => import('./tools/StackTraceFormatter'));
const XmlFormatter = lazy(() => import('./tools/XmlFormatter'));
const HtmlFormatter = lazy(() => import('./tools/HtmlFormatter'));
const CssFormatter = lazy(() => import('./tools/CssFormatter'));
const MarkdownFormatter = lazy(() => import('./tools/MarkdownFormatter'));
const Base64Studio = lazy(() => import('./tools/Base64Studio'));
const Base64UrlStudio = lazy(() => import('./tools/Base64UrlStudio'));
const Base58Studio = lazy(() => import('./tools/Base58Studio'));
const Base32Studio = lazy(() => import('./tools/Base32Studio'));
const QuotedPrintableStudio = lazy(() => import('./tools/QuotedPrintableStudio'));
const DataUrlStudio = lazy(() => import('./tools/DataUrlStudio'));
const BasicAuthStudio = lazy(() => import('./tools/BasicAuthStudio'));
const CharacterCodeStudio = lazy(() => import('./tools/CharacterCodeStudio'));
const Rot13Studio = lazy(() => import('./tools/Rot13Studio'));
const BinaryTextStudio = lazy(() => import('./tools/BinaryTextStudio'));
const MorseCodeStudio = lazy(() => import('./tools/MorseCodeStudio'));
const HashGenerator = lazy(() => import('./tools/HashGenerator'));
const PasswordGenerator = lazy(() => import('./tools/PasswordGenerator'));
const PassphraseGenerator = lazy(() => import('./tools/PassphraseGenerator'));
const RandomNumberGenerator = lazy(() => import('./tools/RandomNumberGenerator'));
const PlanningPoker = lazy(() => import('./tools/PlanningPoker'));
const ColorPaletteGenerator = lazy(() => import('./tools/ColorPaletteGenerator'));
const NanoIdGenerator = lazy(() => import('./tools/NanoIdGenerator'));
const FakeUserGenerator = lazy(() => import('./tools/FakeUserGenerator'));
const UsernameGenerator = lazy(() => import('./tools/UsernameGenerator'));
const ApiTokenGenerator = lazy(() => import('./tools/ApiTokenGenerator'));
const ReleaseNoteGenerator = lazy(() => import('./tools/ReleaseNoteGenerator'));
const TestCaseTitleGenerator = lazy(() => import('./tools/TestCaseTitleGenerator'));
const LoremIpsumGenerator = lazy(() => import('./tools/LoremIpsumGenerator'));
const UrlStudio = lazy(() => import('./tools/UrlStudio'));
const CaseConverter = lazy(() => import('./tools/CaseConverter'));
const ByteSizeConverter = lazy(() => import('./tools/ByteSizeConverter'));
const ColorFormatConverter = lazy(() => import('./tools/ColorFormatConverter'));
const LineEndingConverter = lazy(() => import('./tools/LineEndingConverter'));
const TabsSpacesConverter = lazy(() => import('./tools/TabsSpacesConverter'));
const ListJsonConverter = lazy(() => import('./tools/ListJsonConverter'));
const DelimiterConverter = lazy(() => import('./tools/DelimiterConverter'));
const DurationConverter = lazy(() => import('./tools/DurationConverter'));
const DateDifferenceCalculator = lazy(() => import('./tools/DateDifferenceCalculator'));
const ExpiryTimeCalculator = lazy(() => import('./tools/ExpiryTimeCalculator'));
const PathSeparatorConverter = lazy(() => import('./tools/PathSeparatorConverter'));
const NumberBaseConverter = lazy(() => import('./tools/NumberBaseConverter'));
const RelativeTimeCalculator = lazy(() => import('./tools/RelativeTimeCalculator'));
const RomanNumeralConverter = lazy(() => import('./tools/RomanNumeralConverter'));
const TimeZoneConverter = lazy(() => import('./tools/TimeZoneConverter'));
const TimestampConverter = lazy(() => import('./tools/TimestampConverter'));
const TimestampBatchInspector = lazy(() => import('./tools/TimestampBatchInspector'));
const JWTDecoder = lazy(() => import('./tools/JWTDecoder'));
const JwtExpiryChecker = lazy(() => import('./tools/JwtExpiryChecker'));
const RegexTester = lazy(() => import('./tools/RegexTester'));
const RegexReplaceTester = lazy(() => import('./tools/RegexReplaceTester'));
const EmailValidator = lazy(() => import('./tools/EmailValidator'));
const JsonPointerTester = lazy(() => import('./tools/JsonPointerTester'));
const UrlPatternTester = lazy(() => import('./tools/UrlPatternTester'));
const SemverRangeTester = lazy(() => import('./tools/SemverRangeTester'));
const HttpStatusTester = lazy(() => import('./tools/HttpStatusTester'));
const QRCodeGenerator = lazy(() => import('./tools/QRCodeGenerator'));
const UuidGenerator = lazy(() => import('./tools/UuidGenerator'));
const UlidGenerator = lazy(() => import('./tools/UlidGenerator'));
const HmacGenerator = lazy(() => import('./tools/HmacGenerator'));
const QueryStringStudio = lazy(() => import('./tools/QueryStringStudio'));
const HtmlEntityStudio = lazy(() => import('./tools/HtmlEntityStudio'));
const HexStudio = lazy(() => import('./tools/HexStudio'));
const SlugifyStudio = lazy(() => import('./tools/SlugifyStudio'));
const UnicodeEscapeStudio = lazy(() => import('./tools/UnicodeEscapeStudio'));
const CsvJsonStudio = lazy(() => import('./tools/CsvJsonStudio'));
const TextDiffChecker = lazy(() => import('./tools/TextDiffChecker'));
const DockerOptimizer = lazy(() => import('./tools/DockerOptimizer'));
const GitHubActionsValidator = lazy(() => import('./tools/GitHubActionsValidator'));
const DependencyVisualizer = lazy(() => import('./tools/DependencyVisualizer'));
const BundleSizeCalculator = lazy(() => import('./tools/BundleSizeCalculator'));
const CurlToCodeConverter = lazy(() => import('./tools/CurlToCodeConverter'));
const GitignoreBuilder = lazy(() => import('./tools/GitignoreBuilder'));
const MediaFixtureGenerator = lazy(() => import('./tools/MediaFixtureGenerator'));
const VideoToGifStudio = lazy(() => import('./tools/VideoToGifStudio'));
const SqlBeautifier = lazy(() => import('./tools/SqlBeautifier'));
const SemanticVersionCalculator = lazy(() => import('./tools/SemanticVersionCalculator'));
const BreakingChangeDetector = lazy(() => import('./tools/BreakingChangeDetector'));
const HttpHeaderInspector = lazy(() => import('./tools/HttpHeaderInspector'));
const ApiKeyFingerprinter = lazy(() => import('./tools/ApiKeyFingerprinter'));
const SriHashGenerator = lazy(() => import('./tools/SriHashGenerator'));
const CorsPolicyInspector = lazy(() => import('./tools/CorsPolicyInspector'));
const CookieSecurityInspector = lazy(() => import('./tools/CookieSecurityInspector'));
const CspPolicyInspector = lazy(() => import('./tools/CspPolicyInspector'));
const SecurityTxtInspector = lazy(() => import('./tools/SecurityTxtInspector'));
const OpenRedirectChecker = lazy(() => import('./tools/OpenRedirectChecker'));
const PasswordPolicyInspector = lazy(() => import('./tools/PasswordPolicyInspector'));
const SignedUrlInspector = lazy(() => import('./tools/SignedUrlInspector'));
const JsonPathExplorer = lazy(() => import('./tools/JsonPathExplorer'));
const JsonValueComparator = lazy(() => import('./tools/JsonValueComparator'));
const HeaderDiffChecker = lazy(() => import('./tools/HeaderDiffChecker'));
const HarRequestExtractor = lazy(() => import('./tools/HarRequestExtractor'));
const WebhookPayloadInspector = lazy(() => import('./tools/WebhookPayloadInspector'));
const SqlResultToMarkdownTable = lazy(() => import('./tools/SqlResultToMarkdownTable'));
const LogLevelAnalyzer = lazy(() => import('./tools/LogLevelAnalyzer'));
const UuidExtractor = lazy(() => import('./tools/UuidExtractor'));
const LinkExtractor = lazy(() => import('./tools/LinkExtractor'));
const SecretRedactor = lazy(() => import('./tools/SecretRedactor'));
const ApiErrorFormatter = lazy(() => import('./tools/ApiErrorFormatter'));
const CronExpressionExplainer = lazy(() => import('./tools/CronExpressionExplainer'));
const DockerComposeAuditor = lazy(() => import('./tools/DockerComposeAuditor'));
const OpenApiSummary = lazy(() => import('./tools/OpenApiSummary'));
const JsonLinesStudio = lazy(() => import('./tools/JsonLinesStudio'));
const EnvFileInspector = lazy(() => import('./tools/EnvFileInspector'));
const AnsiEscapeCleaner = lazy(() => import('./tools/AnsiEscapeCleaner'));
const MarkdownChecklistBuilder = lazy(() => import('./tools/MarkdownChecklistBuilder'));
const LineDeduplicator = lazy(() => import('./tools/LineDeduplicator'));
const MarkdownTableBuilder = lazy(() => import('./tools/MarkdownTableBuilder'));
const MarkdownStudio = lazy(() => import('./tools/MarkdownStudio'));
const JsonSchemaGenerator = lazy(() => import('./tools/JsonSchemaGenerator'));
const ShiftHandoverBuilder = lazy(() => import('./tools/ShiftHandoverBuilder'));
const PressureDropHeadLossCalculator = lazy(() => import('./tools/PressureDropHeadLossCalculator'));
const DrawingRevisionDiffChecker = lazy(() => import('./tools/DrawingRevisionDiffChecker'));
const ToleranceStackupAnalyzer = lazy(() => import('./tools/ToleranceStackupAnalyzer'));
const BomDiffChecker = lazy(() => import('./tools/BomDiffChecker'));
const HoleShaftFitCalculator = lazy(() => import('./tools/HoleShaftFitCalculator'));
const MechanicalFormulaFinder = lazy(() => import('./tools/MechanicalFormulaFinder'));
const MaterialTakeoffCarbonEstimator = lazy(() => import('./tools/MaterialTakeoffCarbonEstimator'));
const BoqDiffChecker = lazy(() => import('./tools/BoqDiffChecker'));
const CivilFormulaFinder = lazy(() => import('./tools/CivilFormulaFinder'));

const loadAiWorkbench = () => import('./tools/AiWorkbench');
const PromptStudio = lazyNamed(loadAiWorkbench, 'PromptStudio');
const PromptDiffChecker = lazyNamed(loadAiWorkbench, 'PromptDiffChecker');
const PromptTestRunner = lazyNamed(loadAiWorkbench, 'PromptTestRunner');
const PromptEvalScorecard = lazyNamed(loadAiWorkbench, 'PromptEvalScorecard');
const StructuredOutputSchemaBuilder = lazyNamed(loadAiWorkbench, 'StructuredOutputSchemaBuilder');
const OutputRepairStudio = lazyNamed(loadAiWorkbench, 'OutputRepairStudio');
const JailbreakPromptInjectionChecker = lazyNamed(loadAiWorkbench, 'JailbreakPromptInjectionChecker');
const HallucinationReviewWorkspace = lazyNamed(loadAiWorkbench, 'HallucinationReviewWorkspace');
const RagChunkPreviewer = lazyNamed(loadAiWorkbench, 'RagChunkPreviewer');
const EmbeddingSimilarityExplorer = lazyNamed(loadAiWorkbench, 'EmbeddingSimilarityExplorer');
const SystemPromptBuilder = lazyNamed(loadAiWorkbench, 'SystemPromptBuilder');
const FewShotExampleOrganizer = lazyNamed(loadAiWorkbench, 'FewShotExampleOrganizer');
const PromptVariableExtractor = lazyNamed(loadAiWorkbench, 'PromptVariableExtractor');
const TokenCostEstimator = lazyNamed(loadAiWorkbench, 'TokenCostEstimator');
const LatencyQualityPlanner = lazyNamed(loadAiWorkbench, 'LatencyQualityPlanner');
const AiResponseComparator = lazyNamed(loadAiWorkbench, 'AiResponseComparator');
const SafetyPolicyTester = lazyNamed(loadAiWorkbench, 'SafetyPolicyTester');
const ToolCallPayloadValidator = lazyNamed(loadAiWorkbench, 'ToolCallPayloadValidator');
const FunctionCallingSchemaTester = lazyNamed(loadAiWorkbench, 'FunctionCallingSchemaTester');
const AgentLoopTraceViewer = lazyNamed(loadAiWorkbench, 'AgentLoopTraceViewer');
const GroundedAnswerChecker = lazyNamed(loadAiWorkbench, 'GroundedAnswerChecker');
const CitationFormatterForAiAnswers = lazyNamed(loadAiWorkbench, 'CitationFormatterForAiAnswers');
const ConversationStateSimulator = lazyNamed(loadAiWorkbench, 'ConversationStateSimulator');
const ContextWindowCompactor = lazyNamed(loadAiWorkbench, 'ContextWindowCompactor');
const PromptLeakDetector = lazyNamed(loadAiWorkbench, 'PromptLeakDetector');
const ConsistencyRunner = lazyNamed(loadAiWorkbench, 'ConsistencyRunner');
const BestOfNComparisonTool = lazyNamed(loadAiWorkbench, 'BestOfNComparisonTool');
const BatchEvalDatasetBuilder = lazyNamed(loadAiWorkbench, 'BatchEvalDatasetBuilder');
const SyntheticTestCaseGenerator = lazyNamed(loadAiWorkbench, 'SyntheticTestCaseGenerator');
const RedTeamScenarioBuilder = lazyNamed(loadAiWorkbench, 'RedTeamScenarioBuilder');

const appRoutes: AppRoute[] = [
  { path: '/', Component: Home },
  { path: '/collections', Component: CollectionsIndex },
  { path: '/collections/:slug', Component: CollectionPage },
  { path: '/industries/mechanical', Component: MechanicalWorkspacePage },
  { path: '/industries/civil', Component: CivilWorkspacePage },
  { path: '/guides', Component: GuidesIndex },
  { path: '/guides/:slug', Component: GuidePage },
  { path: '/feedback', Component: FeedbackPage },
  { path: '/wishlist', Component: WishlistPage },
  { path: '/about', Component: AboutPage },
  { path: '/privacy', Component: PrivacyPage },
  { path: '/terms', Component: TermsPage },
  { path: '/json-formatter', Component: JsonFormatter },
  { path: '/ini-formatter', Component: IniFormatter },
  { path: '/http-request-formatter', Component: HttpRequestFormatter },
  { path: '/stack-trace-formatter', Component: StackTraceFormatter },
  { path: '/xml-formatter', Component: XmlFormatter },
  { path: '/html-formatter', Component: HtmlFormatter },
  { path: '/css-formatter', Component: CssFormatter },
  { path: '/markdown-formatter', Component: MarkdownFormatter },
  { path: '/base64-studio', Component: Base64Studio },
  { path: '/base64-url-studio', Component: Base64UrlStudio },
  { path: '/base58-studio', Component: Base58Studio },
  { path: '/base32-studio', Component: Base32Studio },
  { path: '/quoted-printable-studio', Component: QuotedPrintableStudio },
  { path: '/data-url-studio', Component: DataUrlStudio },
  { path: '/basic-auth-studio', Component: BasicAuthStudio },
  { path: '/character-code-studio', Component: CharacterCodeStudio },
  { path: '/rot13-studio', Component: Rot13Studio },
  { path: '/binary-text-studio', Component: BinaryTextStudio },
  { path: '/morse-code-studio', Component: MorseCodeStudio },
  { path: '/hash-generator', Component: HashGenerator },
  { path: '/password-generator', Component: PasswordGenerator },
  { path: '/passphrase-generator', Component: PassphraseGenerator },
  { path: '/random-number-generator', Component: RandomNumberGenerator },
  { path: '/planning-poker', Component: PlanningPoker },
  { path: '/color-palette-generator', Component: ColorPaletteGenerator },
  { path: '/nano-id-generator', Component: NanoIdGenerator },
  { path: '/fake-user-generator', Component: FakeUserGenerator },
  { path: '/username-generator', Component: UsernameGenerator },
  { path: '/api-token-generator', Component: ApiTokenGenerator },
  { path: '/release-note-generator', Component: ReleaseNoteGenerator },
  { path: '/test-case-title-generator', Component: TestCaseTitleGenerator },
  { path: '/lorem-ipsum-generator', Component: LoremIpsumGenerator },
  { path: '/url-encoder', Component: UrlStudio },
  { path: '/case-converter', Component: CaseConverter },
  { path: '/byte-size-converter', Component: ByteSizeConverter },
  { path: '/color-format-converter', Component: ColorFormatConverter },
  { path: '/line-ending-converter', Component: LineEndingConverter },
  { path: '/tabs-spaces-converter', Component: TabsSpacesConverter },
  { path: '/list-json-converter', Component: ListJsonConverter },
  { path: '/delimiter-converter', Component: DelimiterConverter },
  { path: '/duration-converter', Component: DurationConverter },
  { path: '/date-difference-calculator', Component: DateDifferenceCalculator },
  { path: '/expiry-time-calculator', Component: ExpiryTimeCalculator },
  { path: '/path-separator-converter', Component: PathSeparatorConverter },
  { path: '/number-base-converter', Component: NumberBaseConverter },
  { path: '/relative-time-calculator', Component: RelativeTimeCalculator },
  { path: '/roman-numeral-converter', Component: RomanNumeralConverter },
  { path: '/time-zone-converter', Component: TimeZoneConverter },
  { path: '/timestamp-converter', Component: TimestampConverter },
  { path: '/timestamp-batch-inspector', Component: TimestampBatchInspector },
  { path: '/jwt-decoder', Component: JWTDecoder },
  { path: '/jwt-expiry-checker', Component: JwtExpiryChecker },
  { path: '/regex-tester', Component: RegexTester },
  { path: '/regex-replace-tester', Component: RegexReplaceTester },
  { path: '/email-validator', Component: EmailValidator },
  { path: '/json-pointer-tester', Component: JsonPointerTester },
  { path: '/url-pattern-tester', Component: UrlPatternTester },
  { path: '/semver-range-tester', Component: SemverRangeTester },
  { path: '/http-status-tester', Component: HttpStatusTester },
  { path: '/qr-code-generator', Component: QRCodeGenerator },
  { path: '/uuid-generator', Component: UuidGenerator },
  { path: '/ulid-generator', Component: UlidGenerator },
  { path: '/hmac-generator', Component: HmacGenerator },
  { path: '/query-string-studio', Component: QueryStringStudio },
  { path: '/html-entity-studio', Component: HtmlEntityStudio },
  { path: '/hex-studio', Component: HexStudio },
  { path: '/slugify-studio', Component: SlugifyStudio },
  { path: '/unicode-escape-studio', Component: UnicodeEscapeStudio },
  { path: '/csv-json-studio', Component: CsvJsonStudio },
  { path: '/text-diff-checker', Component: TextDiffChecker },
  { path: '/docker-optimizer', Component: DockerOptimizer },
  { path: '/github-actions-validator', Component: GitHubActionsValidator },
  { path: '/dependency-visualizer', Component: DependencyVisualizer },
  { path: '/bundle-size-calculator', Component: BundleSizeCalculator },
  { path: '/curl-to-code-converter', Component: CurlToCodeConverter },
  { path: '/gitignore-builder', Component: GitignoreBuilder },
  { path: '/media-fixture-generator', Component: MediaFixtureGenerator },
  { path: '/video-to-gif-studio', Component: VideoToGifStudio },
  { path: '/sql-beautifier', Component: SqlBeautifier },
  { path: '/semantic-version-calculator', Component: SemanticVersionCalculator },
  { path: '/breaking-change-detector', Component: BreakingChangeDetector },
  { path: '/http-header-inspector', Component: HttpHeaderInspector },
  { path: '/api-key-fingerprinter', Component: ApiKeyFingerprinter },
  { path: '/sri-hash-generator', Component: SriHashGenerator },
  { path: '/cors-policy-inspector', Component: CorsPolicyInspector },
  { path: '/cookie-security-inspector', Component: CookieSecurityInspector },
  { path: '/csp-policy-inspector', Component: CspPolicyInspector },
  { path: '/security-txt-inspector', Component: SecurityTxtInspector },
  { path: '/open-redirect-checker', Component: OpenRedirectChecker },
  { path: '/password-policy-inspector', Component: PasswordPolicyInspector },
  { path: '/signed-url-inspector', Component: SignedUrlInspector },
  { path: '/json-path-explorer', Component: JsonPathExplorer },
  { path: '/json-value-comparator', Component: JsonValueComparator },
  { path: '/header-diff-checker', Component: HeaderDiffChecker },
  { path: '/har-request-extractor', Component: HarRequestExtractor },
  { path: '/webhook-payload-inspector', Component: WebhookPayloadInspector },
  { path: '/sql-result-to-markdown-table', Component: SqlResultToMarkdownTable },
  { path: '/log-level-analyzer', Component: LogLevelAnalyzer },
  { path: '/uuid-extractor', Component: UuidExtractor },
  { path: '/link-extractor', Component: LinkExtractor },
  { path: '/secret-redactor', Component: SecretRedactor },
  { path: '/api-error-formatter', Component: ApiErrorFormatter },
  { path: '/cron-expression-explainer', Component: CronExpressionExplainer },
  { path: '/docker-compose-auditor', Component: DockerComposeAuditor },
  { path: '/openapi-summary', Component: OpenApiSummary },
  { path: '/json-lines-studio', Component: JsonLinesStudio },
  { path: '/env-file-inspector', Component: EnvFileInspector },
  { path: '/ansi-escape-cleaner', Component: AnsiEscapeCleaner },
  { path: '/markdown-checklist-builder', Component: MarkdownChecklistBuilder },
  { path: '/line-deduplicator', Component: LineDeduplicator },
  { path: '/markdown-table-builder', Component: MarkdownTableBuilder },
  { path: '/markdown-studio', Component: MarkdownStudio },
  { path: '/json-schema-generator', Component: JsonSchemaGenerator },
  { path: '/shift-handover-builder', Component: ShiftHandoverBuilder },
  { path: '/pressure-drop-head-loss-calculator', Component: PressureDropHeadLossCalculator },
  { path: '/industries/mechanical/tools/pressure-drop-head-loss-calculator', Component: PressureDropHeadLossCalculator },
  { path: '/industries/civil/tools/pressure-drop-head-loss-calculator', Component: PressureDropHeadLossCalculator },
  { path: '/drawing-revision-diff-checker', Component: DrawingRevisionDiffChecker },
  { path: '/industries/mechanical/tools/drawing-revision-diff-checker', Component: DrawingRevisionDiffChecker },
  { path: '/industries/civil/tools/drawing-revision-diff-checker', Component: DrawingRevisionDiffChecker },
  { path: '/tolerance-stackup-analyzer', Component: ToleranceStackupAnalyzer },
  { path: '/industries/mechanical/tools/tolerance-stackup-analyzer', Component: ToleranceStackupAnalyzer },
  { path: '/bom-diff-checker', Component: BomDiffChecker },
  { path: '/industries/mechanical/tools/bom-diff-checker', Component: BomDiffChecker },
  { path: '/hole-shaft-fit-calculator', Component: HoleShaftFitCalculator },
  { path: '/industries/mechanical/tools/hole-shaft-fit-calculator', Component: HoleShaftFitCalculator },
  { path: '/mechanical-formula-finder', Component: MechanicalFormulaFinder },
  { path: '/industries/mechanical/tools/mechanical-formula-finder', Component: MechanicalFormulaFinder },
  { path: '/material-takeoff-carbon-estimator', Component: MaterialTakeoffCarbonEstimator },
  { path: '/industries/civil/tools/material-takeoff-carbon-estimator', Component: MaterialTakeoffCarbonEstimator },
  { path: '/boq-diff-checker', Component: BoqDiffChecker },
  { path: '/industries/civil/tools/boq-diff-checker', Component: BoqDiffChecker },
  { path: '/civil-formula-finder', Component: CivilFormulaFinder },
  { path: '/industries/civil/tools/civil-formula-finder', Component: CivilFormulaFinder },
  { path: '/prompt-studio', Component: PromptStudio },
  { path: '/prompt-diff-checker', Component: PromptDiffChecker },
  { path: '/prompt-test-runner', Component: PromptTestRunner },
  { path: '/prompt-eval-scorecard', Component: PromptEvalScorecard },
  { path: '/structured-output-schema-builder', Component: StructuredOutputSchemaBuilder },
  { path: '/output-repair-studio', Component: OutputRepairStudio },
  { path: '/jailbreak-prompt-injection-checker', Component: JailbreakPromptInjectionChecker },
  { path: '/hallucination-review-workspace', Component: HallucinationReviewWorkspace },
  { path: '/rag-chunk-previewer', Component: RagChunkPreviewer },
  { path: '/embedding-similarity-explorer', Component: EmbeddingSimilarityExplorer },
  { path: '/system-prompt-builder', Component: SystemPromptBuilder },
  { path: '/few-shot-example-organizer', Component: FewShotExampleOrganizer },
  { path: '/prompt-variable-extractor', Component: PromptVariableExtractor },
  { path: '/token-cost-estimator', Component: TokenCostEstimator },
  { path: '/latency-quality-planner', Component: LatencyQualityPlanner },
  { path: '/ai-response-comparator', Component: AiResponseComparator },
  { path: '/safety-policy-tester', Component: SafetyPolicyTester },
  { path: '/tool-call-payload-validator', Component: ToolCallPayloadValidator },
  { path: '/function-calling-schema-tester', Component: FunctionCallingSchemaTester },
  { path: '/agent-loop-trace-viewer', Component: AgentLoopTraceViewer },
  { path: '/grounded-answer-checker', Component: GroundedAnswerChecker },
  { path: '/citation-formatter-for-ai-answers', Component: CitationFormatterForAiAnswers },
  { path: '/conversation-state-simulator', Component: ConversationStateSimulator },
  { path: '/context-window-compactor', Component: ContextWindowCompactor },
  { path: '/prompt-leak-detector', Component: PromptLeakDetector },
  { path: '/consistency-runner', Component: ConsistencyRunner },
  { path: '/best-of-n-comparison-tool', Component: BestOfNComparisonTool },
  { path: '/batch-eval-dataset-builder', Component: BatchEvalDatasetBuilder },
  { path: '/synthetic-test-case-generator', Component: SyntheticTestCaseGenerator },
  { path: '/red-team-scenario-builder', Component: RedTeamScenarioBuilder },
];

const redirectRoutes = [
  { path: '/base64', to: '/base64-studio' },
  { path: '/qr-code', to: '/qr-code-generator' },
  { path: '/timestamp', to: '/timestamp-converter' },
];

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<div className="empty-panel-copy">Loading tool...</div>}>
          <Routes>
            {appRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
            {redirectRoutes.map(({ path, to }) => (
              <Route key={path} path={path} element={<Navigate to={to} replace />} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}
