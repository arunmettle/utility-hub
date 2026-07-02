import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import TurnstileWidget from '../components/TurnstileWidget';
import { tools } from '../data/tools';
import { submitFeedback } from '../lib/feedback';
import { getPublicConfig } from '../lib/publicConfig';

type Outcome = 'worked' | 'partly-worked' | 'did-not-work';

export default function FeedbackPage() {
  const [toolId, setToolId] = useState('');
  const [workflow, setWorkflow] = useState('');
  const [outcome, setOutcome] = useState<Outcome>('worked');
  const [missing, setMissing] = useState('');
  const [email, setEmail] = useState('');
  const [canContact, setCanContact] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const spamProtectionEnabled = Boolean(turnstileSiteKey);

  useEffect(() => {
    getPublicConfig().then((config) => {
      setTurnstileSiteKey(config.turnstileSiteKey?.trim() ?? '');
      setTurnstileLoaded(true);
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      await submitFeedback({
        toolId,
        workflow: workflow.trim(),
        outcome,
        missing: missing.trim(),
        email: email.trim() || undefined,
        canContact,
        turnstileToken: turnstileToken || undefined,
      });

      setStatus('submitted');
      setWorkflow('');
      setMissing('');
      setEmail('');
      setCanContact(false);
      setOutcome('worked');
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong while saving your feedback.');
    }
  }

  return (
    <div className="docs-shell">
      <aside className="docs-sidebar">
        <div className="docs-sidebar__section">
          <p className="docs-sidebar__label">Help center</p>
          <div className="docs-sidebar__list">
            <Link to="/guides" className="docs-sidebar__item docs-sidebar__item--link">
              Guides
            </Link>
            <span className="docs-sidebar__item is-active">Feedback</span>
            <Link to="/wishlist" className="docs-sidebar__item docs-sidebar__item--link">
              Wishlist
            </Link>
          </div>
        </div>
      </aside>

      <div className="docs-main">
        <article className="docs-article">
          <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Help center</Link>
            <span>/</span>
            <span>Feedback</span>
          </nav>

          <header className="docs-article__head">
            <div className="docs-article__icon">
              <MessageSquareHeart size={18} />
            </div>
            <div>
              <h1>Feedback</h1>
              <p>Tell us what you were trying to do, what worked, and what was missing from the workflow.</p>
            </div>
          </header>

          <section className="docs-prose-card">
            <p>
              The goal is not generic praise. The goal is to understand the real tasks people are trying to complete so
              UtilityHub becomes more useful for day-to-day work.
            </p>
          </section>

          <form className="docs-form" onSubmit={handleSubmit}>
            <section className="docs-section">
              <h2>Leave feedback</h2>
              <p className="docs-section__intro">Keep it concrete. What were you trying to do, and what blocked the workflow?</p>
            </section>

            <div className="submission-form__grid">
              <label className="submission-form__field">
                <span>Tool</span>
                <select value={toolId} onChange={(event) => setToolId(event.target.value)}>
                  <option value="">General site feedback</option>
                  {tools.map((tool) => (
                    <option key={tool.id} value={tool.id}>
                      {tool.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="submission-form__field">
                <span>Outcome</span>
                <select value={outcome} onChange={(event) => setOutcome(event.target.value as Outcome)}>
                  <option value="worked">Worked well</option>
                  <option value="partly-worked">Partly worked</option>
                  <option value="did-not-work">Did not work</option>
                </select>
              </label>
            </div>

            <label className="submission-form__field">
              <span>What were you trying to do?</span>
              <textarea
                value={workflow}
                onChange={(event) => setWorkflow(event.target.value)}
                placeholder="Example: I was trying to clean up a webhook payload before sharing it in a ticket."
                required
              />
            </label>

            <label className="submission-form__field">
              <span>What was missing or frustrating?</span>
              <textarea
                value={missing}
                onChange={(event) => setMissing(event.target.value)}
                placeholder="Example: I needed redaction suggestions for emails and bearer tokens, not just formatting."
                required
              />
            </label>

            <div className="submission-form__grid">
              <label className="submission-form__field">
                <span>Email (optional)</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label className="submission-form__checkbox">
                <input type="checkbox" checked={canContact} onChange={(event) => setCanContact(event.target.checked)} />
                <span>You can contact me about this feedback</span>
              </label>
            </div>

            <div className="submission-form__actions">
              <TurnstileWidget key={turnstileResetKey} action="feedback_submit" siteKey={turnstileSiteKey} onTokenChange={setTurnstileToken} />
              <button
                type="submit"
                className="action-button action-button--primary"
                disabled={status === 'submitting' || (turnstileLoaded && spamProtectionEnabled && !turnstileToken)}
              >
                {status === 'submitting' ? 'Sending...' : 'Submit feedback'}
              </button>
              {status === 'submitted' ? (
                <p className="submission-form__status submission-form__status--success">
                  <CheckCircle2 size={18} /> Feedback saved. Thanks for helping shape UtilityHub.
                </p>
              ) : null}
              {status === 'error' ? <p className="submission-form__status submission-form__status--error">{errorMessage}</p> : null}
            </div>
          </form>
        </article>

        <aside className="docs-rail">
          <section className="docs-rail__card">
            <h2>Saved privately</h2>
            <p>Feedback is sent to UtilityHub's Cloudflare-backed submission queue and is not stored in this browser.</p>
          </section>

          <section className="docs-rail__card">
            <h2>Good feedback includes</h2>
            <p>The workflow attempted, the edge case hit, and the missing action or output you expected to see.</p>
          </section>

          <section className="docs-rail__card">
            <h2>Related page</h2>
            <p>Use the wishlist if the problem is bigger than a bug or paper cut and really needs a new tool or workflow.</p>
            <Link to="/wishlist" className="guide-inline-link">
              Open wishlist
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
