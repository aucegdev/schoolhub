/**
 * Test Firebase Admin SDK connection.
 * Run: npx tsx src/scripts/test-firebase.ts
 */

// Load .env first — tsx doesn't do this automatically
import "dotenv/config";
import { getFirebaseAdminApp } from "../config/firebase";

async function main() {
  console.log("Testing Firebase Admin SDK...\n");

  // Check env vars are loaded
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  console.log("  FIREBASE_PROJECT_ID:", projectId || "(not set)");
  console.log("  GOOGLE_APPLICATION_CREDENTIALS:", credPath || "(not set — will use FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY)");

  if (!projectId) {
    console.log("\nFAIL: FIREBASE_PROJECT_ID is not set in .env");
    process.exit(1);
  }

  const app = getFirebaseAdminApp();

  if (!app) {
    console.log("\nFAIL: Firebase app returned null.");
    console.log("Check that serviceAccountKey.json exists or FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY are set.");
    process.exit(1);
  }

  console.log("\nPASS: Firebase Admin SDK initialized successfully");

  // Verify Auth module works
  try {
    const auth = app.auth();
    console.log("  Auth module: available");
    console.log("\nAll checks passed!");
  } catch (err) {
    console.log("  Auth module error:", err);
    process.exit(1);
  }
}

main()
  .catch((e) => { console.error("Unexpected error:", e); process.exit(1); })
  .finally(async () => { process.exit(0); });
