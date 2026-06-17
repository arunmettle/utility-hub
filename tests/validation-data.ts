export interface ToolDefinition {
  name: string;
  path: string;
  category: string;
  expectsCopyButton: boolean;
}

export const toolDefinitions: ToolDefinition[] = [
  { name: 'JSON Formatter', path: '/json-formatter', category: 'Formatters', expectsCopyButton: true },
  { name: 'Base64 Encoder', path: '/base64-encoder', category: 'Encoders/Decoders', expectsCopyButton: true },
  { name: 'Hash Generator', path: '/hash-generator', category: 'Generators', expectsCopyButton: true },
  { name: 'QR Code Generator', path: '/qr-code-generator', category: 'Generators', expectsCopyButton: true },
  { name: 'Case Converter', path: '/case-converter', category: 'Converters', expectsCopyButton: true },
  { name: 'Timestamp Converter', path: '/timestamp-converter', category: 'Converters', expectsCopyButton: true },
  { name: 'URL Encoder', path: '/url-encoder', category: 'Encoders/Decoders', expectsCopyButton: true },
  { name: 'Password Generator', path: '/password-generator', category: 'Generators', expectsCopyButton: true },
  { name: 'JWT Decoder', path: '/jwt-decoder', category: 'Encoders/Decoders', expectsCopyButton: true },
  { name: 'Regex Tester', path: '/regex-tester', category: 'Testers', expectsCopyButton: true },
];

export const generators = toolDefinitions
  .filter((tool) => tool.category === 'Generators')
  .map((tool) => tool.name);
