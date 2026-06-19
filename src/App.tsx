import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import Base64Studio from './tools/Base64Studio';
import BreakingChangeDetector from './tools/BreakingChangeDetector';
import BundleSizeCalculator from './tools/BundleSizeCalculator';
import CaseConverter from './tools/CaseConverter';
import CronExpressionExplainer from './tools/CronExpressionExplainer';
import CsvJsonStudio from './tools/CsvJsonStudio';
import CurlToCodeConverter from './tools/CurlToCodeConverter';
import DependencyVisualizer from './tools/DependencyVisualizer';
import DockerComposeAuditor from './tools/DockerComposeAuditor';
import DockerOptimizer from './tools/DockerOptimizer';
import GitHubActionsValidator from './tools/GitHubActionsValidator';
import HashGenerator from './tools/HashGenerator';
import HmacGenerator from './tools/HmacGenerator';
import HtmlEntityStudio from './tools/HtmlEntityStudio';
import HexStudio from './tools/HexStudio';
import HttpHeaderInspector from './tools/HttpHeaderInspector';
import JWTDecoder from './tools/JWTDecoder';
import JsonSchemaGenerator from './tools/JsonSchemaGenerator';
import JsonFormatter from './tools/JsonFormatter';
import MarkdownTableBuilder from './tools/MarkdownTableBuilder';
import OpenApiSummary from './tools/OpenApiSummary';
import Home from './pages/Home';
import PasswordGenerator from './tools/PasswordGenerator';
import QueryStringStudio from './tools/QueryStringStudio';
import QRCodeGenerator from './tools/QRCodeGenerator';
import RegexTester from './tools/RegexTester';
import SemanticVersionCalculator from './tools/SemanticVersionCalculator';
import SlugifyStudio from './tools/SlugifyStudio';
import SqlBeautifier from './tools/SqlBeautifier';
import TextDiffChecker from './tools/TextDiffChecker';
import TimestampConverter from './tools/TimestampConverter';
import UlidGenerator from './tools/UlidGenerator';
import UnicodeEscapeStudio from './tools/UnicodeEscapeStudio';
import UrlStudio from './tools/UrlStudio';
import UuidGenerator from './tools/UuidGenerator';
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
          <Route path="/json-formatter" element={<JsonFormatter />} />
          <Route path="/base64-studio" element={<Base64Studio />} />
          <Route path="/hash-generator" element={<HashGenerator />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/url-encoder" element={<UrlStudio />} />
          <Route path="/base64" element={<Navigate to="/base64-studio" replace />} />
          <Route path="/case-converter" element={<CaseConverter />} />
          <Route path="/timestamp-converter" element={<TimestampConverter />} />
          <Route path="/timestamp" element={<Navigate to="/timestamp-converter" replace />} />
          <Route path="/jwt-decoder" element={<JWTDecoder />} />
          <Route path="/regex-tester" element={<RegexTester />} />
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
          <Route path="/sql-beautifier" element={<SqlBeautifier />} />
          <Route path="/semantic-version-calculator" element={<SemanticVersionCalculator />} />
          <Route path="/breaking-change-detector" element={<BreakingChangeDetector />} />
          <Route path="/http-header-inspector" element={<HttpHeaderInspector />} />
          <Route path="/cron-expression-explainer" element={<CronExpressionExplainer />} />
          <Route path="/docker-compose-auditor" element={<DockerComposeAuditor />} />
          <Route path="/openapi-summary" element={<OpenApiSummary />} />
          <Route path="/markdown-table-builder" element={<MarkdownTableBuilder />} />
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
