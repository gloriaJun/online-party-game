import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Party Games",
  description: "Play party games with friends online!",
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
