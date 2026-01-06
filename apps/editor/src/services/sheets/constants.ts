/**
 * Constantes e dados de exemplo para o lado do cliente
 */

import { TeamMemberData } from "./types";

export const VALID_POSITIONS = [
  "Laboratory Head",
  "Postdoctoral Researcher",
  "PhD Student",
  "MSc Student",
  "BSc Student",
  "Collaborator",
  "Alumni",
] as const;

export const EXAMPLE_TEAM_MEMBER: TeamMemberData = {
  name: "Example Member",
  position: "Laboratory Head",
  university: "PUC-Rio",
  imageUrl: "https://imgbox.com/mZ8NXbYf",
  description:
    "<NAME> is description here description here description here description here description here description here description here description here description here description here description here description here description here description here description here description here",
  email: "example@mail.com",
  researchInterests: [
    "Artificial Intelligence",
    "Machine Learning",
    "Software Engineering",
    "Deep Learning",
    "AI Ethics",
  ],
  technologies: [
    "Python",
    "Java",
    "C++",
    "TensorFlow",
    "PyTorch",
    "Docker",
    "Kubernetes",
  ],
  knowledge: ["Frontend", "Backend", "Data Science"],
  socialLinks: {
    lattes: "http://lattes.cnpq.br/1234567890123456",
    personalWebsite: "https://example.com",
    linkedin: "https://linkedin.com/in/example",
    github: "https://github.com/example",
    googleScholar: "https://scholar.google.com/citations?user=example",
    orcid: "https://orcid.org/0000-0000-0000-0000",
  },
};

// Regex patterns
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const IMAGE_EXTENSION_REGEX = /\.(jpg|jpeg|png|gif|webp)$/i;
export const DURATION_REGEX =
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[–-]\s*(present|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})$/i;

// Validation limits
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

// Exemplo de Tool
export const EXAMPLE_TOOL = {
  id: "my-new-tool-id",
  name: "Example Tool",
  tagline: "A short tagline describing the tool purpose",
  description:
    "A brief description of what this tool does and its main purpose. This should be 2-3 sentences.",
  longDescription:
    "A detailed description explaining the tool's background, motivation, key features, and impact. This can be several paragraphs long and provide comprehensive context about the project.",
  category: "Data Science",
  highlightImageUrl: "https://imgbox.com/V1F45enR",
  galleryImagesUrl: [
    "https://imgbox.com/V1F45enR",
    "https://imgbox.com/V1F45enR",
    "https://imgbox.com/V1F45enR",
  ],
  duration: "Jan 2025 – present",
  objectives: [
    "First objective to achieve",
    "Second objective to achieve",
    "Third objective to achieve",
  ],
  features: [
    "Feature one description",
    "Feature two description",
    "Feature three description",
  ],
  techStack: ["Next.js", "TypeScript", "Python", "PostgreSQL"],
  team_relationships: [],
  publication_relationships: [],
  links: {
    webapp: "https://example.com",
    github: "https://github.com/example/repo",
    api: "https://api.example.com",
    docs: "https://docs.example.com",
  },
} as const;

// Exemplo de Research
export const EXAMPLE_RESEARCH = {
  id: "my-new-research-id",
  name: "Example Research Line",
  shortDescription:
    "A brief description of the research line (2-3 sentences explaining the main focus).",
  longDescription:
    "A comprehensive description explaining the research background, objectives, methodologies, and expected impact. This should provide detailed context about what makes this research line unique and important.",
  highlightImageUrl:
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
  duration: "Jan 2025 – present",
  projects: [
    {
      name: "Example Project 1",
      imageUrl:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop",
      description:
        "Description of the first project within this research line.",
    },
    {
      name: "Example Project 2",
      imageUrl:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop",
      description:
        "Description of the second project within this research line.",
    },
  ],
  team_relationships: [],
  publication_relationships: [],
  tools_relationships: [],
} as const;
