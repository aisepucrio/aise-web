/**
 * Módulo SERVER-ONLY para acesso ao Google Sheets
 * NUNCA importe isso em componentes client!
 * Use apenas em rotas API (/app/api/...)
 *
 * Este arquivo agora é um wrapper simplificado que re-exporta
 * a estrutura modular de src/server/sheets/
 */

// Re-exporta tudo da estrutura modular
export * from "./sheets";
