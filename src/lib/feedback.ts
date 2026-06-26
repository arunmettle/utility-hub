export interface FeedbackSubmission {
  id: string;
  createdAt: string;
  toolId: string;
  workflow: string;
  outcome: 'worked' | 'partly-worked' | 'did-not-work';
  missing: string;
  email?: string;
  canContact: boolean;
}

export interface WishlistSubmission {
  id: string;
  createdAt: string;
  requestType: 'new-tool' | 'improve-tool' | 'workflow';
  title: string;
  toolId?: string;
  painPoint: string;
  idealOutcome: string;
  workaround?: string;
  email?: string;
}

interface SubmissionResponse {
  ok: boolean;
  submission?: {
    id: string;
    createdAt: string;
  };
  error?: string;
}

async function postSubmission(endpoint: string, payload: unknown) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as SubmissionResponse | null;

  if (!response.ok || !result?.ok || !result.submission) {
    throw new Error(result?.error ?? 'Unable to save your submission right now.');
  }

  return result.submission;
}

export async function submitFeedback(input: Omit<FeedbackSubmission, 'id' | 'createdAt'>) {
  const endpoint = import.meta.env.VITE_FEEDBACK_ENDPOINT?.trim() || '/api/feedback';
  const submission = await postSubmission(endpoint, input);

  return {
    ...input,
    ...submission,
  };
}

export async function submitWishlistItem(input: Omit<WishlistSubmission, 'id' | 'createdAt'>) {
  const endpoint = import.meta.env.VITE_WISHLIST_ENDPOINT?.trim() || '/api/wishlist';
  const submission = await postSubmission(endpoint, input);

  return {
    ...input,
    ...submission,
  };
}
