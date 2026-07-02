import { describe, expect, it } from 'vitest';
import {
  buildPlanningPokerRoundMarkdown,
  buildPlanningPokerStory,
  createPlanningPokerRoundRecord,
  getPlanningPokerCardSet,
  parsePlanningPokerCustomCards,
  parsePlanningPokerStoryQueue,
  resetPlanningPokerStoryForReestimate,
  resolvePlanningPokerCards,
  summarizePlanningPokerRound,
  type PlanningPokerParticipant,
} from '../src/lib/planningPoker';

const participants: PlanningPokerParticipant[] = [
  { id: 'sam', name: 'Sam' },
  { id: 'maya', name: 'Maya' },
  { id: 'lee', name: 'Lee' },
];

describe('planningPoker', () => {
  it('returns the expected built-in decks and falls back safely', () => {
    expect(getPlanningPokerCardSet('fibonacci').cards).toContain('13');
    expect(getPlanningPokerCardSet('custom').name).toBe('Custom');
  });

  it('parses custom cards with trimming and deduplication', () => {
    expect(parsePlanningPokerCustomCards('1, 2, 2, 3').output).toEqual(['1', '2', '3']);
    expect(parsePlanningPokerCustomCards('   ').error).toBe('Add at least one custom card value.');
  });

  it('resolves custom decks and preserves defaults when custom input is invalid', () => {
    expect(resolvePlanningPokerCards('custom', 'Small, Medium, Large').output).toEqual(['Small', 'Medium', 'Large']);

    const invalid = resolvePlanningPokerCards('custom', ' ');
    expect(invalid.error).toBe('');
    expect(invalid.output).toEqual(['1', '2', '3', '5', '8']);
  });

  it('parses story queues into backlog-linked work items', () => {
    const queue = parsePlanningPokerStoryQueue(
      'PBI 1423 | https://dev.azure.com/org/proj/_workitems/edit/1423 | Customer profile\nhttps://jira.example.com/browse/APP-12 | Login cleanup | APP-12',
    );

    expect(queue.error).toBe('');
    expect(queue.output).toEqual([
      {
        label: 'PBI 1423',
        url: 'https://dev.azure.com/org/proj/_workitems/edit/1423',
        title: 'Customer profile',
      },
      {
        label: 'APP-12',
        url: 'https://jira.example.com/browse/APP-12',
        title: 'Login cleanup',
      },
    ]);
  });

  it('summarizes numeric rounds with consensus, averages, and outliers', () => {
    const summary = summarizePlanningPokerRound(
      participants,
      {
        sam: '3',
        maya: '8',
        lee: '3',
      },
      true,
    );

    expect(summary.votesCast).toBe(3);
    expect(summary.consensus).toBe(false);
    expect(summary.average).toBeCloseTo(4.67, 2);
    expect(summary.lowest).toBe(3);
    expect(summary.highest).toBe(8);
    expect(summary.outlierNames).toEqual(['Maya']);
    expect(summary.tally).toEqual([
      { value: '3', count: 2, participantNames: ['Lee', 'Sam'] },
      { value: '8', count: 1, participantNames: ['Maya'] },
    ]);
  });

  it('summarizes non-numeric rounds without pretending there is a numeric average', () => {
    const summary = summarizePlanningPokerRound(
      participants,
      {
        sam: 'High',
        maya: 'Medium',
      },
      false,
    );

    expect(summary.average).toBeNull();
    expect(summary.nonNumericVotes).toEqual(['High', 'Medium']);
    expect(summary.missingParticipants).toEqual(['Lee']);
    expect(summary.consensusLabel).toBe('Voting in progress');
  });

  it('creates round records and markdown summaries with the scrum master final estimate', () => {
    const story = buildPlanningPokerStory(
      {
        label: 'PBI 1423',
        url: 'https://dev.azure.com/org/proj/_workitems/edit/1423',
        title: 'Customer profile redesign',
      },
      () => 'story-1',
      'active',
    );
    const summary = summarizePlanningPokerRound(
      participants,
      {
        sam: '5',
        maya: '5',
        lee: '8',
      },
      true,
    );
    const round = createPlanningPokerRoundRecord(
      story,
      {
        sam: '5',
        maya: '5',
        lee: '8',
      },
      summary,
      '5',
      'fibonacci',
      'Fibonacci',
      () => 'round-1',
      '2026-06-29T10:00:00.000Z',
    );

    expect(round.finalEstimate).toBe('5');
    expect(round.storyLabel).toBe('PBI 1423');
    expect(round.roundNumber).toBe(1);

    const markdown = buildPlanningPokerRoundMarkdown(round, participants);
    expect(markdown).toContain('Work item: PBI 1423');
    expect(markdown).toContain('Final estimate: 5');
    expect(markdown).toContain('Link: https://dev.azure.com/org/proj/_workitems/edit/1423');
    expect(markdown).toContain('- 5: 2 (Maya, Sam)');
    expect(markdown).toContain('- Sam: 5');
  });

  it('reopens finalized stories for a new round cleanly', () => {
    const finalizedStory = {
      ...buildPlanningPokerStory(
        {
          label: 'PBI 1450',
          url: 'https://dev.azure.com/org/proj/_workitems/edit/1450',
          title: 'Notification rules cleanup',
        },
        () => 'story-2',
        'finalized',
      ),
      finalEstimate: '8',
    };

    const reopened = resetPlanningPokerStoryForReestimate(finalizedStory);
    expect(reopened.status).toBe('active');
    expect(reopened.finalEstimate).toBeNull();
    expect(reopened.roundNumber).toBe(2);
  });
});
