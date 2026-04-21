import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2.5 font-display text-[1.35rem] tracking-tight">
      <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-ink text-paper">
        <span className="font-mono text-[11px] font-bold tracking-tighter">YC</span>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-electric ring-2 ring-background" />
      </span>
      <span className="font-medium">Your Choice</span>
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#how" className="text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#paths" className="text-muted-foreground transition-colors hover:text-foreground">
            Career paths
          </a>
          <a href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
            <a href="#start">Sign in</a>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <a href="#start">Start free</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function StickyMobileCTA() {
  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 md:hidden">
      <Button variant="primary" size="lg" className="w-full shadow-elevated" asChild>
        <a href="#start">See my career map →</a>
      </Button>
    </div>
  );
}
