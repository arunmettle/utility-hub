export interface ToolDefinition {
  name: string;
  path: string;
  category: string;
  expectsCopyButton: boolean;
}

export const toolDefinitions: ToolDefinition[] = [
  { name: 'JSON Formatter', path: '/json-formatter', category: 'Formatters', expectsCopyButton: true },
  { name: 'Base64 Studio', path: '/base64-studio', category: 'Encoders', expectsCopyButton: true },
  { name: 'Hash Generator', path: '/hash-generator', category: 'Generators', expectsCopyButton: true },
  { name: 'Case Converter', path: '/case-converter', category: 'Converters', expectsCopyButton: true },
  { name: 'Timestamp Converter', path: '/timestamp-converter', category: 'Converters', expectsCopyButton: true },
  { name: 'URL Studio', path: '/url-encoder', category: 'Encoders', expectsCopyButton: true },
  { name: 'Password Generator', path: '/password-generator', category: 'Generators', expectsCopyButton: true },
  { name: 'JWT Decoder', path: '/jwt-decoder', category: 'Security', expectsCopyButton: true },
  { name: 'Regex Tester', path: '/regex-tester', category: 'Testers', expectsCopyButton: true },
  { name: 'QR Code Generator', path: '/qr-code-generator', category: 'Generators', expectsCopyButton: true },
  { name: 'UUID Generator', path: '/uuid-generator', category: 'Generators', expectsCopyButton: true },
  { name: 'ULID Generator', path: '/ulid-generator', category: 'Generators', expectsCopyButton: true },
  { name: 'HMAC Generator', path: '/hmac-generator', category: 'Security', expectsCopyButton: true },
  { name: 'Query String Studio', path: '/query-string-studio', category: 'Converters', expectsCopyButton: true },
  { name: 'HTML Entity Studio', path: '/html-entity-studio', category: 'Encoders', expectsCopyButton: true },
  { name: 'Hex Studio', path: '/hex-studio', category: 'Encoders', expectsCopyButton: true },
  { name: 'Slugify Studio', path: '/slugify-studio', category: 'Converters', expectsCopyButton: true },
  { name: 'Unicode Escape Studio', path: '/unicode-escape-studio', category: 'Encoders', expectsCopyButton: true },
  { name: 'CSV JSON Studio', path: '/csv-json-studio', category: 'Converters', expectsCopyButton: true },
  { name: 'Text Diff Checker', path: '/text-diff-checker', category: 'Testers', expectsCopyButton: false },
  { name: 'Docker Optimizer', path: '/docker-optimizer', category: 'Developer', expectsCopyButton: true },
  { name: 'GitHub Actions Validator', path: '/github-actions-validator', category: 'Developer', expectsCopyButton: false },
  { name: 'Dependency Visualizer', path: '/dependency-visualizer', category: 'Developer', expectsCopyButton: false },
  { name: 'Bundle Size Calculator', path: '/bundle-size-calculator', category: 'Developer', expectsCopyButton: false },
  { name: 'cURL to Code Converter', path: '/curl-to-code-converter', category: 'Developer', expectsCopyButton: true },
  { name: 'SQL Beautifier', path: '/sql-beautifier', category: 'Developer', expectsCopyButton: true },
  { name: 'Semantic Version Calculator', path: '/semantic-version-calculator', category: 'Developer', expectsCopyButton: false },
  { name: 'Breaking Change Detector', path: '/breaking-change-detector', category: 'Developer', expectsCopyButton: false },
  { name: 'HTTP Header Inspector', path: '/http-header-inspector', category: 'Developer', expectsCopyButton: false },
  { name: 'Cron Expression Explainer', path: '/cron-expression-explainer', category: 'Developer', expectsCopyButton: false },
  { name: 'Docker Compose Auditor', path: '/docker-compose-auditor', category: 'Developer', expectsCopyButton: false },
  { name: 'OpenAPI Summary', path: '/openapi-summary', category: 'Developer', expectsCopyButton: false },
  { name: 'Markdown Table Builder', path: '/markdown-table-builder', category: 'Developer', expectsCopyButton: true },
  { name: 'JSON Schema Generator', path: '/json-schema-generator', category: 'Developer', expectsCopyButton: true },
];

export const generators = toolDefinitions
  .filter((tool) => tool.category === 'Generators')
  .map((tool) => tool.name);
