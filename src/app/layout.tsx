import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dev Toolkit",
  description: "A collection of useful tools for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex antialiased min-h-screen `}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Sidebar />
          <main className="flex flex-col flex-1 overflow-y-auto p-6 min-h-screen">
            {children}
            <Footer />
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
