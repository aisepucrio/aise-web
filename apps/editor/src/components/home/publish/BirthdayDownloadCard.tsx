"use client";

import { IconCalendarEvent, IconDownload } from "@tabler/icons-react";
import { authFetchJson } from "@/lib/auth-fetch";
import PublishSectionCard from "./PublishSectionCard";

type TeamMemberBirthday = {
  name?: string;
  birthday?: string;
};

type BirthdayEvent = {
  name: string;
  date: string;
};

function parseBirthday(birthday: string): string | null {
  const match = birthday.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return `${year}${month}${day}`;
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function createUid(name: string, date: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `birthday-${slug || "team-member"}-${date}@aise-lab`;
}

function buildCalendar(events: BirthdayEvent[]): string {
  const dtstamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AISE Lab//Team Birthdays//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Aniversarios do Team",
    ...events.flatMap(({ name, date }) => [
      "BEGIN:VEVENT",
      `UID:${createUid(name, date)}`,
      `DTSTAMP:${dtstamp}`,
      `SUMMARY:${escapeIcsText(`Aniversario de ${name}`)}`,
      `DTSTART;VALUE=DATE:${date}`,
      "RRULE:FREQ=YEARLY",
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];

  return `${lines.join("\r\n")}\r\n`;
}

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function BirthdayDownloadCard() {
  const handleDownload = async () => {
    const response = await authFetchJson<{ team?: TeamMemberBirthday[] }>(
      "/api/team",
      { method: "GET" },
    );

    const members = Array.isArray(response.team) ? response.team : [];
    let invalidCount = 0;

    const events = members.reduce<BirthdayEvent[]>((result, member) => {
      const name = member.name?.trim();
      const birthday = member.birthday?.trim();

      if (!name || !birthday) return result;

      const date = parseBirthday(birthday);
      if (!date) {
        invalidCount += 1;
        return result;
      }

      result.push({ name, date });
      return result;
    }, []);

    if (events.length === 0) {
      throw new Error(
        "Nenhuma data de aniversario valida foi encontrada no team.",
      );
    }

    downloadFile("team-birthdays.ics", buildCalendar(events));

    return invalidCount > 0
      ? `${events.length} aniversarios exportados. ${invalidCount} datas invalidas foram ignoradas.`
      : `${events.length} aniversarios exportados com sucesso.`;
  };

  return (
    <PublishSectionCard
      name="Datas de Aniversario"
      description="Baixa um arquivo .ics com os aniversarios anuais do team."
      icon={<IconCalendarEvent size={24} />}
      onAction={handleDownload}
      loadingLabel="Gerando..."
      successLabel="Arquivo pronto"
      idleButtonLabel="Baixar .ics"
      loadingButtonLabel="Gerando..."
      idleButtonIcon={<IconDownload size={16} />}
      successButtonIcon={<IconDownload size={16} />}
    />
  );
}
