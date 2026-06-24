import { useEffect, useMemo, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotVariant = 'banner' | 'floating';

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT?.trim();
const FALLBACK_ADSENSE_CLIENT = 'ca-pub-7971868534583867';
const ADSENSE_TOP_SLOT = import.meta.env.VITE_ADSENSE_TOP_SLOT?.trim();
const ADSENSE_FLOAT_SLOT = import.meta.env.VITE_ADSENSE_FLOAT_SLOT?.trim();

function getSlotId(placement: AdSlotVariant) {
  return placement === 'banner' ? ADSENSE_TOP_SLOT : ADSENSE_FLOAT_SLOT;
}

export default function AdSlot({
  placement,
  pageLabel,
}: {
  placement: AdSlotVariant;
  pageLabel: string;
}) {
  const adsenseClient = ADSENSE_CLIENT || FALLBACK_ADSENSE_CLIENT;
  const slot = getSlotId(placement);
  const isConfigured = Boolean(adsenseClient && slot);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isConfigured || isLoaded) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      setIsLoaded(true);
    } catch {
      setIsLoaded(false);
    }
  }, [isConfigured, isLoaded]);

  const fallbackCopy = useMemo(() => {
    if (placement === 'banner') {
      return {
        eyebrow: 'Sponsor placement',
        title: `Subtle banner slot above ${pageLabel}`,
      };
    }

    return {
      eyebrow: 'Sponsor placement',
      title: `Sticky tool sponsor slot for ${pageLabel}`,
    };
  }, [pageLabel, placement]);

  if (!isConfigured || !slot) {
    return (
      <aside
        className={`ad-slot ad-slot--${placement} ad-slot--fallback`}
        aria-label={`${fallbackCopy.eyebrow} on ${pageLabel}`}
      >
        <span className="ad-slot__eyebrow">{fallbackCopy.eyebrow}</span>
        <strong>{fallbackCopy.title}</strong>
      </aside>
    );
  }

  return (
    <aside
      className={`ad-slot ad-slot--${placement}`}
      aria-label={`Advertisement on ${pageLabel}`}
    >
      <span className="ad-slot__eyebrow">Advertisement</span>
      <ins
        className="adsbygoogle ad-slot__unit"
        style={{ display: 'block' }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
