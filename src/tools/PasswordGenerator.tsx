import { useState, type Dispatch, type SetStateAction } from 'react';
import { Check, Copy, KeyRound, RefreshCw } from 'lucide-react';
import ToolPage from '../components/ToolPage';

interface PasswordOption {
  label: string;
  value: boolean;
  setter: Dispatch<SetStateAction<boolean>>;
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPassword('');
      return;
    }

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    setPassword(Array.from(randomValues, (value) => charset[value % charset.length]).join(''));
  };

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = (): { label: string; width: string; tone: string } => {
    if (!password) return { label: 'Not generated', width: '0%', tone: '#E2E8F0' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Weak', width: '25%', tone: '#DC2626' };
    if (strength <= 4) return { label: 'Fair', width: '50%', tone: '#D97706' };
    if (strength <= 5) return { label: 'Good', width: '75%', tone: '#0058be' };
    return { label: 'Strong', width: '100%', tone: '#059669' };
  };

  const strength = getStrength();
  const options: PasswordOption[] = [
    { label: 'Uppercase Letters (A-Z)', value: includeUppercase, setter: setIncludeUppercase },
    { label: 'Lowercase Letters (a-z)', value: includeLowercase, setter: setIncludeLowercase },
    { label: 'Numbers (0-9)', value: includeNumbers, setter: setIncludeNumbers },
    { label: 'Symbols (!@#$%^&*)', value: includeSymbols, setter: setIncludeSymbols },
  ];

  return (
    <ToolPage
      title="Password Generator"
      description="Create browser-generated passwords with configurable character sets, live strength feedback, and secure copy support."
      category="Generators"
      icon={KeyRound}
      actions={
        <>
          <button type="button" onClick={generatePassword} className="button-primary">
            <RefreshCw size={16} />
            Generate
          </button>
          <button type="button" onClick={copyToClipboard} className="button-secondary" disabled={!password}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-gutter xl:grid-cols-[1.1fr_0.9fr]">
        <section className="app-panel p-6">
          <p className="font-mono text-label-sm uppercase text-text-secondary">Generated Password</p>
          <div className="mt-4 code-surface flex min-h-[160px] items-center justify-center break-all text-center text-lg">
            {password || 'Generate a password to preview the output.'}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-body-md font-medium text-text-primary">Strength: {strength.label}</p>
              <p className="mt-1 text-body-md text-text-secondary">
                {password ? `${password.length} characters selected.` : 'Choose your settings below.'}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 rounded-full bg-border">
            <div className="h-full rounded-full transition-all" style={{ width: strength.width, backgroundColor: strength.tone }} />
          </div>

          <div className="mt-6 notice-success">
            Passwords are produced locally with cryptographically secure random values. Nothing leaves your browser.
          </div>
        </section>

        <section className="app-panel p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between gap-3">
              <label className="field-label mb-0">Length</label>
              <span className="font-mono text-label-md text-text-primary">{length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(event) => setLength(Number(event.target.value))}
              className="field-range mt-3"
            />
            <div className="mt-2 flex justify-between font-mono text-[11px] text-text-secondary">
              <span>8</span>
              <span>64</span>
            </div>
          </div>

          <div className="space-y-3">
            {options.map((option) => (
              <label key={option.label} className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
                <input
                  type="checkbox"
                  checked={option.value}
                  onChange={(event) => option.setter(event.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-body-md text-text-primary">{option.label}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </ToolPage>
  );
}
