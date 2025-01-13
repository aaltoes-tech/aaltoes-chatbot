/*
  Warnings:

  - Added the required column `chat_id` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_user_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_fkey";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "chat_id" TEXT NOT NULL;
