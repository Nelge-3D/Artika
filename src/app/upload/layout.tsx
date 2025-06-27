import Navbar from "@/components/ui/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ArTika",
  description: "Découvrez la richesse culturelle du Gabon et du Congo à travers nos cours de langue en ligne ! ",
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
