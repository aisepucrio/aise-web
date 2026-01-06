"use client";

import { useState } from "react";
import {
  Box,
  Group,
  Select,
  Stack,
  Text,
  Checkbox,
  Paper,
} from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";

interface DateRangePickerProps {
  value: string; // Formato: "Jan 2025 – present" ou "Jan 2024 – Dec 2024"
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

// Meses do ano
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Anos disponíveis (últimos 10 anos + próximos 2)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 13 }, (_, i) => currentYear - 10 + i);

export default function DateRangePicker({
  value,
  onChange,
  label = "Duration",
  required = false,
}: DateRangePickerProps) {
  // Parse do valor inicial
  const parseValue = (val: string) => {
    if (!val || val.trim() === "") {
      return {
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        isOngoing: false,
      };
    }

    // Formato: "Jan 2025 – present" ou "Jan 2024 – Dec 2024"
    const parts = val.split(/\s*[–-]\s*/);
    if (parts.length !== 2) {
      return {
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        isOngoing: false,
      };
    }

    const [start, end] = parts;
    const startParts = start.trim().split(" ");
    const isOngoing = end.trim().toLowerCase() === "present";

    let endMonth = "";
    let endYear = "";
    if (!isOngoing) {
      const endParts = end.trim().split(" ");
      endMonth = endParts[0] || "";
      endYear = endParts[1] || "";
    }

    return {
      startMonth: startParts[0] || "",
      startYear: startParts[1] || "",
      endMonth,
      endYear,
      isOngoing,
    };
  };

  const parsed = parseValue(value);
  const [startMonth, setStartMonth] = useState(parsed.startMonth);
  const [startYear, setStartYear] = useState(parsed.startYear);
  const [endMonth, setEndMonth] = useState(parsed.endMonth);
  const [endYear, setEndYear] = useState(parsed.endYear);
  const [isOngoing, setIsOngoing] = useState(parsed.isOngoing);

  // Atualiza o valor formatado quando qualquer campo muda
  const updateValue = (
    sMonth: string,
    sYear: string,
    eMonth: string,
    eYear: string,
    ongoing: boolean
  ) => {
    if (!sMonth || !sYear) {
      onChange("");
      return;
    }

    if (ongoing) {
      onChange(`${sMonth} ${sYear} – present`);
    } else if (eMonth && eYear) {
      onChange(`${sMonth} ${sYear} – ${eMonth} ${eYear}`);
    } else {
      onChange(`${sMonth} ${sYear} – present`);
    }
  };

  const handleStartMonthChange = (val: string | null) => {
    const newMonth = val || "";
    setStartMonth(newMonth);
    updateValue(newMonth, startYear, endMonth, endYear, isOngoing);
  };

  const handleStartYearChange = (val: string | null) => {
    const newYear = val || "";
    setStartYear(newYear);
    updateValue(startMonth, newYear, endMonth, endYear, isOngoing);
  };

  const handleEndMonthChange = (val: string | null) => {
    const newMonth = val || "";
    setEndMonth(newMonth);
    updateValue(startMonth, startYear, newMonth, endYear, isOngoing);
  };

  const handleEndYearChange = (val: string | null) => {
    const newYear = val || "";
    setEndYear(newYear);
    updateValue(startMonth, startYear, endMonth, newYear, isOngoing);
  };

  const handleOngoingChange = (checked: boolean) => {
    setIsOngoing(checked);
    if (checked) {
      setEndMonth("");
      setEndYear("");
      updateValue(startMonth, startYear, "", "", true);
    } else {
      updateValue(startMonth, startYear, endMonth, endYear, false);
    }
  };

  return (
    <Paper p="md" radius="lg" withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <IconCalendar size={20} color="var(--primary)" />
          <Text size="sm" fw={600} c="var(--primary)">
            {label}
            {required && <span style={{ color: "red" }}> *</span>}
          </Text>
        </Group>

        {/* Data de início */}
        <Box>
          <Text size="xs" fw={600} c="dimmed" mb="xs">
            Data de Início
          </Text>
          <Group grow>
            <Select
              radius={"md"}
              placeholder="Mês"
              data={MONTHS}
              value={startMonth}
              onChange={handleStartMonthChange}
              searchable
              styles={{
                input: {
                  borderColor: !startMonth && required ? "#fa5252" : undefined,
                },
                label: {
                  color: "#000000",
                  fontWeight: 500,
                },
                option: {
                  color: "#000",
                  "&[dataDisabled]": { color: "#adb5bd" },
                  "&[dataSelected]": { background: "#f1f3f5", color: "#000" },
                  "&[dataHovered]": { background: "#f8f9fa" },
                },
              }}
            />
            <Select
              radius={"md"}
              placeholder="Ano"
              data={YEARS.map(String)}
              value={startYear}
              onChange={handleStartYearChange}
              searchable
              styles={{
                input: {
                  borderColor: !startYear && required ? "#fa5252" : undefined,
                },
                label: {
                  color: "#000000",
                  fontWeight: 500,
                },
                option: {
                  color: "#000",
                  "&[dataDisabled]": { color: "#adb5bd" },
                  "&[dataSelected]": { background: "#f1f3f5", color: "#000" },
                  "&[dataHovered]": { background: "#f8f9fa" },
                },
              }}
            />
          </Group>
        </Box>

        {/* Checkbox "Em andamento" */}
        <Checkbox
          label="Projeto em andamento (ongoing)"
          checked={isOngoing}
          onChange={(e) => handleOngoingChange(e.currentTarget.checked)}
          color="var(--primary)"
          style={{ color: "black" }}
        />

        {/* Data de fim (desabilitado se ongoing) */}
        {!isOngoing && (
          <Box>
            <Text size="xs" fw={600} c="dimmed" mb="xs">
              Data de Término
            </Text>
            <Group grow>
              <Select
                radius={"md"}
                placeholder="Mês"
                data={MONTHS}
                value={endMonth}
                onChange={handleEndMonthChange}
                searchable
                styles={{
                  label: {
                    color: "#000000",
                    fontWeight: 500,
                  },
                  option: {
                    color: "#000",
                    "&[dataDisabled]": { color: "#adb5bd" },
                    "&[dataSelected]": { background: "#f1f3f5", color: "#000" },
                    "&[dataHovered]": { background: "#f8f9fa" },
                  },
                }}
              />
              <Select
                radius={"md"}
                placeholder="Ano"
                data={YEARS.map(String)}
                value={endYear}
                onChange={handleEndYearChange}
                searchable
                styles={{
                  label: {
                    color: "#000000",
                    fontWeight: 500,
                  },
                  option: {
                    color: "#000",
                    "&[dataDisabled]": { color: "#adb5bd" },
                    "&[dataSelected]": { background: "#f1f3f5", color: "#000" },
                    "&[dataHovered]": { background: "#f8f9fa" },
                  },
                }}
              />
            </Group>
          </Box>
        )}

        {/* Preview do valor formatado */}
        {value && (
          <Box>
            <Text size="xs" c="dimmed">
              Formato final:
            </Text>
            <Text
              size="sm"
              fw={600}
              c="var(--primary)"
              style={{ fontFamily: "monospace" }}
            >
              {value}
            </Text>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
