export function Logo({ wordmark, className = "" }: { wordmark: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label={wordmark}>
      <svg aria-hidden width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="0.75" y="0.75" width="20.5" height="20.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 16V6h5.2a3 3 0 010 6H6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="13" width="3" height="3" fill="#2864D8" />
      </svg>
      <span className="text-[1.02rem] font-bold tracking-[0.14em]">{wordmark}</span>
    </span>
  );
}
