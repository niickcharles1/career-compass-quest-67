export function Footer() {
  return (
    <footer className="bg-ink py-10 text-paper/60">
      <div className="container mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 text-sm md:flex-row md:items-center">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-paper/10 text-paper">
            <span className="font-mono text-[11px] font-bold tracking-tighter">YC</span>
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-electric ring-2 ring-ink" />
          </span>
          <div>
            <p className="font-display text-base text-paper">Your Choice</p>
            <p className="text-xs text-paper/45">The career decision engine.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <a href="#" className="transition-colors hover:text-paper">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-paper">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-paper">
            Methodology
          </a>
          <a href="#" className="transition-colors hover:text-paper">
            Contact
          </a>
        </div>
        <p className="font-mono text-xs text-paper/40">© 2026 Your Choice</p>
      </div>
    </footer>
  );
}
