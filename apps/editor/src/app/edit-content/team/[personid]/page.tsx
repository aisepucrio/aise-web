//editContentPage              -> Pagina teste com mudança de edição / alteração dos itens do JSON
//Pagina de Edicao do Conteudo

"use client";

import { useParams } from "next/navigation";
import { TeamMemberData } from "@/lib/types";
import { useState, useEffect } from "react";
import { Center, Text, Stack, Box, Divider, List, Code } from "@mantine/core";
import { EXAMPLE_TEAM_MEMBER } from "@/lib/examples";
import {
  validateMemberData,
  validateMemberEmailUnchanged,
} from "@/lib/validations";
import { useEditPage } from "@/components/useEditPage";
import { EditPageLayout } from "@/components/EditPageLayout";
import { PersonCard } from "@shared/ui";
import { TeamMemberListItem } from "@shared/ui";
import { TeamMemberGridItem } from "@shared/ui";
import { TeamMemberProfile } from "@shared/ui";
import ProfileInstructions from "@/components/ProfileInstructions";
import { convertImgboxUrls } from "@/lib/imgbox";
import { authFetchJson } from "@/lib/auth-fetch";
import { RequireAuth } from "@/components/AuthContext";
import TeamMemberFormEditor from "@/components/TeamMemberFormEditor"; // importado. TeamMemberFormEditor

// Conteúdo do tooltip — resumo das instruções de perfil
const teamTooltipContent = (
  <Stack gap={6}>
    <Text size="xs" fw={700}>Dicas rápidas:</Text>
    <List size="xs" spacing={4}>
      <List.Item><Code>Nome</Code>: formato First Last, 3–100 caracteres.</List.Item>
      <List.Item><Code>Email</Code>: identificador único — não pode ser alterado após salvar.</List.Item>
      <List.Item><Code>Position</Code>: use exatamente um dos valores válidos (ex: PhD Student).</List.Item>
      <List.Item><Code>Image URL</Code>: upload no imgbox.com, foto 3:4 com rosto visível.</List.Item>
      <List.Item><Code>Description</Code>: 50–750 caracteres, foco em formação e interesses.</List.Item>
      <List.Item><Code>Research Interests</Code>: 2–10 itens em inglês.</List.Item>
      <List.Item><Code>Technologies</Code>: 3–15 itens em inglês.</List.Item>
      <List.Item><Code>Knowledge</Code>: 1–8 áreas em inglês.</List.Item>
    </List>
  </Stack>
);

export default function EditContentPage() {
  const params = useParams();
  const personId = decodeURIComponent(params?.personid as string);
  const [convertedData, setConvertedData] = useState<TeamMemberData | null>(
    null,
  );

  const {
    jsonText,
    setJsonText,
    isLoading,
    isSaving,
    isNewItem,
    jsonError,
    //editMode="json"    -> antes
    editMode,     // agora desestruturado do hook
    //setEditMode={() => {}} // função vazia no JSX    -> antes
    setEditMode,  // agora desestruturado do hook
    parsedData,   
    validation,   
    lastSaved,    
    isAutoSaving, 
    updateField,  // foi criado, e como os outros, foi desestruturado do hook
    handleSave,
    handleReset,
  } = useEditPage<TeamMemberData>({
    itemId: personId,
    itemType: "membro",
    apiEndpoint: "/api/team",
    exampleData: EXAMPLE_TEAM_MEMBER,
    fetchItem: async (id) => {
      const data = await authFetchJson("/api/team");
      const members = data.team || [];
      const member = members.find(
        (m: any) => m.email.toLowerCase() === id.toLowerCase(),
      );
      return member || null;
    },
    validate: validateMemberData,
    validateExisting: validateMemberEmailUnchanged,
    isNewItemId: (id) => id === "new" || !id || id === "undefined",
    getItemUrl: (data) =>
      `/edit-content/team/${encodeURIComponent(data.email)}`,
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

  return (
    <RequireAuth>
      <EditPageLayout
        title="Editor de Perfil"
        subtitle={`${
          isNewItem ? "Novo perfil" : "Editando perfil existente"
        }: ${personId}`}
        isLoading={isLoading}
        isNewItem={isNewItem}
        newItemMessage="Novo Perfil"
        newItemWarning="IMPORTANTE: Certifique-se de usar um email válido e único! Após salvar, não será possível alterar o email."
        jsonText={jsonText}
        setJsonText={setJsonText}
        jsonError={jsonError}
        editMode={editMode}           // incluido, agora esta dinâmico agora
        setEditMode={setEditMode}     // incluido, agora esta dinâmico agora
        validation={validation}
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
        lastSaved={lastSaved}
        isAutoSaving={isAutoSaving}
        instructions={<ProfileInstructions />}
        formEditor={                  // novo bloco incluido (formEditor), para o formulário  
          parsedData ? (
            <TeamMemberFormEditor
              data={parsedData}
              onChange={updateField}
              tooltip={teamTooltipContent} // tooltip passado
            />
          ) : null
        }
        // display ja existente. Não foi alterado.
        preview={
          displayData ? (
            <Stack gap="lg">
              <Box>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  Página de Perfil Completo
                </Text>
                <TeamMemberProfile member={displayData} />
              </Box>
              <Divider />

              <Box>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  PersonCard (carrossel / página de time)
                </Text>
                <Center>
                  <PersonCard
                    key={`person-card-1-${displayData.imageUrl}`}
                    name={displayData.name}
                    position={displayData.position}
                    imageUrl={displayData.imageUrl}
                    description={displayData.description}
                    cardWidth={240}
                  />
                  <PersonCard
                    key={`person-card-2-${displayData.imageUrl}`}
                    name={displayData.name}
                    position={displayData.position}
                    imageUrl={displayData.imageUrl}
                    description={displayData.description}
                    cardWidth={240}
                    roles={displayData.knowledge?.slice(0, 2)}
                  />
                </Center>
              </Box>

              <Divider />

              <Box>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  Lista de Membros - Vizualização desktop
                </Text>
                <Center>
                  <Box style={{ width: "35%" }}>
                    <TeamMemberListItem
                      key={`member-horizontal-${displayData.imageUrl}`}
                      member={displayData}
                    />
                  </Box>
                </Center>
              </Box>

              <Divider />

              <Box>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  Lista de Membros - Vizualização mobile
                </Text>
                <Center>
                  <Box style={{ width: "35%" }}>
                    <TeamMemberGridItem
                      key={`member-vertical-${displayData.imageUrl}`}
                      member={displayData}
                    />
                  </Box>
                </Center>
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
    </RequireAuth>
  );
}
