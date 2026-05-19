#!/bin/bash
# Daily SEO maintenance — runs via systemd timer
# - Warms sitemap caches (so they're fresh for next 24h)
# - Submits sitemap to GSC
# - Pings IndexNow with rotating priority URLs (Bing/Yandex/Naver crawl trigger)
# - Logs to /var/log/juridicoonline-seo.log

set -e
LOG=/var/log/juridicoonline-seo.log
exec > >(tee -a "$LOG") 2>&1
echo "════════════════════════════════════════════════════"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Daily SEO start"

SITE=https://juridicoonline.com.br
INDEXNOW_KEY=b8e1a5f6d4c3b2a190e8d7c6b5a4f3e2
GSC_KEY=/root/CascadeProjects/fdstributario/google-service-account.json

# 1) Warm sitemaps (force regeneration & populate CF edge)
echo "→ Warming sitemaps..."
for path in /sitemap.xml /sitemaps/static /sitemaps/cnae; do
    curl -sk -o /dev/null -w "  $path → %{http_code} (%{time_total}s, %{size_download}b)\n" "$SITE$path"
done
for uf in ac al am ap ba ce df es go ma mg ms mt pa pb pe pi pr rj rn ro rr rs sc se sp to; do
    curl -sk -o /dev/null -w "  /sitemaps/uf/$uf → %{http_code} (%{time_total}s)\n" "$SITE/sitemaps/uf/$uf"
done

# 2) Submit sitemap to Google Search Console
echo "→ Submitting sitemap to GSC..."
python3 - <<PY
from google.oauth2 import service_account
from googleapiclient.discovery import build
creds = service_account.Credentials.from_service_account_file("$GSC_KEY", scopes=["https://www.googleapis.com/auth/webmasters"])
svc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
svc.sitemaps().submit(siteUrl="$SITE/", feedpath="$SITE/sitemap.xml").execute()
print("  Sitemap submitted OK")
PY

# 3) IndexNow ping — rotating priority URLs
echo "→ Pinging IndexNow (Bing/Yandex/Naver)..."
python3 - <<PY
import urllib.request, json, random, datetime

KEY = "$INDEXNOW_KEY"
HOST = "juridicoonline.com.br"

ufs = ['ac','al','am','ap','ba','ce','df','es','go','ma','mg','ms','mt','pa','pb','pe','pi','pr','rj','rn','ro','rr','rs','sc','se','sp','to']
cnaes = ['4711301','4751201','5611201','9602501','4789099','7319002','7020400','4520001','4399103','4520003','4530703','4621400','4632001','4631100','4929901','6201500','6202300','6810201','7112000','7311400']

# Daily rotation: pick 100 URLs that change each day
seed = datetime.date.today().toordinal()
rng = random.Random(seed)

urls = [f"https://{HOST}/", f"https://{HOST}/empresas", f"https://{HOST}/planos", f"https://{HOST}/sitemap.xml"]
urls += [f"https://{HOST}/empresas/{u}" for u in ufs]
urls += [f"https://{HOST}/cnae/{c}" for c in rng.sample(cnaes, min(15, len(cnaes)))]
urls += [f"https://{HOST}/empresas/{u}/{c}" for u in rng.sample(ufs, 5) for c in rng.sample(cnaes, 4)]

payload = {"host": HOST, "key": KEY, "keyLocation": f"https://{HOST}/{KEY}.txt", "urlList": urls[:100]}
req = urllib.request.Request("https://api.indexnow.org/IndexNow", data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"}, method="POST")
try:
    r = urllib.request.urlopen(req, timeout=30)
    print(f"  IndexNow → HTTP {r.status} ({len(urls[:100])} URLs)")
except Exception as e:
    print(f"  IndexNow error: {e}")
PY

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Daily SEO done"
echo
