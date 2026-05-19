# Jurídico Online

Consulta gratuita de empresas brasileiras — 65 milhões de CNPJs (Receita Federal) + 25M sócios (QSA), com gate free signup pra liberar telefones/emails/quadro societário completo.

🌐 **Production**: https://juridicoonline.com.br

## Stack

- **Frontend**: Next.js 16 (standalone) + Tailwind v4 + Lucide icons
- **Auth**: Auth.js v5 (magic link via Mailgun, opcional Google OAuth)
- **DB**: Postgres 16 + Redis 7 (dockerized, isolated)
- **Search**: MeiliSearch shared (NewWay 195.35.40.29:7700)
- **CDN**: Cloudflare proxied, cache bypass on session cookie
- **Email**: Mailgun HTTP API (mg.juridicoonline.com.br)
- **SEO**: Sitemap index + 3 children (static, per-UF, CNAE) + JSON-LD maxxing
- **Hosting**: Servidor 3 (72.60.63.183) via docker-compose

## Quick start

```bash
git clone https://github.com/rdgbr/juridicoonline.git
cd juridicoonline
cp .env.example .env  # preencher credentials
docker compose up -d
npx prisma migrate deploy
npm install && npm run dev
```

Acesso: http://localhost:3000

## Documentação

| Arquivo | O que é |
|---------|---------|
| [`CLAUDE.md`](./CLAUDE.md) | Guia para AI agents — context, conventions, common tasks |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Diagramas, fluxos, decisões técnicas |
| [`SEO_STRATEGY.md`](./SEO_STRATEGY.md) | Playbook gray-hat + concorrentes + táticas |
| [`OPERATIONS.md`](./OPERATIONS.md) | Runbook, troubleshooting, deploy |
| [`ROADMAP.md`](./ROADMAP.md) | Sprints futuros, KPIs, riscos |

## Páginas principais

- `/` — Home com busca
- `/empresa/[slug]` — Detalhe CNPJ (server-side gate)
- `/empresas/[uf]` — Hub UF
- `/empresas/[uf]/[slug]` — Município ou CNAE (dispatcher numérico vs alpha)
- `/cnae/[codigo]` — Landing por atividade econômica
- `/socio/[slug]` — Pessoa + empresas onde é sócio
- `/buscar` — Resultados textuais
- `/cadastro` / `/login` — Auth.js magic link
- `/sitemap.xml` — Sitemap index dinâmico

## Cron diário (04:00 UTC)

- Warm sitemaps (3 children + 27 UFs)
- Re-submit pra Google Search Console
- IndexNow ping (Bing/Yandex/Naver/Seznam) com 100 URLs rotativas

Status: `systemctl status juridicoonline-seo.timer`

## License

Proprietary. Todos os dados disponibilizados são públicos da Receita Federal (CNPJ + QSA).
