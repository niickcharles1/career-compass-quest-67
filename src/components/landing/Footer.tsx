export function Footer() {
  return (
    <footer className="bg-ink py-8 text-cream/70">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm md:flex-row">
        <p className="flex items-center gap-2 font-display text-base font-semibold text-cream">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          Your Choice
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="#" className="transition-colors hover:text-cream">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-cream">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-cream">
            Contact Support
          </a>
        </div>
        <p className="text-xs text-cream/40">© 2026 Your Choice. All rights reserved.</p>
      </div>
    </footer>
  );
}
