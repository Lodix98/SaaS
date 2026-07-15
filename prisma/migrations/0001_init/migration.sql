-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'inactive');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "subscription_status" "SubscriptionStatus" NOT NULL DEFAULT 'trialing',
    "trial_ends_at" TIMESTAMPTZ,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "client_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "reminder_day" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_cycles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "client_id" UUID NOT NULL,
    "month" TIMESTAMPTZ NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "monthly_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_submissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "monthly_cycle_id" UUID NOT NULL,
    "document_template_id" UUID,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT,
    "notes" TEXT,
    "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminder_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "monthly_cycle_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "sent_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "opened_at" TIMESTAMPTZ,

    CONSTRAINT "reminder_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_portal_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "client_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_portal_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");
CREATE UNIQUE INDEX "monthly_cycles_client_id_month_key" ON "monthly_cycles"("client_id", "month");
CREATE UNIQUE INDEX "client_portal_sessions_token_key" ON "client_portal_sessions"("token");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_templates" ADD CONSTRAINT "document_templates_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_cycles" ADD CONSTRAINT "monthly_cycles_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_submissions" ADD CONSTRAINT "document_submissions_monthly_cycle_id_fkey" FOREIGN KEY ("monthly_cycle_id") REFERENCES "monthly_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_submissions" ADD CONSTRAINT "document_submissions_document_template_id_fkey" FOREIGN KEY ("document_template_id") REFERENCES "document_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_logs" ADD CONSTRAINT "reminder_logs_monthly_cycle_id_fkey" FOREIGN KEY ("monthly_cycle_id") REFERENCES "monthly_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_portal_sessions" ADD CONSTRAINT "client_portal_sessions_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
