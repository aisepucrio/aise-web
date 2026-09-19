-- V1: schema inicial consolidado

CREATE TYPE "TeamRole" AS ENUM ('admin', 'user');
CREATE TYPE "TeamMemberItemType" AS ENUM ('research_interest', 'technology', 'knowledge');
CREATE TYPE "ToolItemType" AS ENUM ('objective', 'feature', 'tech_stack');

CREATE TABLE "Team_Members" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "birth_date" DATE,
    "google_email" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL DEFAULT 'user',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Team_Members_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Team_Member_Editables" (
    "id" SERIAL NOT NULL,
    "team_member_id" INTEGER NOT NULL,
    "position" TEXT,
    "university" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "contact_email" TEXT,
    "lattes" TEXT,
    "personalWebsite" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "googleScholar" TEXT,
    "orcid" TEXT,
    "is_alumni" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),
    CONSTRAINT "Team_Member_Editables_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Team_Member_Items" (
    "id" SERIAL NOT NULL,
    "team_member_editable_id" INTEGER NOT NULL,
    "type" "TeamMemberItemType" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "value" TEXT NOT NULL,
    "position" INTEGER,
    CONSTRAINT "Team_Member_Items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Research_Areas" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "highlightImageUrl" TEXT,
    "duration" TEXT,
    CONSTRAINT "Research_Areas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Research_Projects" (
    "id" SERIAL NOT NULL,
    "research_area_id" INTEGER,
    "name" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "position" INTEGER,
    CONSTRAINT "Research_Projects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Research_Areas_Team_Members" (
    "id" SERIAL NOT NULL,
    "research_area_id" INTEGER,
    "team_member_id" INTEGER,
    "role" TEXT,
    "position" INTEGER,
    CONSTRAINT "Research_Areas_Team_Members_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Research_Areas_Tools" (
    "id" SERIAL NOT NULL,
    "research_area_id" INTEGER,
    "tool_id" INTEGER,
    "position" INTEGER,
    CONSTRAINT "Research_Areas_Tools_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Research_Areas_Publications" (
    "id" SERIAL NOT NULL,
    "research_area_id" INTEGER,
    "publication_id" INTEGER,
    "position" INTEGER,
    CONSTRAINT "Research_Areas_Publications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Research_Projects_Team_Members" (
    "id" SERIAL NOT NULL,
    "research_project_id" INTEGER,
    "team_member_id" INTEGER,
    "position" INTEGER,
    CONSTRAINT "Research_Projects_Team_Members_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Research_Projects_Tools" (
    "id" SERIAL NOT NULL,
    "research_project_id" INTEGER,
    "tool_id" INTEGER,
    "position" INTEGER,
    CONSTRAINT "Research_Projects_Tools_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Research_Projects_Publications" (
    "id" SERIAL NOT NULL,
    "research_project_id" INTEGER NOT NULL,
    "publication_id" INTEGER NOT NULL,
    "position" INTEGER,
    CONSTRAINT "Research_Projects_Publications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Publications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "authors_list" TEXT,
    "publication_place" TEXT,
    "citation_number" INTEGER,
    "year" INTEGER,
    "awards" TEXT,
    "acronym" TEXT,
    CONSTRAINT "Publications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tools_Publications" (
    "id" SERIAL NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "publication_id" INTEGER NOT NULL,
    "position" INTEGER,
    CONSTRAINT "Tools_Publications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tools" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT,
    "tagline" TEXT,
    "description" TEXT,
    "longDescription" TEXT,
    "category" TEXT,
    "highlightImageUrl" TEXT,
    "duration" TEXT,
    "link_webapp" TEXT,
    "link_github" TEXT,
    "link_api" TEXT,
    "link_docs" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Tools_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tool_Items" (
    "id" SERIAL NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "type" "ToolItemType" NOT NULL,
    "value" TEXT NOT NULL,
    "position" INTEGER,
    CONSTRAINT "Tool_Items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tool_Gallery_Images" (
    "id" SERIAL NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "position" INTEGER,
    CONSTRAINT "Tool_Gallery_Images_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tools_Team_Members" (
    "id" SERIAL NOT NULL,
    "tool_id" INTEGER,
    "team_member_id" INTEGER,
    "role" TEXT,
    "position" INTEGER,
    CONSTRAINT "Tools_Team_Members_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Team_Members_google_email_key" ON "Team_Members"("google_email");
CREATE UNIQUE INDEX "Team_Member_Editables_team_member_id_key" ON "Team_Member_Editables"("team_member_id");
CREATE UNIQUE INDEX "Research_Areas_slug_key" ON "Research_Areas"("slug");
CREATE UNIQUE INDEX "Tools_slug_key" ON "Tools"("slug");

ALTER TABLE "Team_Member_Editables" ADD CONSTRAINT "Team_Member_Editables_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "Team_Members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Team_Member_Items" ADD CONSTRAINT "Team_Member_Items_team_member_editable_id_fkey" FOREIGN KEY ("team_member_editable_id") REFERENCES "Team_Member_Editables"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Projects" ADD CONSTRAINT "Research_Projects_research_area_id_fkey" FOREIGN KEY ("research_area_id") REFERENCES "Research_Areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Areas_Team_Members" ADD CONSTRAINT "Research_Areas_Team_Members_research_area_id_fkey" FOREIGN KEY ("research_area_id") REFERENCES "Research_Areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Areas_Team_Members" ADD CONSTRAINT "Research_Areas_Team_Members_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "Team_Members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Areas_Tools" ADD CONSTRAINT "Research_Areas_Tools_research_area_id_fkey" FOREIGN KEY ("research_area_id") REFERENCES "Research_Areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Areas_Tools" ADD CONSTRAINT "Research_Areas_Tools_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "Tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Areas_Publications" ADD CONSTRAINT "Research_Areas_Publications_research_area_id_fkey" FOREIGN KEY ("research_area_id") REFERENCES "Research_Areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Areas_Publications" ADD CONSTRAINT "Research_Areas_Publications_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "Publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Projects_Team_Members" ADD CONSTRAINT "Research_Projects_Team_Members_research_project_id_fkey" FOREIGN KEY ("research_project_id") REFERENCES "Research_Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Projects_Team_Members" ADD CONSTRAINT "Research_Projects_Team_Members_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "Team_Members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Projects_Tools" ADD CONSTRAINT "Research_Projects_Tools_research_project_id_fkey" FOREIGN KEY ("research_project_id") REFERENCES "Research_Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Projects_Tools" ADD CONSTRAINT "Research_Projects_Tools_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "Tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Projects_Publications" ADD CONSTRAINT "Research_Projects_Publications_research_project_id_fkey" FOREIGN KEY ("research_project_id") REFERENCES "Research_Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Research_Projects_Publications" ADD CONSTRAINT "Research_Projects_Publications_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "Publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tools_Publications" ADD CONSTRAINT "Tools_Publications_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "Tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tools_Publications" ADD CONSTRAINT "Tools_Publications_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "Publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tool_Items" ADD CONSTRAINT "Tool_Items_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "Tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tool_Gallery_Images" ADD CONSTRAINT "Tool_Gallery_Images_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "Tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tools_Team_Members" ADD CONSTRAINT "Tools_Team_Members_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "Tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tools_Team_Members" ADD CONSTRAINT "Tools_Team_Members_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "Team_Members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
