import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Provider from "@/components/Provider";

import ToasterProvider from "@/components/ToasterProvider";

const inter = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PDF IntelliQuery",
  description: "AI-Powered PDF Summarization/Query Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Provider>
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <ToasterProvider />
            {children}
          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}
