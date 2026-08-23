# 2MK Custom Center API

## Local setup

```bash
cd backend
npm install
copy .env.example .env
```

Fill `.env` with the Supabase project values and run:

```bash
npm run dev
```

Run `supabase.sql` in the Supabase SQL editor before starting the API.

## Render

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Root directory: `backend`

Configure the variables from `.env.example` in the Render dashboard. Never commit `.env` or the Supabase service role key.
