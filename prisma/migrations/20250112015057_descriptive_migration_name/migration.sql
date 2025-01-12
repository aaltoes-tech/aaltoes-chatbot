-- AlterTable
ALTER TABLE "users" ALTER COLUMN "quota" SET DEFAULT 1,
ALTER COLUMN "quota" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "chat_topic" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "question" TEXT,
    "answer" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
