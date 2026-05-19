# Roadmap — Jurídico Online

## ✅ Phase 0 — Foundation (DONE)

- Next.js 16 stack
- Auth.js v5 + Prisma + Postgres + Redis (dockerized)
- MeiliSearch integration (65.7M empresas)
- RFB Sócios import (~25M registros) → Postgres
- Mailgun magic link + welcome + admin notification
- Cloudflare proxy + cache bypass on session
- 8 páginas SEO programáticas (empresa, UF, município, CNAE, sócio, UF×CNAE, etc)
- JSON-LD: Organization + LocalBusiness + Breadcrumb + FAQ + Person + ItemList + InteractionCounter
- Sitemap index + 3 children (static, per-UF, CNAE)
- Cron diário: warm + GSC submit + IndexNow
- Git push: github.com/rdgbr/juridicoonline
- Docs: CLAUDE.md, ARCHITECTURE.md, SEO_STRATEGY.md, OPERATIONS.md
- LGPD: /unsubscribe page + /lgpd compliance

## 🟡 Phase 1 — Polish & Conversion (próximas 2 semanas)

| Task | Why | Effort |
|------|-----|--------|
| `/api/auth/verify` page (POST confirmation) | Fix Gmail pre-fetch consumindo token | 2h |
| Migrate `middleware.ts` → `proxy.ts` (Next 16) | Próxima major do Next vai quebrar | 1h |
| Server actions com error states UX | Hoje só redireciona, melhor mostrar inline | 4h |
| OG image dinâmica `/api/og?cnpj=` | Link share visual nos socials | 3h |
| Logo PNG/favicon high-res | Falta favicon, manifest, apple-touch | 1h |
| Google Analytics 4 + GTM | Métricas reais | 2h |
| Google OAuth ativo | Login alternativo, > conversão | 1h (só config) |
| Welcome series (3 emails) | Onboarding | 3h |
| `/admin` panel | Ver leads, consultations, métricas | 8h |
| Painel "Minhas consultas" /perfil | User retention | 4h |

## 🟢 Phase 2 — SEO Scale (próximo mês)

| Task | Why | Effort |
|------|-----|--------|
| `/empresas-abertas/[uf]/[periodo]` (27 × 24 = 648 landings) | High intent | 6h |
| `/empresas-baixadas/[uf]` | Long tail | 4h |
| `/maiores-empresas/[uf]` (top 100 por UF) | Authority pages | 4h |
| `/empresas-mei/[uf]` + `/empresas-simples/[uf]` | Filtros = páginas | 4h |
| Blog `/blog/[slug]` (10 posts iniciais) | E-E-A-T + topics | 20h |
| FAQ "Hub" `/perguntas/...` | Featured snippets | 8h |
| Comparações `/comparar/[a]-vs-[b]` | Demanda comparativa | 6h |
| Bing Webmaster Tools setup | Yandex + Bing extras | 1h |
| `/dados/` open dumps (.csv) | Backlinks orgânicos | 4h |
| Bright Data scraper para enrich (telefone móvel, website) | Dados extras | 12h |

## 🔵 Phase 3 — Monetization (mês 2-3)

| Task | Why | Effort |
|------|-----|--------|
| API REST v1 com Bearer token + rate limit | Receita B2B | 16h |
| Stripe ou Mercado Pago | Billing | 8h |
| Plano Pro/Business UI | Upsell | 8h |
| Export CSV | Feature paga clássica | 6h |
| Alertas (novos CNPJs matching filtro) | Retention + premium | 12h |
| Adsense slots | Receita ads grátis | 4h |
| Hermes CRM webhook | Leads → CRM automático | 4h |

## 🟣 Phase 4 — Differentiation (mês 4+)

| Task | Why | Effort |
|------|-----|--------|
| PGFN dívidas integration | Diferencial competitivo | 16h |
| CARF integration (notícias jurisprudência) | Tax/legal niche | 20h |
| Newsletter "Radar Empresarial" real | Marketing | 8h |
| Multilingual (en/, es/) | Bots AI internacionais | 16h |
| AI Chat "Pergunte ao Jurídico" | Wow factor | 24h |
| Junta Comercial integrations (SP/SC/MG) | Dados antes RFB | 24h |
| Empresas similares ML | Engagement | 16h |
| Mobile PWA | App-like UX | 12h |

## 🔴 Risk register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Cloudflare blocking heavy traffic | medium | high | Move to Cloudflare Pro ($20/mo) before 100k pv/day |
| RFB legal challenge (data delisting) | low | high | LGPD compliance OK, /lgpd page, opt-out fácil |
| Competitor (cnpj.biz) buying ads on our brand | medium | medium | Reserve trademark, Google brand alerts |
| NewWay MeiliSearch shutdown | low | critical | Mirror to own instance se receita ≥ R$5k/mo |
| Mailgun blacklist | low | high | Implementar Resend como fallback |
| Tráfego sem conversão | medium | medium | A/B test gates (mais hard / mais soft) |
| Disco cheio (volume Postgres cresce) | high | medium | Monitor + alert at 85% + cleanup velhos Consultations |

## 📊 KPIs (revisão mensal)

| KPI | Today | M+1 | M+3 | M+6 | M+12 |
|-----|-------|-----|-----|-----|------|
| Páginas indexadas | 1 | 1k | 10k | 100k | 1M+ |
| Visitas/dia | 0 | 50 | 500 | 5k | 30k |
| Signups/mês | 1 | 50 | 500 | 2k | 10k |
| MRR (R$) | 0 | 0 | 0 | 500 | 5k |
| Domain Rating (Ahrefs) | 0 | 5 | 15 | 30 | 50 |

## See also

- [`SEO_STRATEGY.md`](./SEO_STRATEGY.md) — playbook detalhado
- [`OPERATIONS.md`](./OPERATIONS.md) — runbook
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — diagramas
