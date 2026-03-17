import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spyfall - Online Party Game",
  description: "Play Spyfall with friends online. Find the spy before time runs out!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
