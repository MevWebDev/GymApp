import type { Metadata } from "next";

import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import WebSocketListener from "./components/webSocketListener";

export const metadata: Metadata = {
  title: "Gymify",
  description: "Create, browse, and share workout routines",
  type: "website",
  siteName: "Gymify",
  locale: "en_US",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeRegistry>
        <body className={`antialiased`}>
          <SnackbarProvider>
            <AuthProvider>
              <Navbar />
              <WebSocketListener />
              {children}
            </AuthProvider>
          </SnackbarProvider>
        </body>
      </ThemeRegistry>
    </html>
  );
}
