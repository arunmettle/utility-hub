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
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="56" height="56" rx="18" fill="#2563EB" />
        <path
          d="M41.5 18H25.5C21.3579 18 18 21.3579 18 25.5V38.5C18 42.6421 21.3579 46 25.5 46H41.5"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M34 26L42 32L34 38" stroke="#BFDBFE" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {withWordmark ? (
        <span className="brand-mark__wordmark">
          <strong>{compactWordmark ? 'UtilityHub' : 'UTILITYHUB'}</strong>
          {!compactWordmark ? <small>Privacy-first browser tools</small> : null}
        </span>
      ) : null}
    </span>
  );
}
