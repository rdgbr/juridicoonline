# Plano de Expansão — Rede Jurídico

Documento estratégico para os projetos derivados do Jurídico Online (JOL).

> Atualizado: 20/05/2026

---

## Visão

Construir uma **rede de 3 sites** focados em dados públicos brasileiros, conectados via SSO, cross-promotion contextual e branding "Rede Jurídico":

| Domínio | Foco | Status |
|---------|------|--------|
| `juridicoonline.com.br` | Empresas / CNPJ / Sócios | ✅ Em produção |
| `licitascanner.com.br` | Licitações públicas (PNCP) | 🚧 Em desenvolvimento |
| `juridicoempauta.com.br` | Diários oficiais municipais/estaduais | 🚧 Em desenvolvimento |
| `juridicodoagro.com.br` | CAR + agronegócio (futuro) | 📋 Planejado |

## Por que domínios separados (não subdomínios)

1. **Topical authority** — Google premia foco em 1 vertical por domínio
2. **Brand entity recognition** — cada marca constrói reconhecimento próprio
3. **Penalty isolation** — HCU update em 1 não derruba os outros
4. **Network effect** — Google reconhece "network" (Stack Overflow / Wikipedia) e premia

Custo: ~R$ 40/ano por domínio (Registro.br). Negligível vs ganho de SEO.

---

## Stack compartilhada

Todos os 3 projetos usam **a mesma stack** do JOL:

- **Frontend**: Next.js 16 (App Router) + Tailwind v4 + Lucide
- **DB**: Postgres 16 (mesma instância, schemas separados)
- **Search**: Meilisearch (mesma instância 195.35.40.29:7700, índices separados)
- **Auth**: Auth.js v5 magic link (mesma `User` table → SSO automático)
- **Email**: Mailgun (mesma config, mesma domain)
- **CDN**: Cloudflare (uma zone por domínio)
- **Deploy**: Docker compose (servidor 3, portas 3471 e 3472)
- **GitHub**: 2 novos repos públicos sob `rdgbr/`

---

## SSO entre os 3 sites

Como `juridicoonline.com.br`, `licitascanner.com.br` e `juridicoempauta.com.br` são domínios diferentes, não dá pra compartilhar cookies via `domain=.example.com`. Solução:

### Approach: OAuth próprio com JOL como Identity Provider

```
LicitaScanner / JeP                    Jurídico Online
─────────────────                      ───────────────
Click "Entrar com JOL"  ───────────►  /api/auth/oauth/authorize
                                       (gera code, redirect back)
                                              │
                       ◄───────────────────────┘
                              ?code=xxx
                              │
                              ▼
                    /api/auth/oauth/callback
                              │
                              ▼ POST exchange code → token
                       /api/auth/oauth/token  (no JOL)
                              │
                              ▼
                    Recebe access_token + user data
                    Cria sessão local (cookie do próprio domain)
```

Stack: Implementar mini-IDP OAuth2 no JOL com Auth.js + custom routes. Tabela `OAuthClient` com `client_id` e `client_secret` por site.

**Modelo Suite (futuro)**: usuário Pro do JOL → Pro automático nos outros 2.

### Plano mais simples (Fase 1)

Cada site tem seu próprio Auth.js + magic link (mesma `User` table do Postgres compartilhado). Login independente em cada domínio. SSO implementa Fase 2.

---

## Cross-promotion contextual

| Origem | Destino | Quando aparece |
|--------|---------|----------------|
| JOL → LicitaScanner | Página de empresa | "Esta empresa venceu N licitações" + link |
| JOL → JeP | Página de sócio | "Aparece em diário oficial?" + alerts |
| LicitaScanner → JOL | Página de licitação | "CNPJ do órgão" + "Empresas que vencem este CNAE" |
| LicitaScanner → JeP | Página de licitação | "Ver publicação no Diário Oficial" |
| JeP → JOL | Ato de nomeação | "Ver CNPJ da pessoa/empresa nomeada" |
| JeP → LicitaScanner | Ato de licitação | "Ver edital completo" |

**Footer compartilhado** discreto em todos:
```
Rede Jurídico: Jurídico Online · Jurídico em Pauta · LicitaScanner
```

---

## Projeto 1: LicitaScanner (`licitascanner.com.br`)

### Fonte de dados
- **PNCP** (Portal Nacional de Contratações Públicas) — API REST oficial 100% aberta
- Base URL: `https://pncp.gov.br/api/consulta/v1/`
- Sem auth, sem token
- Volume: ~5.000 editais/dia novos
- Cobertura: TODAS as 3 esferas (federal + estadual + municipal)
- Lei 14.133/2021 obriga publicação

### Endpoints PNCP que vamos usar

```bash
# Editais por data + UF
GET /contratacoes/publicacao?dataInicial=20260520&dataFinal=20260520&uf=SP

# Atualização incremental (últimas 24h)
GET /contratacoes/atualizacao?dataInicial=20260519&dataFinal=20260520

# Detalhe de uma contratação
GET /orgaos/{cnpj}/compras/{ano}/{seq}

# Itens individuais
GET /orgaos/{cnpj}/compras/{ano}/{seq}/itens
```

### Schema Prisma

```prisma
model Licitacao {
  id                String   @id // PNCP numeroControle
  modalidade        String
  modalidadeId      Int
  objeto            String   @db.Text
  valorEstimado     Float?
  valorHomologado   Float?
  uasg              String?
  orgaoNome         String
  orgaoCnpj         String?
  municipio         String?
  uf                String?
  dataPublicacao    DateTime
  dataAbertura      DateTime?
  dataEncerramento  DateTime?
  situacao          String
  linkEdital        String?
  linkSistema       String?
  cnaePrincipal     String?
  raw               Json
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  itens             ItemLicitacao[]

  @@index([uf, dataPublicacao])
  @@index([cnaePrincipal])
  @@index([modalidadeId])
  @@index([situacao])
}

model ItemLicitacao {
  id            String     @id @default(cuid())
  licitacaoId   String
  licitacao     Licitacao  @relation(fields: [licitacaoId], references: [id], onDelete: Cascade)
  numero        Int
  descricao     String     @db.Text
  unidade       String?
  quantidade    Float?
  valorUnitario Float?
  valorTotal    Float?
}

model AlertaLicitacao {
  id        String   @id @default(cuid())
  userId    String   // FK pro User compartilhado
  term      String
  uf        String?
  cnaeFilter String?
  valorMin  Float?
  valorMax  Float?
  channels  String[] @default(["email"])
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([active])
}
```

### Páginas (URL → o que mostra → SEO)

| URL | Conteúdo | Volume |
|-----|----------|--------|
| `/` | Home: busca + hoje + featured | 1 |
| `/buscar?q=X` | Busca full-text + filtros | ∞ |
| `/[uf]` | Listagem por estado | 27 |
| `/[uf]/[municipio]` | Por município | ~5.570 |
| `/categoria/[cnae]` | Por categoria (CNAE) | ~1.300 |
| `/[uf]/[municipio]/[cnae]` | UF × município × categoria | ~milhões |
| `/edital/[id]` | Detalhe completo | ~3M+ acumulado |
| `/orgao/[cnpj]` | Página do órgão público | ~50.000 |
| `/alertas` (gated) | Configurar alertas | 1 |
| `/api` | Documentação API REST | 1 |
| `/blog` | Conteúdo SEO sobre licitações | 10 posts inicial |

### Worker de importação

```python
# scripts/pncp_importer.py
# Roda a cada 1h via cron
# 1. GET /contratacoes/atualizacao (últimas 2h)
# 2. Upsert no Postgres
# 3. Indexar no Meili (índice "licitacoes")
# 4. Trigger alertas: cada AlertaLicitacao ativo, check matches
# 5. Enviar emails de alertas via Mailgun
```

### Monetização

- **Free**: busca + visualização + 5 alertas
- **Pro R$ 29/mês**: alertas ilimitados, filtros avançados, export CSV
- **Business R$ 149/mês**: API + webhook + multi-usuário
- **Enterprise**: dados históricos + integração CRM

### Concorrentes (mapeados)

| Player | Modelo | Gap que exploramos |
|--------|--------|--------------------|
| Effecti | Pago R$ 99-499/mês | SEO ruim, sem free tier |
| ComprasGov.com.br | Free mas UX horrível | Não há alertas, SEO inexistente |
| LicitaFácil | Pago | Sem free, sem SEO |
| BLL Compras | Pago | Foco em fornecedores grandes |

**Nosso diferencial**: free + SEO programático + alertas + cross-link rede.

### Effort
~25h (3-4 dias intensos) para MVP funcional.

---

## Projeto 2: Jurídico em Pauta (`juridicoempauta.com.br`)

### Fonte de dados

#### Querido Diário (Open Knowledge Brasil)
- Open source MIT — https://github.com/okfn-brasil/querido-diario
- API pública: `https://queridodiario.ok.org.br/api`
- Cobertura atual: **~750 municípios** (de 5.570)
- Inclui TODAS as capitais + cidades grandes
- Cresce ~30 municípios/mês
- Já fazem OCR e disponibilizam `.txt`

#### Endpoints Querido Diário

```bash
# Lista municípios disponíveis
GET https://queridodiario.ok.org.br/api/cities

# Diários de um município (territory_id = código IBGE)
GET https://queridodiario.ok.org.br/api/gazettes?territory_ids=4205407&size=50

# Busca full-text em SP
GET https://queridodiario.ok.org.br/api/gazettes?territory_ids=3550308&querystring=licitação
```

#### Fonte secundária: scrapy spiders próprios (Fase 2)

Quando atingir tração, forkar repo e rodar spiders próprios pra cobrir municípios faltantes (~4.800).

### Schema Prisma

```prisma
model DiarioOficial {
  id            String   @id @default(cuid())
  territoryId   String   // IBGE 7 dígitos
  municipio     String
  uf            String
  date          DateTime
  edition       String?
  url           String   // URL original do PDF
  txtUrl        String?  // URL do texto extraído
  pageCount     Int?
  scrapedAt     DateTime?
  publishedAt   DateTime @default(now())
  
  atos          Ato[]
  
  @@unique([territoryId, date, edition])
  @@index([uf, date])
  @@index([municipio])
  @@index([date])
}

model Ato {
  id        String         @id @default(cuid())
  diarioId  String
  diario    DiarioOficial  @relation(fields: [diarioId], references: [id], onDelete: Cascade)
  type      AtoType
  title     String         @db.Text
  excerpt   String         @db.Text
  body      String         @db.Text
  entities  Json?          // [{type:"person", name:"João Silva", cpf:"***.123.456-**"}]
  page      Int?
  
  @@index([type])
  @@index([diarioId])
}

enum AtoType {
  NOMEACAO
  EXONERACAO
  LICITACAO
  CONCURSO
  PORTARIA
  DECRETO
  CONTRATO
  EDITAL
  OUTRO
}

model AlertaDiario {
  id        String   @id @default(cuid())
  userId    String
  term      String   // pode ser nome, CPF mascarado, CNPJ, palavra-chave
  territoryFilter String[] // IBGE codes específicos (vazio = todos)
  channels  String[] @default(["email"])
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([term])
  @@index([active])
}
```

### Páginas

| URL | Conteúdo | Volume |
|-----|----------|--------|
| `/` | Home + busca + últimos diários | 1 |
| `/buscar?q=X` | Busca full-text + filtros | ∞ |
| `/[uf]` | Estados | 27 |
| `/[uf]/[municipio]` | Município (lista diários) | ~750 |
| `/[uf]/[municipio]/[YYYY-MM-DD]` | Diário do dia | ~milhões |
| `/atos/nomeacao/[uf]/[municipio]` | Nomeações | ~milhares |
| `/atos/exoneracao/[uf]/[municipio]` | Exonerações | ~milhares |
| `/atos/concurso/[uf]/[municipio]` | Concursos | ~milhares |
| `/atos/licitacao/[uf]/[municipio]` | Licitações (cross-link LicitaScanner) | ~milhares |
| `/ato/[id]` | Ato individual | ~milhões |
| `/alertas` (gated) | "Me avise se meu nome aparecer" | 1 |
| `/blog` | Conteúdo SEO direito administrativo | 10 posts |

### Worker de importação

```python
# scripts/qd_importer.py
# Roda a cada 4h via cron
# 1. GET /api/cities (descobre novos municípios)
# 2. Pra cada município ativo, GET /api/gazettes?territory_ids=X&after=ULTIMA_DATA
# 3. Pra cada diário novo:
#    - Download .txt
#    - NER simples: extrair nomes (capitalize), CPFs (regex masked), CNPJs (regex)
#    - Detectar tipo de ato por regex: "nomeação", "exoneração", "concurso", etc
#    - Save Ato rows
#    - Index no Meili (índice "atos")
# 4. Trigger alertas: cada AlertaDiario ativo, check matches no novo conteúdo
```

### Monetização

- **Free**: busca + 3 alertas
- **Pro R$ 19/mês**: alertas ilimitados + RSS + export
- **Business R$ 99/mês**: API + relatórios mensais + webhook
- **Enterprise**: integração jurídica

### Concorrentes

| Player | Modelo | Gap |
|--------|--------|-----|
| JusBrasil | Foco em judiciário | Não cobre executivo municipal |
| e-diariooficial.com | Pago | Site ruim, sem SEO |
| alertadiario.com.br | Pago | Cobertura limitada |
| Querido Diário (OKBR) | ONG, sem UX comercial | Sem alertas pra leigos, sem monetização |

### Effort
~40h (5-7 dias) para MVP funcional.

---

## Roadmap consolidado

### Sprint 1 (semana 1)
- [x] Plano detalhado (este documento)
- [ ] Cloudflare zones: licitascanner.com.br + juridicoempauta.com.br
- [ ] GitHub repos públicos
- [ ] Boilerplate base compartilhado (`packages/shared` ou copy approach)
- [ ] LicitaScanner: schema + PNCP importer + páginas básicas
- [ ] Deploy beta LicitaScanner

### Sprint 2 (semana 2)
- [ ] Jurídico em Pauta: schema + QD client + páginas básicas
- [ ] Alerts worker pra ambos
- [ ] SSO mínimo (compartilha User table, login separado em cada)
- [ ] Deploy beta JeP
- [ ] Submit GSC pros 2

### Sprint 3 (mês 2)
- [ ] Polish ambos (OG, schemas, blog, planos)
- [ ] Cross-link contextual: empresa JOL ↔ licitação ↔ ato
- [ ] OAuth IdP no JOL pra SSO real
- [ ] Stripe wired
- [ ] Adsense

### Sprint 4+ (mês 3+)
- [ ] Spiders próprios pro JeP cobrir mais municípios
- [ ] APIs PRO de ambos
- [ ] juridicodoagro.com.br (CAR + agro)

---

## Custos estimados

| Item | Custo/ano |
|------|-----------|
| Domínio licitascanner.com.br | ~R$ 40 |
| Domínio juridicoempauta.com.br | ~R$ 40 |
| Domínio juridicodoagro.com.br | ~R$ 40 |
| Cloudflare (3 zones free) | R$ 0 |
| Postgres extras (compartilhado) | R$ 0 |
| Meilisearch extras (compartilhado) | R$ 0 |
| Mailgun (compartilhado, dentro do plano free) | R$ 0 |
| Servidor 3 (já existe) | R$ 0 extra |
| **Total infra extra/ano** | **~R$ 120** |

---

## Métricas de sucesso (6 meses)

| Site | Visitas/dia | Cadastros | Pagantes | MRR |
|------|-------------|-----------|----------|-----|
| JOL | 5.000 | 2.000 | 30 | R$ 1.500 |
| LicitaScanner | 1.500 | 500 | 15 | R$ 1.500 |
| Jurídico em Pauta | 2.000 | 800 | 20 | R$ 600 |
| **Total** | **8.500/dia** | **3.300** | **65** | **R$ 3.600/mês** |

**Estratégia long-game**: 12-18 meses pra atingir R$ 20k MRR somando os 3.

---

## Decisões pendentes

- [ ] User: registrar domínios + adicionar no Cloudflare (1 token API novo com permissão de zone:create OU adicionar via UI)
- [ ] User: confirmar nomes finais e taglines
- [ ] User: branding (logo, cores) — sugiro reusar pattern do JOL com variações
- [ ] Decisão SSO: Fase 1 (independente, mesmo banco) vs Fase 2 (OAuth real)
