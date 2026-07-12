import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { FloatingActions, ScrollProgress } from "../components/site/Shared";

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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MM Engineering | Industrial Fabrication Baddi | SS & Structural Metalwork" },
      {
        name: "description",
        content:
          "MM Engineering offers certified industrial fabrication, SS 316L cleanroom piping, structural steel mezzanine floors, custom gears, and BMC machining in Baddi, Himachal Pradesh.",
      },
      { name: "author", content: "MM Engineering" },
      { name: "geo.region", content: "IN-HP" },
      { name: "geo.placename", content: "Baddi, Himachal Pradesh" },
      { name: "geo.position", content: "30.9578;76.7913" },
      { name: "ICBM", content: "30.9578, 76.7913" },
      { property: "og:title", content: "MM Engineering | Industrial Fabrication Baddi | SS & Structural Metalwork" },
      {
        property: "og:description",
        content: "Certified industrial fabrication, hygienic SS piping, structural mezzanines, and BMC machining in Baddi, Himachal Pradesh.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "MM Engineering" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MM Engineering | Industrial Fabrication Baddi | SS & Structural Metalwork" },
      { name: "twitter:description", content: "Industrial fabrication and precision engineering services in Baddi, Himachal Pradesh." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["Organization", "LocalBusiness"],
          name: "MM Engineering",
          description:
            "Industrial fabrication and engineering services company in Baddi, Himachal Pradesh. Specialising in industrial fabrication, stainless steel work, sheet metal fabrication, assembly & integration, custom gear manufacturing and BMC machining.",
          telephone: "+91 93188 73188",
          email: "info@mmengineeringbaddi.in",
          image: "https://www.mmengineeringbaddi.in/og-image.jpg",
          url: "https://www.mmengineeringbaddi.in",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Near Simro Dharam Kanta, By Pass Road",
            addressLocality: "Baddi",
            addressRegion: "Himachal Pradesh",
            postalCode: "173205",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 30.9578,
            longitude: 76.7913,
          },
          areaServed: [
            "Baddi",
            "Barotiwala",
            "Nalagarh",
            "BBN Industrial Area",
            "Solan District",
            "Himachal Pradesh",
            "Northern India",
          ],
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              opens: "08:00",
              closes: "18:30",
            },
          ],
          priceRange: "₹₹",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
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
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollProgress />
      <Header />
      <main>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </QueryClientProvider>
  );
}
