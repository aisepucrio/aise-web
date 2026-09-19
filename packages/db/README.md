# @shared/db — POC Prisma + PostgreSQL + Docker

POC para validar a estrutura de banco antes de aplicar o schema real
(`banco_v2.dbml`). Uma única tabela de exemplo: `Task`.

## Passo a passo

1. **Instalar o Docker Desktop** (não estava instalado na máquina onde isso
   foi montado — https://www.docker.com/products/docker-desktop/).

2. **Subir o Postgres**, na raiz do monorepo:
   ```bash
   docker compose up -d
   ```
   Isso sobe um Postgres 16 em `localhost:5432` (usuário/senha/banco:
   `poc`/`poc`/`poc_db` — já configurado em `packages/db/.env` e em
   `apps/editor/.env.local`).

3. **Rodar a primeira migration**, dentro de `packages/db`:
   ```bash
   cd packages/db
   npx prisma migrate dev --name init
   ```
   Isso cria a tabela `Task` no banco e gera o Prisma Client.

4. **Subir o editor**:
   ```bash
   npm run dev:editor
   ```

5. **Testar o CRUD** (`http://localhost:3001`):
   - `GET  /api/poc-tasks` — lista
   - `POST /api/poc-tasks` — cria (`{ "title": "..." }`)
   - `GET  /api/poc-tasks/:id` — busca uma
   - `PUT  /api/poc-tasks/:id` — atualiza
   - `DELETE /api/poc-tasks/:id` — remove

6. **Ver a documentação Swagger**: `http://localhost:3001/poc-docs`
   (spec gerada automaticamente a partir dos comentários `@swagger` em
   `src/app/api/poc-tasks/route.ts` e `src/app/api/poc-tasks/[id]/route.ts`).

## Outros comandos úteis

```bash
npx prisma studio   # interface visual pra ver/editar o banco
docker compose down  # derruba o container (mantém os dados no volume)
docker compose down -v  # derruba e apaga os dados
```
