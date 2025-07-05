-- CreateEnum
CREATE TYPE "Category" AS ENUM ('personal', 'business', 'coding');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'personal';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
