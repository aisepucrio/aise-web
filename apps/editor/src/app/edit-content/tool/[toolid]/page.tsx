//editContentPage              -> Pagina teste com mudança de edição / alteração dos itens do JSON
//Pagina de Edicao do Conteudo

"use client";

import { useParams } from "next/navigation";
import { ToolData } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import { Center, Text, Stack, Box, Divider, Alert, List, Code } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { EXAMPLE_TOOL } from "@/lib/examples";
import { authFetchJson } from "@/lib/auth-fetch";
import { validateToolData, validateToolIdUnchanged } from "@/lib/validations";
import { useEditPage } from "@/components/useEditPage";
import { EditPageLayout } from "@/components/EditPageLayout";
import { convertImgboxUrls } from "@/lib/imgbox";
import { ToolDetailView, ToolHeroCard, ToolCardCompact } from "@shared/ui";
import ToolInstructions from "@/components/ToolInstructions";
import DateRangePicker from "@/components/DateRangePicker";
import TeamRelationshipSelector from "@/components/TeamRelationshipSelector";
import PublicationRelationshipSelector from "@/components/PublicationRelationshipSelector";
import ToolFormEditor from "@/components/ToolMemberFormEditor"; // novo import

// Conteúdo do tooltip — resumo das instruções de tool
const toolTooltipContent = (
  <Stack gap={6}>
    <Text size="xs" fw={700}>Dicas rápidas:</Text>
    <List size="xs" spacing={4}>
      <List.Item><Code>id</Code>: kebab-case único (ex: my-awesome-tool).</List.Item>
      <List.Item><Code>name</Code>: nome legível, 3–60 caracteres.</List.Item>
      <List.Item><Code>tagline</Code>: frase curta, 10–100 caracteres.</List.Item>
      <List.Item><Code>description</Code>: 2-3 sentenças, 50–300 caracteres.</List.Item>
      <List.Item><Code>category</Code>: ex: "Data Analysis", "Automation".</List.Item>
      <List.Item><Code>highlightImageUrl</Code>: upload no imgbox.com, 16:9 preferível.</List.Item>
      <List.Item><Code>duration</Code>: formato "Jan 2025 – present".</List.Item>
      <List.Item><Code>techStack</Code>: 2–10 tecnologias.</List.Item>
    </List>
  </Stack>
);

// Converte ToolData para formato dos componentes de card
const convertToCardFormat = (toolData: ToolData) => {
  return {
    ...toolData,
    imageUrl: toolData.highlightImageUrl,
    status: (toolData as any).status || "active",
  };
};

// Converte ToolData para formato do ToolDetailView
const convertToDetailViewFormat = (toolData: ToolData) => {
  return {
    name: toolData.name,
    tagline: toolData.tagline,
    description: toolData.description,
    longDescription: toolData.longDescription,
    imageUrl: toolData.highlightImageUrl,
    duration: toolData.duration,
    techStack: toolData.techStack,
    objectives: toolData.objectives,
    features: toolData.features,
    gallery: toolData.galleryImagesUrl,
    links: toolData.links,
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
      sheetData.publication_relationships,
    )
      ? sheetData.publication_relationships
      : [],
    links: {
      webapp: sheetData.links?.webapp || "",
      github: sheetData.links?.github || "",
      api: sheetData.links?.api || "",
      docs: sheetData.links?.docs || "",
    },
  };
};

export default function EditToolPage() {
  const params = useParams();
  const toolId = decodeURIComponent(params?.toolid as string);
  const [convertedData, setConvertedData] = useState<ToolData | null>(null);

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
      const data = await authFetchJson("/api/tools");
      const tools = data.tools || [];
      const tool = tools.find((t: any) => t.id === id);
      return tool ? convertFromSheetFormat(tool) : null;
    },
    validate: validateToolData,
    validateExisting: validateToolIdUnchanged,
    isNewItemId: (id) => id === "new-tool",
    getItemUrl: (data) => `/edit-content/tool/${encodeURIComponent(data.id)}`,
  });

  // Convert imgbox URLs when parsedData changes
  useEffect(() => {
    if (parsedData) {
      convertImgboxUrls(parsedData).then(setConvertedData);
    } else {
      setConvertedData(null);
    }
  }, [parsedData]);

  const displayData = convertedData || parsedData;

  const teamMembers = useMemo(() => {
    return (
      displayData?.team_relationships?.map((rel: any) => ({
        name: rel.name,
        position: "",
        imageUrl: "",
        description: "",
        roles: rel.roles || [],
      })) || []
    );
  }, [displayData]);

  const publications = useMemo(() => {
    return (
      displayData?.publication_relationships?.map((title: string) => ({
        title: title,
        link: "",
        authors_list: "",
        publication_place: "",
        citation_number: 0,
        year: 0,
      })) || []
    );
  }, [displayData]);

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
            {/* Novo FormEditor com todos os campos principais */}
            <ToolFormEditor 
              data={parsedData} 
              onChange={updateField} 
              tooltip={toolTooltipContent} // tooltip passado
            />
            {/* Seletores separados — mantidos como estavam */}
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
                campos não listados acima.
              </Text>
            </Alert>
          </Stack>
        )
      }
      preview={
        displayData ? (
          <Stack gap="xl">
            <Box>
              <Text size="sm" fw={600} mb="xs" c="dimmed">
                Preview: Detail View
              </Text>
              <ToolDetailView
                tool={convertToDetailViewFormat(displayData)}
                teamMembers={teamMembers}
                publications={publications}
              />
            </Box>
            <Divider />
            <Box>
              <Text size="sm" fw={600} mb="xs" c="dimmed">
                Preview: Hero Card
              </Text>
              <ToolHeroCard tool={convertToCardFormat(displayData)} index={0} />
            </Box>
            <Divider />
            <Box>
              <Text size="sm" fw={600} mb="xs" c="dimmed">
                Preview: Compact Card
              </Text>
              <div style={{ width: "50%", margin: "auto" }}>
                <ToolCardCompact
                  tool={convertToCardFormat(displayData)}
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