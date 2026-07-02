import { enforceRateLimit, verifyTurnstileToken } from './_requestGuards.js';

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

const textLimits = {
  workflow: 4000,
  missing: 4000,
  title: 180,
  painPoint: 4000,
  idealOutcome: 4000,
  workaround: 4000,
  email: 254,
  toolId: 120,
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}

function methodNotAllowed() {
  return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405);
}

function readString(value, field, required = true) {
  if (typeof value !== 'string') {
    if (required) {
      throw new Error(`${field} is required.`);
    }
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    if (required) {
      throw new Error(`${field} is required.`);
    }
    return null;
  }

  const limit = textLimits[field] ?? 1000;
  if (trimmed.length > limit) {
    throw new Error(`${field} must be ${limit} characters or fewer.`);
  }

  return trimmed;
}

function readEmail(value) {
  const email = readString(value, 'email', false);
  if (!email) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('email must be a valid email address.');
  }

  return email;
}

function readEnum(value, field, allowed) {
  if (typeof value !== 'string' || !allowed.includes(value)) {
    throw new Error(`${field} is invalid.`);
  }

  return value;
}

async function readPayload(request) {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error('Expected an application/json request body.');
  }

  const text = await request.text();
  if (text.length > 20_000) {
    throw new Error('Request body is too large.');
  }

  try {
    const payload = JSON.parse(text);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('Request body must be a JSON object.');
    }
    return payload;
  } catch {
    throw new Error('Request body must be valid JSON.');
  }
}

async function createFeedback(env, payload) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const toolId = readString(payload.toolId, 'toolId', false) ?? '';
  const workflow = readString(payload.workflow, 'workflow');
  const outcome = readEnum(payload.outcome, 'outcome', ['worked', 'partly-worked', 'did-not-work']);
  const missing = readString(payload.missing, 'missing');
  const email = readEmail(payload.email);
  const canContact = payload.canContact === true ? 1 : 0;

  await env.DB.prepare(
    `INSERT INTO feedback_submissions (
      id, created_at, tool_id, workflow, outcome, missing, email, can_contact
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, createdAt, toolId, workflow, outcome, missing, email, canContact)
    .run();

  return { id, createdAt };
}

async function createWishlist(env, payload) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const requestType = readEnum(payload.requestType, 'requestType', ['new-tool', 'improve-tool', 'workflow']);
  const title = readString(payload.title, 'title');
  const toolId = readString(payload.toolId, 'toolId', false);
  const painPoint = readString(payload.painPoint, 'painPoint');
  const idealOutcome = readString(payload.idealOutcome, 'idealOutcome');
  const workaround = readString(payload.workaround, 'workaround', false);
  const email = readEmail(payload.email);

  await env.DB.prepare(
    `INSERT INTO wishlist_submissions (
      id, created_at, request_type, title, tool_id, pain_point, ideal_outcome, workaround, email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, createdAt, requestType, title, toolId, painPoint, idealOutcome, workaround, email)
    .run();

  return { id, createdAt };
}

export async function onRequest(context) {
  const { request, env, params } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  if (request.method !== 'POST') {
    return methodNotAllowed();
  }

  if (!env.DB) {
    return jsonResponse({ ok: false, error: 'Submission database is not configured.' }, 500);
  }

  const submissionType = params.submission;
  if (submissionType !== 'feedback' && submissionType !== 'wishlist') {
    return jsonResponse({ ok: false, error: 'Unknown submission endpoint.' }, 404);
  }

  try {
    const payload = await readPayload(request);
    await enforceRateLimit(env, request, {
      scope: `submission:${submissionType}`,
      maxRequests: 5,
      windowSeconds: 15 * 60,
    });
    await verifyTurnstileToken(
      env,
      request,
      payload.turnstileToken,
      submissionType === 'feedback' ? 'feedback_submit' : 'wishlist_submit',
    );
    const submission =
      submissionType === 'feedback' ? await createFeedback(env, payload) : await createWishlist(env, payload);

    return jsonResponse({ ok: true, submission });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save submission.';
    const status = message.includes('Too many requests') ? 429 : 400;
    return jsonResponse({ ok: false, error: message }, status);
  }
}
