import { useEffect, useRef } from 'react';
import { getBuildTimeTurnstileSiteKey } from '../lib/publicConfig';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          theme?: 'auto' | 'light' | 'dark';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        },
      ) => string;
      remove?: (widgetId: string) => void;
    };
  }
}

const turnstileScriptId = 'utilityhub-turnstile-script';
let turnstileLoaderPromise: Promise<void> | null = null;

function loadTurnstileScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  if (turnstileLoaderPromise) {
    return turnstileLoaderPromise;
  }

  turnstileLoaderPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(turnstileScriptId) as HTMLScriptElement | null;
    if (existing) {
      const waitForTurnstile = () => {
        if (window.turnstile) {
          resolve();
          return;
        }

        window.setTimeout(waitForTurnstile, 50);
      };

      waitForTurnstile();
      existing.addEventListener('error', () => reject(new Error('Unable to load Turnstile.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = turnstileScriptId;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Turnstile.'));
    document.head.appendChild(script);
  });

  return turnstileLoaderPromise;
}

interface TurnstileWidgetProps {
  action: string;
  onTokenChange: (token: string) => void;
  siteKey?: string;
}

export default function TurnstileWidget({ action, onTokenChange, siteKey = getBuildTimeTurnstileSiteKey() }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    onTokenChange('');
  }, [action, onTokenChange, siteKey]);

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      return undefined;
    }

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) {
          return;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: 'auto',
          callback: (token) => onTokenChange(token),
          'expired-callback': () => onTokenChange(''),
          'error-callback': () => onTokenChange(''),
        });
      })
      .catch(() => {
        onTokenChange('');
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [action, onTokenChange, siteKey]);

  if (!siteKey) {
    return null;
  }

  return (
    <div className="turnstile-panel">
      <div ref={containerRef} />
      <p>Spam protection keeps public submissions and room creation usable for real people.</p>
    </div>
  );
}
