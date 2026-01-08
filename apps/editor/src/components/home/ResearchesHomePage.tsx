"use client";

import { IconFlask } from "@tabler/icons-react";
import GenericHomePage from "./GenericHomePage";

interface ResearchListItem {
  id: string;
  name: string;
  shortDescription: string;
}

export default function ResearchesHomePage() {
  return (
    <GenericHomePage<ResearchListItem>
      title="Researches"
      icon={<IconFlask size={24} />}
      selectLabel="Selecione uma linha de pesquisa"
      instructionText='Selecione uma linha de pesquisa na lista para editar suas informações, ou escolha "Criar nova research" para adicionar uma nova área de pesquisa.'
      apiEndpoint="/api/researches"
      newItemValue="__NEW_RESEARCH__"
      newItemLabel="+ Criar nova research"
      newItemRoute="/edit-content/researches/new-research"
      mapResponseToItems={(data) => {
        const researchesList = data.researches || [];
        return researchesList.map((research: any) => ({
          id: research.id,
          name: research.name,
          shortDescription: research.shortDescription || "",
        }));
      }}
      getItemValue={(item) => item.id}
      getItemLabel={(item) => item.name}
      getItemRoute={(value) => `/edit-content/researches/${value}`}
    />
  );
}
