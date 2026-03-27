import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./Redux/store/provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doctor Admin Panel",
  description: "Manage doctors and appointments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full bg-gray-50" suppressHydrationWarning={true}>
        <ReduxProvider>
          
          {/* HEADER */}
          {/* <Header /> */}

          {/* MAIN LAYOUT */}
          <div className="flex h-[calc(100vh-64px)]">
            
            {/* SIDEBAR */}
            {/* <Sidebar /> */}

            {/* CONTENT */}
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>

          </div>

        </ReduxProvider>
      </body>
    </html>
  );
}