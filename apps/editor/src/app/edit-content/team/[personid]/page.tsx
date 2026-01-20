"use client";

import { useParams } from "next/navigation";
import { TeamMemberData } from "@/lib/types";
import { useState, useEffect } from "react";
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
import ProfileInstructions from "@/components/ProfileInstructions";
import { convertImgboxUrls } from "@/lib/imgbox";
import { authFetchJson } from "@/lib/auth-fetch";
import { RequireAuth } from "@/components/AuthContext";

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
    parsedData,
    validation,
    lastSaved,
    isAutoSaving,
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
        editMode="json"
        setEditMode={() => {}}
        validation={validation}
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
        lastSaved={lastSaved}
        isAutoSaving={isAutoSaving}
        instructions={<ProfileInstructions />}
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
