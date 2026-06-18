import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Snapmydesign VTON API Reference",
  description: "Comprehensive API reference and developer documentation for integrating Snapmydesign Virtual Try-On (VTON) services.",
  keywords: ["VTON", "Virtual Try-On", "Snapmydesign", "AI Fashion", "E-commerce SDK", "API Documentation"],
  openGraph: {
    title: "Snapmydesign VTON API Reference",
    description: "Comprehensive API reference and developer documentation for integrating Snapmydesign Virtual Try-On (VTON) services.",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
