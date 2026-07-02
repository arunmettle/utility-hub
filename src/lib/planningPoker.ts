import type { TransformResult } from './privacyTools';

export type PlanningPokerCardSetId = 'fibonacci' | 'tshirt' | 'sequential' | 'risk' | 'custom';

export interface PlanningPokerCardSet {
  id: PlanningPokerCardSetId;
  name: string;
  description: string;
  cards: string[];
}

export interface PlanningPokerParticipant {
  id: string;
  name: string;
  joinedAt?: string | null;
  hasVoted?: boolean;
}

export interface PlanningPokerStory {
  id: string;
  label: string;
  url: string;
  title: string;
  status: 'pending' | 'active' | 'finalized';
  finalEstimate: string | null;
  roundNumber: number;
}

export interface PlanningPokerVoteSummary {
  totalParticipants: number;
  votesCast: number;
  revealedVotes: number;
  missingParticipants: string[];
  average: number | null;
  lowest: number | null;
  highest: number | null;
  spread: number | null;
  consensus: boolean;
  consensusLabel: string;
  outlierNames: string[];
  tally: Array<{ value: string; count: number; participantNames: string[] }>;
  numericVoteCount: number;
  nonNumericVotes: string[];
}

export interface PlanningPokerRoundRecord {
  id: string;
  storyLabel: string;
  storyTitle: string;
  storyUrl: string;
  cardSetId: PlanningPokerCardSetId;
  cardSetName: string;
  votes: Record<string, string>;
  finalEstimate: string;
  roundNumber: number;
  summary: PlanningPokerVoteSummary;
  createdAt: string;
}

export interface PlanningPokerRoomSnapshot {
  roomId: string;
  roomName: string;
  hostName: string;
  cardSetId: PlanningPokerCardSetId;
  customCardsSource: string;
  revealed: boolean;
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
  currentStoryId: string | null;
  participants: PlanningPokerParticipant[];
  stories: PlanningPokerStory[];
  currentVotes: Record<string, string>;
  history: PlanningPokerRoundRecord[];
}

export const planningPokerCardSets: PlanningPokerCardSet[] = [
  {
    id: 'fibonacci',
    name: 'Fibonacci',
    description: 'Best for agile story points with built-in uncertainty at higher sizes.',
    cards: ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', 'Coffee'],
  },
  {
    id: 'tshirt',
    name: 'T-shirt',
    description: 'Good for rough sizing when the team wants simpler language than point values.',
    cards: ['XS', 'S', 'M', 'L', 'XL', '?', 'Coffee'],
  },
  {
    id: 'sequential',
    name: 'Sequential',
    description: 'Useful when teams prefer straightforward number scales for lighter estimation rounds.',
    cards: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '?'],
  },
  {
    id: 'risk',
    name: 'Risk / confidence',
    description: 'Helpful for delivery confidence, implementation risk, or release readiness discussions.',
    cards: ['Low', 'Medium', 'High', 'Critical', '?'],
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Bring your own card labels when the team uses a house scale.',
    cards: ['1', '2', '3', '5', '8'],
  },
];

export function getPlanningPokerCardSet(cardSetId: PlanningPokerCardSetId): PlanningPokerCardSet {
  return planningPokerCardSets.find((cardSet) => cardSet.id === cardSetId) ?? planningPokerCardSets[0];
}

export function parsePlanningPokerCustomCards(source: string): TransformResult<string[] | null> {
  const normalized = source
    .split(/[,\n|]/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (normalized.length === 0) {
    return { error: 'Add at least one custom card value.', output: null };
  }

  const deduped = normalized.filter((entry, index) => normalized.indexOf(entry) === index);
  if (deduped.length > 20) {
    return { error: 'Keep the custom deck to 20 cards or fewer so the board stays usable.', output: null };
  }

  return { error: '', output: deduped };
}

export function resolvePlanningPokerCards(cardSetId: PlanningPokerCardSetId, customCardsSource: string): TransformResult<string[]> {
  if (cardSetId !== 'custom') {
    return { error: '', output: getPlanningPokerCardSet(cardSetId).cards };
  }

  if (!customCardsSource.trim()) {
    return { error: '', output: getPlanningPokerCardSet(cardSetId).cards };
  }

  const parsed = parsePlanningPokerCustomCards(customCardsSource);
  if (!parsed.output) {
    return { error: parsed.error, output: getPlanningPokerCardSet(cardSetId).cards };
  }

  return { error: '', output: parsed.output };
}

export function parsePlanningPokerStoryQueue(source: string): TransformResult<Array<Omit<PlanningPokerStory, 'id' | 'status' | 'finalEstimate' | 'roundNumber'>> | null> {
  const rows = source
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (rows.length === 0) {
    return { error: 'Add at least one story link or work item label.', output: null };
  }

  const stories = rows.map((row) => {
    const [first = '', second = '', third = ''] = row.split('|').map((part) => part.trim());
    if (!first) {
      return null;
    }

    const secondLooksLikeUrl = /^https?:\/\//i.test(second);
    const firstLooksLikeUrl = /^https?:\/\//i.test(first);

    const label = firstLooksLikeUrl ? third || 'Work item' : first;
    const url = firstLooksLikeUrl ? first : secondLooksLikeUrl ? second : '';
    const title = firstLooksLikeUrl ? second : third || (!secondLooksLikeUrl ? second : '');

    if (!label) {
      return null;
    }

    return {
      label,
      url,
      title,
    };
  });

  if (stories.some((story) => story === null)) {
    return { error: 'Use one story per line in the format label | link | optional title.', output: null };
  }

  return {
    error: '',
    output: stories.filter((story): story is NonNullable<typeof story> => Boolean(story)),
  };
}

export function buildPlanningPokerStory(
  story: Omit<PlanningPokerStory, 'id' | 'status' | 'finalEstimate' | 'roundNumber'>,
  createId: () => string,
  status: PlanningPokerStory['status'] = 'pending',
): PlanningPokerStory {
  return {
    id: createId(),
    label: story.label.trim(),
    url: story.url.trim(),
    title: story.title.trim(),
    status,
    finalEstimate: null,
    roundNumber: 1,
  };
}

export function createPlanningPokerRoundRecord(
  story: PlanningPokerStory,
  votes: Record<string, string>,
  summary: PlanningPokerVoteSummary,
  finalEstimate: string,
  cardSetId: PlanningPokerCardSetId,
  cardSetName: string,
  createId: () => string,
  createdAt: string,
): PlanningPokerRoundRecord {
  return {
    id: createId(),
    storyLabel: story.label,
    storyTitle: story.title,
    storyUrl: story.url,
    cardSetId,
    cardSetName,
    votes,
    finalEstimate,
    roundNumber: story.roundNumber,
    summary,
    createdAt,
  };
}

export function resetPlanningPokerStoryForReestimate(story: PlanningPokerStory): PlanningPokerStory {
  return {
    ...story,
    status: 'active',
    finalEstimate: null,
    roundNumber: story.roundNumber + 1,
  };
}

function toNumericVote(value: string) {
  return /^-?\d+(\.\d+)?$/.test(value.trim()) ? Number(value) : null;
}

export function summarizePlanningPokerRound(
  participants: PlanningPokerParticipant[],
  votes: Record<string, string>,
  revealed: boolean,
): PlanningPokerVoteSummary {
  const tallyMap = new Map<string, { count: number; participantNames: string[] }>();
  const missingParticipants: string[] = [];
  const outlierNames: string[] = [];
  const numericVotes: Array<{ name: string; value: number }> = [];
  const nonNumericVotes: string[] = [];

  for (const participant of participants) {
    const vote = votes[participant.id]?.trim() ?? '';

    if (!vote) {
      missingParticipants.push(participant.name);
      continue;
    }

    const currentTally = tallyMap.get(vote) ?? { count: 0, participantNames: [] };
    currentTally.count += 1;
    currentTally.participantNames.push(participant.name);
    tallyMap.set(vote, currentTally);
    const numericValue = toNumericVote(vote);
    if (numericValue === null) {
      nonNumericVotes.push(vote);
    } else {
      numericVotes.push({ name: participant.name, value: numericValue });
    }
  }

  const tally = [...tallyMap.entries()]
    .map(([value, bucket]) => ({
      value,
      count: bucket.count,
      participantNames: bucket.participantNames.sort((left, right) => left.localeCompare(right)),
    }))
    .sort((left, right) => right.count - left.count || left.value.localeCompare(right.value));

  const uniqueVotes = tally.length;
  const consensus = uniqueVotes <= 1 && tally.length > 0 && missingParticipants.length === 0;
  const consensusLabel =
    tally.length === 0
      ? 'Waiting for votes'
      : consensus
        ? 'Consensus reached'
        : missingParticipants.length > 0
          ? 'Voting in progress'
          : 'Discussion recommended';

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
    consensusLabel,
    outlierNames,
    tally,
    numericVoteCount: numericVotes.length,
    nonNumericVotes: [...new Set(nonNumericVotes)],
  };
}

export function buildPlanningPokerRoundMarkdown(
  round: Pick<
    PlanningPokerRoundRecord,
    'storyLabel' | 'storyTitle' | 'storyUrl' | 'cardSetName' | 'votes' | 'summary' | 'finalEstimate' | 'roundNumber'
  >,
  participants: PlanningPokerParticipant[],
): string {
  const title = round.storyTitle.trim() || round.storyLabel.trim() || 'Untitled story';
  const lines = [`## ${title}`, '', `Work item: ${round.storyLabel}`, `Card set: ${round.cardSetName}`, `Round: ${round.roundNumber}`];

  if (round.storyUrl.trim()) {
    lines.push(`Link: ${round.storyUrl.trim()}`);
  }

  lines.push(`Consensus: ${round.summary.consensusLabel}`, `Final estimate: ${round.finalEstimate}`);

  if (round.summary.average !== null) {
    lines.push('', `Average: ${round.summary.average}`);
  }

  if (round.summary.lowest !== null && round.summary.highest !== null) {
    lines.push(`Range: ${round.summary.lowest} to ${round.summary.highest}`);
  }

  if (round.summary.tally.length > 0) {
    lines.push('', 'Vote tally:');
    for (const item of round.summary.tally) {
      lines.push(`- ${item.value}: ${item.count}${item.participantNames.length > 0 ? ` (${item.participantNames.join(', ')})` : ''}`);
    }
  }

  lines.push('', 'Votes by participant:');
  for (const participant of participants) {
    lines.push(`- ${participant.name}: ${round.votes[participant.id] ?? 'No vote'}`);
  }

  if (round.summary.outlierNames.length > 0) {
    lines.push('', `Outliers: ${round.summary.outlierNames.join(', ')}`);
  }

  if (round.summary.missingParticipants.length > 0) {
    lines.push('', `Missing votes: ${round.summary.missingParticipants.join(', ')}`);
  }

  return lines.join('\n');
}
