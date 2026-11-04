This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Voice Form Modes

- **Option 1:** The existing guided questions and spoken submission confirmation.
- **Option 2:** Click **Start voice entry**, allow microphone access, then say a field name followed by its answer. For example, say "Entity Name", then "Test", then "Entity Type", then "Trust". A combined utterance such as "Entity Name Test" also works. No questions are spoken by the app.

Option 2 automatically saves when all eight fields have been addressed. Say "skip" after TSP or Branch Name to leave those optional fields blank. Say "finish" or click **Finish and save** to save once the required fields are valid. **Stop voice entry** retains the current recording so it can be saved with the completed form. **Cancel** clears the draft and its recording. Switching options stops recording and resets the unsaved draft.

Completed Option 2 answers, transcripts, and audio recordings appear below the form. The form data remains visible, and the recorded voice has an in-app audio player and a **Download recorded voice** button. Audio downloads use the browser's recording format (WebM, Ogg, or M4A), not JSON. They are stored in IndexedDB in the same browser and can be played or downloaded after reloading. Clearing site data removes these records. If browser storage is blocked or full, download the session-only recording before leaving the option. These records are not sent to an application backend; browser speech recognition may use the browser vendor's services.

Use a speech-recognition-capable browser such as Chrome or Edge on HTTPS or localhost. Option 2 requires microphone permission and MediaRecorder support. Bank and branch options are sample data.

## Checks

With Node.js 22.6 or newer, run `npm test` for the field-and-answer parser tests. Run `npx tsc --noEmit` for the project type check.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
