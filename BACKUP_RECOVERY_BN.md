# GitHub থেকে সম্পূর্ণ ফোল্ডার ফিরিয়ে আনা

এই public repository-তে সম্পাদনাযোগ্য website source, images, scripts, Supabase schema/function এবং আগের audit/release files আছে। `README.md`-তে নিয়মিত development-এর নির্দেশনা আছে।

সম্পূর্ণ স্থানীয় ফোল্ডারের অতিরিক্ত encrypted snapshot এই repository-এর **Releases**-এ `full-backup-2026-11-05` নামে রাখা হয়। এতে `.env.local`, `.env.production.local`, `node_modules`, `dist`, original reference, পুরোনো preview folders ও স্থানীয় hidden files-ও থাকে। Root `.git` directory বাদ দেওয়া হয়; repository clone করলে নতুন `.git` তৈরি হয়। Archive-এ dependency links-এর প্রকৃত ফাইল রাখা হয়, যাতে পুরোনো PC-এর absolute link-এর প্রয়োজন না হয়।

এই snapshot live database বা hosting account-এর backup নয়। Live Supabase enquiries, database records, cloud storage ও server-side secrets ওই services-এ আলাদাভাবে থাকে।

## প্রয়োজনীয় জিনিস

1. GitHub Releases থেকে `.tar.gz.enc` file download করুন।
2. এই chat-এ দেওয়া ৪৩ অক্ষরের **recovery key** আলাদা নিরাপদ জায়গায় রাখুন। Public repository-তে এই key নেই।
3. এই repository-এর `scripts/restore-full-backup.mjs` file এবং Node.js 22 লাগবে। Windows-এ থাকা `tar` দিয়েই archive খোলা হয়; GitHub Desktop/CLI লাগে না।

## Restore

Repository-এর ফোল্ডার থেকে চালান:

```sh
node scripts/restore-full-backup.mjs "C:/Downloads/avance-website-full-2026-11-05.tar.gz.enc" "C:/Restored-Avance-Website"
```

চাইলে recovery key paste করুন। Destination আগে থেকে থাকা চলবে না; আপনার পুরোনো ফাইল overwrite করা হবে না। ফিরিয়ে আনা website থাকবে `C:/Restored-Avance-Website/project`-এ। সেখান থেকে:

```sh
pnpm typecheck
pnpm test
pnpm build
```

অন্য operating system বা architecture হলে `pnpm install --frozen-lockfile` দিয়ে dependencies নতুন করে install করুন। Development server চালাতে `pnpm dev` ব্যবহার করুন।

শুধু GitHub-এর **Code > Download ZIP** নিলে public source পাবেন। সম্পূর্ণ স্থানীয় ফোল্ডারের জন্য Releases-এর encrypted snapshot-ও download করতে হবে।

Recovery key হারিয়ে গেলে encrypted snapshot খোলা যাবে না। Key-টি public code, issue বা release description-এ রাখবেন না।
