import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import { getUserObject } from "@/db/getServerSupabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserObject();

  return (
    <StoreProvider initialUser={user}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-full`}
        >
          <div className="flex-none">
            <Header />
          </div>
          <div className="flex-1 min-h-0 overflow-auto">{children}</div>
          <footer className="flex-none">
            <Footer />
          </footer>
        </body>
      </html>
    </StoreProvider>
  );
}
