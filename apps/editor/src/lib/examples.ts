/**
 * Client-side examples
 */

import { VALID_POSITIONS } from "./validations";

export const EXAMPLE_TEAM_MEMBER = {
  name: "Member",
  position: VALID_POSITIONS[0],
  university: "PUC-Rio",
  imageUrl: "https://imgbox.com/mZ8NXbYf",
  description:
    "<NAME> is description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc volutpat consequat ante ac ultricies. Morbi vel mi blandit nunc blandit gravida nec hendrerit magna. Integer eget nulla sed dolor convallis molestie nec vel magna. Proin pulvinar aliquam facilisis. In id commodo odio. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas tristique cursus mollis. Sed ut est laoreet, auctor velit sit amet, iaculis elit.",
  email: "member@university.edu",
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
  birthday: "01/01/1990",
  socialLinks: {
    lattes: "lattes.cnpq.br/1234567890123456",
    personalWebsite: "example.com",
    linkedin: "linkedin.com/in/example",
    github: "github.com/example",
    googleScholar: "scholar.google.com/citations?user=example",
    orcid: "orcid.org/0000-0000-0000-0000",
  },
};

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
    webapp: "example.com",
    github: "github.com/example/repo",
    api: "api.example.com",
    docs: "docs.example.com",
  },
} as const;

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
