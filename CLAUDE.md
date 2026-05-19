# Jurídico Online — AI Agent Guide

> Concise context for AI assistants working on this codebase. Read this first.

## What this project is

**juridicoonline.com.br** — consulta gratuita de empresas brasileiras. 65 milhões de CNPJs (Receita Federal) + 25M sócios (QSA), com login obrigatório free para liberar telefones/emails/sócios completos. Monetização futura: Adsense + plans pagos + API REST + Hermes CRM integration.

## Quick orientation

```
src/
├── app/                       # Next.js App Router (Next 16, NOT what you know — see AGENTS.md)
│   ├── page.tsx               # Home
│   ├── empresa/[slug]/        # Detalhe CNPJ (canonical slug = cnpj14-razao-slugified)
│   ├── empresas/              # Index UFs
│   │   └── [uf]/
│   │       └── [slug]/        # CNAE numérico OU município (alpha) — dispatcher
│   ├── cnae/[codigo]/         # Página por CNAE
│   ├── socio/[slug]/          # Página por sócio (busca em Postgres)
│   ├── buscar/                # Resultados de busca
│   ├── cadastro/              # Server action → Auth.js magic link
│   ├── login/                 # Server action → Auth.js magic link
│   ├── login/check-email/     # verifyRequest page (Auth.js)
│   ├── unsubscribe/           # LGPD opt-out de newsletter
│   ├── planos|api|sobre|contato|privacidade|termos|lgpd/
│   ├── api/auth/[...nextauth] # Auth.js handlers
│   ├── sitemap.xml/           # Sitemap index → child sitemaps
│   ├── sitemaps/
│   │   ├── static/            # Páginas estáticas + UF index
│   │   ├── uf/[uf]/           # 5000 empresas top por UF + municípios
│   │   └── cnae/              # /cnae/* + /empresas/uf/cnae intersections
│   └── robots.ts              # robots.txt
├── lib/
│   ├── db.ts                  # Prisma client
│   ├── meili.ts               # MeiliSearch (empresas) + helpers SEO
│   ├── socios.ts              # Postgres mirror QSA + helpers
│   ├── mailer.ts              # Mailgun HTTP API + templates
│   ├── seo.ts                 # SITE_URL, SITE_NAME
│   ├── cnpj.ts                # formatadores, slugs, validação
│   ├── brightdata.ts          # Bright Data unlocker (scrape competidores/enrich)
│   └── utils.ts               # cn() helper
├── components/                # Header, Footer, Logo, SearchBox, Gate
├── middleware.ts              # Security headers + cache (vary by Cookie)
└── auth.ts                    # Auth.js v5 config (magic link via Mailgun + Google opt)

prisma/schema.prisma           # User, Account, Session, VerificationToken, Lead, Consultation, Socio, ApiKey, RemovalRequest
scripts/
├── import_socios.py           # Importa RFB QSA zips → Postgres (~25M)
└── daily_seo.sh               # Cron: warm sitemaps + GSC re-submit + IndexNow

docker-compose.yml             # jol-app + jol-db + jol-redis
Dockerfile                     # multi-stage Next standalone
```

## Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | Next.js 16 + Tailwind v4 | Standalone build, ISR `revalidate=86400` |
| Auth | Auth.js v5 + Prisma adapter | Magic link (Mailgun) + Google OAuth opcional |
| DB | Postgres 16 (`jol-db`) | Users, Sessions, Leads, Consultations, Socios (~25M) |
| Cache | Redis 7 (`jol-redis`) | Currently idle, reserved for rate limit / cache |
| Search | MeiliSearch (NewWay 195.35.40.29:7700) | Single index `empresas`, 65.7M docs |
| Mail | Mailgun HTTP API | Domain `mg.juridicoonline.com.br`, all DNS valid |
| CDN | Cloudflare proxied | Cache rule: bypass when `authjs.session-token` cookie |
| Hosting | Servidor 3 (72.60.63.183) | docker-compose stack, isolated `jol-net` |
| Repo | github.com/rdgbr/juridicoonline | main branch |

## Critical conventions

### Next 16 — read `node_modules/next/dist/docs/` before edits
- Use `output: "standalone"` (already set)
- Dynamic params are `Promise<{}>` — always `await params`
- Routes: NO mixed dynamic+literal segments (e.g. `[uf].xml/` doesn't work)
- `middleware.ts` is deprecated → use `proxy.ts` (TODO migrate)

### SEO gates
- Anônimo: vê razão social, CNPJ, situação, CNAE, endereço, capital, sócios PARCIAIS (apenas QSA público RFB), FAQ, relacionadas
- Logado: telefones, emails, sócios completos com qualificação + data entrada
- **Server-side strip**: `/empresa/[slug]` apaga `telefone1/2/email` no SSR antes de renderizar pra anônimos (não tem DevTools workaround)

### Auth flow
1. `/cadastro` server action saves Lead + upsert User + sends admin notif + calls `signIn("nodemailer", {email})`
2. Auth.js generates token → Mailgun envia magic link
3. User clicks `/api/auth/callback/email?token=X&email=Y`
4. Auth.js cria Session, redireciona pra `redirectTo`
5. `events.createUser` dispara welcome email + admin notif (Promise.allSettled, non-blocking)
6. **Gmail prefetch issue**: links são pré-buscados por scanners → session cria mas user vê erro. Conhecido, próximo fix: página de "Confirmar acesso" com POST.

### Cache strategy
- Logged-in users: `Cache-Control: private, no-cache` + `Vary: Cookie` (middleware)
- Anônimos `/`, `/sobre`, etc: `public, s-maxage=300, swr=600`
- Anônimos `/empresa/*`, `/empresas/*`, `/cnae/*`, `/socio/*`: `public, s-maxage=86400, swr=604800`
- Cloudflare: regra de bypass quando `authjs.session-token` cookie presente

## Common tasks

### Run dev
```bash
cd /root/CascadeProjects/juridicoonline
docker compose up -d  # Postgres + Redis only
npm run dev           # Local Next.js (port 3000)
```

### Rebuild + deploy
```bash
docker compose build jol-app
docker compose up -d --force-recreate jol-app
```

### Force CF cache purge (após code change)
```bash
CF_TOKEN="<set-from-secure-storage>"
ZONE="<your-zone-id>"
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \
  -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
  -d '{"purge_everything":true}'
```

### DB queries
```bash
docker exec -it jol-db psql -U jol -d juridicoonline
# ou Prisma Studio: npx prisma studio
```

### Logs
```bash
docker logs jol-app --tail 50 -f
journalctl -u juridicoonline-seo.service --no-pager -n 50
tail -f /var/log/juridicoonline-seo.log
```

### Submit URLs to GSC/IndexNow
- Daily automático: `juridicoonline-seo.timer` (04:00 UTC)
- Manual: `/root/CascadeProjects/juridicoonline/scripts/daily_seo.sh`

## Credentials (env vars in `.env`)

| Var | Value | Notes |
|-----|-------|-------|
| `POSTGRES_PASSWORD` | random hex 24 | gerado no setup |
| `AUTH_SECRET` | random hex 32 | rotacionar invalida todas sessões |
| `MAILGUN_API_KEY` | `1d1f3ccf...` | conta master, todos os domains |
| `MAILGUN_DOMAIN` | `mg.juridicoonline.com.br` | DKIM/SPF/MX valid |
| `ADMIN_EMAIL` | `rodrigodgbr1@gmail.com` | recebe notif cada signup |
| `MEILI_HOST` | `http://195.35.40.29:7700` | NewWay shared |
| `BRIGHTDATA_API_KEY` | `2c2ec5d0-...` | scraping competidores |
| `AUTH_GOOGLE_ID/SECRET` | vazio | preencher pra ativar "Continuar com Google" |

External tokens (NUNCA commitar — só em `.env` e em conversation memory):
- Cloudflare API token (escopo amplo)
- GitHub Personal Access Token (`rdgbr`)
- GSC Service Account: `/root/CascadeProjects/fdstributario/google-service-account.json`

> Para AI agents: solicite os tokens via memory ou via user explicitly se precisar.

## See also

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — diagramas, fluxos, decisões
- [`SEO_STRATEGY.md`](./SEO_STRATEGY.md) — gray-hat playbook + concorrentes
- [`OPERATIONS.md`](./OPERATIONS.md) — runbook, troubleshooting
- [`ROADMAP.md`](./ROADMAP.md) — sprints futuros
- [`README.md`](./README.md) — overview público
