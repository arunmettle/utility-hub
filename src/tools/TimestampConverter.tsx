import { useState, useEffect } from 'react';
import { Copy, Check, Calendar } from 'lucide-react';
import { format, fromUnixTime } from 'date-fns';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [humanReadable, setHumanReadable] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!timestamp) {
      setHumanReadable('');
      setError('');
      return;
    }

    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        setError('Invalid timestamp');
        setHumanReadable('');
        return;
      }

      // Handle both seconds and milliseconds
      const date = ts > 10000000000 ? new Date(ts) : fromUnixTime(ts);
      
      if (isNaN(date.getTime())) {
        setError('Invalid timestamp');
        setHumanReadable('');
        return;
      }

      const formatted = format(date, 'PPpp');
      setHumanReadable(formatted);
      setError('');
    } catch (e) {
      setError('Invalid timestamp');
      setHumanReadable('');
    }
  }, [timestamp]);

  const useCurrentTime = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(now.toString());
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setTimestamp('');
  };

  const currentUnix = Math.floor(currentTime / 1000);
  const currentDate = format(new Date(currentTime), 'PPpp');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Timestamp Converter</h1>
        <p className="text-gray-600 dark:text-gray-400">Convert Unix timestamps to human-readable dates</p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex gap-2">
        <button
          onClick={useCurrentTime}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Calendar size={16} />
          Use Current Time
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl">
          {/* Current Time Display */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Current Time</h3>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Unix:</span> {currentUnix}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Date:</span> {currentDate}
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Unix Timestamp (seconds or milliseconds)
            </label>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="1640000000 or 1640000000000"
              className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg text-gray-900 dark:text-white"
            />
          </div>

          {/* Output */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Human-Readable Date</h3>
              {humanReadable && (
                <button
                  onClick={() => copyToClipboard(humanReadable)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            {error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                {error}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
                <p className="text-lg font-mono text-gray-900 dark:text-white text-center">
                  {humanReadable || 'Enter a timestamp to convert...'}
                </p>
              </div>
            )}
          </div>

          {/* Info */}
          {timestamp && !error && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-semibold">Note:</span> Timestamps less than 10,000,000,000 are treated as seconds. 
                Larger values are treated as milliseconds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
