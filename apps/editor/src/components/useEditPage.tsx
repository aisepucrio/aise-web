"use client";

/**
 * Hook genérico reutilizável para páginas de edição
 * Elimina código duplicado entre Team, Tools e Researches
 */

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { authFetchJson } from "@/lib/auth-fetch";

export interface UseEditPageOptions<T> {
  /** ID do item sendo editado (email, tool id, research id) */
  itemId: string;

  /** Nome do tipo de item para mensagens ("membro", "tool", "research") */
  itemType: string;

  /** Endpoint da API para buscar dados ("/api/team", "/api/tools", etc) */
  apiEndpoint: string;

  /** Dados de exemplo para novos items */
  exampleData: T;

  /** Função para buscar item específico */
  fetchItem?: (itemId: string) => Promise<T | null>;

  /** Função de validação customizada */
  validate: (data: T) => { valid: boolean; errors: string[] };

  /** Validação adicional para items não-novos */
  validateExisting?: (
    data: T,
    itemId: string,
  ) => { valid: boolean; errors: string[] };

  /** Indica se é um novo item baseado no ID */
  isNewItemId?: (itemId: string) => boolean;

  /** Função para construir URL do item (usado para redirecionar após criar novo) */
  getItemUrl?: (data: T) => string;
}

export interface UseEditPageReturn<T> {
  // Estado
  jsonText: string;
  setJsonText: (text: string) => void;
  itemData: T | null;
  isLoading: boolean;
  isSaving: boolean;
  isNewItem: boolean;
  jsonError: string | null;
  editMode: "json" | "form";
  setEditMode: (mode: "json" | "form") => void;

  // Dados parseados e validação
  parsedData: T | null;
  validation: { valid: boolean; errors: string[] };

  // Autosave
  lastSaved: Date | null;
  isAutoSaving: boolean;

  // Ações
  updateField: (field: keyof T, value: any) => void;
  handleSave: () => Promise<void>;
  handleReset: () => void;
}

export function useEditPage<T>({
  itemId,
  itemType,
  apiEndpoint,
  exampleData,
  fetchItem,
  validate,
  validateExisting,
  isNewItemId = (id) => id === "new" || id.startsWith("new-"),
  getItemUrl,
}: UseEditPageOptions<T>): UseEditPageReturn<T> {
  const router = useRouter();

  const [jsonText, setJsonText] = useState("");
  const [itemData, setItemData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<"json" | "form">("form");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastManualSave, setLastManualSave] = useState<Date | null>(null);

  // Carrega os dados do item
  useEffect(() => {
    const loadItemData = async () => {
      setIsLoading(true);
      try {
        if (isNewItemId(itemId)) {
          // Novo item - usa dados de exemplo
          setItemData(exampleData);
          setJsonText(JSON.stringify(exampleData, null, 2));
          setIsNewItem(true);
        } else if (fetchItem) {
          // Busca item existente usando função customizada
          const item = await fetchItem(itemId);
          if (item) {
            setItemData(item);
            setJsonText(JSON.stringify(item, null, 2));
            setIsNewItem(false);
          } else {
            throw new Error(`${itemType} não encontrado`);
          }
        } else {
          // Busca item da API genérica
          // authFetchJson returns parsed JSON directly (throws on error)
          const data = await authFetchJson(apiEndpoint);
          const items = data[Object.keys(data)[0]] || [];
          const item = items.find(
            (t: any) => t.id === itemId || t.email === itemId,
          );

          if (item) {
            setItemData(item);
            setJsonText(JSON.stringify(item, null, 2));
            setIsNewItem(false);
          } else {
            throw new Error(`${itemType} não encontrado`);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        notifications.show({
          title: "Erro",
          message: `Erro ao carregar dados. Redirecionando...`,
          color: "red",
        });
        setTimeout(() => router.push("/"), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (itemId) {
      loadItemData();
    }
  }, [
    itemId,
    itemType,
    apiEndpoint,
    exampleData,
    fetchItem,
    isNewItemId,
    router,
  ]);

  // Autosave: monitora mudanças no JSON e salva após 5 segundos de inatividade
  useEffect(() => {
    // Se estiver carregando ou já salvando, não inicia autosave
    if (isLoading || isSaving || isAutoSaving) {
      return;
    }

    // Não faz autosave para novos items ou JSON inválido
    if (isNewItem || !parsedData || !validation.valid) {
      return;
    }

    // Agenda novo autosave após 5 segundos
    const timer = setTimeout(() => {
      performAutoSave();
    }, 5000);

    // Cleanup
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonText, isNewItem, isLoading]);

  // Parse do JSON em tempo real
  const parsedData = useMemo<T | null>(() => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonError(null);
      return parsed as T;
    } catch (error) {
      if (jsonText.trim() !== "") {
        setJsonError("JSON inválido");
      }
      return null;
    }
  }, [jsonText]);

  // Atualiza um campo específico (modo formulário)
  const updateField = (field: keyof T, value: any) => {
    if (!parsedData) return;

    const updated = { ...parsedData, [field]: value };
    setJsonText(JSON.stringify(updated, null, 2));
  };

  // Validação dos dados
  const validation = useMemo(() => {
    if (!parsedData) return { valid: false, errors: ["JSON inválido"] };

    const baseValidation = validate(parsedData);

    // Validação adicional para items existentes
    if (!isNewItem && validateExisting) {
      const existingValidation = validateExisting(parsedData, itemId);
      if (!existingValidation.valid) {
        return {
          valid: false,
          errors: [...baseValidation.errors, ...existingValidation.errors],
        };
      }
    }

    return baseValidation;
  }, [parsedData, validate, validateExisting, isNewItem, itemId]);

  // Autosave - salva automaticamente após inatividade
  const performAutoSave = async () => {
    if (!parsedData || !validation.valid || isNewItem) {
      return; // Não faz autosave se dados inválidos ou item novo
    }

    // Verifica se passaram pelo menos 10 segundos desde o último save manual
    if (lastManualSave) {
      const secondsSinceManualSave =
        (new Date().getTime() - lastManualSave.getTime()) / 1000;
      if (secondsSinceManualSave < 10) {
        return; // Não faz autosave se ainda não passaram 10 segundos
      }
    }

    setIsAutoSaving(true);

    try {
      // authFetchJson returns parsed JSON directly (throws on error)
      await authFetchJson(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      setLastSaved(new Date());
      notifications.show({
        title: "Salvo automaticamente",
        message: ``,
        color: "blue",
        icon: <IconCheck />,
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Erro no autosave:", error);
      // Não mostra erro para não incomodar o usuário
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Salvar alterações
  const handleSave = async () => {
    if (!parsedData) {
      notifications.show({
        title: "Erro",
        message: "JSON inválido. Corrija os erros antes de salvar.",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    if (!validation.valid) {
      notifications.show({
        title: "Erro de Validação",
        message: validation.errors.join(", "),
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    setIsSaving(true);

    try {
      // authFetchJson returns parsed JSON directly (throws on error)
      const result = await authFetchJson(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      const now = new Date();
      setLastSaved(now);
      setLastManualSave(now);
      notifications.show({
        title: "Sucesso!",
        message: result.message || `${itemType} salvo com sucesso`,
        color: "green",
        icon: <IconCheck />,
      });

      // Se era novo, redireciona para a URL correta
      if (isNewItem && getItemUrl) {
        const newUrl = getItemUrl(parsedData);
        console.log(`[useEditPage] Redirecionando novo item para: ${newUrl}`);
        router.push(newUrl);
      } else if (isNewItem) {
        setIsNewItem(false);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      notifications.show({
        title: "Erro",
        message:
          error instanceof Error
            ? error.message
            : "Erro ao salvar dados. Tente novamente.",
        color: "red",
        icon: <IconX />,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Resetar para dados de exemplo
  const handleReset = () => {
    const resetData: T = {
      ...exampleData,
      ...(itemData && { id: (itemData as any).id }),
      ...(itemData && { email: (itemData as any).email }),
    };
    setJsonText(JSON.stringify(resetData, null, 2));
    notifications.show({
      title: "Resetado",
      message: "Dados resetados para exemplo (ID mantido)",
      color: "blue",
    });
  };

  return {
    jsonText,
    setJsonText,
    itemData,
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
  };
}
