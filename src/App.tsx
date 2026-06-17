import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import JsonFormatter from './tools/JsonFormatter';
import Base64Encoder from './tools/Base64Encoder';
import HashGenerator from './tools/HashGenerator';
import QRCodeGenerator from './tools/QRCodeGenerator';
import CaseConverter from './tools/CaseConverter';
import TimestampConverter from './tools/TimestampConverter';
import URLEncoder from './tools/URLEncoder';
import PasswordGenerator from './tools/PasswordGenerator';
import JWTDecoder from './tools/JWTDecoder';
import RegexTester from './tools/RegexTester';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
          <Route path="/base64-encoder" element={<Base64Encoder />} />
          <Route path="/hash-generator" element={<HashGenerator />} />
          <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
          <Route path="/case-converter" element={<CaseConverter />} />
          <Route path="/timestamp-converter" element={<TimestampConverter />} />
          <Route path="/url-encoder" element={<URLEncoder />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/jwt-decoder" element={<JWTDecoder />} />
          <Route path="/regex-tester" element={<RegexTester />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
