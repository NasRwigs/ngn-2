import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "NGN Portal",
    template: "%s · NGN Portal",
  },
  description:
    "The Now Generation Network Portal — Mo Ibrahim Foundation. The digital home for Africa's next generation of leaders.",
  applicationName: "NGN Portal",
};

export const viewport: Viewport = {
  themeColor: "#00265e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={hanken.variable}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
