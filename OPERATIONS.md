# Operations Runbook — Jurídico Online

## Daily checks

```bash
# 1) Containers running
docker ps --filter "name=jol-" --format "table {{.Names}}\t{{.Status}}"

# 2) Recent signups
docker exec jol-db psql -U jol -d juridicoonline -c \
  "SELECT email, name, purpose, \"createdAt\" FROM \"Lead\" ORDER BY \"createdAt\" DESC LIMIT 10;"

# 3) Cron last run
systemctl list-timers juridicoonline-seo.timer --no-pager

# 4) Disk
df -h /
du -sh /var/lib/docker/volumes/jol_jol-db-data
```

## Deploy a new version

```bash
cd /root/CascadeProjects/juridicoonline
git pull origin main
docker compose build jol-app
docker compose up -d --force-recreate jol-app
# Wait 10s, verify
sleep 10
docker logs jol-app --tail 20
# Purge CF cache
CF_TOKEN="<seu-token-cf>"
ZONE="<zone-id>"
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \
  -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
  -d '{"purge_everything":true}'
```

## Backup

```bash
# Postgres dump (run from host)
docker exec jol-db pg_dump -U jol -d juridicoonline -Fc -f /tmp/jol-$(date +%F).dump
docker cp jol-db:/tmp/jol-$(date +%F).dump /backups/

# Restore
docker exec -i jol-db pg_restore -U jol -d juridicoonline --clean --if-exists < /backups/jol-2026-05-19.dump
```

## Sócios import (one-time / re-run)

```bash
# 1) Truncate first if re-running
docker exec jol-db psql -U jol -d juridicoonline -c 'TRUNCATE "Socio";'

# 2) Run import (background)
PG_PWD=$(grep ^POSTGRES_PASSWORD /root/CascadeProjects/juridicoonline/.env | cut -d= -f2)
DATABASE_URL="postgresql://jol:${PG_PWD}@127.0.0.1:5470/juridicoonline" \
  nohup python3 /root/CascadeProjects/juridicoonline/scripts/import_socios.py \
  > /tmp/socios_import.log 2>&1 &

# 3) Monitor
docker exec jol-db psql -U jol -d juridicoonline -At -c "SELECT COUNT(*) FROM \"Socio\";"
tail -f /tmp/socios_import.log
```

Estimativa: ~25M registros em ~30min (~11k/s com COPY).

## Troubleshooting

### Login não persiste / Header mostra "Entrar" mesmo logado

1. Verify cookie no browser: deve ter `__Secure-authjs.session-token`
2. Verify session no DB:
   ```sql
   SELECT u.email, s.expires FROM "Session" s JOIN "User" u ON s."userId" = u.id;
   ```
3. Verify CF cache rule existe:
   ```bash
   curl -s "https://api.cloudflare.com/client/v4/zones/$ZONE/rulesets/phases/http_request_cache_settings/entrypoint" \
     -H "Authorization: Bearer $CF_TOKEN" | python3 -m json.tool | grep -A 3 expression
   ```
4. Force purge: `curl -X POST .../purge_cache -d '{"purge_everything":true}'`
5. Check middleware:
   ```bash
   curl -skI -H "Cookie: __Secure-authjs.session-token=fake" https://juridicoonline.com.br/ | grep -i cache-control
   # Should show: private, no-cache
   ```

### Magic link não chega ou já foi usado

- Gmail pré-busca links → token consumido antes user clicar
- Workaround: copiar URL pra address bar (sem clicar no Gmail)
- TODO: implementar página `/api/auth/verify` com botão "Confirmar"

### Mailgun erros

```bash
# Verify domain status
curl --user "api:$MAILGUN_API_KEY" \
  https://api.mailgun.net/v4/domains/mg.juridicoonline.com.br | python3 -m json.tool

# Logs de envio (últimos 100)
curl --user "api:$MAILGUN_API_KEY" \
  "https://api.mailgun.net/v3/mg.juridicoonline.com.br/events?limit=100" | python3 -m json.tool
```

### Container crashou

```bash
docker compose logs jol-app --tail 100
docker compose restart jol-app
# Last resort:
docker compose down && docker compose up -d
```

### DB lock / slow query

```bash
docker exec jol-db psql -U jol -d juridicoonline -c \
  "SELECT pid, query, query_start, state FROM pg_stat_activity WHERE state != 'idle';"
```

### MeiliSearch lento ou indisponível

```bash
curl -s http://195.35.40.29:7700/health
curl -s "http://195.35.40.29:7700/indexes/empresas/stats" -H "Authorization: Bearer masterKey"
# Falls back gracefully: helpers return empty arrays
```

## Common admin tasks

### Block email do JOL (LGPD removal)

```sql
UPDATE "User" SET "newsletterOptIn" = false WHERE email = 'foo@example.com';
DELETE FROM "User" WHERE email = 'foo@example.com';  -- só se solicitação formal
```

### Promote user to paid plan

```sql
UPDATE "User" SET plan = 'pro' WHERE email = 'paid@user.com';
```

### Check signup conversion

```sql
SELECT
  DATE("createdAt") as dia,
  COUNT(*) as signups,
  COUNT(DISTINCT purpose) as purposes
FROM "Lead"
GROUP BY DATE("createdAt")
ORDER BY dia DESC
LIMIT 30;
```

### Top consulted CNPJs (last 7d)

```sql
SELECT cnpj, COUNT(*) as views
FROM "Consultation"
WHERE "createdAt" > NOW() - INTERVAL '7 days'
GROUP BY cnpj
ORDER BY views DESC LIMIT 20;
```

## Disaster Recovery

### Whole server down

1. Verify DNS: `dig +short juridicoonline.com.br` should return Cloudflare IPs
2. SSH to backup server (Servidor 2 — `62.72.63.93`)
3. Restore from `/backups/jol-latest.dump`
4. Update Cloudflare DNS to point to backup IP

### Postgres data corruption

1. Stop `jol-app` to prevent writes: `docker compose stop jol-app`
2. Backup current state: `docker exec jol-db pg_dump -U jol -d juridicoonline -Fc -f /tmp/emergency.dump`
3. Restore last good backup
4. Re-run `npx prisma migrate deploy` if schema changed
5. Re-import sócios if Socio table corrupt

### Mailgun blocked / sender reputation drop

1. Check via Postmaster Tools (Google/Microsoft)
2. Reduce sending rate, only transactional
3. Switch fallback provider (configurar Resend ou Postmark como backup)

## Cost monitoring (current estimates)

| Item | Monthly cost | Notes |
|------|--------------|-------|
| Servidor 3 (VPS) | ~R$ 150 | shared with other projects |
| Cloudflare | R$ 0 | free plan suficient até 100k pv/mo |
| Mailgun | R$ 0 | grátis até 5k/mês |
| GSC + Bing Webmaster | R$ 0 | grátis |
| Bright Data | ~R$ 100 | só usar se necessário |
| Total | **~R$ 250** | |

Quando crescer:
- Mailgun pago R$ 80/mo a partir de 5k emails
- Cloudflare Pro R$ 100/mo se precisar WAF
- Servidor dedicado R$ 500/mo a partir de 100k pv/dia
