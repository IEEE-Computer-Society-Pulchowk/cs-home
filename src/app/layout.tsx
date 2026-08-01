import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://ieeecs.pcampus.edu.np";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IEEE Computer Society Pulchowk SBC",
    template: "%s | IEEE Computer Society Pulchowk SBC",
  },
  description:
    "Official website of IEEE Computer Society Pulchowk SBC at IOE Pulchowk Campus — workshops, seminars, competitions, and a community advancing excellence in computing and technology.",
  keywords: [
    "IEEE",
    "IEEE Pulchowk",
    "IEEE Student Branch",
    "IEEE Computer Society",
    "IEEE Pulchowk Student Branch",
    "IEEE Computer Society Pulchowk SBC",
    "Computer Society",
    "Pulchowk SBC",
    "Computer Society Pulchowk",
    "Pulchowk Campus",
    "IOE",
    "engineering",
    "technology",
    "Nepal",
    "workshops",
    "seminars",
    "hackathons",
  ],
  authors: [{ name: "IEEE Computer Society Pulchowk SBC" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "IEEE Computer Society Pulchowk SBC",
    title: "IEEE Computer Society Pulchowk SBC",
    description:
      "Workshops, seminars, competitions, and a community advancing excellence in computing and technology at IOE Pulchowk Campus.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IEEE Computer Society Pulchowk SBC Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEEE Computer Society Pulchowk SBC",
    description:
      "Workshops, seminars, competitions, and a community advancing excellence in computing and technology at IOE Pulchowk Campus.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "nAe06vQjRy6OTOt61juUQUdkLiPtcL6XYr-ina679j4",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "IEEE Computer Society Pulchowk SBC",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-orange.svg`,
  description:
    "IEEE Student Branch at IOE Pulchowk Campus, Tribhuvan University, Nepal.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lalitpur",
    addressRegion: "Bagmati",
    addressCountry: "NP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
