import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Bench — Digital Justice",
  description:
    "AI-powered legal intelligence platform combining advanced AI with trusted Indian legal databases to make legal knowledge accessible to everyone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>

        {/* Responsive viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />

      </head>

      <body>

        {children}

      </body>
    </html>
  );
}