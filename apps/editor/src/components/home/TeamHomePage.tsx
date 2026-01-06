"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Select,
  Button,
  Alert,
  Loader,
  Center,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconUserCircle,
  IconAlertCircle,
  IconLogin,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  listAllMembers,
  getExampleData,
  type TeamMemberData,
  type MemberListItem,
} from "@/services/googleSheets";

const NEW_MEMBER_VALUE = "__NEW_MEMBER__";

export default function TeamHomePage() {
  const router = useRouter();
  const [members, setMembers] = useState<MemberListItem[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [error, setError] = useState("");

  // Carrega lista de membros ao montar o componente
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const membersList = await listAllMembers();
      setMembers(membersList);
    } catch (err) {
      console.error("Erro ao carregar membros:", err);
      setError("Erro ao carregar lista de membros");
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleLogin = async () => {
    setError("");

    if (!selectedValue) {
      setError("Por favor, selecione uma opção");
      return;
    }

    setLoading(true);

    try {
      if (selectedValue === NEW_MEMBER_VALUE) {
        // Novo membro - criar perfil com dados de exemplo
        console.log("Novo membro - criando perfil com dados de exemplo");
        const exampleData = await getExampleData();
        const newMember: TeamMemberData = {
          ...exampleData,
          email: "", // Email vazio para novo membro
        };

        // Salva o novo membro em sessionStorage
        if (typeof window !== "undefined") {
          sessionStorage.setItem("newMember", JSON.stringify(newMember));
          sessionStorage.setItem("isNewMember", "true");
        }

        router.push(`/edit-content/team/new`);
      } else {
        // Membro existente - redireciona com email
        const encodedEmail = encodeURIComponent(selectedValue);
        router.push(`/edit-content/team/${encodedEmail}`);
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError(
        "Erro ao conectar com o servidor. Verifique sua conexão e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      {/* Instruções */}
      <Alert
        icon={<IconAlertCircle size={24} />}
        title="Como funciona"
        color="var(--primary)"
        variant="light"
        radius="lg"
      >
        <Text size="sm">
          Selecione seu nome na lista para editar seu perfil, ou escolha
          &quot;Cadastrar novo membro&quot; para criar um novo registro.
        </Text>
        <Text size="sm" mt="sm">
          <strong>Importante:</strong> Não edite a planilha diretamente. Use
          sempre este editor.
        </Text>
        <Text size="sm" mt="sm">
          Se o seu email estiver incorreto na planilha, contate o responsável
          para alterá-lo. Não é possível mudar o email pelo editor.
        </Text>
      </Alert>

      {/* Seleção de Membro */}
      {loadingMembers ? (
        <Center py="xl">
          <Loader size="md" color="var(--primary)" />
        </Center>
      ) : (
        <Select
          radius={"md"}
          size="md"
          label="Selecione seu perfil"
          placeholder="Escolha uma opção"
          leftSection={<IconUserCircle size={24} />}
          value={selectedValue}
          onChange={setSelectedValue}
          disabled={loading}
          error={error}
          searchable
          data={[
            {
              value: NEW_MEMBER_VALUE,
              label: "+ Cadastrar novo membro",
            },
            ...members.map((member) => ({
              value: member.email,
              label: `${member.name} (${member.email})`,
            })),
          ]}
          styles={{
            label: {
              color: "#000000",
              fontWeight: 500,
            },
            input: {
              color: "#000000",
              borderColor: error ? "#fa5252" : undefined,
            },
            option: {
              color: "#000",
              "&[dataDisabled]": { color: "#adb5bd" },
              "&[dataSelected]": { background: "#f1f3f5", color: "#000" },
              "&[dataHovered]": { background: "#f8f9fa" },
            },
          }}
        />
      )}

      {/* Botão de Login */}
      <Button
        size="md"
        fullWidth
        onClick={handleLogin}
        disabled={loading}
        rightSection={
          loading ? (
            <Loader size="xs" color="white" />
          ) : (
            <IconLogin size={18} color="white" />
          )
        }
        styles={{
          root: {
            background: "var(--primary)",
            border: "none",
            "&[dataDisabled]": {
              background: "var(--primary)",
              opacity: 1,
              cursor: "not-allowed",
            },
          },
          label: {
            color: "white",
          },
        }}
      >
        {loading ? "Verificando..." : "Acessar Editor"}
      </Button>

      {/* Informações adicionais */}
      <Box ta="center">
        <Text size="xs" c="dimmed">
          Suas alterações serão sincronizadas com o Google Sheets
        </Text>
      </Box>
    </Stack>
  );
}
