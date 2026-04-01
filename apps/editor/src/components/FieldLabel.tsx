import { Box, Text } from "@mantine/core";
import { ReactNode } from "react";
import Tooltip from "./Tooltip";

export type FieldLabelOptions = {
  text: string;
  tooltip: ReactNode;
  required?: boolean;
};

export function FieldLabel({
  text,
  tooltip,
  required = false,
}: FieldLabelOptions) {
  return (
    <Box
      component="span"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
      }}
    >
      <Text component="span" size="sm" fw={500} style={{ minWidth: 0 }}>
        {text}
        {required && (
          <Text component="span" c="red" ml={5}>
            *
          </Text>
        )}
      </Text>
      <Box
        component="span"
        style={{ marginLeft: "auto", flexShrink: 0, display: "inline-flex" }}
      >
        <Tooltip position="top">{tooltip}</Tooltip>
      </Box>
    </Box>
  );
}
