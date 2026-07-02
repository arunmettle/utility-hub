import { enforceRateLimit, verifyTurnstileToken } from './_requestGuards.js';

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

const roomLifetimeHours = 48;
const maxParticipants = 20;
const maxStories = 50;

const cardSets = {
  fibonacci: ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', 'Coffee'],
  tshirt: ['XS', 'S', 'M', 'L', 'XL', '?', 'Coffee'],
  sequential: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '?'],
  risk: ['Low', 'Medium', 'High', 'Critical', '?'],
  custom: ['1', '2', '3', '5', '8'],
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

function notFound(message = 'Planning Poker room not found.') {
  return jsonResponse({ ok: false, error: message }, 404);
}

function badRequest(message) {
  return jsonResponse({ ok: false, error: message }, 400);
}

function makeId() {
  return crypto.randomUUID();
}

function makeRoomId() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
}

function toIso(value = new Date()) {
  return value.toISOString();
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function readString(value, field, { required = true, maxLength = 500 } = {}) {
  if (typeof value !== 'string') {
    if (required) {
      throw new Error(`${field} is required.`);
    }
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed && required) {
    throw new Error(`${field} is required.`);
  }

  if (trimmed.length > maxLength) {
    throw new Error(`${field} must be ${maxLength} characters or fewer.`);
  }

  return trimmed;
}

function readArray(value, field) {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array.`);
  }

  return value;
}

function readCardSetId(value) {
  const cardSetId = readString(value, 'cardSetId');
  if (!(cardSetId in cardSets)) {
    throw new Error('cardSetId is invalid.');
  }

  return cardSetId;
}

function parseCustomCards(source) {
  const cards = source
    .split(/[,\n|]/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return cards.filter((entry, index) => cards.indexOf(entry) === index);
}

function getAllowedCards(cardSetId, customCardsSource) {
  if (cardSetId !== 'custom') {
    return cardSets[cardSetId];
  }

  const parsed = parseCustomCards(customCardsSource);
  return parsed.length > 0 ? parsed : cardSets.custom;
}

function readStories(value) {
  const stories = readArray(value, 'stories');
  if (stories.length === 0) {
    throw new Error('stories must contain at least one item.');
  }

  if (stories.length > maxStories) {
    throw new Error(`stories must contain ${maxStories} items or fewer.`);
  }

  return stories.map((story, index) => {
    if (!story || typeof story !== 'object' || Array.isArray(story)) {
      throw new Error(`stories[${index}] must be an object.`);
    }

    return {
      label: readString(story.label, `stories[${index}].label`, { maxLength: 160 }),
      url: readString(story.url, `stories[${index}].url`, { required: false, maxLength: 1000 }),
      title: readString(story.title, `stories[${index}].title`, { required: false, maxLength: 240 }),
    };
  });
}

function readParticipantNames(value) {
  const names = readArray(value, 'participantNames');
  if (names.length === 0) {
    throw new Error('participantNames must contain at least one name.');
  }

  if (names.length > maxParticipants) {
    throw new Error(`participantNames must contain ${maxParticipants} names or fewer.`);
  }

  const trimmed = names.map((name, index) => readString(name, `participantNames[${index}]`, { maxLength: 80 }));
  return trimmed.filter((name, index) => trimmed.indexOf(name) === index);
}

async function readPayload(request) {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error('Expected an application/json request body.');
  }

  const text = await request.text();
  if (text.length > 100_000) {
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

function summarizePlanningPokerRound(participants, votes, revealed) {
  const tallyMap = new Map();
  const missingParticipants = [];
  const outlierNames = [];
  const numericVotes = [];
  const nonNumericVotes = [];

  for (const participant of participants) {
    const vote = votes[participant.participant_id]?.trim() ?? '';
    if (!vote) {
      missingParticipants.push(participant.name);
      continue;
    }

    const currentTally = tallyMap.get(vote) ?? { count: 0, participantNames: [] };
    currentTally.count += 1;
    currentTally.participantNames.push(participant.name);
    tallyMap.set(vote, currentTally);
    if (/^-?\d+(\.\d+)?$/.test(vote)) {
      numericVotes.push({ name: participant.name, value: Number(vote) });
    } else {
      nonNumericVotes.push(vote);
    }
  }

  const tally = [...tallyMap.entries()]
    .map(([value, bucket]) => ({
      value,
      count: bucket.count,
      participantNames: bucket.participantNames.sort((left, right) => left.localeCompare(right)),
    }))
    .sort((left, right) => right.count - left.count || left.value.localeCompare(right.value));

  const values = numericVotes.map((entry) => entry.value);
  const average = values.length > 0 ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : null;
  const lowest = values.length > 0 ? Math.min(...values) : null;
  const highest = values.length > 0 ? Math.max(...values) : null;
  const spread = values.length > 1 && lowest !== null && highest !== null ? highest - lowest : null;

  if (revealed && average !== null && spread !== null && spread > 0) {
    const distanceThreshold = Math.max(spread / 2, 2);
    for (const vote of numericVotes) {
      if (Math.abs(vote.value - average) >= distanceThreshold) {
        outlierNames.push(vote.name);
      }
    }
  }

  const consensus = tally.length <= 1 && tally.length > 0 && missingParticipants.length === 0;

  return {
    totalParticipants: participants.length,
    votesCast: participants.length - missingParticipants.length,
    revealedVotes: revealed ? participants.length - missingParticipants.length : 0,
    missingParticipants,
    average,
    lowest,
    highest,
    spread,
    consensus,
    consensusLabel:
      tally.length === 0
        ? 'Waiting for votes'
        : consensus
          ? 'Consensus reached'
          : missingParticipants.length > 0
            ? 'Voting in progress'
            : 'Discussion recommended',
    outlierNames,
    tally,
    numericVoteCount: numericVotes.length,
    nonNumericVotes: [...new Set(nonNumericVotes)],
  };
}

async function getRoomRow(env, roomId) {
  return env.DB.prepare(
    `SELECT room_id, room_name, host_name, host_token, card_set_id, custom_cards_source, current_story_id, revealed, status, created_at, updated_at, expires_at
     FROM planning_poker_rooms
     WHERE room_id = ?`,
  )
    .bind(roomId)
    .first();
}

async function ensureRoom(env, roomId) {
  const room = await getRoomRow(env, roomId);
  if (!room) {
    throw new Error('Planning Poker room not found.');
  }

  if (new Date(room.expires_at).getTime() < Date.now()) {
    throw new Error('Planning Poker room has expired.');
  }

  return room;
}

async function touchRoom(env, roomId) {
  const now = new Date();
  await env.DB.prepare('UPDATE planning_poker_rooms SET updated_at = ?, expires_at = ? WHERE room_id = ?')
    .bind(toIso(now), toIso(addHours(now, roomLifetimeHours)), roomId)
    .run();
}

async function fetchRoomSnapshot(env, roomId, viewer = {}) {
  const room = await ensureRoom(env, roomId);
  const [participantsResult, storiesResult, votesResult, roundsResult] = await Promise.all([
    env.DB.prepare(
      `SELECT participant_id, name, joined_at
       FROM planning_poker_participants
       WHERE room_id = ?
       ORDER BY created_at ASC`,
    )
      .bind(roomId)
      .all(),
    env.DB.prepare(
      `SELECT story_id, label, url, title, status, final_estimate, round_number
       FROM planning_poker_stories
       WHERE room_id = ?
       ORDER BY sort_order ASC`,
    )
      .bind(roomId)
      .all(),
    room.current_story_id
      ? env.DB.prepare(
          `SELECT participant_id, vote
           FROM planning_poker_votes
           WHERE room_id = ? AND story_id = ?`,
        )
          .bind(roomId, room.current_story_id)
          .all()
      : Promise.resolve({ results: [] }),
    env.DB.prepare(
      `SELECT round_id, story_id, story_label, story_title, story_url, final_estimate, card_set_id, card_set_name, round_number, summary_json, votes_json, created_at
       FROM planning_poker_rounds
       WHERE room_id = ?
       ORDER BY created_at DESC
       LIMIT 20`,
    )
      .bind(roomId)
      .all(),
  ]);

  const rawVotes = Object.fromEntries((votesResult.results ?? []).map((row) => [row.participant_id, row.vote]));
  const participantVoteIds = new Set(Object.keys(rawVotes));

  const participants = (participantsResult.results ?? []).map((participant) => ({
    id: participant.participant_id,
    name: participant.name,
    joinedAt: participant.joined_at ?? null,
    hasVoted: participantVoteIds.has(participant.participant_id),
  }));

  const visibleVotes =
    room.revealed === 1
      ? rawVotes
      : viewer.participantId && viewer.participantToken
        ? rawVotes[viewer.participantId]
          ? { [viewer.participantId]: rawVotes[viewer.participantId] }
          : {}
        : {};

  const stories = (storiesResult.results ?? []).map((story) => ({
    id: story.story_id,
    label: story.label,
    url: story.url,
    title: story.title,
    status: story.status,
    finalEstimate: story.final_estimate,
    roundNumber: story.round_number,
  }));

  const history = (roundsResult.results ?? []).map((round) => ({
    id: round.round_id,
    storyLabel: round.story_label,
    storyTitle: round.story_title,
    storyUrl: round.story_url,
    cardSetId: round.card_set_id,
    cardSetName: round.card_set_name,
    votes: JSON.parse(round.votes_json),
    finalEstimate: round.final_estimate,
    roundNumber: round.round_number,
    summary: JSON.parse(round.summary_json),
    createdAt: round.created_at,
  }));

  return {
    roomId: room.room_id,
    roomName: room.room_name,
    hostName: room.host_name,
    cardSetId: room.card_set_id,
    customCardsSource: room.custom_cards_source,
    revealed: room.revealed === 1,
    status: room.status,
    createdAt: room.created_at,
    updatedAt: room.updated_at,
    currentStoryId: room.current_story_id,
    participants,
    stories,
    currentVotes: visibleVotes,
    history,
  };
}

async function requireHost(env, roomId, hostToken) {
  const token = readString(hostToken, 'hostToken', { maxLength: 120 });
  const room = await ensureRoom(env, roomId);
  if (room.host_token !== token) {
    throw new Error('Host authorization failed.');
  }

  return room;
}

async function requireParticipant(env, roomId, participantId, participantToken) {
  const id = readString(participantId, 'participantId', { maxLength: 120 });
  const token = readString(participantToken, 'participantToken', { maxLength: 120 });
  const participant = await env.DB.prepare(
    `SELECT participant_id, room_id, name, access_token
     FROM planning_poker_participants
     WHERE room_id = ? AND participant_id = ?`,
  )
    .bind(roomId, id)
    .first();

  if (!participant || participant.access_token !== token) {
    throw new Error('Participant authorization failed.');
  }

  return participant;
}

async function createRoom(env, request, payload) {
  await enforceRateLimit(env, request, {
    scope: 'planning-poker:create-room',
    maxRequests: 6,
    windowSeconds: 15 * 60,
  });
  await verifyTurnstileToken(env, request, payload.turnstileToken, 'planning_poker_create_room');

  const roomId = makeRoomId();
  const hostToken = makeId();
  const roomName = readString(payload.roomName, 'roomName', { maxLength: 120 });
  const hostName = readString(payload.hostName, 'hostName', { maxLength: 80 });
  const cardSetId = readCardSetId(payload.cardSetId);
  const customCardsSource = readString(payload.customCardsSource, 'customCardsSource', {
    required: false,
    maxLength: 1000,
  });
  const participantNames = readParticipantNames(payload.participantNames);
  const stories = readStories(payload.stories);

  const createdAt = toIso();
  const expiresAt = toIso(addHours(new Date(), roomLifetimeHours));
  const storyIds = stories.map(() => makeId());
  const participantIds = participantNames.map(() => makeId());

  const statements = [
    env.DB.prepare(
      `INSERT INTO planning_poker_rooms (
        room_id, room_name, host_name, host_token, card_set_id, custom_cards_source, current_story_id, revealed, status, created_at, updated_at, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'active', ?, ?, ?)`,
    ).bind(roomId, roomName, hostName, hostToken, cardSetId, customCardsSource, storyIds[0], createdAt, createdAt, expiresAt),
  ];

  participantNames.forEach((name, index) => {
    statements.push(
      env.DB.prepare(
        `INSERT INTO planning_poker_participants (
          participant_id, room_id, name, access_token, joined_at, created_at
        ) VALUES (?, ?, ?, NULL, NULL, ?)`,
      ).bind(participantIds[index], roomId, name, createdAt),
    );
  });

  stories.forEach((story, index) => {
    statements.push(
      env.DB.prepare(
        `INSERT INTO planning_poker_stories (
          story_id, room_id, sort_order, label, url, title, status, final_estimate, round_number, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 1, ?, ?)`,
      ).bind(storyIds[index], roomId, index, story.label, story.url, story.title, index === 0 ? 'active' : 'pending', createdAt, createdAt),
    );
  });

  await env.DB.batch(statements);

  const room = await fetchRoomSnapshot(env, roomId, { hostToken });
  return { roomId, hostToken, room };
}

async function joinRoom(env, payload) {
  const roomId = readString(payload.roomId, 'roomId', { maxLength: 20 }).toUpperCase();
  const participantId = readString(payload.participantId, 'participantId', { maxLength: 120 });
  await ensureRoom(env, roomId);

  const participant = await env.DB.prepare(
    `SELECT participant_id, access_token
     FROM planning_poker_participants
     WHERE room_id = ? AND participant_id = ?`,
  )
    .bind(roomId, participantId)
    .first();

  if (!participant) {
    throw new Error('Participant not found in this room.');
  }

  const participantToken = makeId();
  const joinedAt = participant.joined_at ?? toIso();
  await env.DB.prepare(
    `UPDATE planning_poker_participants
     SET access_token = ?, joined_at = ?
     WHERE room_id = ? AND participant_id = ?`,
  )
    .bind(participantToken, joinedAt, roomId, participantId)
    .run();
  await touchRoom(env, roomId);

  const room = await fetchRoomSnapshot(env, roomId, { participantId, participantToken });
  return { participantToken, room };
}

async function recordVote(env, payload) {
  const roomId = readString(payload.roomId, 'roomId', { maxLength: 20 }).toUpperCase();
  const vote = readString(payload.vote, 'vote', { maxLength: 40 });
  const participant = await requireParticipant(env, roomId, payload.participantId, payload.participantToken);
  const room = await ensureRoom(env, roomId);

  if (!room.current_story_id) {
    throw new Error('There is no active story to estimate.');
  }

  if (room.revealed === 1) {
    throw new Error('Votes are already revealed for this story. Reset or finalize before voting again.');
  }

  const allowedCards = getAllowedCards(room.card_set_id, room.custom_cards_source);
  if (!allowedCards.includes(vote)) {
    throw new Error('Vote is not valid for the active card set.');
  }

  await env.DB.prepare(
    `INSERT INTO planning_poker_votes (room_id, story_id, participant_id, vote, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(room_id, story_id, participant_id)
     DO UPDATE SET vote = excluded.vote, updated_at = excluded.updated_at`,
  )
    .bind(roomId, room.current_story_id, participant.participant_id, vote, toIso())
    .run();
  await touchRoom(env, roomId);

  return fetchRoomSnapshot(env, roomId, {
    participantId: participant.participant_id,
    participantToken: payload.participantToken,
  });
}

async function revealRoom(env, payload) {
  const roomId = readString(payload.roomId, 'roomId', { maxLength: 20 }).toUpperCase();
  await requireHost(env, roomId, payload.hostToken);

  await env.DB.prepare(
    `UPDATE planning_poker_rooms
     SET revealed = 1, updated_at = ?, expires_at = ?
     WHERE room_id = ?`,
  )
    .bind(toIso(), toIso(addHours(new Date(), roomLifetimeHours)), roomId)
    .run();

  return fetchRoomSnapshot(env, roomId, { hostToken: payload.hostToken });
}

async function resetRound(env, payload) {
  const roomId = readString(payload.roomId, 'roomId', { maxLength: 20 }).toUpperCase();
  const room = await requireHost(env, roomId, payload.hostToken);

  if (!room.current_story_id) {
    throw new Error('There is no active story to reset.');
  }

  await env.DB.batch([
    env.DB.prepare('DELETE FROM planning_poker_votes WHERE room_id = ? AND story_id = ?').bind(roomId, room.current_story_id),
    env.DB.prepare(
      `UPDATE planning_poker_rooms
       SET revealed = 0, updated_at = ?, expires_at = ?
       WHERE room_id = ?`,
    ).bind(toIso(), toIso(addHours(new Date(), roomLifetimeHours)), roomId),
  ]);

  return fetchRoomSnapshot(env, roomId, { hostToken: payload.hostToken });
}

async function finalizeStory(env, payload) {
  const roomId = readString(payload.roomId, 'roomId', { maxLength: 20 }).toUpperCase();
  const finalEstimate = readString(payload.finalEstimate, 'finalEstimate', { maxLength: 40 });
  const room = await requireHost(env, roomId, payload.hostToken);

  if (!room.current_story_id) {
    throw new Error('There is no active story to finalize.');
  }

  const [participantsResult, story, votesResult, nextStoryResult] = await Promise.all([
    env.DB.prepare(
      `SELECT participant_id, name
       FROM planning_poker_participants
       WHERE room_id = ?
       ORDER BY created_at ASC`,
    )
      .bind(roomId)
      .all(),
    env.DB.prepare(
      `SELECT story_id, label, url, title, round_number
       FROM planning_poker_stories
       WHERE room_id = ? AND story_id = ?`,
    )
      .bind(roomId, room.current_story_id)
      .first(),
    env.DB.prepare(
      `SELECT participant_id, vote
       FROM planning_poker_votes
       WHERE room_id = ? AND story_id = ?`,
    )
      .bind(roomId, room.current_story_id)
      .all(),
    env.DB.prepare(
      `SELECT story_id
       FROM planning_poker_stories
       WHERE room_id = ? AND status = 'pending'
       ORDER BY sort_order ASC
       LIMIT 1`,
    )
      .bind(roomId)
      .first(),
  ]);

  if (!story) {
    throw new Error('Active story could not be found.');
  }

  const votes = Object.fromEntries((votesResult.results ?? []).map((row) => [row.participant_id, row.vote]));
  const summary = summarizePlanningPokerRound(participantsResult.results ?? [], votes, true);
  const roundId = makeId();
  const now = new Date();
  const nextStoryId = nextStoryResult?.story_id ?? null;
  const nextStatus = nextStoryId ? 'active' : 'completed';

  const statements = [
    env.DB.prepare(
      `INSERT INTO planning_poker_rounds (
        round_id, room_id, story_id, story_label, story_title, story_url, final_estimate, card_set_id, card_set_name, round_number, summary_json, votes_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      roundId,
      roomId,
      story.story_id,
      story.label,
      story.title,
      story.url,
      finalEstimate,
      room.card_set_id,
      room.card_set_id === 'custom' ? 'Custom' : room.card_set_id,
      story.round_number,
      JSON.stringify(summary),
      JSON.stringify(votes),
      toIso(now),
    ),
    env.DB.prepare(
      `UPDATE planning_poker_stories
       SET status = 'finalized', final_estimate = ?, updated_at = ?
       WHERE room_id = ? AND story_id = ?`,
    ).bind(finalEstimate, toIso(now), roomId, story.story_id),
    env.DB.prepare(
      `UPDATE planning_poker_rooms
       SET current_story_id = ?, revealed = 0, status = ?, updated_at = ?, expires_at = ?
       WHERE room_id = ?`,
    ).bind(nextStoryId, nextStatus, toIso(now), toIso(addHours(now, roomLifetimeHours)), roomId),
  ];

  if (nextStoryId) {
    statements.push(
      env.DB.prepare(
        `UPDATE planning_poker_stories
         SET status = 'active', updated_at = ?
         WHERE room_id = ? AND story_id = ?`,
      ).bind(toIso(now), roomId, nextStoryId),
    );
  }

  await env.DB.batch(statements);

  return fetchRoomSnapshot(env, roomId, { hostToken: payload.hostToken });
}

async function reestimateStory(env, payload) {
  const roomId = readString(payload.roomId, 'roomId', { maxLength: 20 }).toUpperCase();
  const storyId = readString(payload.storyId, 'storyId', { maxLength: 120 });
  await requireHost(env, roomId, payload.hostToken);

  const story = await env.DB.prepare(
    `SELECT story_id, round_number
     FROM planning_poker_stories
     WHERE room_id = ? AND story_id = ?`,
  )
    .bind(roomId, storyId)
    .first();

  if (!story) {
    throw new Error('Story not found.');
  }

  const now = new Date();
  await env.DB.batch([
    env.DB.prepare(
      `UPDATE planning_poker_stories
       SET status = CASE WHEN story_id = ? THEN 'active' ELSE CASE WHEN status = 'active' THEN 'pending' ELSE status END END,
           final_estimate = CASE WHEN story_id = ? THEN NULL ELSE final_estimate END,
           round_number = CASE WHEN story_id = ? THEN round_number + 1 ELSE round_number END,
           updated_at = ?
       WHERE room_id = ?`,
    ).bind(storyId, storyId, storyId, toIso(now), roomId),
    env.DB.prepare('DELETE FROM planning_poker_votes WHERE room_id = ? AND story_id = ?').bind(roomId, storyId),
    env.DB.prepare(
      `UPDATE planning_poker_rooms
       SET current_story_id = ?, revealed = 0, status = 'active', updated_at = ?, expires_at = ?
       WHERE room_id = ?`,
    ).bind(storyId, toIso(now), toIso(addHours(now, roomLifetimeHours)), roomId),
  ]);

  return fetchRoomSnapshot(env, roomId, { hostToken: payload.hostToken });
}

async function addStories(env, payload) {
  const roomId = readString(payload.roomId, 'roomId', { maxLength: 20 }).toUpperCase();
  await requireHost(env, roomId, payload.hostToken);
  const stories = readStories(payload.stories);
  const now = toIso();
  const existingOrderResult = await env.DB.prepare(
    `SELECT COALESCE(MAX(sort_order), -1) AS max_order
     FROM planning_poker_stories
     WHERE room_id = ?`,
  )
    .bind(roomId)
    .first();

  const startOrder = Number(existingOrderResult?.max_order ?? -1) + 1;
  const statements = stories.map((story, index) =>
    env.DB.prepare(
      `INSERT INTO planning_poker_stories (
        story_id, room_id, sort_order, label, url, title, status, final_estimate, round_number, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NULL, 1, ?, ?)`,
    ).bind(makeId(), roomId, startOrder + index, story.label, story.url, story.title, now, now),
  );

  statements.push(
    env.DB.prepare('UPDATE planning_poker_rooms SET updated_at = ?, expires_at = ? WHERE room_id = ?').bind(
      now,
      toIso(addHours(new Date(), roomLifetimeHours)),
      roomId,
    ),
  );

  await env.DB.batch(statements);
  return fetchRoomSnapshot(env, roomId, { hostToken: payload.hostToken });
}

async function activateStory(env, payload) {
  const roomId = readString(payload.roomId, 'roomId', { maxLength: 20 }).toUpperCase();
  const storyId = readString(payload.storyId, 'storyId', { maxLength: 120 });
  await requireHost(env, roomId, payload.hostToken);

  const story = await env.DB.prepare(
    `SELECT story_id, status
     FROM planning_poker_stories
     WHERE room_id = ? AND story_id = ?`,
  )
    .bind(roomId, storyId)
    .first();

  if (!story) {
    throw new Error('Story not found.');
  }

  if (story.status === 'finalized') {
    throw new Error('Finalized stories should be reopened with re-estimate instead.');
  }

  const now = new Date();
  await env.DB.batch([
    env.DB.prepare(
      `UPDATE planning_poker_stories
       SET status = CASE WHEN story_id = ? THEN 'active' ELSE CASE WHEN status = 'active' THEN 'pending' ELSE status END END,
           updated_at = ?
       WHERE room_id = ?`,
    ).bind(storyId, toIso(now), roomId),
    env.DB.prepare('DELETE FROM planning_poker_votes WHERE room_id = ?').bind(roomId),
    env.DB.prepare(
      `UPDATE planning_poker_rooms
       SET current_story_id = ?, revealed = 0, status = 'active', updated_at = ?, expires_at = ?
       WHERE room_id = ?`,
    ).bind(storyId, toIso(now), toIso(addHours(now, roomLifetimeHours)), roomId),
  ]);

  return fetchRoomSnapshot(env, roomId, { hostToken: payload.hostToken });
}

async function removeStory(env, payload) {
  const roomId = readString(payload.roomId, 'roomId', { maxLength: 20 }).toUpperCase();
  const storyId = readString(payload.storyId, 'storyId', { maxLength: 120 });
  const room = await requireHost(env, roomId, payload.hostToken);

  const story = await env.DB.prepare(
    `SELECT story_id, status
     FROM planning_poker_stories
     WHERE room_id = ? AND story_id = ?`,
  )
    .bind(roomId, storyId)
    .first();

  if (!story) {
    throw new Error('Story not found.');
  }

  if (story.status === 'finalized') {
    throw new Error('Finalized stories cannot be removed from the completed session list.');
  }

  const now = new Date();
  const statements = [
    env.DB.prepare('DELETE FROM planning_poker_stories WHERE room_id = ? AND story_id = ?').bind(roomId, storyId),
    env.DB.prepare('DELETE FROM planning_poker_votes WHERE room_id = ? AND story_id = ?').bind(roomId, storyId),
  ];

  if (room.current_story_id === storyId) {
    const nextStory = await env.DB.prepare(
      `SELECT story_id
       FROM planning_poker_stories
       WHERE room_id = ? AND story_id != ? AND status = 'pending'
       ORDER BY sort_order ASC
       LIMIT 1`,
    )
      .bind(roomId, storyId)
      .first();

    if (nextStory?.story_id) {
      statements.push(
        env.DB.prepare(
          `UPDATE planning_poker_stories
           SET status = 'active', updated_at = ?
           WHERE room_id = ? AND story_id = ?`,
        ).bind(toIso(now), roomId, nextStory.story_id),
      );
    }

    statements.push(
      env.DB.prepare(
        `UPDATE planning_poker_rooms
         SET current_story_id = ?, revealed = 0, status = ?, updated_at = ?, expires_at = ?
         WHERE room_id = ?`,
      ).bind(
        nextStory?.story_id ?? null,
        nextStory?.story_id ? 'active' : 'completed',
        toIso(now),
        toIso(addHours(now, roomLifetimeHours)),
        roomId,
      ),
    );
  } else {
    statements.push(
      env.DB.prepare('UPDATE planning_poker_rooms SET updated_at = ?, expires_at = ? WHERE room_id = ?').bind(
        toIso(now),
        toIso(addHours(now, roomLifetimeHours)),
        roomId,
      ),
    );
  }

  await env.DB.batch(statements);
  return fetchRoomSnapshot(env, roomId, { hostToken: payload.hostToken });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  if (!env.DB) {
    return jsonResponse({ ok: false, error: 'Planning Poker storage is not configured.' }, 500);
  }

  try {
    if (request.method === 'GET') {
      const url = new URL(request.url);
      const roomId = readString(url.searchParams.get('roomId') ?? '', 'roomId', { maxLength: 20 }).toUpperCase();
      const hostToken = url.searchParams.get('hostToken') ?? undefined;
      const participantId = url.searchParams.get('participantId') ?? undefined;
      const participantToken = url.searchParams.get('participantToken') ?? undefined;

      const room = await fetchRoomSnapshot(env, roomId, { hostToken, participantId, participantToken });
      return jsonResponse({ ok: true, room });
    }

    if (request.method !== 'POST') {
      return methodNotAllowed();
    }

    const payload = await readPayload(request);
    const action = readString(payload.action, 'action', { maxLength: 80 });

    if (action === 'create-room') {
      const result = await createRoom(env, request, payload);
      return jsonResponse({ ok: true, roomId: result.roomId, hostToken: result.hostToken, room: result.room }, 201);
    }

    if (action === 'join-room') {
      const result = await joinRoom(env, payload);
      return jsonResponse({ ok: true, participantToken: result.participantToken, room: result.room });
    }

    if (action === 'vote') {
      const room = await recordVote(env, payload);
      return jsonResponse({ ok: true, room });
    }

    if (action === 'reveal-room') {
      const room = await revealRoom(env, payload);
      return jsonResponse({ ok: true, room });
    }

    if (action === 'reset-round') {
      const room = await resetRound(env, payload);
      return jsonResponse({ ok: true, room });
    }

    if (action === 'finalize-story') {
      const room = await finalizeStory(env, payload);
      return jsonResponse({ ok: true, room });
    }

    if (action === 'reestimate-story') {
      const room = await reestimateStory(env, payload);
      return jsonResponse({ ok: true, room });
    }

    if (action === 'add-stories') {
      const room = await addStories(env, payload);
      return jsonResponse({ ok: true, room });
    }

    if (action === 'activate-story') {
      const room = await activateStory(env, payload);
      return jsonResponse({ ok: true, room });
    }

    if (action === 'remove-story') {
      const room = await removeStory(env, payload);
      return jsonResponse({ ok: true, room });
    }

    return badRequest('Unknown Planning Poker action.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Planning Poker request failed.';
    if (message.includes('not found') || message.includes('expired')) {
      return notFound(message);
    }

    return message.includes('Too many requests') ? jsonResponse({ ok: false, error: message }, 429) : badRequest(message);
  }
}
