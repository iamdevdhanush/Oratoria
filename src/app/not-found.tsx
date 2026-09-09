import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-auditorium-bg text-auditorium-cream gap-4 p-4">
      <h2 className="font-serif text-3xl text-auditorium-gold">404 — Hall Not Found</h2>
      <p className="text-sm text-auditorium-cream/60">
        You seem to have wandered outside the auditorium corridors.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-auditorium-gold/20 hover:bg-auditorium-gold/30 text-auditorium-gold border border-auditorium-gold/30 text-sm font-medium transition-colors"
      >
        Return to Auditorium
      </Link>
    </div>
  );
}
