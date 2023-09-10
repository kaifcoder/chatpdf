import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to PDF IntelliQuery",
  description: "AI-Powered PDF Summarization/Query Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-red-200 via-purple-100 to-violet-400">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        {children}
      </div>
    </div>
  );
}
