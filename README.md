# **AISE Web — Monorepo**

Monorepo do **AISE Lab (PUC-Rio)** contendo o site público e o editor de conteúdo.

---

## 📦 Módulos

### **apps/main — Site Principal**

Site público do AISE Lab.

---

### **apps/editor — Editor de Conteúdo**

Painel interno para editar os conteúdos do site.

---

### **packages/ui — UI Compartilhada**

Biblioteca de componentes reutilizáveis entre os apps
(cards, badges, layouts, etc).

---

## 🚀 Início rápido

```bash
npm install

# site principal
npm run dev:main
# http://localhost:3000

# editor
npm run dev:editor
# http://localhost:3001
```

---

## ⚙️ Variáveis de Ambiente

### **ENV — apps/main (site público)**

Arquivo: `apps/main/.env.local`

```env
# Proteção da API administrativa
ADMIN_TOKEN=

# Conexão com o Firebase Database
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### **ENV — apps/editor (editor de conteúdo)**

Arquivo: `apps/editor/.env.local`

```env
# URL do site principal
NEXT_PUBLIC_PUBLISH_API_URL=

# Nome das abas da planilha (opcional)
TEAM_SHEET_NAME=
PUBLICATIONS_SHEET_NAME=
TOOLS_SHEET_NAME=
RESEARCHES_SHEET_NAME=

# Acesso via service account ao Google Sheets
GOOGLE_SHEETS_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=

# Key da SERP API, busca automática de publicações
SERPAPI_KEY=

# Key para autenticação (cliente/servidor) ;  os dois são a mesma chave
GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

---

**AISE Lab — PUC-Rio**
