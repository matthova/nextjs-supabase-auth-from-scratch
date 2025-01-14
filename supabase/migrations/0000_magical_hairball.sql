CREATE TABLE "counts_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "counts_table_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "counts_table" ADD CONSTRAINT "counts_table_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;