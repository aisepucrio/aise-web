export type TeamMember = {
  name: string;
  position: string;
  imageUrl: string;
  description: string;
  university?: string;
  bio?: string;
  email?: string;
  researchInterests?: string[];
  technologies?: string[];
  knowledge?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    googleScholar?: string;
    orcid?: string;
    lattes?: string;
    personalWebsite?: string;
  };
};
