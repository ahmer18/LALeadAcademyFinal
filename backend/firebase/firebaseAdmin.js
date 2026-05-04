const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
  } catch (err) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", err);
  }
} else {
  // Try to load local file only if not on Vercel
  if (!process.env.VERCEL) {
    try {
      serviceAccount = require("./serviceAccountKey.json");
    } catch (err) {
      console.warn("⚠️ Local serviceAccountKey.json not found.");
    }
  }
}

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else if (!serviceAccount) {
  console.warn("⚠️ Firebase Admin not initialized: Missing Service Account configuration.");
}

module.exports = admin;