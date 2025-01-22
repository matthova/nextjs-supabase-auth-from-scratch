CREATE TABLE "counts_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "counts_table_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "counts_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "counts_table" ADD CONSTRAINT "counts_table_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "authenticated user can create" ON "counts_table" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "owner can view count" ON "counts_table" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("counts_table"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "owner can update count" ON "counts_table" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("counts_table"."user_id" = (select auth.uid())) WITH CHECK ("counts_table"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "owner can delete count" ON "counts_table" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("counts_table"."user_id" = (select auth.uid()));