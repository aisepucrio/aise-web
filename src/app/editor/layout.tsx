import { MantineProvider, createTheme } from "@mantine/core";
import type { Metadata } from "next";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { AuthProvider } from "@/components/editor/AuthContext";

// Ajustes de tema específicos do editor, por cima do tema base do layout raiz.
const theme = createTheme({
  fontFamily:
    "var(--font-montserrat), Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  headings: { fontFamily: "var(--font-montserrat), Montserrat, sans-serif" },
  fontFamilyMonospace: "ui-monospace, SFMono-Regular, Menlo, monospace",
  primaryColor: "indigo",
  components: {
    InputWrapper: {
      defaultProps: {
        labelElement: "div",
        labelProps: {
          style: {
            display: "block",
            width: "100%",
          },
        },
      },
    },
  },
});

export const metadata: Metadata = {
  title: "AISE Team Editor",
  description: "Editor de perfis da equipe AISE - PUC-Rio",
};

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <AuthProvider>
        <Notifications position="top-right" />
        {children}
      </AuthProvider>
    </MantineProvider>
  );
}
