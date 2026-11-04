# Avance Law Partners website

Avance Law Partners-এর React, TypeScript, Vite এবং Tailwind CSS ওয়েবসাইটের source backup।

## যা সংরক্ষিত আছে

- `src/`: পেজ, কম্পোনেন্ট, স্টাইল, admin UI এবং application logic।
- `public/` ও `images/`: সাইটের ছবি, লোগো, favicon ও অন্যান্য assets।
- `supabase/`: database schema, seed SQL এবং contact enquiry function-এর source।
- `scripts/`, `tests/` ও `audit/`: build/check scripts, tests, review reports এবং পুরোনো release/preview archives।
- `package.json` ও `pnpm-lock.yaml`: dependency ও version তথ্য।

## অন্য কম্পিউটারে চালানো

Node.js 22 ও pnpm 10 ব্যবহার করুন।

```sh
pnpm install --frozen-lockfile
```

`.env.example` থেকে `.env.local` তৈরি করে নিজের Supabase-এর public client configuration বসান। Production build-এর জন্য `.env.production.example` থেকে `.env.production.local` তৈরি করে প্রয়োজনীয় public Supabase ও Turnstile configuration বসান।

```sh
pnpm dev
```

পরীক্ষা ও production build:

```sh
pnpm typecheck
pnpm test
pnpm build
```

## Backup-এর সীমা

বাস্তব `.env.local` / `.env.production.local`, passwords, secret keys, `node_modules/`, generated `dist/`, এবং আলাদা generated preview folders public Git source-এ রাখা হয় না। সম্পূর্ণ স্থানীয় ফোল্ডার ফেরত পেতে Releases-এর encrypted snapshot এবং আপনার recovery password ব্যবহার করুন: [সম্পূর্ণ backup ফিরিয়ে আনার নির্দেশনা](BACKUP_RECOVERY_BN.md)। স্থানীয় ফাইলগুলো তাদের জায়গায় থাকে।

এই repository website source-এর backup। এটি live Supabase database, নতুন enquiries, uploaded media বা Cloudflare/server-side secrets-এর স্বয়ংক্রিয় backup নয়। নতুন deployment-এর সময় সংশ্লিষ্ট hosting ও backend settings আলাদাভাবে configure করতে হবে।

## পরের পরিবর্তন GitHub-এ সেভ করা

এই ফোল্ডারে Git দিয়ে পরিবর্তন commit ও push করতে হবে; GitHub-এ ফাইল নিজে থেকে sync হয় না। প্রথম push-এর পরে:

```sh
git add .
git commit -m "Update website"
git push
```

এই repository তৈরি করা বা push করা live website deploy করে না।
