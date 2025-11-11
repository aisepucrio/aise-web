## Como executar (instruções rápidas)

1. Instale dependências:

```powershell
npm install
```

2. Rodar em modo desenvolvimento (auto-reload):

```powershell
npm run dev
```

3. Criar build e executar em produção:

```powershell
npm run build; npm start
```

Conteúdo e dados do site

Todos os textos, listas e dados que preenchem o site ficam em arquivos JSON dentro de `public/json` (por exemplo `data/tools-data.json`, `data/team-data.json`, `home-content.json`). Esses arquivos são a fonte da estrutura do website e podem ser editados diretamente para alterar conteúdo.

Script de publications

Existe um script em `scripts/normalize_paper_data.js` que busca artigos (via SerpAPI), normaliza e gera `public/json/data/publications-data.json`. Para usá-lo, crie um arquivo `.env` com `SERPAPI_KEY=sua_chave` e execute:

```powershell
node scripts/normalize_paper_data.js
```

O script salva o JSON em `public/json/data/publications-data.json`.
