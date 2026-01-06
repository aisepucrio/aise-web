"use client";

import { useParams } from "next/navigation";
import { Center, Text, Stack, Box, Divider, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { validateToolData, EXAMPLE_TOOL } from "@/services/googleSheets";
import { useEditPage } from "@/hooks/useEditPage";
import { EditPageLayout } from "@/components/EditPageLayout";
import ToolDetailView from "@/components/main-app-components/ToolDetailView";
import ToolHeroCard from "@/components/main-app-components/ToolHeroCard";
import ToolCardCompact from "@/components/main-app-components/ToolCardCompact";
import ToolInstructions from "@/components/tools/ToolInstructions";
import DateRangePicker from "@/components/DateRangePicker";
import TeamRelationshipSelector from "@/components/TeamRelationshipSelector";
import PublicationRelationshipSelector from "@/components/tools/PublicationRelationshipSelector";

// Interface completa do Tool
export interface ToolData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  category: string;
  highlightImageUrl: string;
  galleryImagesUrl?: string[];
  duration: string;
  objectives?: string[];
  features?: string[];
  techStack?: string[];
  team_relationships?: Array<{ name: string; roles: string[] }>;
  publication_relationships?: string[];
  links?: {
    webapp?: string;
    github?: string;
    api?: string;
    docs?: string;
  };
}

// Converte ToolData para formato dos componentes de card
const convertToCardFormat = (toolData: ToolData) => {
  return {
    ...toolData,
    imageUrl: toolData.highlightImageUrl,
    status: "active" as const,
  };
};

// Converte dados da planilha para formato JSON
const convertFromSheetFormat = (sheetData: any): ToolData => {
  return {
    id: sheetData.id,
    name: sheetData.name,
    tagline: sheetData.tagline,
    description: sheetData.description,
    longDescription: sheetData.longDescription,
    category: sheetData.category,
    highlightImageUrl: sheetData.highlightImageUrl,
    duration: sheetData.duration,
    galleryImagesUrl: Array.isArray(sheetData.galleryImagesUrl)
      ? sheetData.galleryImagesUrl
      : [],
    objectives: Array.isArray(sheetData.objectives) ? sheetData.objectives : [],
    features: Array.isArray(sheetData.features) ? sheetData.features : [],
    techStack: Array.isArray(sheetData.techStack) ? sheetData.techStack : [],
    team_relationships: Array.isArray(sheetData.team_relationships)
      ? sheetData.team_relationships
      : [],
    publication_relationships: Array.isArray(
      sheetData.publication_relationships
    )
      ? sheetData.publication_relationships
      : [],
    links: sheetData.links || {},
  };
};

export default function EditToolPage() {
  const params = useParams();
  const toolId = decodeURIComponent(params?.toolid as string);

  const {
    jsonText,
    setJsonText,
    isLoading,
    isSaving,
    isNewItem,
    jsonError,
    editMode,
    setEditMode,
    parsedData,
    validation,
    lastSaved,
    isAutoSaving,
    updateField,
    handleSave,
    handleReset,
  } = useEditPage<ToolData>({
    itemId: toolId,
    itemType: "tool",
    apiEndpoint: "/api/tools",
    exampleData: EXAMPLE_TOOL as any,
    fetchItem: async (id) => {
      const res = await fetch("/api/tools");
      if (!res.ok) return null;
      const data = await res.json();
      const tools = data.tools || [];
      const tool = tools.find((t: any) => t.id === id);
      return tool ? convertFromSheetFormat(tool) : null;
    },
    validate: validateToolData,
    validateExisting: (data, itemId) => {
      if (data.id !== itemId) {
        return {
          valid: false,
          errors: [
            `✖ ID: Deve corresponder ao ID da rota (${itemId}). Não é possível alterar o ID de um tool existente.`,
          ],
        };
      }
      return { valid: true, errors: [] };
    },
    isNewItemId: (id) => id === "new-tool",
    getItemUrl: (data) => `/edit-content/tool/${encodeURIComponent(data.id)}`,
  });

  return (
    <EditPageLayout
      title="Editor de Tool"
      subtitle={`${isNewItem ? "Novo tool" : "Editando tool"}: ${toolId}`}
      isLoading={isLoading}
      isNewItem={isNewItem}
      newItemMessage="Novo Tool"
      newItemWarning='IMPORTANTE: Altere o campo "id" para um identificador único (ex: "my-awesome-tool") antes de salvar!'
      jsonText={jsonText}
      setJsonText={setJsonText}
      jsonError={jsonError}
      editMode={editMode}
      setEditMode={setEditMode}
      validation={validation}
      onSave={handleSave}
      onReset={handleReset}
      isSaving={isSaving}
      lastSaved={lastSaved}
      isAutoSaving={isAutoSaving}
      instructions={<ToolInstructions />}
      formEditor={
        parsedData && (
          <Stack gap="md" style={{ paddingRight: 8 }}>
            <DateRangePicker
              value={parsedData.duration}
              onChange={(val) => updateField("duration", val)}
              label="Duration"
              required
            />
            <TeamRelationshipSelector
              value={parsedData.team_relationships || ""}
              onChange={(val) => updateField("team_relationships", val)}
              label="Team Relationships"
            />
            <PublicationRelationshipSelector
              value={parsedData.publication_relationships || ""}
              onChange={(val) => updateField("publication_relationships", val)}
              label="Publication Relationships"
            />
            <Alert
              icon={<IconAlertCircle />}
              color="blue"
              variant="light"
              radius="lg"
            >
              <Text size="xs">
                <strong>Outros campos:</strong> Use o modo JSON para editar
                tagline, description, longDescription, category, images,
                objectives, features, techStack e links.
              </Text>
            </Alert>
          </Stack>
        )
      }
      preview={
        parsedData ? (
          <Stack gap="xl">
            <Box>
              <Text size="sm" fw={600} mb="xs" c="dimmed">
                Preview: Detail View
              </Text>
              <ToolDetailView
                tool={parsedData}
                isMobile={false}
                content={{
                  backButton: "Voltar",
                  sections: {
                    duration: { label: "Duration" },
                    techStack: { title: "Tech Stack" },
                    about: { title: "About" },
                    gallery: { title: "Gallery" },
                    objectives: { title: "Objectives" },
                    features: { title: "Features" },
                    team: { title: "Team" },
                    publications: { title: "Publications" },
                  },
                }}
              />
            </Box>
            <Divider />
            <Box>
              <Text size="sm" fw={600} mb="xs" c="dimmed">
                Preview: Hero Card
              </Text>
              <ToolHeroCard tool={convertToCardFormat(parsedData)} index={0} />
            </Box>
            <Divider />
            <Box>
              <Text size="sm" fw={600} mb="xs" c="dimmed">
                Preview: Compact Card
              </Text>
              <div style={{ width: "50%", margin: "auto" }}>
                <ToolCardCompact
                  tool={convertToCardFormat(parsedData)}
                  index={1}
                />
              </div>
            </Box>
          </Stack>
        ) : (
          <Center h={400}>
            <Text c="dimmed">
              JSON inválido - corrija os erros para ver o preview
            </Text>
          </Center>
        )
      }
    />
  );
}
