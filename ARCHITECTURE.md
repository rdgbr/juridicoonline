# Architecture — Jurídico Online

## High-level diagram

```
                                          ┌──────────────────────┐
                                          │   Cloudflare (CDN)   │
              Browser ─────────HTTPS──────│  apex + www proxied  │
                                          │  Cache rule:         │
                                          │   bypass on session  │
                                          └──────────┬───────────┘
                                                     │ proxy
                                                     ▼
                          ┌──────────────────────────────────────────────────────┐
                          │  Servidor 3 (72.60.63.183) — Linux                   │
                          │  Nginx (443→127.0.0.1:3470)                          │
                          │                                                      │
                          │  ┌─── docker-compose: jol-net (172.20.0.0/16) ───┐  │
                          │  │                                                │  │
                          │  │  ┌─ jol-app ─────────────┐                     │  │
                          │  │  │ Next.js 16 standalone │                     │  │
                          │  │  │ Auth.js v5            │                     │  │
                          │  │  │ :3000 (→host :3470)   │                     │  │
                          │  │  └──┬────────────┬───────┘                     │  │
                          │  │     │            │                             │  │
                          │  │     ▼            ▼                             │  │
                          │  │  ┌─jol-db─┐   ┌─jol-redis─┐                    │  │
                          │  │  │PG 16   │   │ Redis 7   │                    │  │
                          │  │  │:5432   │   │ :6379     │                    │  │
                          │  │  │25M soc.│   │ idle      │                    │  │
                          │  │  └────────┘   └───────────┘                    │  │
                          │  └────────────────────────────────────────────────┘  │
                          └────────────┬─────────────────────┬────────────────────┘
                                       │                     │
                                       ▼                     ▼
                       ┌───────────────────────┐   ┌──────────────────────┐
                       │ MeiliSearch (shared)  │   │ Mailgun HTTP API     │
                       │ 195.35.40.29:7700     │   │ mg.juridicoonline... │
                       │ 65.7M empresas        │   │ DKIM/SPF/MX valid    │
                       └───────────────────────┘   └──────────────────────┘
```

## Data sources

| Source | Volume | Where |
|--------|--------|-------|
| **NewWay MeiliSearch** `empresas` | 65.7M docs | `195.35.40.29:7700` (shared) |
| **RFB Sócios (QSA) zips** | 7 files = 641MB | `/root/dados_socios/Socios*.zip` |
| **Postgres `Socio` table** | ~25M (importing) | `jol-db`, indexed by `cnpjBasico` + `nomeSlug` |
| **Postgres business tables** | small | `User`, `Lead`, `Session`, `Consultation`, etc |

## Container details

```yaml
jol-app:    image local, port 3000→3470 (loopback), depends_on db+redis
jol-db:     postgres:16-alpine, vol jol-db-data, port 5432→5470 (loopback), healthcheck
jol-redis:  redis:7-alpine, vol jol-redis-data, port 6379→6390 (loopback)
```

All bound to `127.0.0.1:*` only. Nginx host proxies 443 → 3470.

## Routes & rendering

| Route | Mode | Cache | Description |
|-------|------|-------|-------------|
| `/` | dynamic | edge 5min | Home |
| `/empresa/[slug]` | dynamic + ISR | edge 24h | Detalhe CNPJ — server gate de dados sensíveis |
| `/empresas` | static | edge 5min | Hub 27 UFs |
| `/empresas/[uf]` | dynamic + ISR | edge 24h | UF + top 50 cidades |
| `/empresas/[uf]/[slug]` | dynamic + ISR | edge 24h | Dispatcher: numérico→CNAE, alpha→município |
| `/cnae/[codigo]` | dynamic + ISR | edge 24h | Landing CNAE com top 50 empresas |
| `/socio/[slug]` | dynamic + ISR | edge 24h | Sócio + empresas via Postgres |
| `/buscar` | dynamic | edge 5min | Resultados MeiliSearch |
| `/cadastro` `/login` | dynamic | no-cache | Server action → Auth.js |
| `/unsubscribe` | dynamic | no-cache | LGPD opt-out newsletter |
| `/sitemap.xml` | dynamic | 1h | Index → child sitemaps |
| `/sitemaps/static` | static | 24h | Pages estáticas + UFs |
| `/sitemaps/uf/[uf]` | static | 24h | Top 5k empresas + 500 cidades por UF |
| `/sitemaps/cnae` | static | 24h | 1.3k CNAEs + 5.4k intersections UF×CNAE |
| `/api/auth/[...nextauth]` | dynamic | no-cache | Auth.js catch-all |
| `/robots.txt` | static | 1y | AI bots allowed |

## Auth flow (server-side strict)

```
[browser]                  [Next.js]              [Mailgun]            [Postgres]
   │                           │                      │                    │
   │── POST /cadastro ────────►│ (server action)      │                    │
   │                           │── upsert User ───────────────────────────►│
   │                           │── create Lead ───────────────────────────►│
   │                           │── signIn(nodemailer) ─►                   │
   │                           │── create VerifToken ─────────────────────►│
   │                           │                      │                    │
   │                           │── sendEmail() ─────►│                     │
   │                           │                      │── magic link email
   │                           │                      ▼
   │◄─── 302 /login/check-email                       │
   │                                                  │
   │── (user clicks link)                             │
   │── GET /api/auth/callback/email?token=X&email=Y ─►│
   │                           │── delete VerifToken ─────────────────────►│
   │                           │── create Session ────────────────────────►│
   │                           │── set __Secure-authjs.session-token cookie│
   │                           │── events.createUser ──┐                   │
   │                           │                       ├── sendWelcomeEmail
   │                           │                       └── notifyAdminSignup
   │◄──── 302 / (logged in)                                                 │
```

## Cache invalidation policy

| When | Action |
|------|--------|
| Code deploy | `curl -X POST .../purge_cache` (manual ou via CI) |
| New empresa indexada na NewWay | Aguarda revalidate=86400 OR force /sitemap.xml + GSC submit |
| Daily 04:00 UTC | `juridicoonline-seo.timer` warm + GSC + IndexNow ping |
| User logs in | CF bypassa via cookie rule, app retorna `no-cache` |

## Security headers (set in middleware.ts)

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: interest-cohort=(), browsing-topics=()
Vary: Cookie
```

## DNS records (Cloudflare zone `juridicoonline.com.br`)

```
A     juridicoonline.com.br        72.60.63.183       proxied
A     www                          72.60.63.183       proxied
TXT   mg                           v=spf1 include:mailgun.org ~all
TXT   smtp._domainkey.mg           k=rsa; p=MIGfMA0GCSqGS...
CNAME email.mg                     mailgun.org
MX    mg                           10 mxa.mailgun.org
MX    mg                           10 mxb.mailgun.org
```

## SSL

- **Edge ↔ origin**: Cloudflare "Full" mode, self-signed cert no nginx (`/etc/nginx/ssl/juridicoonline/`)
- **Client ↔ Edge**: Cloudflare-issued cert (Universal SSL)
- **Always HTTPS**: ON (auto-redirect 80→443)

## Key design decisions

1. **Postgres mirror for Sócios** (não MeiliSearch) — query por nome exato é melhor com BTREE index. Full-text de empresa fica em Meili.
2. **NewWay shared (não local)** — 33GB de dados, replicar custaria muito disco. Latência ~ok via internet.
3. **Standalone Next build** — imagem Docker fica < 200MB sem `node_modules` completo.
4. **Database sessions (não JWT)** — pra conseguir invalidar uma sessão sem rotacionar AUTH_SECRET.
5. **CF cache bypass on cookie** — alternativa ao SSR sempre dinâmico; mantém performance pra anônimos.
6. **Server-side gate ANTES de render** — apaga campo do objeto, garante que telefone NUNCA vai pro HTML cacheado.

## See also

- [`OPERATIONS.md`](./OPERATIONS.md) — runbook
- [`SEO_STRATEGY.md`](./SEO_STRATEGY.md) — playbook gray-hat
- [`CLAUDE.md`](./CLAUDE.md) — AI guide
