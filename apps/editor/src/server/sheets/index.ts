/**
 * Google Sheets Service - Modular Architecture
 *
 * Estrutura:
 * - types.ts: Interfaces e tipos compartilhados
 * - constants.ts: Mapeamentos de colunas e constantes
 * - utils.ts: Funções auxiliares para parsing/serialização
 * - parsers.ts: Converte rows do Sheets → objetos tipados
 * - serializers.ts: Converte objetos tipados → rows do Sheets
 * - client.ts: Cliente Google Sheets e operações básicas
 * - operations.ts: CRUD de alto nível para cada entidade
 */

// Re-exports
export * from "./types";
export * from "./constants";
export * from "./client";
export * from "./parsers";
export * from "./serializers";
export * from "./operations";
export * from "./utils";
