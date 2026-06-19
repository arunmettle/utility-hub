import { useMemo, useState } from 'react';
import { Check, Copy, KeyRound, RefreshCw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generatePassword, getPasswordStrength, type PasswordOptions } from '../lib/privacyTools';

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const buildPassword = () => {
    setPassword(generatePassword(options));
  };

  const copyPassword = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const optionEntries: Array<{ key: keyof Omit<PasswordOptions, 'length'>; label: string }> = [
    { key: 'includeUppercase', label: 'Uppercase letters' },
    { key: 'includeLowercase', label: 'Lowercase letters' },
    { key: 'includeNumbers', label: 'Numbers' },
    { key: 'includeSymbols', label: 'Symbols' },
  ];

  return (
    <ToolFrame
      eyebrow="Generator"
      title="Password Generator"
      description="Create strong passwords with configurable character sets and browser-native randomness."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={buildPassword}>
            <RefreshCw size={16} />
            Generate
          </button>
          <button type="button" className="action-button" onClick={copyPassword} disabled={!password}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </>
      }
      note={{
        title: 'Privacy note',
        body: 'Passwords are produced with cryptographically secure random values in your browser and are never sent to a server.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Generated password</span>
            <span>{password ? `${password.length} chars` : 'Awaiting generation'}</span>
          </div>
          <div className="password-output">
            <KeyRound size={18} />
            <span>{password || 'Generate a password to preview the output.'}</span>
          </div>
          <div className="strength-meter">
            <div className="strength-meter__label">
              <strong>{strength.label}</strong>
              <span>Strength</span>
            </div>
            <div className="strength-meter__track">
              <div className="strength-meter__fill" style={{ width: strength.width, backgroundColor: strength.tone }} />
            </div>
          </div>
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Options</span>
            <span>Local only</span>
          </div>

          <div className="range-row">
            <label htmlFor="password-length">Length</label>
            <span>{options.length}</span>
          </div>
          <input
            id="password-length"
            type="range"
            min="8"
            max="64"
            value={options.length}
            onChange={(event) => setOptions((current) => ({ ...current, length: Number(event.target.value) }))}
            className="field-range"
          />

          <div className="toggle-list">
            {optionEntries.map((entry) => (
              <label key={entry.key} className="toggle-card">
                <input
                  type="checkbox"
                  checked={options[entry.key]}
                  onChange={(event) => setOptions((current) => ({ ...current, [entry.key]: event.target.checked }))}
                />
                <span>{entry.label}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </ToolFrame>
  );
}
