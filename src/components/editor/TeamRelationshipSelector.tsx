"use client";

import { useState, useEffect, type ReactNode } from "react";
import {
  Box,
  Group,
  Stack,
  Text,
  Button,
  Select,
  MultiSelect,
  Paper,
  ActionIcon,
  Badge,
  Alert,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconUsers,
  IconPlus,
  IconTrash,
  IconAlertCircle,
} from "@tabler/icons-react";
import { SectionBlock } from "./SectionBlock";

interface TeamMember {
  name: string;
  email: string;
  knowledge: string[]; // Lista de knowledges disponíveis
}

interface TeamRelationship {
  name: string;
  roles: string[]; // Roles selecionados para este membro no projeto
}

interface TeamRelationshipSelectorProps {
  value: string | Array<{ name: string; roles: string[] }>; // Aceita string ou array
  onChange: (value: Array<{ name: string; roles: string[] }>) => void; // Retorna array
  label?: string;
  showRoles?: boolean; // Se false, não mostra seleção de roles
  tooltip?: ReactNode;
}

export default function TeamRelationshipSelector({
  value,
  onChange,
  label = "Team Relationships",
  showRoles = true,
  tooltip,
}: TeamRelationshipSelectorProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [relationships, setRelationships] = useState<TeamRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conflicts, setConflicts] = useState<string[]>([]);

  // Carrega membros do team disponíveis
  useEffect(() => {
    loadTeamMembers();
  }, []);

  // Parse do valor inicial
  useEffect(() => {
    if (!value) {
      setRelationships([]);
      return;
    }

    // Se já é array, usa direto
    if (Array.isArray(value)) {
      setRelationships(value);
      checkConflicts(value);
      return;
    }

    // Se é string, faz parse do formato "Nome (Role1, Role2) | Nome (Role)"
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = value.split("|").map((rel) => {
        const match = rel.trim().match(/^(.+?)\s*\((.+)\)$/);
        if (match) {
          const name = match[1].trim();
          const roles = match[2].split(",").map((r) => r.trim());
          return { name, roles };
        }
        return { name: rel.trim(), roles: [] };
      });
      setRelationships(parsed);
      checkConflicts(parsed);
    }
  }, [value, teamMembers]);

  const loadTeamMembers = async () => {
    try {
      const res = await fetch("/api/team");
      if (!res.ok) throw new Error("Erro ao carregar team");

      const data = await res.json();
      const members = data.team || [];

      // Mapeia para extrair nome, email e knowledge
      const mappedMembers: TeamMember[] = members.map((m: any) => ({
        name: m.name,
        email: m.email,
        knowledge: m.knowledge || [],
      }));

      setTeamMembers(mappedMembers);
    } catch (err) {
      console.error("Erro ao carregar team:", err);
      setError("Erro ao carregar lista de membros do team");
    } finally {
      setLoading(false);
    }
  };

  // Verifica se há conflitos (pessoas deletadas)
  const checkConflicts = (rels: TeamRelationship[]) => {
    const memberNames = teamMembers.map((m) => m.name);
    const conflictNames = rels
      .filter((rel) => !memberNames.includes(rel.name))
      .map((rel) => rel.name);
    setConflicts(conflictNames);
  };

  // Atualiza o valor (retorna array)
  const updateValue = (rels: TeamRelationship[]) => {
    onChange(rels);
  };

  const handleAddRelationship = () => {
    const newRels = [{ name: null as any, roles: [] }, ...relationships];
    setRelationships(newRels);
  };

  const handleRemoveRelationship = (index: number) => {
    const newRels = relationships.filter((_, i) => i !== index);
    setRelationships(newRels);
    updateValue(newRels);
  };

  const handleNameChange = (index: number, name: string) => {
    const newRels = [...relationships];
    newRels[index].name = name;
    setRelationships(newRels);
    updateValue(newRels);
    checkConflicts(newRels);
  };

  const handleRolesChange = (index: number, roles: string[]) => {
    const newRels = [...relationships];
    newRels[index].roles = roles;
    setRelationships(newRels);
    updateValue(newRels);
  };

  return (
    <SectionBlock
      icon={<IconUsers size={14} />}
      title={label}
      tooltip={tooltip}
      headerRight={
        !loading && !error ? (
          <Button
            size="xs"
            leftSection={<IconPlus size={16} />}
            onClick={handleAddRelationship}
            variant="light"
            color="var(--primary)"
          >
            Adicionar Membro
          </Button>
        ) : null
      }
    >
      {loading ? (
        <Center py="xl">
          <Loader size="md" color="var(--primary)" />
        </Center>
      ) : error ? (
        <Alert icon={<IconAlertCircle />} title="Erro" color="red" radius="lg">
          {error}
        </Alert>
      ) : (
        <Stack gap="md">
          {conflicts.length > 0 && (
            <Alert
              icon={<IconAlertCircle />}
              title="Conflito Detectado"
              color="orange"
              radius="lg"
            >
              <Text size="sm">
                Os seguintes membros não existem mais na planilha de Team:
              </Text>
              <Stack gap="xs" mt="xs">
                {conflicts.map((name, idx) => (
                  <Badge key={idx} color="orange" variant="light">
                    {name}
                  </Badge>
                ))}
              </Stack>
              <Text size="sm" mt="xs">
                Remova-os ou atualize com nomes válidos.
              </Text>
            </Alert>
          )}

          {relationships.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              Nenhum membro adicionado. Clique em "Adicionar Membro" para
              começar.
            </Text>
          ) : (
            <Stack gap="md">
              {relationships.map((rel, index) => {
                const member = teamMembers.find((m) => m.name === rel.name);
                const availableRoles = member?.knowledge || [];
                const hasConflict = conflicts.includes(rel.name);

                return (
                  <Paper
                    key={index}
                    p="sm"
                    radius="lg"
                    withBorder
                    style={{
                      borderColor: hasConflict ? "#fd7e14" : undefined,
                    }}
                  >
                    <Group align="flex-start" wrap="nowrap">
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Select
                          placeholder="Selecione um membro"
                          data={teamMembers.map((m) => ({
                            value: m.name,
                            label: `${m.name} (${m.email})`,
                          }))}
                          value={rel.name || null}
                          onChange={(val) => handleNameChange(index, val || "")}
                          searchable
                          error={
                            hasConflict ? "Membro não encontrado" : undefined
                          }
                          styles={{
                            option: { color: "#000" },
                            input: { color: "#000" },
                          }}
                        />

                        {showRoles && rel.name && !hasConflict && (
                          <MultiSelect
                            placeholder="Selecione os cargos/roles"
                            data={availableRoles}
                            value={rel.roles}
                            onChange={(vals) => handleRolesChange(index, vals)}
                            searchable
                            description={
                              availableRoles.length === 0
                                ? "Este membro não tem knowledge cadastrada"
                                : `${availableRoles.length} knowledge(s) disponível(is)`
                            }
                            styles={{
                              option: { color: "#000" },
                              input: { color: "#000" },
                            }}
                          />
                        )}
                      </Stack>

                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => handleRemoveRelationship(index)}
                        size="lg"
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          )}

          {relationships.length > 0 && (
            <Box>
              <Text size="xs" c="dimmed">
                {relationships.length} membro(s) selecionado(s)
              </Text>
            </Box>
          )}
        </Stack>
      )}
    </SectionBlock>
  );
}
