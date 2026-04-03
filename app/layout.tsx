import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import SessionProvider from "@/components/auth/SessionProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | StockCoach",
    default: "StockCoach — Personal Investment Manager",
  },
  description: "Track your portfolio, analyze stocks, and get AI-powered investment insights. Not financial advice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 md:ml-60 min-h-screen">
              {children}
            </div>
          </div>
          <BottomNav />
        </SessionProvider>
      </body>
    </html>
  );
}
