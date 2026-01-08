"use client";

import { IconUserCircle } from "@tabler/icons-react";
import GenericHomePage from "./GenericHomePage";

interface MemberListItem {
  email: string;
  name: string;
}

export default function TeamHomePage() {
  return (
    <GenericHomePage<MemberListItem>
      title="Membros"
      icon={<IconUserCircle size={24} />}
      selectLabel="Selecione seu perfil"
      instructionText='Selecione seu nome na lista para editar seu perfil, ou escolha "Cadastrar novo membro" para criar um novo registro.'
      additionalInstructions="Se o seu email estiver incorreto na planilha, contate o responsável para alterá-lo. Não é possível mudar o email pelo editor."
      apiEndpoint="/api/team"
      newItemValue="__NEW_MEMBER__"
      newItemLabel="+ Cadastrar novo membro"
      newItemRoute="/edit-content/team/new"
      mapResponseToItems={(data) => {
        const team = data.team || [];
        return team
          .filter((member: any) => member.name && member.email)
          .map((member: any) => ({
            name: member.name,
            email: member.email,
          }));
      }}
      getItemValue={(item) => item.email}
      getItemLabel={(item) => `${item.name} (${item.email})`}
      getItemRoute={(value) =>
        `/edit-content/team/${encodeURIComponent(value)}`
      }
    />
  );
}
