-- CreateTable
CREATE TABLE "Socio" (
    "id" TEXT NOT NULL,
    "cnpjBasico" TEXT NOT NULL,
    "identificadorTipo" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "nomeSlug" TEXT NOT NULL,
    "cnpjCpfSocio" TEXT,
    "qualificacao" INTEGER,
    "qualificacaoDesc" TEXT,
    "dataEntrada" TEXT,
    "pais" TEXT,
    "representanteCpf" TEXT,
    "representanteNome" TEXT,
    "qualifRepresent" INTEGER,
    "faixaEtaria" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Socio_cnpjBasico_idx" ON "Socio"("cnpjBasico");

-- CreateIndex
CREATE INDEX "Socio_nomeSlug_idx" ON "Socio"("nomeSlug");

-- CreateIndex
CREATE INDEX "Socio_nome_idx" ON "Socio"("nome");
