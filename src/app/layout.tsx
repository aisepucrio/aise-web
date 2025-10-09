import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "./globals.css";
import Header from "@/pages/header/Header";

// Carrega a fonte Montserrat via next/font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

// Define a fonte Montserrat como base no tema
const theme = createTheme({
  fontFamily: "Montserrat, sans-serif",
  headings: { fontFamily: "Montserrat, sans-serif" },
  fontFamilyMonospace: "ui-monospace, SFMono-Regular, Menlo, monospace",
  primaryColor: "indigo",
});

export const metadata: Metadata = {
  title: "AISE LAB",
  description: "Artificial Intelligence and Software Engineering Laboratory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html {...mantineHtmlProps} lang="en" className={montserrat.variable}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${montserrat.variable}`}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Header />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
