interface PublicConfigResponse {
  ok: boolean;
  turnstileSiteKey?: string;
}

let publicConfigPromise: Promise<PublicConfigResponse> | null = null;

export function getBuildTimeTurnstileSiteKey() {
  return import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? '';
}

export async function getPublicConfig() {
  if (publicConfigPromise) {
    return publicConfigPromise;
  }

  publicConfigPromise = fetch('/api/public-config', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(async (response) => {
      const result = (await response.json().catch(() => null)) as PublicConfigResponse | null;
      if (!response.ok || !result?.ok) {
        return { ok: true, turnstileSiteKey: getBuildTimeTurnstileSiteKey() };
      }

      return result;
    })
    .catch(() => ({ ok: true, turnstileSiteKey: getBuildTimeTurnstileSiteKey() }));

  return publicConfigPromise;
}
