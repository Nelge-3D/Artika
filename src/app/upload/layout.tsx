import Navbar from "@/components/ui/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publier une œuvre — ArTika",
  description: "Partagez votre création avec la communauté ArTika. Publiez vos œuvres numériques en quelques secondes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <>
      <Navbar/>
        <main >{children}</main>
      </>
  );
}
