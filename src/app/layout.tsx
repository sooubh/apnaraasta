import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/authContext";

export const metadata: Metadata = {
  title: "ApnaRaasta — From Your Interests to Your People",
  description:
    "Discover cultural activities and recurring communities in Pune with Qloo cultural intelligence and Gemini agentic pathways.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-raasta-canvas text-raasta-ink min-h-screen antialiased flex flex-col selection:bg-raasta-periwinkle selection:text-raasta-ink">
        <AuthProvider>
          <div className="flex-1 flex flex-col w-full max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-5xl shadow-card bg-raasta-canvas">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
