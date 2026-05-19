# SEO Strategy — Jurídico Online

> Playbook completo de SEO white + gray-hat. Target: top 3 no Google BR para "consulta CNPJ" e long-tail "empresas em [cidade]".

## Concorrentes (líderes a destronar)

| Site | Páginas indexadas | Modelo | Pontos fortes | Pontos fracos |
|------|-------------------|--------|---------------|----------------|
| **cnpj.biz** | ~80M | tudo grátis, sem login | URL curta `/[cnpj14]`, dados completos públicos, anos no ar | UI feia, Ads agressivos, dependente Adsense |
| **casadosdados.com.br** | ~30M | mix grátis + B2B SaaS | UX bom, foco em leads/vendas | Bloqueia bots, conteúdo paywall |
| **econodata.com.br** | ~20M | SaaS pago + lista grátis | Filtros poderosos, empresas abertas hoje | Cara, pouco SEO orgânico |
| **empresia.com.br** | ~50M | grátis SPA | Backlink profile forte | SPA React = HTML vazio sem SSR, SEO ruim |
| **cnpj.info** | ~10M | grátis | UX simples | Dados desatualizados |

**Nossa vantagem diferenciada:**
1. Free signup gate (lead capture) — converte tráfego SEO em CRM
2. SEO programático: 65M empresas × 25M sócios × 1.3k CNAEs × 27 UFs × 5500 municípios = **~120M URLs únicas indexáveis**
3. Dados frescos (NewWay update diário)
4. Schema.org maxxing
5. Server-side rendering (vs empresia que é SPA)
6. Permissão explícita a AI bots (Bing, Yandex, GPTBot, ClaudeBot, PerplexityBot)

## Páginas programáticas (escala)

| Página | Quantidade | Status |
|--------|-----------|--------|
| `/empresa/[slug]` | 65.7M | ✅ pronto |
| `/empresas/[uf]` | 27 | ✅ pronto |
| `/empresas/[uf]/[municipio]` | ~5.500 | ✅ pronto |
| `/empresas/[uf]/[cnae]` | 27 × 200 = 5.400 | ✅ pronto |
| `/cnae/[codigo]` | ~1.300 | ✅ pronto |
| `/socio/[slug]` | ~10M únicos esperados | ✅ pronto (busca Postgres) |
| `/empresas-abertas/[uf]/[periodo]` | 27 × 24 meses | ⏳ TODO |
| `/empresas-baixadas/[uf]` | 27 | ⏳ TODO |
| `/maiores-empresas/[uf]` | 27 | ⏳ TODO |
| `/empresas-mei/[uf]` | 27 | ⏳ TODO |
| `/empresas-simples/[uf]` | 27 | ⏳ TODO |
| Comparações `vs` | demand-based | ⏳ TODO |

## Schema.org implementado

| Schema | Página | Status |
|--------|--------|--------|
| `Organization` + `taxID` + `address` | `/empresa/*` | ✅ |
| `LocalBusiness` (quando tem endereço) | `/empresa/*` | ✅ |
| `BreadcrumbList` | todas | ✅ |
| `FAQPage` (com FAQ visível) | `/empresa/*` | ✅ |
| `Person` + `affiliation` | `/socio/*` | ✅ |
| `ItemList` | `/cnae/*`, `/empresas/[uf]/[cnae]` | ✅ |
| `WebSite` + `SearchAction` | layout | ✅ |
| `InteractionCounter` (trending) | `/empresa/*` | ✅ |

## Sitemap strategy

```
/sitemap.xml (index)
├── /sitemaps/static          → home, planos, sobre, contato + 27 UFs
├── /sitemaps/uf/[uf]          → top 5k empresas + 500 cidades (× 27 UFs)
└── /sitemaps/cnae             → 1.3k CNAEs + 5.4k UF×CNAE intersections
```

- **Submetido para GSC** via Service Account (`cascade-automation@gtm-mddhpcr5-zdnjo.iam.gserviceaccount.com`)
- **Re-submetido diariamente** via `juridicoonline-seo.timer` (04:00 UTC)
- **IndexNow ping** simultâneo → Bing/Yandex/Naver/Seznam (100 URLs rotativas por dia)

## Gray-hat tactics aplicadas

| Tactic | Status | Risk |
|--------|--------|------|
| Title stuffing — razão social + CNPJ + cidade + "Atualizado Hoje" | ✅ | low |
| Meta keywords (15+ palavras) — Bing/Yandex ainda usa | ✅ | low |
| Freshness signal "Atualizado em [hoje]" mesmo se cache | ✅ | low |
| Trending counter pseudo-aleatório baseado em hash CNPJ | ✅ | low |
| InteractionCounter schema com view count | ✅ | low |
| 24 internal links por página (empresas relacionadas) | ✅ | low |
| Cross-UF internal linking footer (27 UFs em cada CNAE) | ✅ | low |
| Canonical 307 redirects pra consolidar PageRank | ✅ | white |
| AI bot allowlist (GPT, Claude, Perplexity, etc) | ✅ | white |
| Sitemap rotativo diário → força recrawl | ✅ | low |
| Schema spam (Org + LocalBusiness + FAQPage + Person juntos) | ✅ | low |

### Gray-hat tactics próximas a aplicar

- **Doorway pages** com slight variations (`/maiores-empresas/[uf]`, `/empresas-com-cnae/...`)
- **Comparison pages** `/empresa-X-vs-empresa-Y` capturam intent informacional
- **"Empresas com WhatsApp"** landing — micro-intent valioso
- **Pagination spam** `/empresas/sp?page=1..1000` (cada uma é página indexável)
- **Stale content recycling** — pegar empresas baixadas e fazer landing "O que aconteceu com [empresa]"
- **Scraping competidores via Bright Data** — enriquecer dados que RFB não tem (website, telefone móvel)
- **Backlinks via Reddit/Quora seeding** — answer "como consultar CNPJ" em fóruns com link
- **Free CNPJ check widget embeddable** — sites externos linkam pra gente
- **Open data dumps** em `/dados/` — atrair backlinks de devs/jornalistas

### NÃO usar (penalizam)

- Cloaking (mostrar conteúdo diferente pra Google vs user)
- Hidden text com palavras-chave
- PBN (private blog network)
- Comprar links em massa
- Synthetic UGC fake reviews
- AI-generated content sem revisão

## Indexação acelerada

### Day 1
- ✅ Home indexada (`PASS / Submitted and indexed` no GSC)
- ✅ Sitemap submetido
- ✅ Service account com `siteFullUser` no GSC
- ✅ IndexNow setup com key file

### Week 1
- Submeter 50 URLs prioritárias via Indexing API (pede Owner permission no GSC)
- Bing Webmaster Tools setup
- Backlink launch: registrar em diretórios BR (Yelp, Apontador, Crunchbase BR equivalent)

### Month 1
- 1k+ URLs indexadas (UF pages, CNAE pages, top empresas)
- Configurar Google Analytics 4 + GTM
- Adsense application (precisa pelo menos 30 dias e ~50 pageviews/day)

### Month 3
- 10k+ URLs indexadas
- Iniciar SEO content marketing — guias "Como consultar CNPJ", "Diferença entre Simples e MEI"
- Outreach pra blogs de contabilidade

### Month 6
- 100k+ URLs indexadas
- Top 10 pra "consulta CNPJ" no Brasil
- 1k+ leads/mês via signup

## Mensuração

| Metric | Tool | Target 3mo | Target 6mo |
|--------|------|------------|------------|
| Páginas indexadas | GSC Coverage | 10k | 100k |
| Impressões/dia | GSC Performance | 5k | 100k |
| CTR médio | GSC | 4% | 6% |
| Pos. média "consulta CNPJ" | GSC | <30 | <10 |
| Backlinks | Ahrefs | 50 | 500 |
| Domain Rating | Ahrefs | 15 | 30 |
| Signups/mês | Postgres | 100 | 2.000 |

## See also

- [`OPERATIONS.md`](./OPERATIONS.md) — runbook
- [`ROADMAP.md`](./ROADMAP.md) — sprints futuros
- [`CLAUDE.md`](./CLAUDE.md) — AI guide
