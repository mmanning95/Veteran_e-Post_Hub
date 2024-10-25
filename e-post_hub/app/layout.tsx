//Used for base layout for all pages. For instance the self contained navBar

import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Components/Providers";
import TopNav from "./Components/Navbar/TopNav";

export const metadata: Metadata = {
  title: "Veteran e-Post Hub",
  description: "to-do",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TopNav />
          <main className="container mx-auto ">
            {children}
          </main>
        </Providers>
      </body>
    </html> 
  );
}