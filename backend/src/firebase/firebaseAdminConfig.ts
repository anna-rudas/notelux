import * as admin from "firebase-admin";

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  throw new Error("Missing variable FIREBASE_SERVICE_ACCOUNT_KEY");
}

const serviceAccount = JSON.parse(serviceAccountKey);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

const firebaseAdminConfig = {
  credential: admin.credential.cert(serviceAccount),
};

admin.initializeApp(firebaseAdminConfig);

export default admin;
