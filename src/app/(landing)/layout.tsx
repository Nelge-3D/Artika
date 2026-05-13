import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ArTika — Galerie d'art numérique gabonaise",
  description: "ArTika est la première galerie d'art numérique gabonaise. Découvrez, soutenez et connectez-vous avec les artistes locaux.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
