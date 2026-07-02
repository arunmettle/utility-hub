import { useEffect, useMemo, useState } from 'react';
import { Check, ExternalLink, RefreshCcw, RotateCcw, Share2, Users } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import TurnstileWidget from '../components/TurnstileWidget';
import {
  buildPlanningPokerRoundMarkdown,
  getPlanningPokerCardSet,
  parsePlanningPokerStoryQueue,
  resolvePlanningPokerCards,
  summarizePlanningPokerRound,
  type PlanningPokerCardSetId,
  type PlanningPokerRoomSnapshot,
} from '../lib/planningPoker';
import {
  addPlanningPokerStories,
  activatePlanningPokerStory,
  createPlanningPokerRoom,
  finalizePlanningPokerStory,
  getPlanningPokerRoom,
  joinPlanningPokerRoom,
  removePlanningPokerStory,
  reestimatePlanningPokerStory,
  resetPlanningPokerRound,
  revealPlanningPokerVotes,
  submitPlanningPokerVote,
  type PlanningPokerHostAuth,
  type PlanningPokerParticipantAuth,
} from '../lib/planningPokerApi';
import { getPublicConfig } from '../lib/publicConfig';

const sampleStoryQueue = `PBI 1423 | https://dev.azure.com/example/team/_workitems/edit/1423 | Customer profile redesign
PBI 1450 | https://dev.azure.com/example/team/_workitems/edit/1450 | Notification rules cleanup
PBI 1472 | https://dev.azure.com/example/team/_workitems/edit/1472 | Bulk import retry flow`;

const sampleParticipants = 'Sam\nLee\nMaya\nAlex';

type ViewerMode = 'host-setup' | 'join-room' | 'host-room' | 'participant-room';

interface StoredParticipantSession {
  participantId: string;
  participantToken: string;
}

function getHostTokenStorageKey(roomId: string) {
  return `utilityhub:planning-poker:host:${roomId}`;
}

function getParticipantStorageKey(roomId: string) {
  return `utilityhub:planning-poker:participant:${roomId}`;
}

function readRoomIdFromLocation() {
  const params = new URLSearchParams(window.location.search);
  return params.get('room')?.trim().toUpperCase() ?? '';
}

function writeRoomIdToLocation(roomId: string) {
  const next = new URL(window.location.href);
  if (roomId) {
    next.searchParams.set('room', roomId);
  } else {
    next.searchParams.delete('room');
  }
  window.history.replaceState({}, '', next.toString());
}

function readHostToken(roomId: string) {
  return roomId ? window.sessionStorage.getItem(getHostTokenStorageKey(roomId)) ?? '' : '';
}

function readParticipantSession(roomId: string): StoredParticipantSession | null {
  if (!roomId) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(getParticipantStorageKey(roomId));
    const persisted = raw ?? window.localStorage.getItem(getParticipantStorageKey(roomId));
    if (!persisted) {
      return null;
    }

    const parsed = JSON.parse(persisted) as StoredParticipantSession;
    if (!parsed.participantId || !parsed.participantToken) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function renderVoteBuckets(
  tally: Array<{ value: string; count: number; participantNames: string[] }>,
  heading: string,
) {
  return (
    <section className="planning-poker-summary-block">
      <h2>{heading}</h2>
      <div className="planning-poker-vote-breakdown">
        {tally.map((item) => (
          <article key={item.value} className="planning-poker-vote-bucket">
            <div className="chip">
              {item.value}
              <small>{item.count}</small>
            </div>
            <p>{item.participantNames.join(', ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderParticipantVotes(
  participants: Array<{ id: string; name: string }>,
  votes: Record<string, string>,
  heading: string,
) {
  const rows = participants
    .map((participant) => ({
      id: participant.id,
      name: participant.name,
      vote: votes[participant.id]?.trim() ?? '',
    }))
    .filter((participant) => participant.vote);

  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="planning-poker-summary-block">
      <h2>{heading}</h2>
      <div className="planning-poker-vote-rows">
        {rows.map((participant) => (
          <div key={participant.id} className="planning-poker-vote-row">
            <strong>{participant.name}</strong>
            <span className="chip">{participant.vote}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PlanningPoker() {
  const initialRoomId = readRoomIdFromLocation();
  const [roomId, setRoomId] = useState(initialRoomId);
  const [hostSessionToken, setHostSessionToken] = useState(() => readHostToken(initialRoomId));
  const [participantAuth, setParticipantAuth] = useState<StoredParticipantSession | null>(() => readParticipantSession(initialRoomId));
  const [mode, setMode] = useState<ViewerMode>(() => (readRoomIdFromLocation() ? 'join-room' : 'host-setup'));
  const [room, setRoom] = useState<PlanningPokerRoomSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'done'>('idle');

  const [roomName, setRoomName] = useState('Sprint 24 estimation');
  const [hostName, setHostName] = useState('Scrum Master');
  const [participantNames, setParticipantNames] = useState(sampleParticipants);
  const [storyQueueSource, setStoryQueueSource] = useState(sampleStoryQueue);
  const [additionalStoriesSource, setAdditionalStoriesSource] = useState('');
  const [cardSetId, setCardSetId] = useState<PlanningPokerCardSetId>('fibonacci');
  const [customCardsSource, setCustomCardsSource] = useState('1, 2, 3, 5, 8');
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [selectedFinalEstimate, setSelectedFinalEstimate] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const spamProtectionEnabled = Boolean(turnstileSiteKey);

  const currentStory = useMemo(
    () => room?.stories.find((story) => story.id === room.currentStoryId) ?? null,
    [room],
  );

  const cardsResult = useMemo(() => resolvePlanningPokerCards(cardSetId, customCardsSource), [cardSetId, customCardsSource]);
  const activeCards = cardsResult.output;
  const currentCards = useMemo(
    () => resolvePlanningPokerCards((room?.cardSetId ?? cardSetId) as PlanningPokerCardSetId, room?.customCardsSource ?? customCardsSource).output,
    [room?.cardSetId, room?.customCardsSource, cardSetId, customCardsSource],
  );
  const summary = useMemo(
    () => summarizePlanningPokerRound(room?.participants ?? [], room?.currentVotes ?? {}, room?.revealed ?? false),
    [room?.participants, room?.currentVotes, room?.revealed],
  );
  const scrumMasterVotesCast = useMemo(() => {
    if (!room) {
      return 0;
    }

    if (room.revealed) {
      return summary.votesCast;
    }

    return room.participants.filter((participant) => participant.hasVoted).length;
  }, [room, summary.votesCast]);

  useEffect(() => {
    getPublicConfig().then((config) => {
      setTurnstileSiteKey(config.turnstileSiteKey?.trim() ?? '');
      setTurnstileLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!roomId) {
      setMode('host-setup');
      setRoom(null);
      return;
    }

    if (hostSessionToken) {
      setMode('host-room');
      return;
    }

    if (participantAuth) {
      setMode('participant-room');
      return;
    }

    setMode('join-room');
  }, [hostSessionToken, participantAuth, roomId]);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const auth =
          hostSessionToken
            ? ({ hostToken: hostSessionToken } satisfies PlanningPokerHostAuth)
            : participantAuth
              ? ({
                  participantId: participantAuth.participantId,
                  participantToken: participantAuth.participantToken,
                } satisfies PlanningPokerParticipantAuth)
              : undefined;
        const response = await getPlanningPokerRoom(roomId, auth);
        if (cancelled) {
          return;
        }

        setRoom(response.room ?? null);
        setError('');
      } catch (pollError) {
        if (cancelled) {
          return;
        }

        setError(pollError instanceof Error ? pollError.message : 'Unable to load the room.');
      }
    };

    setLoading(true);
    poll().finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

    const interval = window.setInterval(poll, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [hostSessionToken, participantAuth, roomId]);

  useEffect(() => {
    if (!room?.revealed || selectedFinalEstimate || summary.tally.length === 0) {
      return;
    }

    setSelectedFinalEstimate(summary.tally[0]?.value ?? '');
  }, [room?.revealed, selectedFinalEstimate, summary.tally]);

  useEffect(() => {
    if (copyState !== 'done') {
      return undefined;
    }

    const timeout = window.setTimeout(() => setCopyState('idle'), 1800);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  const refreshRoom = async () => {
    if (!roomId) {
      return;
    }

    setLoading(true);
    try {
      const auth =
        hostSessionToken
          ? ({ hostToken: hostSessionToken } satisfies PlanningPokerHostAuth)
          : participantAuth
            ? ({
                participantId: participantAuth.participantId,
                participantToken: participantAuth.participantToken,
              } satisfies PlanningPokerParticipantAuth)
            : undefined;
      const response = await getPlanningPokerRoom(roomId, auth);
      setRoom(response.room ?? null);
      setError('');
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Unable to refresh the room.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    const participantList = participantNames
      .split('\n')
      .map((name) => name.trim())
      .filter(Boolean);
    const parsedStories = parsePlanningPokerStoryQueue(storyQueueSource);

    if (!parsedStories.output) {
      setError(parsedStories.error);
      return;
    }

    if (participantList.length === 0) {
      setError('Add at least one participant name before creating the room.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createPlanningPokerRoom({
        roomName,
        hostName,
        cardSetId,
        customCardsSource,
        participantNames: participantList,
        stories: parsedStories.output,
        turnstileToken: turnstileToken || undefined,
      });

      if (!response.roomId || !response.hostToken || !response.room) {
        throw new Error('Planning Poker room was created without a valid response.');
      }

      window.sessionStorage.setItem(getHostTokenStorageKey(response.roomId), response.hostToken);
      writeRoomIdToLocation(response.roomId);
      setRoomId(response.roomId);
      setHostSessionToken(response.hostToken);
      setParticipantAuth(null);
      setRoom(response.room);
      setSelectedFinalEstimate('');
      setAdditionalStoriesSource('');
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
      setError('');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to create the room.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId || !selectedParticipantId) {
      setError('Choose your participant name to join the room.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await joinPlanningPokerRoom({
        roomId,
        participantId: selectedParticipantId,
      });

      if (!response.participantToken || !response.room) {
        throw new Error('Participant session could not be created.');
      }

      const storedSession = JSON.stringify({
        participantId: selectedParticipantId,
        participantToken: response.participantToken,
      });
      window.sessionStorage.setItem(
        getParticipantStorageKey(roomId),
        storedSession,
      );
      window.localStorage.setItem(getParticipantStorageKey(roomId), storedSession);
      setParticipantAuth({
        participantId: selectedParticipantId,
        participantToken: response.participantToken,
      });
      setRoom(response.room);
      setError('');
    } catch (joinError) {
      setError(joinError instanceof Error ? joinError.message : 'Unable to join the room.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (vote: string) => {
    if (!roomId || !participantAuth) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitPlanningPokerVote(roomId, vote, {
        participantId: participantAuth.participantId,
        participantToken: participantAuth.participantToken,
      });
      setRoom(response.room ?? null);
      setError('');
    } catch (voteError) {
      setError(voteError instanceof Error ? voteError.message : 'Unable to submit the vote.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevealVotes = async () => {
    if (!roomId || !hostSessionToken) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await revealPlanningPokerVotes(roomId, { hostToken: hostSessionToken });
      setRoom(response.room ?? null);
      setError('');
    } catch (revealError) {
      setError(revealError instanceof Error ? revealError.message : 'Unable to reveal votes.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetRound = async () => {
    if (!roomId || !hostSessionToken) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await resetPlanningPokerRound(roomId, { hostToken: hostSessionToken });
      setRoom(response.room ?? null);
      setSelectedFinalEstimate('');
      setError('');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Unable to reset the round.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalizeStory = async () => {
    if (!roomId || !hostSessionToken || !selectedFinalEstimate) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await finalizePlanningPokerStory(roomId, selectedFinalEstimate, { hostToken: hostSessionToken });
      setRoom(response.room ?? null);
      setSelectedFinalEstimate('');
      setError('');
    } catch (finalizeError) {
      setError(finalizeError instanceof Error ? finalizeError.message : 'Unable to finalize the estimate.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReestimateStory = async (storyId: string) => {
    if (!roomId || !hostSessionToken) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await reestimatePlanningPokerStory(roomId, storyId, { hostToken: hostSessionToken });
      setRoom(response.room ?? null);
      setSelectedFinalEstimate('');
      setError('');
    } catch (reestimateError) {
      setError(reestimateError instanceof Error ? reestimateError.message : 'Unable to reopen the story for re-estimation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddStories = async () => {
    if (!roomId || !hostSessionToken) {
      return;
    }

    const parsedStories = parsePlanningPokerStoryQueue(additionalStoriesSource);
    if (!parsedStories.output) {
      setError(parsedStories.error);
      return;
    }

    setSubmitting(true);
    try {
      const response = await addPlanningPokerStories(roomId, parsedStories.output, { hostToken: hostSessionToken });
      setRoom(response.room ?? null);
      setAdditionalStoriesSource('');
      setError('');
    } catch (storyError) {
      setError(storyError instanceof Error ? storyError.message : 'Unable to add more stories.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivateStory = async (storyId: string) => {
    if (!roomId || !hostSessionToken) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await activatePlanningPokerStory(roomId, storyId, { hostToken: hostSessionToken });
      setRoom(response.room ?? null);
      setSelectedFinalEstimate('');
      setError('');
    } catch (activateError) {
      setError(activateError instanceof Error ? activateError.message : 'Unable to switch the active story.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveStory = async (storyId: string) => {
    if (!roomId || !hostSessionToken) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await removePlanningPokerStory(roomId, storyId, { hostToken: hostSessionToken });
      setRoom(response.room ?? null);
      setSelectedFinalEstimate('');
      setError('');
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Unable to remove the story from the room.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyRoomLink = async () => {
    if (!roomId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(`${window.location.origin}/planning-poker?room=${roomId}`);
      setCopyState('done');
    } catch {
      setCopyState('idle');
    }
  };

  const handleCopyRoundSummary = async () => {
    if (!room || !currentStory || !selectedFinalEstimate) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        buildPlanningPokerRoundMarkdown(
          {
            storyLabel: currentStory.label,
            storyTitle: currentStory.title,
            storyUrl: currentStory.url,
            cardSetName: getPlanningPokerCardSet(room.cardSetId).name,
            votes: room.currentVotes,
            summary,
            finalEstimate: selectedFinalEstimate,
            roundNumber: currentStory.roundNumber,
          },
          room.participants,
        ),
      );
      setCopyState('done');
    } catch {
      setCopyState('idle');
    }
  };

  const leaveRoom = () => {
    if (roomId) {
      window.sessionStorage.removeItem(getHostTokenStorageKey(roomId));
      window.sessionStorage.removeItem(getParticipantStorageKey(roomId));
      window.localStorage.removeItem(getParticipantStorageKey(roomId));
    }

    writeRoomIdToLocation('');
    setRoomId('');
    setHostSessionToken('');
    setParticipantAuth(null);
    setRoom(null);
    setMode('host-setup');
    setSelectedParticipantId('');
    setSelectedFinalEstimate('');
    setError('');
  };

  const joinableParticipants = room?.participants ?? [];
  const participantView = participantAuth
    ? room?.participants.find((participant) => participant.id === participantAuth.participantId) ?? null
    : null;

  return (
    <ToolFrame
      eyebrow="Facilitation"
      title="Planning Poker"
      description="Create a shared estimation room with participant links, hidden voting, host finalization, and practical re-estimate flow for backlog sessions."
      actions={
        <>
          <button type="button" className="action-button" onClick={refreshRoom} disabled={!roomId || loading}>
            <RefreshCcw size={16} />
            Refresh
          </button>
          <button type="button" className="action-button" onClick={leaveRoom}>
            <RotateCcw size={16} />
            Leave room
          </button>
        </>
      }
      note={{
        title: 'Practical room model',
        body: 'The Scrum Master creates one room, shares the room link, and keeps story detail in Azure DevOps or Jira. UtilityHub handles the ceremony itself: participant join, hidden voting, reveal, final estimate, and re-estimation when a round needs another pass.',
      }}
    >
      <div className="planning-poker-layout">
        {error ? (
          <section className="editor-panel">
            <div className="editor-error planning-poker-error">
              <strong>Planning Poker issue</strong>
              <p>{error}</p>
            </div>
          </section>
        ) : null}

        {mode === 'host-setup' ? (
          <section className="editor-panel planning-poker-panel planning-poker-panel--wide">
            <div className="editor-panel__head">
              <span>Create room</span>
              <span>Scrum Master setup</span>
            </div>
            <div className="planning-poker-queue-layout">
              <label className="planning-poker-field">
                <span>Room name</span>
                <input className="tool-input" value={roomName} onChange={(event) => setRoomName(event.target.value)} />
              </label>
              <label className="planning-poker-field">
                <span>Host name</span>
                <input className="tool-input" value={hostName} onChange={(event) => setHostName(event.target.value)} />
              </label>
            </div>
            <div className="planning-poker-settings">
              <label className="planning-poker-field">
                <span>Card set</span>
                <select className="tool-input" value={cardSetId} onChange={(event) => setCardSetId(event.target.value as PlanningPokerCardSetId)}>
                  {Object.values(['fibonacci', 'tshirt', 'sequential', 'risk', 'custom'] as PlanningPokerCardSetId[]).map((value) => (
                    <option key={value} value={value}>
                      {getPlanningPokerCardSet(value).name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="planning-poker-cardset-note">{getPlanningPokerCardSet(cardSetId).description}</div>
            </div>
            {cardSetId === 'custom' ? (
              <label className="planning-poker-field">
                <span>Custom cards</span>
                <input className="tool-input" value={customCardsSource} onChange={(event) => setCustomCardsSource(event.target.value)} />
              </label>
            ) : null}
            <label className="planning-poker-field">
              <span>Participants</span>
              <textarea className="editor-textarea" value={participantNames} onChange={(event) => setParticipantNames(event.target.value)} />
            </label>
            <label className="planning-poker-field">
              <span>Story queue</span>
              <textarea className="editor-textarea" value={storyQueueSource} onChange={(event) => setStoryQueueSource(event.target.value)} />
            </label>
            <div className="planning-poker-actions">
              <TurnstileWidget
                key={turnstileResetKey}
                action="planning_poker_create_room"
                siteKey={turnstileSiteKey}
                onTokenChange={setTurnstileToken}
              />
              <button
                type="button"
                className="action-button action-button--primary"
                onClick={handleCreateRoom}
                disabled={submitting || !activeCards.length || (turnstileLoaded && spamProtectionEnabled && !turnstileToken)}
              >
                Create shared room
              </button>
            </div>
          </section>
        ) : null}

        {mode === 'join-room' ? (
          <section className="editor-panel planning-poker-panel planning-poker-panel--wide">
            <div className="editor-panel__head">
              <span>Join room</span>
              <span>{roomId || 'Waiting for room link'}</span>
            </div>
            {loading ? <p className="planning-poker-muted">Loading room…</p> : null}
            {room ? (
              <>
                <article className="planning-poker-current-story">
                  <div className="planning-poker-history-card__head">
                    <h2>{room.roomName}</h2>
                    <span>{room.hostName}</span>
                  </div>
                  <p>Select your name to join or rejoin the live estimation room.</p>
                </article>
                <label className="planning-poker-field">
                  <span>Your name</span>
                  <select className="tool-input" value={selectedParticipantId} onChange={(event) => setSelectedParticipantId(event.target.value)}>
                    <option value="">Choose your participant name</option>
                    {joinableParticipants.map((participant) => (
                      <option key={participant.id} value={participant.id}>
                        {participant.name}{participant.joinedAt ? ' (rejoin)' : ''}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="planning-poker-actions">
                  <button type="button" className="action-button action-button--primary" onClick={handleJoinRoom} disabled={submitting || !selectedParticipantId}>
                    Join room
                  </button>
                </div>
              </>
            ) : (
              <p className="planning-poker-muted">Open a room link from the Scrum Master to join the session.</p>
            )}
          </section>
        ) : null}

        {mode === 'host-room' && room ? (
          <>
            <section className="editor-panel planning-poker-panel">
              <div className="editor-panel__head">
                <span>Room details</span>
                <span>{room.roomId}</span>
              </div>
              <article className="planning-poker-current-story">
                <div className="planning-poker-history-card__head">
                  <h2>{room.roomName}</h2>
                  <span>{room.hostName}</span>
                </div>
                <p>Share the room link with the team, then move through the backlog one story at a time.</p>
              </article>
              <div className="planning-poker-actions">
                <button type="button" className="action-button action-button--primary" onClick={handleCopyRoomLink}>
                  {copyState === 'done' ? <Check size={16} /> : <Share2 size={16} />}
                  {copyState === 'done' ? 'Copied room link' : 'Copy room link'}
                </button>
              </div>
            </section>

            <section className="editor-panel planning-poker-panel">
              <div className="editor-panel__head">
                <span className="editor-panel__heading-with-icon">
                  <Users size={16} />
                  Team readiness
                </span>
                <span>{room.participants.filter((participant) => participant.joinedAt).length} joined</span>
              </div>
              <div className="planning-poker-team-list">
                {room.participants.map((participant) => (
                  <div key={participant.id} className="planning-poker-team-row">
                    <div className="planning-poker-participant">
                      <strong>{participant.name}</strong>
                      <span>
                        {participant.joinedAt ? participant.hasVoted ? 'Vote locked' : 'Joined' : 'Waiting to join'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="editor-panel planning-poker-panel planning-poker-panel--wide">
              <div className="editor-panel__head">
                <span>Backlog queue</span>
                <span>{room.stories.filter((story) => story.status === 'pending').length} pending</span>
              </div>
              {currentStory ? (
                <article className="planning-poker-current-story" aria-label="Current story">
                  <div className="planning-poker-history-card__head">
                    <h2>{currentStory.label}</h2>
                    <span>Round {currentStory.roundNumber}</span>
                  </div>
                  <p>{currentStory.title || 'Open the linked backlog item for detail.'}</p>
                  {currentStory.url ? (
                    <a href={currentStory.url} target="_blank" rel="noreferrer" className="guide-inline-link">
                      Open story link <ExternalLink size={16} />
                    </a>
                  ) : null}
                </article>
              ) : (
                <p className="planning-poker-muted">No active story is selected right now.</p>
              )}
              <label className="planning-poker-field">
                <span>Add more stories</span>
                <textarea
                  className="editor-textarea"
                  value={additionalStoriesSource}
                  onChange={(event) => setAdditionalStoriesSource(event.target.value)}
                  placeholder="PBI 1501 | https://... | Optional title"
                />
              </label>
              <div className="planning-poker-actions">
                <button type="button" className="action-button" onClick={handleAddStories} disabled={submitting || !additionalStoriesSource.trim()}>
                  Add stories
                </button>
              </div>
              <div className="planning-poker-history">
                {room.stories.map((story) => (
                  <article key={story.id} className={`planning-poker-history-card planning-poker-history-card--${story.status}`}>
                    <div className="planning-poker-history-card__head">
                      <h2>{story.label}</h2>
                      <span>{story.status}</span>
                    </div>
                    <p>{story.title || 'No short title added.'}</p>
                    {story.finalEstimate ? <p className="planning-poker-final-estimate">Final estimate: {story.finalEstimate}</p> : null}
                    <div className="planning-poker-story-actions">
                      {story.status === 'finalized' ? (
                        <button type="button" className="action-button" onClick={() => handleReestimateStory(story.id)} disabled={submitting}>
                          Re-estimate
                        </button>
                      ) : story.status === 'active' ? (
                        <button type="button" className="action-button" disabled>
                          Estimating now
                        </button>
                      ) : (
                        <button type="button" className="action-button" onClick={() => handleActivateStory(story.id)} disabled={submitting}>
                          Estimate now
                        </button>
                      )}
                      {story.status !== 'finalized' ? (
                        <button
                          type="button"
                          className="action-button"
                          onClick={() => handleRemoveStory(story.id)}
                          disabled={submitting}
                          aria-label={`Remove ${story.label}`}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="editor-panel planning-poker-panel planning-poker-panel--wide">
              <div className="editor-panel__head">
                <span>Scrum Master controls</span>
                <span>{scrumMasterVotesCast} voted</span>
              </div>
              <div className="planning-poker-status-bar">
                <article className="stat-card">
                  <span className="stat-card__label">Status</span>
                  <strong>{room.revealed ? summary.consensusLabel : 'Collecting hidden votes'}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Joined</span>
                  <strong>{room.participants.filter((participant) => participant.joinedAt).length}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Votes cast</span>
                  <strong>{scrumMasterVotesCast}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Card set</span>
                  <strong>{getPlanningPokerCardSet(room.cardSetId).name}</strong>
                </article>
              </div>
              <div className="planning-poker-actions">
                <button
                  type="button"
                  className="action-button action-button--primary"
                  onClick={handleRevealVotes}
                  disabled={submitting || !currentStory || scrumMasterVotesCast === 0 || room.revealed}
                >
                  Reveal votes
                </button>
                <button type="button" className="action-button" onClick={handleResetRound} disabled={submitting || !currentStory}>
                  Reset round
                </button>
              </div>
              <section className="planning-poker-summary-block">
                <h2>Voting progress</h2>
                <div className="planning-poker-vote-rows">
                  {room.participants
                    .filter((participant) => participant.joinedAt)
                    .map((participant) => (
                      <div key={participant.id} className="planning-poker-vote-row">
                        <strong>{participant.name}</strong>
                        <span className={`chip${participant.hasVoted ? '' : ' chip--muted'}`}>
                          {participant.hasVoted ? 'Voted' : 'Waiting'}
                        </span>
                      </div>
                    ))}
                </div>
              </section>
              {room.revealed ? (
                <div className="planning-poker-summary-sections">
                  {renderParticipantVotes(room.participants, room.currentVotes, 'Votes by participant')}
                  {renderVoteBuckets(summary.tally, 'Vote tally')}
                  <section className="planning-poker-summary-block">
                    <h2>Finalize estimate</h2>
                    <label className="planning-poker-field">
                      <span>Final estimate</span>
                      <select className="tool-input" aria-label="Scrum Master final estimate" value={selectedFinalEstimate} onChange={(event) => setSelectedFinalEstimate(event.target.value)}>
                        <option value="">Choose final estimate</option>
                        {currentCards.map((card) => (
                          <option key={card} value={card}>
                            {card}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="planning-poker-actions">
                      <button type="button" className="action-button action-button--primary" onClick={handleFinalizeStory} disabled={submitting || !selectedFinalEstimate}>
                        Finalize estimate
                      </button>
                      <button type="button" className="action-button" onClick={handleCopyRoundSummary} disabled={!selectedFinalEstimate}>
                        Copy summary
                      </button>
                    </div>
                  </section>
                </div>
              ) : null}
            </section>

            <section className="editor-panel planning-poker-panel planning-poker-panel--wide">
              <div className="editor-panel__head">
                <span>Session history</span>
                <span>{room.history.length} completed rounds</span>
              </div>
              {room.history.length > 0 ? (
                <div className="planning-poker-history">
                  {room.history.map((round) => (
                    <article key={round.id} className="planning-poker-history-card">
                      <div className="planning-poker-history-card__head">
                        <h2>{round.storyLabel}</h2>
                        <span>{round.finalEstimate}</span>
                      </div>
                      <p>{round.storyTitle || 'No short title captured.'}</p>
                      <div className="planning-poker-history-votes">
                        {room.participants
                          .map((participant) => ({
                            id: participant.id,
                            name: participant.name,
                            vote: round.votes[participant.id]?.trim() ?? '',
                          }))
                          .filter((participant) => participant.vote)
                          .map((participant) => (
                            <div key={`${round.id}-${participant.id}`} className="planning-poker-vote-row">
                              <strong>{participant.name}</strong>
                              <span className="chip">{participant.vote}</span>
                            </div>
                          ))}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="planning-poker-muted">Completed estimates will appear here after the Scrum Master finalizes a story.</p>
              )}
            </section>
          </>
        ) : null}

        {mode === 'participant-room' && room && participantView ? (
          <>
            <section className="editor-panel planning-poker-panel">
              <div className="editor-panel__head">
                <span>Your room</span>
                <span>{room.roomName}</span>
              </div>
              <article className="planning-poker-current-story">
                <div className="planning-poker-history-card__head">
                  <h2>{participantView.name}</h2>
                  <span>{participantView.hasVoted ? 'Vote locked' : 'Ready to vote'}</span>
                </div>
                <p>The room refreshes automatically as the Scrum Master moves to the next story.</p>
              </article>
            </section>

            <section className="editor-panel planning-poker-panel planning-poker-panel--wide">
              <div className="editor-panel__head">
                <span>Current story</span>
                <span>{currentStory ? `Round ${currentStory.roundNumber}` : 'Waiting for next story'}</span>
              </div>
              {currentStory ? (
                <article className="planning-poker-current-story" aria-label="Current story">
                  <div className="planning-poker-history-card__head">
                    <h2>{currentStory.label}</h2>
                    <span>{room.revealed ? 'Revealed' : 'Hidden voting'}</span>
                  </div>
                  <p>{currentStory.title || 'Open the backlog item to read the full story before estimating.'}</p>
                  {currentStory.url ? (
                    <a href={currentStory.url} target="_blank" rel="noreferrer" className="guide-inline-link">
                      Open story link <ExternalLink size={16} />
                    </a>
                  ) : null}
                </article>
              ) : (
                <p className="planning-poker-muted">The Scrum Master has not activated a story yet.</p>
              )}
            </section>

            <section className="editor-panel planning-poker-panel planning-poker-panel--wide">
              <div className="editor-panel__head">
                <span>Participant voting view</span>
                <span>{room.revealed ? 'Votes revealed' : 'Choose a card and wait for reveal'}</span>
              </div>
              <div className="planning-poker-card-picker">
                <p className="planning-poker-card-picker__label">Vote as {participantView.name}</p>
                <div className="planning-poker-card-grid">
                  {currentCards.map((card) => (
                    <button
                      key={card}
                      type="button"
                      className={`planning-poker-card${room.currentVotes[participantView.id] === card ? ' is-selected' : ''}`}
                      onClick={() => handleVote(card)}
                      disabled={submitting || !currentStory || room.revealed}
                    >
                      {card}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="editor-panel planning-poker-panel planning-poker-panel--wide">
              <div className="editor-panel__head">
                <span>Room status</span>
                <span>{summary.votesCast} votes locked</span>
              </div>
              <div className="planning-poker-status-bar">
                <article className="stat-card">
                  <span className="stat-card__label">Your vote</span>
                  <strong>{room.currentVotes[participantView.id] || 'Not yet voted'}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Votes cast</span>
                  <strong>{summary.votesCast}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Joined</span>
                  <strong>{room.participants.filter((participant) => participant.joinedAt).length}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Reveal state</span>
                  <strong>{room.revealed ? 'Revealed' : 'Waiting'}</strong>
                </article>
              </div>
              {room.revealed ? (
                <div className="planning-poker-summary-sections">
                  {renderParticipantVotes(room.participants, room.currentVotes, 'Visible votes')}
                  {renderVoteBuckets(summary.tally, 'Vote tally')}
                  <section className="planning-poker-summary-block">
                    <h2>Discussion hints</h2>
                    <ul className="planning-poker-list">
                      <li>{summary.consensus ? 'The room is aligned on this estimate.' : 'Use the spread to talk through the differences.'}</li>
                      <li>{summary.outlierNames.length > 0 ? `Outliers: ${summary.outlierNames.join(', ')}` : 'No major outliers were detected.'}</li>
                    </ul>
                  </section>
                </div>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
