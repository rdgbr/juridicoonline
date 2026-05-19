#!/usr/bin/env python3
"""
Import RFB Sócios zips → Postgres jol-db.

Streams each CSV inside the zips (latin-1, semicolon-delimited) and bulk-inserts
into the Socio table using COPY for performance. ~25M registros estimados.

Layout RFB (Socios K3241):
  0  CNPJ_BASICO              (8 dígitos)
  1  IDENTIFICADOR_SOCIO      (1=PJ, 2=PF, 3=Estrangeiro)
  2  NOME_SOCIO_RAZAO_SOCIAL
  3  CNPJ_CPF_SOCIO           (mascarado)
  4  QUALIFICACAO_SOCIO       (código)
  5  DATA_ENTRADA_SOCIEDADE   (YYYYMMDD)
  6  PAIS                     (código país)
  7  REPRESENTANTE_LEGAL_CPF
  8  NOME_REPRESENTANTE
  9  QUALIFICACAO_REPRESENTANTE
  10 FAIXA_ETARIA             (1-9)

Usage:
    docker exec -it jol-db psql -U jol -d juridicoonline -c "TRUNCATE \"Socio\";"
    python3 scripts/import_socios.py
"""
import os
import sys
import zipfile
import csv
import io
import re
import time
import unicodedata
from pathlib import Path

import psycopg

DB_URL = os.environ.get("DATABASE_URL", "postgresql://jol:_PG_PWD_@127.0.0.1:5470/juridicoonline")
SOCIOS_DIR = Path("/root/dados_socios")
BATCH = 50_000


def slugify(text: str) -> str:
    if not text:
        return ""
    s = unicodedata.normalize("NFD", text).encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", s).strip().lower()
    s = re.sub(r"\s+", "-", s)
    return s[:120]


def gen_id() -> str:
    # cuid-ish: 25 chars, lowercase alphanumeric
    import random, string
    return "c" + "".join(random.choices(string.ascii_lowercase + string.digits, k=24))


def parse_row(row: list[str]) -> dict | None:
    try:
        cnpj_basico = (row[0] or "").strip()
        if not cnpj_basico or not cnpj_basico.isdigit():
            return None
        nome = (row[2] or "").strip()
        if not nome:
            return None
        ident = int(row[1]) if (row[1] or "").strip().isdigit() else 0
        qual = int(row[4]) if (row[4] or "").strip().isdigit() else None
        data_ent = (row[5] or "").strip() or None
        pais = (row[6] or "").strip() or None
        rep_cpf = (row[7] or "").strip() or None
        rep_nome = (row[8] or "").strip() or None
        qual_rep = int(row[9]) if (row[9] or "").strip().isdigit() else None
        faixa = int(row[10]) if len(row) > 10 and (row[10] or "").strip().isdigit() else None
        cnpj_cpf_socio = (row[3] or "").strip() or None
        return {
            "id": gen_id(),
            "cnpjBasico": cnpj_basico,
            "identificadorTipo": ident,
            "nome": nome[:255],
            "nomeSlug": slugify(nome),
            "cnpjCpfSocio": cnpj_cpf_socio,
            "qualificacao": qual,
            "qualificacaoDesc": None,
            "dataEntrada": data_ent,
            "pais": pais,
            "representanteCpf": rep_cpf,
            "representanteNome": rep_nome[:255] if rep_nome else None,
            "qualifRepresent": qual_rep,
            "faixaEtaria": faixa,
        }
    except Exception:
        return None


def bulk_insert(conn, rows: list[dict]) -> int:
    if not rows:
        return 0
    with conn.cursor() as cur:
        with cur.copy(
            'COPY "Socio" '
            '("id","cnpjBasico","identificadorTipo","nome","nomeSlug","cnpjCpfSocio",'
            '"qualificacao","qualificacaoDesc","dataEntrada","pais","representanteCpf",'
            '"representanteNome","qualifRepresent","faixaEtaria") FROM STDIN'
        ) as copy:
            for r in rows:
                copy.write_row(
                    (
                        r["id"], r["cnpjBasico"], r["identificadorTipo"], r["nome"], r["nomeSlug"],
                        r["cnpjCpfSocio"], r["qualificacao"], r["qualificacaoDesc"],
                        r["dataEntrada"], r["pais"], r["representanteCpf"],
                        r["representanteNome"], r["qualifRepresent"], r["faixaEtaria"],
                    )
                )
    return len(rows)


def import_zip(conn, zip_path: Path, stats: dict):
    print(f"\n📦 {zip_path.name} ({zip_path.stat().st_size / 1024 / 1024:.0f} MB)")
    with zipfile.ZipFile(zip_path) as zf:
        for name in zf.namelist():
            if name.endswith("/"):
                continue
            print(f"   → {name}")
            with zf.open(name) as f:
                wrapper = io.TextIOWrapper(f, encoding="latin-1", newline="")
                reader = csv.reader(wrapper, delimiter=";", quotechar='"')
                batch = []
                for row in reader:
                    parsed = parse_row(row)
                    if not parsed:
                        stats["skipped"] += 1
                        continue
                    batch.append(parsed)
                    if len(batch) >= BATCH:
                        n = bulk_insert(conn, batch)
                        conn.commit()
                        stats["inserted"] += n
                        rate = stats["inserted"] / max(1, time.time() - stats["t0"])
                        print(f"     ✓ {stats['inserted']:>12,} ({rate:.0f}/s)", end="\r", flush=True)
                        batch = []
                if batch:
                    n = bulk_insert(conn, batch)
                    conn.commit()
                    stats["inserted"] += n
                print(f"     ✓ {stats['inserted']:>12,}")


def main():
    if not SOCIOS_DIR.exists():
        print(f"❌ {SOCIOS_DIR} não existe", file=sys.stderr)
        sys.exit(1)

    zips = sorted(SOCIOS_DIR.glob("Socios*.zip"))
    print(f"Found {len(zips)} zips:")
    for z in zips:
        print(f"  {z.name} ({z.stat().st_size / 1024 / 1024:.0f} MB)")

    print(f"\nConnecting to {DB_URL.split('@')[1]}...")
    conn = psycopg.connect(DB_URL)
    conn.autocommit = False

    stats = {"inserted": 0, "skipped": 0, "t0": time.time()}
    for z in zips:
        import_zip(conn, z, stats)

    elapsed = time.time() - stats["t0"]
    print(f"\n✅ Done — inserted={stats['inserted']:,} skipped={stats['skipped']:,} in {elapsed:.0f}s ({stats['inserted']/max(1,elapsed):.0f}/s)")
    conn.close()


if __name__ == "__main__":
    main()
