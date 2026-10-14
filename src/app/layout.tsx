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

// Carrega a fonte Montserrat via next/font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "variable", // Montserrat é variable font — carrega todos os pesos num arquivo só
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
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className={`${montserrat.variable}`}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
