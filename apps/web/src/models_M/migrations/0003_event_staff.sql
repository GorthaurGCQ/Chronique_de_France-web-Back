CREATE TYPE "public"."event_staff_role" AS ENUM('ANIMATEUR', 'ORGANISATEUR');--> statement-breakpoint
CREATE TABLE "event_staff" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"event_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"role" "event_staff_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "event_staff" ADD CONSTRAINT "event_staff_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_staff" ADD CONSTRAINT "event_staff_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_staff_event_idx" ON "event_staff" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_staff_user_idx" ON "event_staff" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "event_staff_event_user_role_idx" ON "event_staff" USING btree ("event_id","user_id","role");--> statement-breakpoint
INSERT INTO "event_staff" ("id", "event_id", "user_id", "role")
SELECT gen_random_uuid()::varchar, "id", "organisateur_id", 'ORGANISATEUR'
FROM "events"
WHERE "organisateur_id" IS NOT NULL;
