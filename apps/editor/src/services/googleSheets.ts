/**
 * Serviço CLIENT-SAFE para integração com Google Sheets
 * Este arquivo NÃO importa googleapis - apenas faz fetch para rotas API
 * A lógica do Google Sheets está em src/server/googleSheets.server.ts
 *
 * Este arquivo agora é um wrapper simplificado que re-exporta
 * a estrutura modular de src/services/sheets/
 */

// Re-exporta tudo da estrutura modular
export * from "./sheets";

// Mantém compatibilidade com código legado
export { EXAMPLE_TEAM_MEMBER as EXAMPLE_DATA } from "./sheets";
