const admin: any = require("firebase-admin");

let initializedApp: any = null;

export function getFirebaseAdminApp(): any {
  if (admin.apps && admin.apps.length > 0) {
    initializedApp = admin.app();
    return initializedApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId && !clientEmail && !privateKey && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return null;
  }

  try {
    const credential =
      clientEmail && privateKey
        ? admin.cert({
            projectId: projectId ?? "schoolhub",
            clientEmail,
            privateKey,
          })
        : process.env.GOOGLE_APPLICATION_CREDENTIALS
          ? admin.applicationDefault()
          : undefined;

    initializedApp = admin.initializeApp({
      projectId,
      credential,
    });
    return initializedApp;
  } catch {
    return null;
  }
}
