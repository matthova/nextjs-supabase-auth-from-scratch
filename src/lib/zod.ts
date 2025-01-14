import * as z from "zod";
import type { User } from "@supabase/supabase-js";

const schemaForType =
  <T>() =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };

export const userParser = schemaForType<User>()(
  z.object({
    id: z.string(),
    app_metadata: z
      .object({
        provider: z.string().optional(),
      })
      .catchall(z.any()),
    user_metadata: z.object({}).catchall(z.any()),
    aud: z.string(),
    confirmation_sent_at: z.string().optional(),
    recovery_sent_at: z.string().optional(),
    email_change_sent_at: z.string().optional(),
    new_email: z.string().optional(),
    new_phone: z.string().optional(),
    invited_at: z.string().optional(),
    action_link: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    created_at: z.string(),
    confirmed_at: z.string().optional(),
    email_confirmed_at: z.string().optional(),
    phone_confirmed_at: z.string().optional(),
    last_sign_in_at: z.string().optional(),
    role: z.string().optional(),
    updated_at: z.string(),
    identities: z.array(
      z.object({
        id: z.string(),
        user_id: z.string(),
        identity_data: z.object({}).catchall(z.any()).optional(),
        identity_id: z.string(),
        provider: z.string(),
        created_at: z.string().optional(),
        last_sign_in_at: z.string().optional(),
        updated_at: z.string().optional(),
      })
    ),
    is_anonymous: z.boolean().optional(),
    factors: z
      .array(
        z.object({
          id: z.string(),
          friendly_name: z.string().optional(),
          factor_type: z.union([
            z.literal("totp"),
            z.literal("phone"),
            z.string(),
          ]),
          status: z.union([z.literal("verified"), z.literal("unverified")]),
          created_at: z.string(),
          updated_at: z.string(),
        })
      )
      .optional(),
  })
);
