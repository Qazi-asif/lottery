# Supabase setup for ScratchCrest

The app still uses **Prisma** as the ORM. Supabase is the **hosted PostgreSQL** database. Do not switch app queries to the Supabase JS client; NextAuth remains the auth system.

## Create the project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. **New project**
   - Name: `scratchcrest` (or any name)
   - Database password: generate a strong password and **save it** (this is `YOUR_DB_PASSWORD`)
   - Region: closest to you / to Vercel
3. Wait until the project is healthy.

You do **not** need:

- Supabase Auth users, providers, or email templates (we use NextAuth + Resend)
- Storage buckets
- Edge Functions
- The `anon` / `service_role` keys for Prisma

You **do** need the Postgres connection strings and the database password.

## Values to copy into `.env`

Copy `.env.example` to `.env`. Fill these from the dashboard.

### Database (required)

**Project Settings → Database → Connection string** (URI)

| Env var | Dashboard connection | Port | Use |
|---|---|---|---|
| `DATABASE_URL` | **Transaction** pooler | `6543` | Next.js / Prisma Client. Add `?pgbouncer=true&sslmode=require` |
| `DIRECT_URL` | **Session** pooler (or Direct) | `5432` | `prisma migrate` and `prisma db seed`. Add `?sslmode=require` |

User in the URI looks like `postgres.PROJECT_REF` (pooler) or `postgres` (direct).

Example:

```
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:YOUR_DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres.abcdefghijklmnop:YOUR_DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

If the password contains special characters (`@`, `#`, `%`, `/`), URL-encode them.

`PROJECT_REF` is also in the project URL: `https://PROJECT_REF.supabase.co`.

### Optional keys (not used by Prisma)

**Project Settings → API**

| Dashboard field | Notes |
|---|---|
| Project URL | `https://PROJECT_REF.supabase.co` |
| `anon` `public` key | Browser / RLS client only — leave unused |
| `service_role` key | Never commit; never send to the browser |

## Create tables

Pick **one** method. Do not run both on a fresh project.

**Recommended:** from the repo, after `.env` is filled:

```powershell
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

**Or** paste `supabase/schema.sql` into **SQL Editor → New query → Run**. Then still run `npx prisma migrate resolve --applied 20240910000000_init` so Prisma does not try to create the same tables again.

After tables exist, confirm in **Table Editor**: `plans`, `tenants`, `subscriptions`, `users`, `user_locations`, `locations`, `games`, `packs`, `tickets`, `sales`, `prize_payouts`, `settings`, `display_configs`.

## Dashboard settings to leave as-is (or confirm)

| Area | What to do |
|---|---|
| **Authentication** | Leave unused. App login is NextAuth. |
| **Authentication → URL** | Ignore unless you later adopt Supabase Auth. |
| **Row Level Security** | Leave **disabled** on ScratchCrest tables. Prisma uses the DB password and would be blocked by RLS with no policies. |
| **Network bans / IPv4** | If migrate fails to connect from Windows, use the **Session pooler** (`:5432`) as `DIRECT_URL`, not the IPv6-only direct host. Paid IPv4 add-on is only needed for a true direct connection. |
| **Database → Roles** | Prisma uses `postgres` (or the pooler user). Do not use `anon`. |

## After tables exist

Seed plans/games:

```powershell
npx prisma db seed
```

Then `npm run dev`.
