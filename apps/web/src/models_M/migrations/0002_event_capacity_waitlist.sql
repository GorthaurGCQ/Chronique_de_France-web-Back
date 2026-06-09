CREATE TYPE "registration_status" AS ENUM('CONFIRME', 'LISTE_ATTENTE');--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "capacite_max" integer;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD COLUMN "statut" "registration_status" DEFAULT 'CONFIRME' NOT NULL;
