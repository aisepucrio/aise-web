/**
 * Reusable validation utilities + validation constants
 */

import { TeamMemberData, ValidationResult } from "./types";

/* ------------------------------ Validation data ----------------------------- */

export const VALID_POSITIONS = [
  "Laboratory Head",
  "Postdoctoral Researcher",
  "PhD Student",
  "MSc Student",
  "BSc Student",
  "Collaborator",
  "Alumni",
] as const;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const IMAGE_EXTENSION_REGEX = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
export const DURATION_REGEX =
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[–-]\s*(present|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})$/i;

export const RESERVED_IDS = {
  RESEARCH: ["new-research", "example-research"],
  TOOL: ["new-tool", "example-tool"],
} as const;

export const VALIDATION_LIMITS = {
  MEMBER: {
    DESCRIPTION_MIN: 50,
    DESCRIPTION_MAX: 750,
    RESEARCH_INTERESTS_MIN: 2,
    RESEARCH_INTERESTS_MAX: 10,
    TECHNOLOGIES_MIN: 3,
    TECHNOLOGIES_MAX: 15,
    KNOWLEDGE_MIN: 1,
    KNOWLEDGE_MAX: 8,
  },
  TOOL: {
    TAGLINE_MIN: 20,
    TAGLINE_MAX: 150,
    DESCRIPTION_MIN: 50,
  },
  RESEARCH: {
    SHORT_DESCRIPTION_MIN: 50,
    LONG_DESCRIPTION_MIN: 100,
  },
} as const;

/* ---------------------------------- Shared --------------------------------- */

const isBlank = (value?: string | null) => !value || value.trim() === "";

const result = (errors: string[]): ValidationResult => ({
  valid: errors.length === 0,
  errors,
});

const requireText = (
  errors: string[],
  label: string,
  value?: string | null
) => {
  if (isBlank(value)) errors.push(`✖ ${label}: Campo obrigatório`);
};

const requireEmail = (errors: string[], value?: string | null) => {
  if (isBlank(value) || !EMAIL_REGEX.test(value!)) {
    errors.push("✖ Email: Email válido é obrigatório");
    return;
  }
  if (value === "example@mail.com") {
    errors.push(
      "✖ Email: Não é possível usar o email de exemplo. Use seu email real"
    );
  }
};

const requireEnum = <T extends string>(
  errors: string[],
  label: string,
  value: string | undefined | null,
  allowed: readonly T[]
) => {
  if (isBlank(value)) {
    errors.push(`✖ ${label}: Campo obrigatório`);
    return;
  }
  if (!allowed.includes(value as T)) {
    errors.push(
      `✖ ${label}: Deve ser exatamente uma das opções: "${allowed.join(
        '", "'
      )}"`
    );
  }
};

const requireLengthRange = (
  errors: string[],
  label: string,
  value: string | undefined | null,
  min: number,
  max: number
) => {
  if (isBlank(value)) {
    errors.push(`✖ ${label}: Campo obrigatório`);
    return;
  }

  const len = value!.trim().length;
  if (len < min) {
    errors.push(
      `✖ ${label}: Muito curta (${len} caracteres). Mínimo: ${min} caracteres`
    );
  } else if (len > max) {
    errors.push(
      `✖ ${label}: Muito longa (${len} caracteres). Máximo: ${max} caracteres`
    );
  }
};

const requireMinLength = (
  errors: string[],
  label: string,
  value: string | undefined | null,
  min: number
) => {
  if (isBlank(value)) {
    errors.push(`✖ ${label}: Campo obrigatório`);
    return;
  }

  const len = value!.length;
  if (len < min) {
    errors.push(`✖ ${label}: Muito curta (${len} caracteres). Mínimo: ${min}`);
  }
};

const validateCountRange = (
  errors: string[],
  items: unknown[] | undefined | null,
  min: number,
  max: number,
  emptyMessage: string,
  tooFewMessage: (count: number) => string,
  tooManyMessage: (count: number) => string
) => {
  const count = items?.length ?? 0;

  if (count === 0) {
    errors.push(emptyMessage);
    return;
  }
  if (count < min) errors.push(tooFewMessage(count));
  else if (count > max) errors.push(tooManyMessage(count));
};

const isReservedId = (
  kind: keyof typeof RESERVED_IDS,
  id: string | undefined | null
) => !!id && (RESERVED_IDS[kind] as readonly string[]).includes(id);

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateUrl(url: string): boolean {
  if (isBlank(url)) return true; // optional

  const raw = url.trim();

  try {
    new URL(raw);
    return true;
  } catch {
    // allow URLs without protocol (e.g. "example.com")
    try {
      new URL(`https://${raw}`);
      return true;
    } catch {
      return false;
    }
  }
}

export function validateImgboxUrl(url: string): boolean {
  if (isBlank(url)) return false;

  return (
    IMAGE_EXTENSION_REGEX.test(url) ||
    url.includes("imgbox.com") ||
    url.startsWith("/images/")
  );
}

export function validateDuration(duration: string): boolean {
  return DURATION_REGEX.test(duration);
}

/**
 * Link fields are optional, but if present they cannot be empty.
 * If you don't have the link, remove the field instead of leaving it blank.
 */
const validateOptionalLinkField = (
  errors: string[],
  label: string,
  value: unknown
) => {
  if (value === undefined || value === null) return;

  const str = String(value);
  if (isBlank(str))
    errors.push(`✖ ${label}: Campo vazio. Remova o campo se não for usar`);
};

/* ----------------------------- Before update/create ------------------------- */

// Validates that a field meant to be immutable has not been changed
const validateImmutableField = (
  currentValue: string,
  originalValue: string,
  fieldLabel: string,
  itemType: string
): ValidationResult => {
  if (currentValue.toLowerCase() !== originalValue.toLowerCase()) {
    return {
      valid: false,
      errors: [
        `✖ ${fieldLabel}: Não é possível alterar o ${fieldLabel.toLowerCase()} de ${itemType}. O valor deve ser "${originalValue}"`,
      ],
    };
  }
  return { valid: true, errors: [] };
};

// Validates that the email of a team member has not been changed
export function validateMemberEmailUnchanged(
  data: any,
  originalEmail: string
): ValidationResult {
  const routeEmail = decodeURIComponent(originalEmail);
  return validateImmutableField(
    data.email,
    routeEmail,
    "Email",
    "um perfil existente"
  );
}

// Validates that the ID of a research has not been changed
export function validateResearchIdUnchanged(
  data: any,
  originalId: string
): ValidationResult {
  return validateImmutableField(
    data.id,
    originalId,
    "ID",
    "uma research existente"
  );
}

// Validates that the ID of a tool has not been changed
export function validateToolIdUnchanged(
  data: any,
  originalId: string
): ValidationResult {
  return validateImmutableField(data.id, originalId, "ID", "um tool existente");
}

export function validateResearchBeforeUpdate(research: any): ValidationResult {
  const errors: string[] = [];

  requireText(errors, "Campos obrigatórios: id", research?.id);
  requireText(errors, "Campos obrigatórios: name", research?.name);

  if (!errors.length && isReservedId("RESEARCH", research?.id)) {
    errors.push("✖ ID reservado. Use um ID único para a research.");
  }

  return result(errors);
}

export function validateToolBeforeUpdate(tool: any): ValidationResult {
  const errors: string[] = [];

  requireText(errors, "Campos obrigatórios: id", tool?.id);
  requireText(errors, "Campos obrigatórios: name", tool?.name);

  if (!errors.length && isReservedId("TOOL", tool?.id)) {
    errors.push("✖ ID reservado. Use um ID único para o tool.");
  }

  return result(errors);
}

export function validateMemberBeforeUpdate(member: any): ValidationResult {
  const errors: string[] = [];

  // keep it consistent with the main email rule
  requireEmail(errors, member?.email);

  return result(errors);
}

/* ----------------------------------- Teams --------------------------------- */

export function validateMemberData(member: TeamMemberData): ValidationResult {
  const errors: string[] = [];
  const limits = VALIDATION_LIMITS.MEMBER;

  requireText(errors, "Nome", member.name);
  requireEmail(errors, member.email);

  requireEnum(errors, "Position", member.position, VALID_POSITIONS);

  if (isBlank(member.imageUrl)) {
    errors.push("✖ Image URL: Campo obrigatório");
  } else if (!validateImgboxUrl(member.imageUrl)) {
    errors.push(
      "✖ Image URL: URL inválida. Use uma URL do imgbox.com ou uma URL de imagem válida"
    );
  }

  requireLengthRange(
    errors,
    "Description",
    member.description,
    limits.DESCRIPTION_MIN,
    limits.DESCRIPTION_MAX
  );

  validateCountRange(
    errors,
    member.researchInterests,
    limits.RESEARCH_INTERESTS_MIN,
    limits.RESEARCH_INTERESTS_MAX,
    `✖ Research Interests: Pelo menos ${limits.RESEARCH_INTERESTS_MIN} interesses são obrigatórios`,
    (count) =>
      `✖ Research Interests: Mínimo ${limits.RESEARCH_INTERESTS_MIN} interesses (você tem ${count})`,
    (count) =>
      `✖ Research Interests: Máximo ${limits.RESEARCH_INTERESTS_MAX} interesses (você tem ${count})`
  );

  validateCountRange(
    errors,
    member.technologies,
    limits.TECHNOLOGIES_MIN,
    limits.TECHNOLOGIES_MAX,
    `✖ Technologies: Pelo menos ${limits.TECHNOLOGIES_MIN} tecnologias são obrigatórias`,
    (count) =>
      `✖ Technologies: Mínimo ${limits.TECHNOLOGIES_MIN} tecnologias (você tem ${count})`,
    (count) =>
      `✖ Technologies: Máximo ${limits.TECHNOLOGIES_MAX} tecnologias (você tem ${count})`
  );

  const knowledgeCount = member.knowledge?.length ?? 0;
  if (knowledgeCount === 0) {
    errors.push(
      `✖ knowledge: Pelo menos ${limits.KNOWLEDGE_MIN} área de especialização é obrigatória`
    );
  } else if (knowledgeCount > limits.KNOWLEDGE_MAX) {
    errors.push(
      `✖ knowledge: Máximo ${limits.KNOWLEDGE_MAX} áreas (você tem ${knowledgeCount})`
    );
  }

  const social = member.socialLinks || {};
  (
    [
      ["lattes", "Lattes"],
      ["personalWebsite", "PersonalWebsite"],
      ["linkedin", "Linkedin"],
      ["github", "Github"],
      ["googleScholar", "GoogleScholar"],
      ["orcid", "Orcid"],
    ] as const
  ).forEach(([key, label]) =>
    validateOptionalLinkField(errors, label, social[key])
  );

  return result(errors);
}

/* ----------------------------------- Tools --------------------------------- */

export function validateToolData(tool: any): ValidationResult {
  const errors: string[] = [];
  const limits = VALIDATION_LIMITS.TOOL;

  requireText(errors, "ID", tool.id);
  requireText(errors, "Name", tool.name);

  if (isBlank(tool.tagline)) {
    errors.push("✖ Tagline: Campo obrigatório");
  } else if (tool.tagline.length < limits.TAGLINE_MIN) {
    errors.push(
      `✖ Tagline: Muito curta (${tool.tagline.length} caracteres). Mínimo: ${limits.TAGLINE_MIN}`
    );
  } else if (tool.tagline.length > limits.TAGLINE_MAX) {
    errors.push(
      `✖ Tagline: Muito longa (${tool.tagline.length} caracteres). Máximo: ${limits.TAGLINE_MAX}`
    );
  }

  if (isBlank(tool.description)) {
    errors.push("✖ Description: Campo obrigatório");
  } else if (tool.description.length < limits.DESCRIPTION_MIN) {
    errors.push(
      `✖ Description: Muito curta (${tool.description.length} caracteres). Mínimo: ${limits.DESCRIPTION_MIN}`
    );
  }

  requireText(errors, "Category", tool.category);

  if (isBlank(tool.highlightImageUrl)) {
    errors.push("✖ Highlight Image URL: Campo obrigatório");
  } else if (!validateImgboxUrl(tool.highlightImageUrl)) {
    errors.push("✖ Highlight Image URL: URL inválida");
  }

  if (isBlank(tool.duration)) {
    errors.push("✖ Duration: Campo obrigatório");
  } else if (!validateDuration(tool.duration)) {
    errors.push(
      "✖ Duration: Formato inválido. Use 'Jan 2025 – present' ou 'Jan 2024 – Dec 2024'"
    );
  }

  (
    [
      ["link_webapp", "Webapp Link"],
      ["link_github", "Github Link"],
      ["link_api", "Api Link"],
      ["link_docs", "Docs Link"],
    ] as const
  ).forEach(([key, label]) =>
    validateOptionalLinkField(errors, label, tool[key])
  );

  return result(errors);
}

/* -------------------------------- Researches ------------------------------- */

export function validateResearchData(research: any): ValidationResult {
  const errors: string[] = [];
  const limits = VALIDATION_LIMITS.RESEARCH;

  requireText(errors, "ID", research.id);
  requireText(errors, "Name", research.name);

  requireMinLength(
    errors,
    "Short Description",
    research.shortDescription,
    limits.SHORT_DESCRIPTION_MIN
  );

  requireMinLength(
    errors,
    "Long Description",
    research.longDescription,
    limits.LONG_DESCRIPTION_MIN
  );

  requireText(errors, "Highlight Image URL", research.highlightImageUrl);

  if (isBlank(research.duration)) {
    errors.push("✖ Duration: Campo obrigatório");
  } else if (!validateDuration(research.duration)) {
    errors.push(
      "✖ Duration: Formato inválido. Use 'Jan 2025 – present' ou 'Jan 2024 – Dec 2024'"
    );
  }

  return result(errors);
}
