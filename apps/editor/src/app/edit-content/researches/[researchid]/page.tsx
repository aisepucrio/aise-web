"use client";

import { useParams } from "next/navigation";
import { ResearchData } from "@/lib/types";
import { Center, Text, Stack, Box, Divider, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { EXAMPLE_RESEARCH } from "@/lib/examples";
import { authFetchJson } from "@/lib/auth-fetch";
import {
  validateResearchData,
  validateResearchIdUnchanged,
} from "@/lib/validations";
import { useEditPage } from "@/components/useEditPage";
import { EditPageLayout } from "@/components/EditPageLayout";
import { ResearchDetailView } from "@shared/ui";
import { ResearchCard } from "@shared/ui";
import ResearchInstructions from "@/components/ResearchInstructions";
import DateRangePicker from "@/components/DateRangePicker";
import TeamRelationshipSelector from "@/components/TeamRelationshipSelector";
import PublicationRelationshipSelector from "@/components/PublicationRelationshipSelector";
import ToolRelationshipSelector from "@/components/ToolRelationshipSelector";

// Converte ResearchData para formato dos componentes de card
const convertToCardFormat = (researchData: ResearchData) => {
  return {
    ...researchData,
    imageUrl: researchData.highlightImageUrl,
    description: researchData.shortDescription,
  };
};

// Converte ResearchData para formato do DetailView
const convertToDetailFormat = (researchData: ResearchData) => {
  return {
    ...researchData,
    imageUrl: researchData.highlightImageUrl,
    description: researchData.shortDescription,
  };
};

// Converte dados da planilha para formato JSON
const convertFromSheetFormat = (sheetData: any): ResearchData => {
  return {
    id: sheetData.id,
    name: sheetData.name,
    shortDescription: sheetData.shortDescription,
    longDescription: sheetData.longDescription,
    highlightImageUrl: sheetData.highlightImageUrl,
    duration: sheetData.duration,
    projects: Array.isArray(sheetData.projects) ? sheetData.projects : [],
    team_relationships: Array.isArray(sheetData.team_relationships)
      ? sheetData.team_relationships
      : [],
    publication_relationships: Array.isArray(
      sheetData.publication_relationships,
    )
      ? sheetData.publication_relationships
      : [],
    tool_relationships: Array.isArray(sheetData.tool_relationships)
      ? sheetData.tool_relationships
      : [],
  };
};

export default function EditResearchPage() {
  const params = useParams();
  const researchId = decodeURIComponent(params?.researchid as string);

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
  } = useEditPage<ResearchData>({
    itemId: researchId,
    itemType: "research",
    apiEndpoint: "/api/researches",
    exampleData: EXAMPLE_RESEARCH as any,
    fetchItem: async (id) => {
      const data = await authFetchJson("/api/researches");
      const researches = data.researches || [];
      const research = researches.find((r: any) => r.id === id);
      return research ? convertFromSheetFormat(research) : null;
    },
    validate: validateResearchData,
    validateExisting: validateResearchIdUnchanged,
    isNewItemId: (id) => id === "new-research",
    getItemUrl: (data) =>
      `/edit-content/researches/${encodeURIComponent(data.id)}`,
  });

  return (
    <EditPageLayout
      title="Editor de Research"
      subtitle={`${
        isNewItem ? "Nova research" : "Editando research"
      }: ${researchId}`}
      isLoading={isLoading}
      isNewItem={isNewItem}
      newItemMessage="Nova Research"
      newItemWarning='IMPORTANTE: Altere o campo "id" para um identificador único (ex: "my-research-line") antes de salvar!'
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
      instructions={<ResearchInstructions />}
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
              value={(parsedData.team_relationships as any) || ""}
              onChange={(val) => updateField("team_relationships", val)}
              label="Team Relationships"
              showRoles={false}
            />
            <PublicationRelationshipSelector
              value={parsedData.publication_relationships || ""}
              onChange={(val) => updateField("publication_relationships", val)}
              label="Publication Relationships"
            />
            <ToolRelationshipSelector
              value={parsedData.tool_relationships || ""}
              onChange={(val) => updateField("tool_relationships", val)}
              label="Tool Relationships"
            />
            <Alert
              icon={<IconAlertCircle />}
              color="blue"
              variant="light"
              radius="lg"
            >
              <Text size="xs">
                <strong>Outros campos:</strong> Use o modo JSON para editar
                name, shortDescription, longDescription, highlightImageUrl e
                projects.
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
              <ResearchDetailView
                research={convertToDetailFormat(parsedData) as any}
              />
            </Box>
            <Divider />
            <Box>
              <Text size="sm" fw={600} mb="xs" c="dimmed">
                Preview: Card
              </Text>
              <div style={{ width: "70%", margin: "auto" }}>
                <ResearchCard
                  research={convertToCardFormat(parsedData)}
                  index={0}
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
