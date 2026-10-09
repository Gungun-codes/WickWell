import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-lume flex min-h-[60vh] items-center justify-center py-16">
      <div className="max-w-lg rounded-card bg-cream-50 p-8 text-center shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-cocoa-600">404</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">This page wandered off.</h1>
        <p className="mt-4 text-cocoa-600">The page you’re looking for doesn’t exist yet, but the rest of WickWell is ready.</p>
        <Link href="/" className="btn-primary mt-6">
          Back home
        </Link>
      </div>
    </main>
  );
}
