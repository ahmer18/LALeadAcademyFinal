const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    // Fix for Vercel/Docker newline issues in private key
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
  } catch (err) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", err);
  }
} else {
  try {
    serviceAccount = require("./serviceAccountKey.json");
  } catch (err) {
    console.warn("⚠️ Firebase serviceAccountKey.json not found. Auth will fail unless FIREBASE_SERVICE_ACCOUNT env var is set.");
  }
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;