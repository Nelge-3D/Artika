import Navbar from "@/components/ui/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ArTika — Galerie",
  description: "Explorez les œuvres d'artistes numériques gabonais sur ArTika : illustrations, 3D, photographie et bien plus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
