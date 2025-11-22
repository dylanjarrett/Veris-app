-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password_hash" TEXT;

-- CreateTable
CREATE TABLE "CRMRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "raw" TEXT NOT NULL,
    "processed" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CRMRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CRMRecord" ADD CONSTRAINT "CRMRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
