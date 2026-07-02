const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

export async function onRequestGet(context) {
  const { env } = context;
  const turnstileSiteKey =
    (typeof env.TURNSTILE_SITE_KEY === 'string' && env.TURNSTILE_SITE_KEY.trim()) ||
    (typeof env.VITE_TURNSTILE_SITE_KEY === 'string' && env.VITE_TURNSTILE_SITE_KEY.trim()) ||
    '';

  return new Response(
    JSON.stringify({
      ok: true,
      turnstileSiteKey,
    }),
    {
      status: 200,
      headers: jsonHeaders,
    },
  );
}
