# Supabase Integration for Notes Frontend

This React app is fully integrated with Supabase for:
- User authentication (signup, login, logout)
- Realtime database for notes

## Environment variables
You **MUST** set the following in your environment, or create a .env file in your project root:

```
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_KEY=your-supabase-anon-key
```
These can be found in your Supabase project dashboard under Project Settings > API.

## Database Schema

You must create a table called `notes` with at least the following columns:

| Column    | Type      | Description              |
|-----------|-----------|--------------------------|
| id        | uuid (PK) | Primary key              |
| user_id   | uuid      | References auth.users.id |
| title     | text      | Title of the note        |
| content   | text      | Note content             |
| tags      | text[]    | Array of tags            |
| updated_at| timestamp | Last update time         |

### Current Supabase Schema (Checked)
- `notes` table exists.
- `tags` (text[]) column has been added.
- However, as of now:
  - `id` and `user_id` columns are `bigint`, **not** `uuid`.
  - This causes errors when trying to apply correct RLS policies using `auth.uid()` (returns uuid).

### RLS Policies & Security

**Row Level Security is NOT fully configured.**  
- RLS could not be enabled as described due to type mismatch: `user_id` is `bigint`, while `auth.uid()` returns `uuid`.
- As a result, any RLS policy such as `user_id = auth.uid()` fails.

**Action Required (by DBA/Project Owner):**
- A database migration is needed:
  1. Convert `id` and `user_id` columns in `notes` from `bigint` to `uuid`.
  2. Migrate related tables (`note_tag`, etc.) as needed.
  3. Only after this can you create secure RLS policies as described below:
      - `FOR SELECT/INSERT/UPDATE/DELETE USING (user_id = auth.uid())`
- Only anon/pk API keys should be used in frontend. Secure tables via RLS.

### What was configured automatically:
- Confirmed the presence of the `notes` table.
- Added the `tags` text[] column for frontend compatibility.

### Steps still needed (manual):
- Migrate/convert the primary and foreign keys for `id` and `user_id` to type `uuid`.
- Apply RLS policies.
- Update relationships as needed so that all IDs are consistently uuid.

## Usage in React
The app uses `@supabase/supabase-js` and reads its config from environment variables.
Authentication is handled with email/password. On successful login/signup, the session is tracked and notes are CRUD-managed through the `notes` table.

**Tip:** For local development, a `.env.local` file in the root directory can be used.

## Security advice
- Never expose your service_role key or any admin secrets in frontend code.
- Use anon/public API key and secure everything via RLS on the Supabase dashboard.

## Troubleshooting / Next Steps

- If you see errors about auth/RLS or "operator does not exist: bigint = uuid", see above for migration instructions.
- Once migration is complete, re-apply RLS policies, and ensure frontend is redeployed.
