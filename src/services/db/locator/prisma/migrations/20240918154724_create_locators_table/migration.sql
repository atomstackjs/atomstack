-- CreateTable
CREATE TABLE "Locator" (
    "id" VARCHAR(25) NOT NULL,
    "service" VARCHAR(64) NOT NULL,
    "dataspaceId" VARCHAR(25) NOT NULL DEFAULT 'c0000000000000000000000',

    CONSTRAINT "Locator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Locator_dataspaceId_idx" ON "Locator"("dataspaceId");

-- CreateIndex
CREATE INDEX "Locator_id_dataspaceId_idx" ON "Locator"("id", "dataspaceId");
