import { 
  FileJson, 
  FileCode, 
  Hash, 
  QrCode, 
  Type, 
  Clock, 
  CalendarRange,
  TimerReset,
  Link2, 
  Key, 
  Shield, 
  FileSearch 
} from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: typeof FileJson;
  path: string;
}

export const categories = [
  'All Tools',
  'Encoders/Decoders',
  'Formatters',
  'Generators',
  'Converters',
  'Testers'
];

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate and beautify JSON data',
    category: 'Formatters',
    icon: FileJson,
    path: '/json-formatter'
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder',
    description: 'Encode and decode Base64 strings',
    category: 'Encoders/Decoders',
    icon: FileCode,
    path: '/base64-encoder'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA256, and SHA512 hashes',
    category: 'Generators',
    icon: Hash,
    path: '/hash-generator'
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create QR codes from text or URLs',
    category: 'Generators',
    icon: QrCode,
    path: '/qr-code-generator'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert between camelCase, snake_case, kebab-case, and more',
    category: 'Converters',
    icon: Type,
    path: '/case-converter'
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Inspect Unix timestamps in seconds, milliseconds, microseconds, or nanoseconds',
    category: 'Converters',
    icon: Clock,
    path: '/timestamp-converter'
  },
  {
    id: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    description: 'Compare two timestamps or date strings and see the exact gap',
    category: 'Converters',
    icon: CalendarRange,
    path: '/date-difference-calculator'
  },
  {
    id: 'expiry-time-calculator',
    name: 'Expiry Time Calculator',
    description: 'Add or subtract a duration from a timestamp or date',
    category: 'Converters',
    icon: TimerReset,
    path: '/expiry-time-calculator'
  },
  {
    id: 'time-zone-converter',
    name: 'Time Zone Converter',
    description: 'Render one timestamp across common time zones',
    category: 'Converters',
    icon: Link2,
    path: '/time-zone-converter'
  },
  {
    id: 'timestamp-batch-inspector',
    name: 'Timestamp Batch Inspector',
    description: 'Inspect a batch of Unix timestamps one per line',
    category: 'Converters',
    icon: Clock,
    path: '/timestamp-batch-inspector'
  },
  {
    id: 'relative-time-calculator',
    name: 'Relative Time Calculator',
    description: 'See how far away a target time is in human terms',
    category: 'Converters',
    icon: Clock,
    path: '/relative-time-calculator'
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder',
    description: 'Encode and decode URL strings',
    category: 'Encoders/Decoders',
    icon: Link2,
    path: '/url-encoder'
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate strong, secure passwords',
    category: 'Generators',
    icon: Key,
    path: '/password-generator'
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and analyze JWT tokens',
    category: 'Encoders/Decoders',
    icon: Shield,
    path: '/jwt-decoder'
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions',
    category: 'Testers',
    icon: FileSearch,
    path: '/regex-tester'
  }
];
