import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Your Choice — Find your dream career in 5 minutes" },
      {
        name: "description",
        content:
          "Take the free Your Choice quiz: get 3 tailored career paths matched to your skills, work-style and life. Built for Gen Z by career experts.",
      },
      { name: "author", content: "Your Choice" },
      { property: "og:title", content: "Your Choice — Find your dream career in 5 minutes" },
      {
        property: "og:description",
        content:
          "Stop second-guessing your future. Get 3 tailored career paths in 5 minutes — free.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Your Choice — Find your dream career in 5 minutes" },
      { name: "description", content: "Your Career Compass is an interactive tool that suggests three personalized career paths based on your skills and priorities." },
      { property: "og:description", content: "Your Career Compass is an interactive tool that suggests three personalized career paths based on your skills and priorities." },
      { name: "twitter:description", content: "Your Career Compass is an interactive tool that suggests three personalized career paths based on your skills and priorities." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6c8df13a-af2f-4b99-95e5-274c07affbb8/id-preview-caf69b3b--ea3fed83-6e6a-4855-8e35-bab2d7c34871.lovable.app-1776778677193.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6c8df13a-af2f-4b99-95e5-274c07affbb8/id-preview-caf69b3b--ea3fed83-6e6a-4855-8e35-bab2d7c34871.lovable.app-1776778677193.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
