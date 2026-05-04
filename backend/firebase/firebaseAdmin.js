const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    // Handle both stringified JSON and potential object types
    serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === 'string' 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
      : process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccount && serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
  } catch (err) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", err);
  }
} else if (!process.env.VERCEL) {
  try {
    serviceAccount = require("./serviceAccountKey.json");
  } catch (err) {
    console.warn("⚠️ Local serviceAccountKey.json not found.");
  }
}

// Final check to ensure it's a valid object with required fields
if (serviceAccount && typeof serviceAccount === 'object' && serviceAccount.project_id) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} else {
  console.warn("⚠️ Firebase Admin NOT initialized: Service account config is invalid or missing.");
}

module.exports = admin;