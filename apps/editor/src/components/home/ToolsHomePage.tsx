"use client";

import { IconTool } from "@tabler/icons-react";
import GenericHomePage from "./GenericHomePage";

interface ToolListItem {
  id: string;
  name: string;
  category: string;
}

export default function ToolsHomePage() {
  return (
    <GenericHomePage<ToolListItem>
      title="Tools"
      icon={<IconTool size={24} />}
      selectLabel="Selecione um tool"
      instructionText='Selecione um tool na lista para editar suas informações, ou escolha "Criar novo tool" para adicionar um novo projeto.'
      apiEndpoint="/api/tools"
      newItemValue="__NEW_TOOL__"
      newItemLabel="+ Criar novo tool"
      newItemRoute="/edit-content/tool/new-tool"
      mapResponseToItems={(data) => {
        const toolsList = data.tools || [];
        return toolsList.map((tool: any) => ({
          id: tool.id,
          name: tool.name,
          category: tool.category || "Uncategorized",
        }));
      }}
      getItemValue={(item) => item.id}
      getItemLabel={(item) => `${item.name} (${item.category})`}
      getItemRoute={(value) => `/edit-content/tool/${value}`}
    />
  );
}
