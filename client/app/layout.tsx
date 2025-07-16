import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const font_main = Poppins({
  variable: "--font-main",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rommie Web App",
  description:
    "Page created to be a solution for rommies that live whithin the tec area, by tec for tec",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${font_main.variable} light`}>{children}</body>
    </html>
  );
}
