//editContentPage              -> Pagina teste com mudança de edição / alteração dos itens do JSON
//Pagina de Edicao do Conteudo

"use client";

import { useParams } from "next/navigation";
import { TeamMemberData } from "@/lib/types";
import { Center, Text, Stack, Box, Divider } from "@mantine/core";
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
import { authFetchJson } from "@/lib/auth-fetch";
import { RequireAuth } from "@/components/AuthContext";
import TeamFormEditor from "@/components/edit-content/TeamFormEditor";

export default function EditContentPage() {
  const params = useParams();
  const personId = decodeURIComponent(params?.personid as string);

  const {
    jsonText,
    setJsonText,
    isLoading,
    isSaving,
    isNewItem,
    jsonError,
    //editMode="json"    -> antes
    editMode, // agora desestruturado do hook
    //setEditMode={() => {}} // função vazia no JSX    -> antes
    setEditMode, // agora desestruturado do hook
    parsedData,
    validation,
    lastSaved,
    isAutoSaving,
    updateField, // foi criado, e como os outros, foi desestruturado do hook
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
        editMode={editMode} // incluido, agora esta dinâmico agora
        setEditMode={setEditMode} // incluido, agora esta dinâmico agora
        validation={validation}
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
        lastSaved={lastSaved}
        isAutoSaving={isAutoSaving}
        formEditor={
          // novo bloco incluido (formEditor), para o formulário
          parsedData ? (
            <TeamFormEditor data={parsedData} onChange={updateField} />
          ) : null
        }
        // display ja existente. Não foi alterado.
        preview={
          parsedData ? (
            <Stack gap="lg">
              <Box>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  Página de Perfil Completo
                </Text>
                <TeamMemberProfile member={parsedData} />
              </Box>
              <Divider />

              <Box>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  PersonCard (carrossel / página de time)
                </Text>
                <Center>
                  <PersonCard
                    key={`person-card-1-${parsedData.imageUrl}`}
                    name={parsedData.name}
                    position={parsedData.position}
                    imageUrl={parsedData.imageUrl}
                    description={parsedData.description}
                    cardWidth={240}
                  />
                  <PersonCard
                    key={`person-card-2-${parsedData.imageUrl}`}
                    name={parsedData.name}
                    position={parsedData.position}
                    imageUrl={parsedData.imageUrl}
                    description={parsedData.description}
                    cardWidth={240}
                    roles={parsedData.knowledge?.slice(0, 2)}
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
                      key={`member-horizontal-${parsedData.imageUrl}`}
                      member={parsedData}
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
                      key={`member-vertical-${parsedData.imageUrl}`}
                      member={parsedData}
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
