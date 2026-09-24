import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rarewise — Career Discovery Platform",
  description:
    "Find your direction. Try the work. Explore real finance careers, learn by doing and build clarity at your own pace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Caveat:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f9fff6] text-[#0e0e0e] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
