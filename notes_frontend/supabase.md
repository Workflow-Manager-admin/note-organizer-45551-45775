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

- Make sure RLS (Row Level Security) is enabled and restricts read/write so that users can only access their own notes.
- Insert/Update notes must use authenticated user's ID.

## Usage in React
The app uses `@supabase/supabase-js` and reads its config from environment variables.
Authentication is handled with email/password. On successful login/signup, the session is tracked and notes are CRUD-managed through the `notes` table.

**Tip:** For local development, a `.env.local` file in the root directory can be used.

## Security advice
- Never expose your service_role key or any admin secrets in frontend code.
- Use anon/public API key and secure everything via RLS on the Supabase dashboard.
