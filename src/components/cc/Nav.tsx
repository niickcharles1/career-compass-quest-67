import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Compass, Menu, X } from "lucide-react";

const SoonBadge = () => (
  <span className="ml-1.5 rounded-full bg-[var(--color-teal-soft)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-teal)]">
    Soon
  </span>
);

export function CCNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-[var(--color-teal)]" />
          <span className="text-lg font-bold text-primary">Career Compass</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">Dashboard</Link>
          <Link to="/translator" className="text-sm font-medium text-muted-foreground hover:text-primary">Translator</Link>
          <Link to="/cover-letter" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary">Cover Letter<SoonBadge /></Link>
          <Link to="/interview-coach" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary">Interview Coach<SoonBadge /></Link>
          <Link to="/actions" className="text-sm font-medium text-muted-foreground hover:text-primary">Actions</Link>
          <Link to="/assessment" className="rounded-lg bg-[var(--color-orange)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Get Started</Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            <Link to="/dashboard" className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>Dashboard</Link>
            <Link to="/translator" className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>Translator</Link>
            <Link to="/cover-letter" className="flex items-center rounded-md px-3 py-3 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>Cover Letter<SoonBadge /></Link>
            <Link to="/interview-coach" className="flex items-center rounded-md px-3 py-3 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>Interview Coach<SoonBadge /></Link>
            <Link to="/actions" className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>Actions</Link>
            <Link to="/assessment" className="mt-1 rounded-lg bg-[var(--color-orange)] px-4 py-3 text-center text-sm font-semibold text-white" onClick={() => setOpen(false)}>Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function CCFooter() {
  return (
    <footer className="border-t border-border bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[var(--color-teal)]" />
          <span className="font-semibold text-primary">Career Compass</span>
        </div>
        <p>Built for international students navigating their career.</p>
      </div>
    </footer>
  );
}
