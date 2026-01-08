"use client";

import { useState, useEffect } from "react";
import {
  Select,
  Button,
  Alert,
  Loader,
  Center,
  Stack,
  Text,
} from "@mantine/core";
import { IconAlertCircle, IconLogin } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface GenericHomePageProps<T> {
  // Configurações de exibição
  title: string;
  icon: ReactNode;
  selectLabel: string;
  selectPlaceholder?: string;
  instructionText: string | ReactNode;
  additionalInstructions?: string | ReactNode;

  // Configurações de API
  apiEndpoint: string;
  newItemValue: string;
  newItemLabel: string;
  newItemRoute: string;

  // Funções de mapeamento
  mapResponseToItems: (data: any) => T[];
  getItemValue: (item: T) => string;
  getItemLabel: (item: T) => string;
  getItemRoute: (value: string) => string;
}

export default function GenericHomePage<T>({
  title,
  icon,
  selectLabel,
  selectPlaceholder = "Escolha uma opção",
  instructionText,
  additionalInstructions,
  apiEndpoint,
  newItemValue,
  newItemLabel,
  newItemRoute,
  mapResponseToItems,
  getItemValue,
  getItemLabel,
  getItemRoute,
}: GenericHomePageProps<T>) {
  const router = useRouter();
  const [items, setItems] = useState<T[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState("");

  // Carrega lista de itens ao montar o componente
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await fetch(apiEndpoint);
      if (!res.ok) throw new Error(`Erro ao carregar ${title.toLowerCase()}`);

      const data = await res.json();
      const mappedItems = mapResponseToItems(data);
      setItems(mappedItems);
    } catch (err) {
      console.error(`Erro ao carregar ${title.toLowerCase()}:`, err);
      setError(`Erro ao carregar lista de ${title.toLowerCase()}`);
    } finally {
      setLoadingItems(false);
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
      if (selectedValue === newItemValue) {
        // Novo item - redireciona para criar
        router.push(newItemRoute);
      } else {
        // Item existente - redireciona com ID/email
        router.push(getItemRoute(selectedValue));
      }
    } catch (err) {
      console.error("Erro ao acessar:", err);
      setError("Erro ao acessar editor. Tente novamente.");
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
        <Text size="sm">{instructionText}</Text>
        {additionalInstructions && (
          <Text size="sm" mt="sm">
            {additionalInstructions}
          </Text>
        )}
      </Alert>

      {/* Seleção de Item */}
      {loadingItems ? (
        <Center py="xl">
          <Loader size="md" color="var(--primary)" />
        </Center>
      ) : (
        <Select
          radius={"md"}
          size="md"
          label={selectLabel}
          placeholder={selectPlaceholder}
          leftSection={icon}
          value={selectedValue}
          onChange={setSelectedValue}
          disabled={loading}
          error={error}
          searchable
          data={[
            {
              value: newItemValue,
              label: newItemLabel,
            },
            ...items.map((item) => ({
              value: getItemValue(item),
              label: getItemLabel(item),
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

      {/* Botão de Acesso */}
      <Button
        size="md"
        fullWidth
        onClick={handleLogin}
        disabled={loading || !selectedValue}
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
              opacity: 0.6,
              cursor: "not-allowed",
            },
          },
          label: {
            color: "white",
          },
        }}
      >
        {loading ? "Carregando..." : "Acessar Editor"}
      </Button>
    </Stack>
  );
}
