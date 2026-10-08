import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VLD — Ultra-Fast TypeScript Validation",
  description:
    "VLD is a zero-dependency TypeScript schema validator and drop-in Zod replacement. 3.03× faster, 27+ languages, Result pattern, plugins and codecs.",
  keywords: [
    "typescript",
    "validation",
    "schema",
    "zod",
    "runtime validation",
    "vld",
    "performance",
  ],
  metadataBase: new URL("https://vld.oxog.dev"),
  openGraph: {
    title: "VLD — Ultra-Fast TypeScript Validation",
    description:
      "3.03× faster than Zod. Zero dependencies. Drop-in replacement. Validate at the speed of light.",
    url: "https://vld.oxog.dev",
    siteName: "VLD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VLD — Ultra-Fast TypeScript Validation",
    description: "3.03× faster than Zod. Zero dependencies. Drop-in replacement.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#05080a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="noise min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
