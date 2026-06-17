import { useEffect, useState } from 'react';
import { CalendarClock, Check, Copy } from 'lucide-react';
import { format, fromUnixTime } from 'date-fns';
import ToolPage from '../components/ToolPage';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [humanReadable, setHumanReadable] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!timestamp) {
      setHumanReadable('');
      setError('');
      return;
    }

    const numericTimestamp = Number.parseInt(timestamp, 10);
    if (Number.isNaN(numericTimestamp)) {
      setError('Enter a valid Unix timestamp in seconds or milliseconds.');
      setHumanReadable('');
      return;
    }

    const date = numericTimestamp > 10_000_000_000 ? new Date(numericTimestamp) : fromUnixTime(numericTimestamp);
    if (Number.isNaN(date.getTime())) {
      setError('Enter a valid Unix timestamp in seconds or milliseconds.');
      setHumanReadable('');
      return;
    }

    setHumanReadable(format(date, 'PPpp'));
    setError('');
  }, [timestamp]);

  const currentUnix = Math.floor(currentTime / 1000);
  const currentDate = format(new Date(currentTime), 'PPpp');

  const copyToClipboard = async () => {
    if (!humanReadable) return;
    await navigator.clipboard.writeText(humanReadable);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPage
      title="Timestamp Converter"
      description="Convert Unix timestamps into readable dates while keeping a live view of the current Unix time."
      category="Converters"
      icon={CalendarClock}
      actions={
        <>
          <button type="button" onClick={() => setTimestamp(String(currentUnix))} className="button-primary">
            Use Current Time
          </button>
          <button type="button" onClick={() => setTimestamp('')} className="button-secondary">
            Clear
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-gutter xl:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-6">
          <div className="app-panel p-6">
            <p className="font-mono text-label-sm uppercase text-text-secondary">Current Time</p>
            <div className="mt-4 space-y-4">
              <div className="mini-card">
                <p className="font-mono text-label-sm uppercase text-text-secondary">Unix</p>
                <p className="mt-2 text-headline-sm font-semibold text-text-primary">{currentUnix}</p>
              </div>
              <div className="mini-card">
                <p className="font-mono text-label-sm uppercase text-text-secondary">Date</p>
                <p className="mt-2 text-body-lg text-text-primary">{currentDate}</p>
              </div>
            </div>
          </div>

          <div className="app-panel p-6">
            <label className="field-label">Unix Timestamp</label>
            <input
              type="text"
              value={timestamp}
              onChange={(event) => setTimestamp(event.target.value)}
              placeholder="1640000000 or 1640000000000"
              className="field-input font-mono text-lg"
            />
            <p className="mt-3 text-body-md text-text-secondary">Values below 10,000,000,000 are treated as seconds.</p>
          </div>
        </section>

        <section className="app-panel p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-label-sm uppercase text-text-secondary">Output</p>
              <h3 className="mt-2 text-headline-sm font-semibold text-text-primary">Human-readable date</h3>
            </div>
            <button type="button" onClick={copyToClipboard} className="button-ghost" disabled={!humanReadable}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {error ? (
            <div className="notice-error">{error}</div>
          ) : (
            <div className="code-surface flex min-h-[220px] items-center justify-center text-center text-lg">
              {humanReadable || 'Enter a timestamp to convert the value.'}
            </div>
          )}
        </section>
      </div>
    </ToolPage>
  );
}
