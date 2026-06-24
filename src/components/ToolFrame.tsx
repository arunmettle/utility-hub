import AdSlot from './AdSlot';

export default function ToolFrame({
  eyebrow,
  title,
  description,
  actions,
  children,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  note?: { title: string; body: string };
}) {
  return (
    <div className="tool-page">
      <div className="tool-page__header">
        <div>
          <p className="tool-page__eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="tool-page__description">{description}</p>
        </div>
        {actions ? <div className="tool-actions">{actions}</div> : null}
      </div>

      <AdSlot placement="banner" pageLabel={title} />

      {children}

      {note ? (
        <section className="tool-note">
          <h2>{note.title}</h2>
          <p>{note.body}</p>
        </section>
      ) : null}

      <AdSlot placement="floating" pageLabel={title} />
    </div>
  );
}
