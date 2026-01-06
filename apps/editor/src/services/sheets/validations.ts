/**
 * Funções de validação reutilizáveis
 */

import {
  EMAIL_REGEX,
  IMAGE_EXTENSION_REGEX,
  DURATION_REGEX,
  VALIDATION_LIMITS,
  VALID_POSITIONS,
} from "./constants";
import { TeamMemberData, ValidationResult } from "./types";

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateUrl(url: string): boolean {
  if (!url || url.trim() === "") return true; // URLs opcionais
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateImgboxUrl(url: string): boolean {
  if (!url || url.trim() === "") return false;

  // Aceita URLs diretas de imagens
  if (url.match(IMAGE_EXTENSION_REGEX)) return true;

  // Aceita URLs do imgbox
  if (url.includes("imgbox.com")) return true;

  // Aceita URLs de imagens locais
  if (url.startsWith("/images/")) return true;

  return false;
}

export function validateDuration(duration: string): boolean {
  return DURATION_REGEX.test(duration);
}

export function validateMemberData(member: TeamMemberData): ValidationResult {
  const errors: string[] = [];
  const limits = VALIDATION_LIMITS.MEMBER;

  // Nome
  if (!member.name || member.name.trim() === "") {
    errors.push("✖ Nome: Campo obrigatório");
  }

  // Email
  if (!member.email || !validateEmail(member.email)) {
    errors.push("✖ Email: Email válido é obrigatório");
  } else if (member.email === "example@mail.com") {
    errors.push(
      "✖ Email: Não é possível usar o email de exemplo. Use seu email real"
    );
  }

  // Position
  if (!member.position || member.position.trim() === "") {
    errors.push("✖ Position: Campo obrigatório");
  } else if (!VALID_POSITIONS.includes(member.position as any)) {
    errors.push(
      `✖ Position: Deve ser exatamente uma das opções: "${VALID_POSITIONS.join(
        '", "'
      )}"`
    );
  }

  // Image URL
  if (!member.imageUrl || member.imageUrl.trim() === "") {
    errors.push("✖ Image URL: Campo obrigatório");
  } else if (!validateImgboxUrl(member.imageUrl)) {
    errors.push(
      "✖ Image URL: URL inválida. Use uma URL do imgbox.com ou uma URL de imagem válida"
    );
  }

  // Description
  if (!member.description || member.description.trim() === "") {
    errors.push("✖ Description: Campo obrigatório");
  } else {
    const descLength = member.description.trim().length;
    if (descLength < limits.DESCRIPTION_MIN) {
      errors.push(
        `✖ Description: Muito curta (${descLength} caracteres). Mínimo: ${limits.DESCRIPTION_MIN} caracteres`
      );
    } else if (descLength > limits.DESCRIPTION_MAX) {
      errors.push(
        `✖ Description: Muito longa (${descLength} caracteres). Máximo: ${limits.DESCRIPTION_MAX} caracteres`
      );
    }
  }

  // Research Interests
  if (!member.researchInterests || member.researchInterests.length === 0) {
    errors.push(
      `✖ Research Interests: Pelo menos ${limits.RESEARCH_INTERESTS_MIN} interesses são obrigatórios`
    );
  } else if (member.researchInterests.length < limits.RESEARCH_INTERESTS_MIN) {
    errors.push(
      `✖ Research Interests: Mínimo ${limits.RESEARCH_INTERESTS_MIN} interesses (você tem ${member.researchInterests.length})`
    );
  } else if (member.researchInterests.length > limits.RESEARCH_INTERESTS_MAX) {
    errors.push(
      `✖ Research Interests: Máximo ${limits.RESEARCH_INTERESTS_MAX} interesses (você tem ${member.researchInterests.length})`
    );
  }

  // Technologies
  if (!member.technologies || member.technologies.length === 0) {
    errors.push(
      `✖ Technologies: Pelo menos ${limits.TECHNOLOGIES_MIN} tecnologias são obrigatórias`
    );
  } else if (member.technologies.length < limits.TECHNOLOGIES_MIN) {
    errors.push(
      `✖ Technologies: Mínimo ${limits.TECHNOLOGIES_MIN} tecnologias (você tem ${member.technologies.length})`
    );
  } else if (member.technologies.length > limits.TECHNOLOGIES_MAX) {
    errors.push(
      `✖ Technologies: Máximo ${limits.TECHNOLOGIES_MAX} tecnologias (você tem ${member.technologies.length})`
    );
  }

  // knowledge
  if (!member.knowledge || member.knowledge.length === 0) {
    errors.push(
      `✖ knowledge: Pelo menos ${limits.KNOWLEDGE_MIN} área de especialização é obrigatória`
    );
  } else if (member.knowledge.length > limits.KNOWLEDGE_MAX) {
    errors.push(
      `✖ knowledge: Máximo ${limits.KNOWLEDGE_MAX} áreas (você tem ${member.knowledge.length})`
    );
  }

  // Links (opcionais, mas se fornecidos devem ser válidos)
  const social = member.socialLinks || {};
  const linkFields: (keyof typeof social)[] = [
    "lattes",
    "personalWebsite",
    "linkedin",
    "github",
    "googleScholar",
    "orcid",
  ];

  linkFields.forEach((field) => {
    const value = social[field] as string | undefined;
    if (value && value.trim() !== "" && !validateUrl(value)) {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      errors.push(
        `✖ ${fieldName}: URL inválida. Deve começar com http:// ou https://`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateToolData(tool: any): ValidationResult {
  const errors: string[] = [];
  const limits = VALIDATION_LIMITS.TOOL;

  // Campos obrigatórios
  if (!tool.id || tool.id.trim() === "") {
    errors.push("✖ ID: Campo obrigatório");
  }
  if (!tool.name || tool.name.trim() === "") {
    errors.push("✖ Name: Campo obrigatório");
  }
  if (!tool.tagline || tool.tagline.trim() === "") {
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

  if (!tool.description || tool.description.trim() === "") {
    errors.push("✖ Description: Campo obrigatório");
  } else if (tool.description.length < limits.DESCRIPTION_MIN) {
    errors.push(
      `✖ Description: Muito curta (${tool.description.length} caracteres). Mínimo: ${limits.DESCRIPTION_MIN}`
    );
  }

  if (!tool.category || tool.category.trim() === "") {
    errors.push("✖ Category: Campo obrigatório");
  }

  if (!tool.highlightImageUrl || tool.highlightImageUrl.trim() === "") {
    errors.push("✖ Highlight Image URL: Campo obrigatório");
  } else if (!validateImgboxUrl(tool.highlightImageUrl)) {
    errors.push("✖ Highlight Image URL: URL inválida");
  }

  if (!tool.duration || tool.duration.trim() === "") {
    errors.push("✖ Duration: Campo obrigatório");
  } else if (!validateDuration(tool.duration)) {
    errors.push(
      "✖ Duration: Formato inválido. Use 'Jan 2025 – present' ou 'Jan 2024 – Dec 2024'"
    );
  }

  // Validação de links (opcionais mas devem ser válidos se fornecidos)
  const linkFields = ["link_webapp", "link_github", "link_api", "link_docs"];
  linkFields.forEach((field) => {
    const value = tool[field];
    if (value && value.trim() !== "" && !validateUrl(value)) {
      const fieldName =
        field.replace("link_", "").charAt(0).toUpperCase() +
        field.replace("link_", "").slice(1);
      errors.push(
        `✖ ${fieldName} Link: URL inválida. Deve começar com http:// ou https://`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateResearchData(research: any): ValidationResult {
  const errors: string[] = [];
  const limits = VALIDATION_LIMITS.RESEARCH;

  // Campos obrigatórios
  if (!research.id || research.id.trim() === "") {
    errors.push("✖ ID: Campo obrigatório");
  }
  if (!research.name || research.name.trim() === "") {
    errors.push("✖ Name: Campo obrigatório");
  }
  if (!research.shortDescription || research.shortDescription.trim() === "") {
    errors.push("✖ Short Description: Campo obrigatório");
  } else if (research.shortDescription.length < limits.SHORT_DESCRIPTION_MIN) {
    errors.push(
      `✖ Short Description: Muito curta (${research.shortDescription.length} caracteres). Mínimo: ${limits.SHORT_DESCRIPTION_MIN}`
    );
  }
  if (!research.longDescription || research.longDescription.trim() === "") {
    errors.push("✖ Long Description: Campo obrigatório");
  } else if (research.longDescription.length < limits.LONG_DESCRIPTION_MIN) {
    errors.push(
      `✖ Long Description: Muito curta (${research.longDescription.length} caracteres). Mínimo: ${limits.LONG_DESCRIPTION_MIN}`
    );
  }
  if (!research.highlightImageUrl || research.highlightImageUrl.trim() === "") {
    errors.push("✖ Highlight Image URL: Campo obrigatório");
  }
  if (!research.duration || research.duration.trim() === "") {
    errors.push("✖ Duration: Campo obrigatório");
  } else if (!validateDuration(research.duration)) {
    errors.push(
      "✖ Duration: Formato inválido. Use 'Jan 2025 – present' ou 'Jan 2024 – Dec 2024'"
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
