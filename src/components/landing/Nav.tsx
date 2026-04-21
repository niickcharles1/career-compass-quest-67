import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink/10 bg-background/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2 font-display text-xl font-semibold">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
          Your Choice
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            Stories
          </a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </a>
        </nav>
        <Button variant="ink" size="sm" asChild>
          <a href="#start">Start free</a>
        </Button>
      </div>
    </header>
  );
}

export function StickyMobileCTA() {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
      <Button variant="hero" size="lg" className="w-full" asChild>
        <a href="#start">Start my free test →</a>
      </Button>
    </div>
  );
}
