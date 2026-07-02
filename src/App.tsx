import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import Base64Studio from './tools/Base64Studio';
import Base64UrlStudio from './tools/Base64UrlStudio';
import Base58Studio from './tools/Base58Studio';
import Base32Studio from './tools/Base32Studio';
import ApiErrorFormatter from './tools/ApiErrorFormatter';
import ApiKeyFingerprinter from './tools/ApiKeyFingerprinter';
import ApiTokenGenerator from './tools/ApiTokenGenerator';
import AnsiEscapeCleaner from './tools/AnsiEscapeCleaner';
import BinaryTextStudio from './tools/BinaryTextStudio';
import BasicAuthStudio from './tools/BasicAuthStudio';
import BreakingChangeDetector from './tools/BreakingChangeDetector';
import BundleSizeCalculator from './tools/BundleSizeCalculator';
import ByteSizeConverter from './tools/ByteSizeConverter';
import CaseConverter from './tools/CaseConverter';
import CharacterCodeStudio from './tools/CharacterCodeStudio';
import ColorPaletteGenerator from './tools/ColorPaletteGenerator';
import ColorFormatConverter from './tools/ColorFormatConverter';
import CorsPolicyInspector from './tools/CorsPolicyInspector';
import CssFormatter from './tools/CssFormatter';
import CookieSecurityInspector from './tools/CookieSecurityInspector';
import CronExpressionExplainer from './tools/CronExpressionExplainer';
import CspPolicyInspector from './tools/CspPolicyInspector';
import CsvJsonStudio from './tools/CsvJsonStudio';
import CurlToCodeConverter from './tools/CurlToCodeConverter';
import DataUrlStudio from './tools/DataUrlStudio';
import DelimiterConverter from './tools/DelimiterConverter';
import DependencyVisualizer from './tools/DependencyVisualizer';
import DockerComposeAuditor from './tools/DockerComposeAuditor';
import DockerOptimizer from './tools/DockerOptimizer';
import EnvFileInspector from './tools/EnvFileInspector';
import FakeUserGenerator from './tools/FakeUserGenerator';
import GitHubActionsValidator from './tools/GitHubActionsValidator';
import GitignoreBuilder from './tools/GitignoreBuilder';
import HashGenerator from './tools/HashGenerator';
import HarRequestExtractor from './tools/HarRequestExtractor';
import HeaderDiffChecker from './tools/HeaderDiffChecker';
import HmacGenerator from './tools/HmacGenerator';
import HttpRequestFormatter from './tools/HttpRequestFormatter';
import HttpStatusTester from './tools/HttpStatusTester';
import HtmlFormatter from './tools/HtmlFormatter';
import HtmlEntityStudio from './tools/HtmlEntityStudio';
import HexStudio from './tools/HexStudio';
import HttpHeaderInspector from './tools/HttpHeaderInspector';
import JsonLinesStudio from './tools/JsonLinesStudio';
import JsonPathExplorer from './tools/JsonPathExplorer';
import JsonValueComparator from './tools/JsonValueComparator';
import JWTDecoder from './tools/JWTDecoder';
import JwtExpiryChecker from './tools/JwtExpiryChecker';
import JsonSchemaGenerator from './tools/JsonSchemaGenerator';
import JsonFormatter from './tools/JsonFormatter';
import JsonPointerTester from './tools/JsonPointerTester';
import LineDeduplicator from './tools/LineDeduplicator';
import LineEndingConverter from './tools/LineEndingConverter';
import LinkExtractor from './tools/LinkExtractor';
import ListJsonConverter from './tools/ListJsonConverter';
import LogLevelAnalyzer from './tools/LogLevelAnalyzer';
import LoremIpsumGenerator from './tools/LoremIpsumGenerator';
import MarkdownChecklistBuilder from './tools/MarkdownChecklistBuilder';
import MarkdownFormatter from './tools/MarkdownFormatter';
import MarkdownTableBuilder from './tools/MarkdownTableBuilder';
import MarkdownStudio from './tools/MarkdownStudio';
import MediaFixtureGenerator from './tools/MediaFixtureGenerator';
import VideoToGifStudio from './tools/VideoToGifStudio';
import MorseCodeStudio from './tools/MorseCodeStudio';
import NanoIdGenerator from './tools/NanoIdGenerator';
import NumberBaseConverter from './tools/NumberBaseConverter';
import OpenApiSummary from './tools/OpenApiSummary';
import OpenRedirectChecker from './tools/OpenRedirectChecker';
import Home from './pages/Home';
import CollectionsIndex from './pages/CollectionsIndex';
import CollectionPage from './pages/CollectionPage';
import GuidesIndex from './pages/GuidesIndex';
import GuidePage from './pages/GuidePage';
import FeedbackPage from './pages/FeedbackPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import IniFormatter from './tools/IniFormatter';
import PasswordGenerator from './tools/PasswordGenerator';
import PasswordPolicyInspector from './tools/PasswordPolicyInspector';
import PassphraseGenerator from './tools/PassphraseGenerator';
import PathSeparatorConverter from './tools/PathSeparatorConverter';
import PlanningPoker from './tools/PlanningPoker';
import QueryStringStudio from './tools/QueryStringStudio';
import QRCodeGenerator from './tools/QRCodeGenerator';
import QuotedPrintableStudio from './tools/QuotedPrintableStudio';
import RandomNumberGenerator from './tools/RandomNumberGenerator';
import ReleaseNoteGenerator from './tools/ReleaseNoteGenerator';
import RegexReplaceTester from './tools/RegexReplaceTester';
import RegexTester from './tools/RegexTester';
import EmailValidator from './tools/EmailValidator';
import SemanticVersionCalculator from './tools/SemanticVersionCalculator';
import SecretRedactor from './tools/SecretRedactor';
import SecurityTxtInspector from './tools/SecurityTxtInspector';
import SemverRangeTester from './tools/SemverRangeTester';
import SlugifyStudio from './tools/SlugifyStudio';
import SignedUrlInspector from './tools/SignedUrlInspector';
import SqlResultToMarkdownTable from './tools/SqlResultToMarkdownTable';
import SqlBeautifier from './tools/SqlBeautifier';
import SriHashGenerator from './tools/SriHashGenerator';
import StackTraceFormatter from './tools/StackTraceFormatter';
import TabsSpacesConverter from './tools/TabsSpacesConverter';
import TestCaseTitleGenerator from './tools/TestCaseTitleGenerator';
import TextDiffChecker from './tools/TextDiffChecker';
import TimestampConverter from './tools/TimestampConverter';
import DurationConverter from './tools/DurationConverter';
import DateDifferenceCalculator from './tools/DateDifferenceCalculator';
import ExpiryTimeCalculator from './tools/ExpiryTimeCalculator';
import RelativeTimeCalculator from './tools/RelativeTimeCalculator';
import TimestampBatchInspector from './tools/TimestampBatchInspector';
import TimeZoneConverter from './tools/TimeZoneConverter';
import UlidGenerator from './tools/UlidGenerator';
import UnicodeEscapeStudio from './tools/UnicodeEscapeStudio';
import UrlPatternTester from './tools/UrlPatternTester';
import UuidExtractor from './tools/UuidExtractor';
import UrlStudio from './tools/UrlStudio';
import UuidGenerator from './tools/UuidGenerator';
import UsernameGenerator from './tools/UsernameGenerator';
import WebhookPayloadInspector from './tools/WebhookPayloadInspector';
import Rot13Studio from './tools/Rot13Studio';
import RomanNumeralConverter from './tools/RomanNumeralConverter';
import XmlFormatter from './tools/XmlFormatter';
import {
  AgentLoopTraceViewer,
  AiResponseComparator,
  BatchEvalDatasetBuilder,
  BestOfNComparisonTool,
  CitationFormatterForAiAnswers,
  ConsistencyRunner,
  ContextWindowCompactor,
  ConversationStateSimulator,
  EmbeddingSimilarityExplorer,
  FewShotExampleOrganizer,
  FunctionCallingSchemaTester,
  GroundedAnswerChecker,
  HallucinationReviewWorkspace,
  JailbreakPromptInjectionChecker,
  LatencyQualityPlanner,
  OutputRepairStudio,
  PromptDiffChecker,
  PromptEvalScorecard,
  PromptStudio,
  PromptTestRunner,
  PromptLeakDetector,
  PromptVariableExtractor,
  RagChunkPreviewer,
  RedTeamScenarioBuilder,
  SafetyPolicyTester,
  StructuredOutputSchemaBuilder,
  SyntheticTestCaseGenerator,
  SystemPromptBuilder,
  TokenCostEstimator,
  ToolCallPayloadValidator,
} from './tools/AiWorkbench';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<CollectionsIndex />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          <Route path="/guides" element={<GuidesIndex />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
          <Route path="/ini-formatter" element={<IniFormatter />} />
          <Route path="/http-request-formatter" element={<HttpRequestFormatter />} />
          <Route path="/stack-trace-formatter" element={<StackTraceFormatter />} />
          <Route path="/xml-formatter" element={<XmlFormatter />} />
          <Route path="/html-formatter" element={<HtmlFormatter />} />
          <Route path="/css-formatter" element={<CssFormatter />} />
          <Route path="/markdown-formatter" element={<MarkdownFormatter />} />
          <Route path="/base64-studio" element={<Base64Studio />} />
          <Route path="/base64-url-studio" element={<Base64UrlStudio />} />
          <Route path="/base58-studio" element={<Base58Studio />} />
          <Route path="/base32-studio" element={<Base32Studio />} />
          <Route path="/quoted-printable-studio" element={<QuotedPrintableStudio />} />
          <Route path="/data-url-studio" element={<DataUrlStudio />} />
          <Route path="/basic-auth-studio" element={<BasicAuthStudio />} />
          <Route path="/character-code-studio" element={<CharacterCodeStudio />} />
          <Route path="/rot13-studio" element={<Rot13Studio />} />
          <Route path="/binary-text-studio" element={<BinaryTextStudio />} />
          <Route path="/morse-code-studio" element={<MorseCodeStudio />} />
          <Route path="/hash-generator" element={<HashGenerator />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/passphrase-generator" element={<PassphraseGenerator />} />
          <Route path="/random-number-generator" element={<RandomNumberGenerator />} />
          <Route path="/planning-poker" element={<PlanningPoker />} />
          <Route path="/color-palette-generator" element={<ColorPaletteGenerator />} />
          <Route path="/nano-id-generator" element={<NanoIdGenerator />} />
          <Route path="/fake-user-generator" element={<FakeUserGenerator />} />
          <Route path="/username-generator" element={<UsernameGenerator />} />
          <Route path="/api-token-generator" element={<ApiTokenGenerator />} />
          <Route path="/release-note-generator" element={<ReleaseNoteGenerator />} />
          <Route path="/test-case-title-generator" element={<TestCaseTitleGenerator />} />
          <Route path="/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
          <Route path="/url-encoder" element={<UrlStudio />} />
          <Route path="/base64" element={<Navigate to="/base64-studio" replace />} />
          <Route path="/case-converter" element={<CaseConverter />} />
          <Route path="/byte-size-converter" element={<ByteSizeConverter />} />
          <Route path="/color-format-converter" element={<ColorFormatConverter />} />
          <Route path="/line-ending-converter" element={<LineEndingConverter />} />
          <Route path="/tabs-spaces-converter" element={<TabsSpacesConverter />} />
          <Route path="/list-json-converter" element={<ListJsonConverter />} />
          <Route path="/delimiter-converter" element={<DelimiterConverter />} />
          <Route path="/duration-converter" element={<DurationConverter />} />
          <Route path="/date-difference-calculator" element={<DateDifferenceCalculator />} />
          <Route path="/expiry-time-calculator" element={<ExpiryTimeCalculator />} />
          <Route path="/path-separator-converter" element={<PathSeparatorConverter />} />
          <Route path="/number-base-converter" element={<NumberBaseConverter />} />
          <Route path="/relative-time-calculator" element={<RelativeTimeCalculator />} />
          <Route path="/roman-numeral-converter" element={<RomanNumeralConverter />} />
          <Route path="/time-zone-converter" element={<TimeZoneConverter />} />
          <Route path="/timestamp-converter" element={<TimestampConverter />} />
          <Route path="/timestamp-batch-inspector" element={<TimestampBatchInspector />} />
          <Route path="/timestamp" element={<Navigate to="/timestamp-converter" replace />} />
          <Route path="/jwt-decoder" element={<JWTDecoder />} />
          <Route path="/jwt-expiry-checker" element={<JwtExpiryChecker />} />
          <Route path="/regex-tester" element={<RegexTester />} />
          <Route path="/regex-replace-tester" element={<RegexReplaceTester />} />
          <Route path="/email-validator" element={<EmailValidator />} />
          <Route path="/json-pointer-tester" element={<JsonPointerTester />} />
          <Route path="/url-pattern-tester" element={<UrlPatternTester />} />
          <Route path="/semver-range-tester" element={<SemverRangeTester />} />
          <Route path="/http-status-tester" element={<HttpStatusTester />} />
          <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
          <Route path="/qr-code" element={<Navigate to="/qr-code-generator" replace />} />
          <Route path="/uuid-generator" element={<UuidGenerator />} />
          <Route path="/ulid-generator" element={<UlidGenerator />} />
          <Route path="/hmac-generator" element={<HmacGenerator />} />
          <Route path="/query-string-studio" element={<QueryStringStudio />} />
          <Route path="/html-entity-studio" element={<HtmlEntityStudio />} />
          <Route path="/hex-studio" element={<HexStudio />} />
          <Route path="/slugify-studio" element={<SlugifyStudio />} />
          <Route path="/unicode-escape-studio" element={<UnicodeEscapeStudio />} />
          <Route path="/csv-json-studio" element={<CsvJsonStudio />} />
          <Route path="/text-diff-checker" element={<TextDiffChecker />} />
          <Route path="/docker-optimizer" element={<DockerOptimizer />} />
          <Route path="/github-actions-validator" element={<GitHubActionsValidator />} />
          <Route path="/dependency-visualizer" element={<DependencyVisualizer />} />
          <Route path="/bundle-size-calculator" element={<BundleSizeCalculator />} />
          <Route path="/curl-to-code-converter" element={<CurlToCodeConverter />} />
          <Route path="/gitignore-builder" element={<GitignoreBuilder />} />
          <Route path="/media-fixture-generator" element={<MediaFixtureGenerator />} />
          <Route path="/video-to-gif-studio" element={<VideoToGifStudio />} />
          <Route path="/sql-beautifier" element={<SqlBeautifier />} />
          <Route path="/semantic-version-calculator" element={<SemanticVersionCalculator />} />
          <Route path="/breaking-change-detector" element={<BreakingChangeDetector />} />
          <Route path="/http-header-inspector" element={<HttpHeaderInspector />} />
          <Route path="/api-key-fingerprinter" element={<ApiKeyFingerprinter />} />
          <Route path="/sri-hash-generator" element={<SriHashGenerator />} />
          <Route path="/cors-policy-inspector" element={<CorsPolicyInspector />} />
          <Route path="/cookie-security-inspector" element={<CookieSecurityInspector />} />
          <Route path="/csp-policy-inspector" element={<CspPolicyInspector />} />
          <Route path="/security-txt-inspector" element={<SecurityTxtInspector />} />
          <Route path="/open-redirect-checker" element={<OpenRedirectChecker />} />
          <Route path="/password-policy-inspector" element={<PasswordPolicyInspector />} />
          <Route path="/signed-url-inspector" element={<SignedUrlInspector />} />
          <Route path="/json-path-explorer" element={<JsonPathExplorer />} />
          <Route path="/json-value-comparator" element={<JsonValueComparator />} />
          <Route path="/header-diff-checker" element={<HeaderDiffChecker />} />
          <Route path="/har-request-extractor" element={<HarRequestExtractor />} />
          <Route path="/webhook-payload-inspector" element={<WebhookPayloadInspector />} />
          <Route path="/sql-result-to-markdown-table" element={<SqlResultToMarkdownTable />} />
          <Route path="/log-level-analyzer" element={<LogLevelAnalyzer />} />
          <Route path="/uuid-extractor" element={<UuidExtractor />} />
          <Route path="/link-extractor" element={<LinkExtractor />} />
          <Route path="/secret-redactor" element={<SecretRedactor />} />
          <Route path="/api-error-formatter" element={<ApiErrorFormatter />} />
          <Route path="/cron-expression-explainer" element={<CronExpressionExplainer />} />
          <Route path="/docker-compose-auditor" element={<DockerComposeAuditor />} />
          <Route path="/openapi-summary" element={<OpenApiSummary />} />
          <Route path="/json-lines-studio" element={<JsonLinesStudio />} />
          <Route path="/env-file-inspector" element={<EnvFileInspector />} />
          <Route path="/ansi-escape-cleaner" element={<AnsiEscapeCleaner />} />
          <Route path="/markdown-checklist-builder" element={<MarkdownChecklistBuilder />} />
          <Route path="/line-deduplicator" element={<LineDeduplicator />} />
          <Route path="/markdown-table-builder" element={<MarkdownTableBuilder />} />
          <Route path="/markdown-studio" element={<MarkdownStudio />} />
          <Route path="/json-schema-generator" element={<JsonSchemaGenerator />} />
          <Route path="/prompt-studio" element={<PromptStudio />} />
          <Route path="/prompt-diff-checker" element={<PromptDiffChecker />} />
          <Route path="/prompt-test-runner" element={<PromptTestRunner />} />
          <Route path="/prompt-eval-scorecard" element={<PromptEvalScorecard />} />
          <Route path="/structured-output-schema-builder" element={<StructuredOutputSchemaBuilder />} />
          <Route path="/output-repair-studio" element={<OutputRepairStudio />} />
          <Route path="/jailbreak-prompt-injection-checker" element={<JailbreakPromptInjectionChecker />} />
          <Route path="/hallucination-review-workspace" element={<HallucinationReviewWorkspace />} />
          <Route path="/rag-chunk-previewer" element={<RagChunkPreviewer />} />
          <Route path="/embedding-similarity-explorer" element={<EmbeddingSimilarityExplorer />} />
          <Route path="/system-prompt-builder" element={<SystemPromptBuilder />} />
          <Route path="/few-shot-example-organizer" element={<FewShotExampleOrganizer />} />
          <Route path="/prompt-variable-extractor" element={<PromptVariableExtractor />} />
          <Route path="/token-cost-estimator" element={<TokenCostEstimator />} />
          <Route path="/latency-quality-planner" element={<LatencyQualityPlanner />} />
          <Route path="/ai-response-comparator" element={<AiResponseComparator />} />
          <Route path="/safety-policy-tester" element={<SafetyPolicyTester />} />
          <Route path="/tool-call-payload-validator" element={<ToolCallPayloadValidator />} />
          <Route path="/function-calling-schema-tester" element={<FunctionCallingSchemaTester />} />
          <Route path="/agent-loop-trace-viewer" element={<AgentLoopTraceViewer />} />
          <Route path="/grounded-answer-checker" element={<GroundedAnswerChecker />} />
          <Route path="/citation-formatter-for-ai-answers" element={<CitationFormatterForAiAnswers />} />
          <Route path="/conversation-state-simulator" element={<ConversationStateSimulator />} />
          <Route path="/context-window-compactor" element={<ContextWindowCompactor />} />
          <Route path="/prompt-leak-detector" element={<PromptLeakDetector />} />
          <Route path="/consistency-runner" element={<ConsistencyRunner />} />
          <Route path="/best-of-n-comparison-tool" element={<BestOfNComparisonTool />} />
          <Route path="/batch-eval-dataset-builder" element={<BatchEvalDatasetBuilder />} />
          <Route path="/synthetic-test-case-generator" element={<SyntheticTestCaseGenerator />} />
          <Route path="/red-team-scenario-builder" element={<RedTeamScenarioBuilder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
