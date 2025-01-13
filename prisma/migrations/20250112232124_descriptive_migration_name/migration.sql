/*
  Warnings:

  - You are about to drop the column `chat_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `chats` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_user_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "chat_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "chats";

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
