export function Logo({ wordmark, className = "" }: { wordmark: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label={wordmark}>
      <svg aria-hidden width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="0.75" y="0.75" width="20.5" height="20.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 6.5l2.7 9 3.3-7.5 3.3 7.5 2.7-9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" />
        <rect x="16" y="2.5" width="3" height="3" fill="#2864D8" />
      </svg>
      <span className="text-[1.02rem] font-bold tracking-[0.14em]">{wordmark}</span>
    </span>
  );
}
