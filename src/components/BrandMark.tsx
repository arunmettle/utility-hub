export default function BrandMark({
  size = 28,
  withWordmark = false,
  compactWordmark = false,
}: {
  size?: number;
  withWordmark?: boolean;
  compactWordmark?: boolean;
}) {
  return (
    <span className={`brand-mark ${withWordmark ? 'brand-mark--with-wordmark' : ''}`} aria-label="UtilityHub">
      <img
        className="brand-mark__image"
        src="/utilityhub-logo.png"
        alt=""
        width={size}
        height={size}
        aria-hidden="true"
      />
      {withWordmark ? (
        <span className="brand-mark__wordmark">
          <strong>{compactWordmark ? 'UtilityHub' : 'UTILITYHUB'}</strong>
          {!compactWordmark ? <small>Privacy-first browser tools</small> : null}
        </span>
      ) : null}
    </span>
  );
}
