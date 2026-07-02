const turnstileVerifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function readClientIp(request) {
  const forwarded = request.headers.get('CF-Connecting-IP') ?? request.headers.get('x-forwarded-for') ?? '';
  return forwarded.split(',')[0]?.trim() ?? '';
}

function toIso(value = new Date()) {
  return value.toISOString();
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function buildRequesterKey(request, scope) {
  const ip = readClientIp(request) || 'unknown';
  const userAgent = (request.headers.get('user-agent') ?? '').slice(0, 180);
  return sha256Hex(`${scope}:${ip}:${userAgent}`);
}

export async function enforceRateLimit(env, request, { scope, maxRequests, windowSeconds }) {
  if (!env.DB) {
    return;
  }

  const keyHash = await buildRequesterKey(request, scope);
  const now = new Date();
  const row = await env.DB.prepare(
    `SELECT scope, key_hash, window_started_at, request_count
     FROM request_rate_limits
     WHERE scope = ? AND key_hash = ?`,
  )
    .bind(scope, keyHash)
    .first();

  if (!row) {
    await env.DB.prepare(
      `INSERT INTO request_rate_limits (scope, key_hash, window_started_at, request_count, updated_at)
       VALUES (?, ?, ?, 1, ?)`,
    )
      .bind(scope, keyHash, toIso(now), toIso(now))
      .run();
    return;
  }

  const startedAt = new Date(row.window_started_at);
  const elapsedMs = now.getTime() - startedAt.getTime();
  if (!Number.isFinite(elapsedMs) || elapsedMs >= windowSeconds * 1000) {
    await env.DB.prepare(
      `UPDATE request_rate_limits
       SET window_started_at = ?, request_count = 1, updated_at = ?
       WHERE scope = ? AND key_hash = ?`,
    )
      .bind(toIso(now), toIso(now), scope, keyHash)
      .run();
    return;
  }

  const nextCount = Number(row.request_count ?? 0) + 1;
  if (nextCount > maxRequests) {
    throw new Error('Too many requests from this browser right now. Please wait a few minutes and try again.');
  }

  await env.DB.prepare(
    `UPDATE request_rate_limits
     SET request_count = ?, updated_at = ?
     WHERE scope = ? AND key_hash = ?`,
  )
    .bind(nextCount, toIso(now), scope, keyHash)
    .run();
}

export async function verifyTurnstileToken(env, request, token, action) {
  const secret = typeof env.TURNSTILE_SECRET_KEY === 'string' ? env.TURNSTILE_SECRET_KEY.trim() : '';
  if (!secret) {
    return;
  }

  if (typeof token !== 'string' || !token.trim()) {
    throw new Error('Please complete the spam protection check and try again.');
  }

  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token.trim());

  const remoteIp = readClientIp(request);
  if (remoteIp) {
    body.set('remoteip', remoteIp);
  }

  const response = await fetch(turnstileVerifyEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    throw new Error('Spam protection could not be verified right now. Please try again.');
  }

  const result = await response.json().catch(() => null);
  if (!result?.success) {
    throw new Error('Spam protection check failed. Please refresh and try again.');
  }

  if (action && result.action && result.action !== action) {
    throw new Error('Spam protection check did not match this action. Please try again.');
  }
}
