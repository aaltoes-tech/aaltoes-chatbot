/*
  Warnings:

  - You are about to drop the column `answer` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `messages` table. All the data in the column will be lost.
  - Added the required column `chat_id` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "answer",
DROP COLUMN "question",
DROP COLUMN "user_id",
ADD COLUMN     "chat_id" TEXT NOT NULL,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "role" TEXT;

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
