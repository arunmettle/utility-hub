import {
  buildPlanningPokerStory,
  createPlanningPokerRoundRecord,
  getPlanningPokerCardSet,
  resetPlanningPokerStoryForReestimate,
  summarizePlanningPokerRound,
  type PlanningPokerCardSetId,
  type PlanningPokerRoomSnapshot,
} from './planningPoker';

interface ApiResponse<T> {
  ok: boolean;
  room?: T;
  roomId?: string;
  hostToken?: string;
  participantToken?: string;
  error?: string;
}

export interface PlanningPokerCreateRoomInput {
  roomName: string;
  hostName: string;
  cardSetId: PlanningPokerCardSetId;
  customCardsSource: string;
  participantNames: string[];
  stories: Array<{ label: string; url: string; title: string }>;
  turnstileToken?: string;
}

export interface PlanningPokerJoinRoomInput {
  roomId: string;
  participantId: string;
}

export interface PlanningPokerParticipantAuth {
  participantId: string;
  participantToken: string;
}

export interface PlanningPokerHostAuth {
  hostToken: string;
}

interface LocalPlanningPokerStore {
  rooms: Record<
    string,
    {
      room: PlanningPokerRoomSnapshot;
      hostToken: string;
      participantTokens: Record<string, string>;
    }
  >;
}

const localStoreKey = 'utilityhub:planning-poker:local-store:v1';

function makeId() {
  return crypto.randomUUID();
}

function makeRoomId() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
}

function readJson<T>(response: Response) {
  return response.json().catch(() => null) as Promise<ApiResponse<T> | null>;
}

async function tryRemote<T>(url: string, init?: RequestInit) {
  if (import.meta.env.DEV) {
    return null;
  }

  const response = await fetch(url, init);
  const result = await readJson<T>(response);

  if (!response.ok || !result?.ok) {
    throw new Error(result?.error ?? 'Planning Poker request failed.');
  }

  return result;
}

function readLocalStore(): LocalPlanningPokerStore {
  try {
    const raw = window.localStorage.getItem(localStoreKey);
    if (!raw) {
      return { rooms: {} };
    }

    const parsed = JSON.parse(raw) as LocalPlanningPokerStore;
    return parsed.rooms ? parsed : { rooms: {} };
  } catch {
    return { rooms: {} };
  }
}

function writeLocalStore(store: LocalPlanningPokerStore) {
  window.localStorage.setItem(localStoreKey, JSON.stringify(store));
}

function withLocalStore<T>(callback: (store: LocalPlanningPokerStore) => T) {
  const store = readLocalStore();
  const result = callback(store);
  writeLocalStore(store);
  return result;
}

function cloneRoomForViewer(
  room: PlanningPokerRoomSnapshot,
  auth?: Partial<PlanningPokerParticipantAuth & PlanningPokerHostAuth>,
): PlanningPokerRoomSnapshot {
  if (room.revealed || auth?.hostToken) {
    return structuredClone(room);
  }

  if (auth?.participantId) {
    const vote = room.currentVotes[auth.participantId];
    return {
      ...structuredClone(room),
      currentVotes: vote ? { [auth.participantId]: vote } : {},
    };
  }

  return {
    ...structuredClone(room),
    currentVotes: {},
  };
}

function getCurrentStory(room: PlanningPokerRoomSnapshot) {
  return room.stories.find((story) => story.id === room.currentStoryId) ?? null;
}

function clearVotes(room: PlanningPokerRoomSnapshot) {
  room.currentVotes = {};
  room.participants = room.participants.map((participant) => ({
    ...participant,
    hasVoted: false,
  }));
  room.revealed = false;
  room.updatedAt = new Date().toISOString();
}

function ensureLocalRoom(store: LocalPlanningPokerStore, roomId: string) {
  const entry = store.rooms[roomId];
  if (!entry) {
    throw new Error('Planning Poker room not found.');
  }

  return entry;
}

function createLocalRoom(input: PlanningPokerCreateRoomInput) {
  return withLocalStore((store) => {
    const roomId = makeRoomId();
    const hostToken = makeId();
    const createdAt = new Date().toISOString();
    const stories = input.stories.map((story, index) =>
      buildPlanningPokerStory(story, makeId, index === 0 ? 'active' : 'pending'),
    );
    const participants = input.participantNames.map((name) => ({
      id: makeId(),
      name,
      joinedAt: null,
      hasVoted: false,
    }));

    const room: PlanningPokerRoomSnapshot = {
      roomId,
      roomName: input.roomName,
      hostName: input.hostName,
      cardSetId: input.cardSetId,
      customCardsSource: input.customCardsSource,
      revealed: false,
      status: 'active',
      createdAt,
      updatedAt: createdAt,
      currentStoryId: stories[0]?.id ?? null,
      participants,
      stories,
      currentVotes: {},
      history: [],
    };

    store.rooms[roomId] = {
      room,
      hostToken,
      participantTokens: {},
    };

    return {
      ok: true,
      roomId,
      hostToken,
      room,
    } satisfies ApiResponse<PlanningPokerRoomSnapshot>;
  });
}

function joinLocalRoom(input: PlanningPokerJoinRoomInput) {
  return withLocalStore((store) => {
    const entry = ensureLocalRoom(store, input.roomId);
    const participant = entry.room.participants.find((row) => row.id === input.participantId);
    if (!participant) {
      throw new Error('Participant not found in this room.');
    }

    const participantToken = makeId();
    entry.participantTokens[input.participantId] = participantToken;
    participant.joinedAt = participant.joinedAt ?? new Date().toISOString();
    entry.room.updatedAt = participant.joinedAt;

    return {
      ok: true,
      participantToken,
      room: cloneRoomForViewer(entry.room, {
        participantId: input.participantId,
        participantToken,
      }),
    } satisfies ApiResponse<PlanningPokerRoomSnapshot>;
  });
}

function getLocalRoom(roomId: string, auth?: Partial<PlanningPokerParticipantAuth & PlanningPokerHostAuth>) {
  return withLocalStore((store) => {
    const entry = ensureLocalRoom(store, roomId);
    if (auth?.hostToken && auth.hostToken !== entry.hostToken) {
      throw new Error('Host authorization failed.');
    }

    if (auth?.participantId && auth.participantToken && entry.participantTokens[auth.participantId] !== auth.participantToken) {
      throw new Error('Participant authorization failed.');
    }

    return {
      ok: true,
      room: cloneRoomForViewer(entry.room, auth),
    } satisfies ApiResponse<PlanningPokerRoomSnapshot>;
  });
}

function voteInLocalRoom(roomId: string, vote: string, auth: PlanningPokerParticipantAuth) {
  return withLocalStore((store) => {
    const entry = ensureLocalRoom(store, roomId);
    if (entry.participantTokens[auth.participantId] !== auth.participantToken) {
      throw new Error('Participant authorization failed.');
    }

    if (entry.room.revealed) {
      throw new Error('Votes are already revealed for this story.');
    }

    entry.room.currentVotes[auth.participantId] = vote;
    entry.room.participants = entry.room.participants.map((participant) =>
      participant.id === auth.participantId ? { ...participant, hasVoted: true } : participant,
    );
    entry.room.updatedAt = new Date().toISOString();

    return {
      ok: true,
      room: cloneRoomForViewer(entry.room, auth),
    } satisfies ApiResponse<PlanningPokerRoomSnapshot>;
  });
}

function revealLocalRoom(roomId: string, auth: PlanningPokerHostAuth) {
  return withLocalStore((store) => {
    const entry = ensureLocalRoom(store, roomId);
    if (entry.hostToken !== auth.hostToken) {
      throw new Error('Host authorization failed.');
    }

    entry.room.revealed = true;
    entry.room.updatedAt = new Date().toISOString();

    return {
      ok: true,
      room: structuredClone(entry.room),
    } satisfies ApiResponse<PlanningPokerRoomSnapshot>;
  });
}

function resetLocalRoom(roomId: string, auth: PlanningPokerHostAuth) {
  return withLocalStore((store) => {
    const entry = ensureLocalRoom(store, roomId);
    if (entry.hostToken !== auth.hostToken) {
      throw new Error('Host authorization failed.');
    }

    clearVotes(entry.room);

    return {
      ok: true,
      room: structuredClone(entry.room),
    } satisfies ApiResponse<PlanningPokerRoomSnapshot>;
  });
}

function finalizeLocalStory(roomId: string, finalEstimate: string, auth: PlanningPokerHostAuth) {
  return withLocalStore((store) => {
    const entry = ensureLocalRoom(store, roomId);
    if (entry.hostToken !== auth.hostToken) {
      throw new Error('Host authorization failed.');
    }

    const currentStory = getCurrentStory(entry.room);
    if (!currentStory) {
      throw new Error('There is no active story to finalize.');
    }

    const summary = summarizePlanningPokerRound(entry.room.participants, entry.room.currentVotes, true);
    entry.room.history.unshift(
      createPlanningPokerRoundRecord(
        currentStory,
        entry.room.currentVotes,
        summary,
        finalEstimate,
        entry.room.cardSetId,
        getPlanningPokerCardSet(entry.room.cardSetId).name,
        makeId,
        new Date().toISOString(),
      ),
    );

    entry.room.stories = entry.room.stories.map((story) =>
      story.id === currentStory.id
        ? { ...story, status: 'finalized', finalEstimate }
        : story,
    );
    const nextStory = entry.room.stories.find((story) => story.status === 'pending') ?? null;
    if (nextStory) {
      entry.room.stories = entry.room.stories.map((story) =>
        story.id === nextStory.id ? { ...story, status: 'active' } : story,
      );
      entry.room.currentStoryId = nextStory.id;
      entry.room.status = 'active';
    } else {
      entry.room.currentStoryId = null;
      entry.room.status = 'completed';
    }
    clearVotes(entry.room);

    return {
      ok: true,
      room: structuredClone(entry.room),
    } satisfies ApiResponse<PlanningPokerRoomSnapshot>;
  });
}

function reestimateLocalStory(roomId: string, storyId: string, auth: PlanningPokerHostAuth) {
  return withLocalStore((store) => {
    const entry = ensureLocalRoom(store, roomId);
    if (entry.hostToken !== auth.hostToken) {
      throw new Error('Host authorization failed.');
    }

    entry.room.stories = entry.room.stories.map((story) => {
      if (story.id === storyId) {
        return resetPlanningPokerStoryForReestimate(story);
      }

      if (story.status === 'active') {
        return { ...story, status: 'pending' };
      }

      return story;
    });
    entry.room.currentStoryId = storyId;
    entry.room.status = 'active';
    clearVotes(entry.room);

    return {
      ok: true,
      room: structuredClone(entry.room),
    } satisfies ApiResponse<PlanningPokerRoomSnapshot>;
  });
}

function addLocalStories(roomId: string, stories: Array<{ label: string; url: string; title: string }>, auth: PlanningPokerHostAuth) {
  return withLocalStore((store) => {
    const entry = ensureLocalRoom(store, roomId);
    if (entry.hostToken !== auth.hostToken) {
      throw new Error('Host authorization failed.');
    }

    const additions = stories.map((story) => buildPlanningPokerStory(story, makeId, 'pending'));
    entry.room.stories = [...entry.room.stories, ...additions];
    entry.room.updatedAt = new Date().toISOString();

    return {
      ok: true,
      room: structuredClone(entry.room),
    } satisfies ApiResponse<PlanningPokerRoomSnapshot>;
  });
}

function activateLocalStory(roomId: string, storyId: string, auth: PlanningPokerHostAuth) {
  return withLocalStore((store) => {
    const entry = ensureLocalRoom(store, roomId);
    if (entry.hostToken !== auth.hostToken) {
      throw new Error('Host authorization failed.');
    }

    const story = entry.room.stories.find((item) => item.id === storyId);
    if (!story) {
      throw new Error('Story not found.');
    }

    if (story.status === 'finalized') {
      throw new Error('Finalized stories should be reopened with re-estimate instead.');
    }

    entry.room.stories = entry.room.stories.map((item) => {
      if (item.id === storyId) {
        return { ...item, status: 'active' };
      }

      if (item.status === 'active') {
        return { ...item, status: 'pending' };
      }

      return item;
    });
    entry.room.currentStoryId = storyId;
    entry.room.status = 'active';
    clearVotes(entry.room);

    return {
      ok: true,
      room: structuredClone(entry.room),
    } satisfies ApiResponse<PlanningPokerRoomSnapshot>;
  });
}

function removeLocalStory(roomId: string, storyId: string, auth: PlanningPokerHostAuth) {
  return withLocalStore((store) => {
    const entry = ensureLocalRoom(store, roomId);
    if (entry.hostToken !== auth.hostToken) {
      throw new Error('Host authorization failed.');
    }

    const story = entry.room.stories.find((item) => item.id === storyId);
    if (!story) {
      throw new Error('Story not found.');
    }

    if (story.status === 'finalized') {
      throw new Error('Finalized stories cannot be removed from the completed session list.');
    }

    entry.room.stories = entry.room.stories.filter((item) => item.id !== storyId);

    if (entry.room.currentStoryId === storyId) {
      const nextStory = entry.room.stories.find((item) => item.status === 'pending') ?? null;
      if (nextStory) {
        entry.room.stories = entry.room.stories.map((item) =>
          item.id === nextStory.id ? { ...item, status: 'active' } : item,
        );
        entry.room.currentStoryId = nextStory.id;
        entry.room.status = 'active';
      } else {
        entry.room.currentStoryId = null;
        entry.room.status = 'completed';
      }
      clearVotes(entry.room);
    } else {
      entry.room.updatedAt = new Date().toISOString();
    }

    return {
      ok: true,
      room: structuredClone(entry.room),
    } satisfies ApiResponse<PlanningPokerRoomSnapshot>;
  });
}

async function postRoomAction<T>(payload: Record<string, unknown>, localFallback: () => ApiResponse<T>) {
  const response = await tryRemote<T>('/api/planning-poker', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response ?? localFallback();
}

export async function createPlanningPokerRoom(input: PlanningPokerCreateRoomInput) {
  return postRoomAction<PlanningPokerRoomSnapshot>(
    {
      action: 'create-room',
      ...input,
    },
    () => createLocalRoom(input),
  );
}

export async function joinPlanningPokerRoom(input: PlanningPokerJoinRoomInput) {
  return postRoomAction<PlanningPokerRoomSnapshot>(
    {
      action: 'join-room',
      ...input,
    },
    () => joinLocalRoom(input),
  );
}

export async function getPlanningPokerRoom(roomId: string, auth?: Partial<PlanningPokerParticipantAuth & PlanningPokerHostAuth>) {
  const url = new URL('/api/planning-poker', window.location.origin);
  url.searchParams.set('roomId', roomId);

  if (auth?.hostToken) {
    url.searchParams.set('hostToken', auth.hostToken);
  }

  if (auth?.participantId) {
    url.searchParams.set('participantId', auth.participantId);
  }

  if (auth?.participantToken) {
    url.searchParams.set('participantToken', auth.participantToken);
  }

  const response = await tryRemote<PlanningPokerRoomSnapshot>(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  return response ?? getLocalRoom(roomId, auth);
}

export async function submitPlanningPokerVote(roomId: string, vote: string, auth: PlanningPokerParticipantAuth) {
  return postRoomAction<PlanningPokerRoomSnapshot>(
    {
      action: 'vote',
      roomId,
      vote,
      participantId: auth.participantId,
      participantToken: auth.participantToken,
    },
    () => voteInLocalRoom(roomId, vote, auth),
  );
}

export async function revealPlanningPokerVotes(roomId: string, auth: PlanningPokerHostAuth) {
  return postRoomAction<PlanningPokerRoomSnapshot>(
    {
      action: 'reveal-room',
      roomId,
      hostToken: auth.hostToken,
    },
    () => revealLocalRoom(roomId, auth),
  );
}

export async function resetPlanningPokerRound(roomId: string, auth: PlanningPokerHostAuth) {
  return postRoomAction<PlanningPokerRoomSnapshot>(
    {
      action: 'reset-round',
      roomId,
      hostToken: auth.hostToken,
    },
    () => resetLocalRoom(roomId, auth),
  );
}

export async function finalizePlanningPokerStory(roomId: string, finalEstimate: string, auth: PlanningPokerHostAuth) {
  return postRoomAction<PlanningPokerRoomSnapshot>(
    {
      action: 'finalize-story',
      roomId,
      finalEstimate,
      hostToken: auth.hostToken,
    },
    () => finalizeLocalStory(roomId, finalEstimate, auth),
  );
}

export async function reestimatePlanningPokerStory(roomId: string, storyId: string, auth: PlanningPokerHostAuth) {
  return postRoomAction<PlanningPokerRoomSnapshot>(
    {
      action: 'reestimate-story',
      roomId,
      storyId,
      hostToken: auth.hostToken,
    },
    () => reestimateLocalStory(roomId, storyId, auth),
  );
}

export async function activatePlanningPokerStory(roomId: string, storyId: string, auth: PlanningPokerHostAuth) {
  return postRoomAction<PlanningPokerRoomSnapshot>(
    {
      action: 'activate-story',
      roomId,
      storyId,
      ...auth,
    },
    () => activateLocalStory(roomId, storyId, auth),
  );
}

export async function removePlanningPokerStory(roomId: string, storyId: string, auth: PlanningPokerHostAuth) {
  return postRoomAction<PlanningPokerRoomSnapshot>(
    {
      action: 'remove-story',
      roomId,
      storyId,
      ...auth,
    },
    () => removeLocalStory(roomId, storyId, auth),
  );
}

export async function addPlanningPokerStories(
  roomId: string,
  stories: Array<{ label: string; url: string; title: string }>,
  auth: PlanningPokerHostAuth,
) {
  return postRoomAction<PlanningPokerRoomSnapshot>(
    {
      action: 'add-stories',
      roomId,
      stories,
      hostToken: auth.hostToken,
    },
    () => addLocalStories(roomId, stories, auth),
  );
}
