import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import TurnstileWidget from '../components/TurnstileWidget';
import { tools } from '../data/tools';
import { submitWishlistItem } from '../lib/feedback';
import { getPublicConfig } from '../lib/publicConfig';

type RequestType = 'new-tool' | 'improve-tool' | 'workflow';

export default function WishlistPage() {
  const [requestType, setRequestType] = useState<RequestType>('new-tool');
  const [title, setTitle] = useState('');
  const [toolId, setToolId] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [idealOutcome, setIdealOutcome] = useState('');
  const [workaround, setWorkaround] = useState('');
  const [email, setEmail] = useState('');
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
      await submitWishlistItem({
        requestType,
        title: title.trim(),
        toolId: toolId || undefined,
        painPoint: painPoint.trim(),
        idealOutcome: idealOutcome.trim(),
        workaround: workaround.trim() || undefined,
        email: email.trim() || undefined,
        turnstileToken: turnstileToken || undefined,
      });

      setStatus('submitted');
      setTitle('');
      setToolId('');
      setPainPoint('');
      setIdealOutcome('');
      setWorkaround('');
      setEmail('');
      setRequestType('new-tool');
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong while saving your request.');
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
            <Link to="/feedback" className="docs-sidebar__item docs-sidebar__item--link">
              Feedback
            </Link>
            <span className="docs-sidebar__item is-active">Wishlist</span>
          </div>
        </div>
      </aside>

      <div className="docs-main">
        <article className="docs-article">
          <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Help center</Link>
            <span>/</span>
            <span>Wishlist</span>
          </nav>

          <header className="docs-article__head">
            <div className="docs-article__icon">
              <Lightbulb size={18} />
            </div>
            <div>
              <h1>Wishlist</h1>
              <p>Request a new tool, suggest a workflow improvement, or describe the feature gap blocking your work.</p>
            </div>
          </header>

          <section className="docs-prose-card">
            <p>
              The best requests explain the job to be done, the pain point, and what the ideal finished workflow should
              look like. That makes prioritization much easier later.
            </p>
          </section>

          <form className="docs-form" onSubmit={handleSubmit}>
            <section className="docs-section">
              <h2>Request a tool or improvement</h2>
              <p className="docs-section__intro">Describe the workflow problem, not just a feature name.</p>
            </section>

            <div className="submission-form__grid">
              <label className="submission-form__field">
                <span>Request type</span>
                <select value={requestType} onChange={(event) => setRequestType(event.target.value as RequestType)}>
                  <option value="new-tool">New tool</option>
                  <option value="improve-tool">Improve an existing tool</option>
                  <option value="workflow">New workflow or collection</option>
                </select>
              </label>

              <label className="submission-form__field">
                <span>Related tool (optional)</span>
                <select value={toolId} onChange={(event) => setToolId(event.target.value)}>
                  <option value="">No specific tool</option>
                  {tools.map((tool) => (
                    <option key={tool.id} value={tool.id}>
                      {tool.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="submission-form__field">
              <span>Short title</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Redact secrets directly inside the JSON formatter flow"
                required
              />
            </label>

            <label className="submission-form__field">
              <span>What pain point are you hitting?</span>
              <textarea
                value={painPoint}
                onChange={(event) => setPainPoint(event.target.value)}
                placeholder="Example: I can format payloads, but I still need a safe way to mask tokens before sharing them."
                required
              />
            </label>

            <label className="submission-form__field">
              <span>What would the ideal outcome look like?</span>
              <textarea
                value={idealOutcome}
                onChange={(event) => setIdealOutcome(event.target.value)}
                placeholder="Example: One flow that validates JSON, highlights schema changes, and redacts secrets before export."
                required
              />
            </label>

            <label className="submission-form__field">
              <span>Current workaround (optional)</span>
              <textarea
                value={workaround}
                onChange={(event) => setWorkaround(event.target.value)}
                placeholder="Example: I use two or three separate tools and then manually clean the output."
              />
            </label>

            <label className="submission-form__field">
              <span>Email (optional)</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </label>

            <div className="submission-form__actions">
              <TurnstileWidget key={turnstileResetKey} action="wishlist_submit" siteKey={turnstileSiteKey} onTokenChange={setTurnstileToken} />
              <button
                type="submit"
                className="action-button action-button--primary"
                disabled={status === 'submitting' || (turnstileLoaded && spamProtectionEnabled && !turnstileToken)}
              >
                {status === 'submitting' ? 'Saving...' : 'Submit request'}
              </button>
              {status === 'submitted' ? (
                <p className="submission-form__status submission-form__status--success">
                  <CheckCircle2 size={18} /> Request saved. This gives us a clean starting point for future prioritization.
                </p>
              ) : null}
              {status === 'error' ? <p className="submission-form__status submission-form__status--error">{errorMessage}</p> : null}
            </div>
          </form>
        </article>

        <aside className="docs-rail">
          <section className="docs-rail__card">
            <h2>Saved privately</h2>
            <p>Wishlist requests are sent to UtilityHub's Cloudflare-backed submission queue and are not stored in this browser.</p>
          </section>

          <section className="docs-rail__card">
            <h2>Strong requests include</h2>
            <p>A current workaround, the missing step in the workflow, and what success would feel like for the user.</p>
          </section>

          <section className="docs-rail__card">
            <h2>Related page</h2>
            <p>Use feedback when the tool exists but the experience is incomplete or broken on an edge case.</p>
            <Link to="/feedback" className="guide-inline-link">
              Leave feedback
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
