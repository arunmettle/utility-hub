import { useEffect } from 'react';

const ADSENSE_CLIENT =
  import.meta.env.VITE_ADSENSE_CLIENT?.trim() || 'ca-pub-7971868534583867';
const ADSENSE_SCRIPT_ID = 'utilityhub-adsense-script';

export default function AdNetworkLoader() {
  useEffect(() => {
    if (!ADSENSE_CLIENT || typeof document === 'undefined') {
      return;
    }

    if (document.getElementById(ADSENSE_SCRIPT_ID)) {
      return;
    }

    const existingGoogleScript = document.querySelector(
      `script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}"]`,
    );

    if (existingGoogleScript) {
      return;
    }

    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
