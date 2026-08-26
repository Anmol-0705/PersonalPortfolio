import type { Metadata } from "next";
import { Space_Grotesk, VT323 } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RetroPreferencesProvider } from "@/components/retro/retro-preferences-provider";
import { RetroControls } from "@/components/retro/retro-controls";
import { CursorTrail } from "@/components/retro/cursor-trail";
import { siteConfig } from "@/data/site-config";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

const title = `${siteConfig.name} — ${siteConfig.role}`;
const description = `Portfolio of ${siteConfig.name}, a ${siteConfig.role} with ${siteConfig.experience} of experience and ${siteConfig.projectsDelivered} projects delivered. ${siteConfig.availability}.`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  // No `title.template`: every route already sets its own full title
  // (e.g. `About — ${siteConfig.name}`) — a template would double-append
  // the suffix on top of those. This `title` is only the fallback for a
  // route that sets none (currently none do).
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <RetroPreferencesProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CursorTrail />
          <RetroControls />
        </RetroPreferencesProvider>
      </body>
    </html>
  );
}
