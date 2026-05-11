import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import Providers from "@/components/layout/Providers";

const prompt = Prompt({ 
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HotelBooking | จองที่พักออนไลน์ คุ้มค่าที่สุด",
  description: "ค้นหาและจองโรงแรม ที่พัก บังกะโล ในราคาประหยัด พร้อมโปรโมชั่นมากมาย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={prompt.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-muted py-8 border-t border-border">
              <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
                &copy; {new Date().getFullYear()} HotelBooking Platform. All rights reserved.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
