import Navbar from "@/components/ui/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorer — ArTika",
  description: "Explorez les artistes et les œuvres de la galerie ArTika. Filtrez par catégorie, tendance et bien plus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar/>
      <main className="lg:ml-16"> {/* Ajout de la marge gauche uniquement à partir du breakpoint lg */}
        {children}
      </main>
    </>
  );
}