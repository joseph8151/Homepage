export default function Loading() {
  return <div role="status" aria-live="polite" className="flex min-h-[60vh] items-center justify-center pt-24 text-mute"><span className="sr-only">불러오는 중</span><span aria-hidden className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" /></div>;
}
