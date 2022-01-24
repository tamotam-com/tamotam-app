import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import { initializeApp } from "firebase/app";
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  // @ts-ignore
} from "@env";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  appId: FIREBASE_APP_ID,
  authDomain: FIREBASE_AUTH_DOMAIN,
  measurementId: FIREBASE_MEASUREMENT_ID,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
};

const firebaseApp = initializeApp(firebaseConfig);
const firestoreDatabase = getFirestore();
// TODO: Integrate those wherever needed.
const analytics = getAnalytics(firebaseApp);
const performance = getPerformance(firebaseApp);
logEvent(analytics, "notification_received");
export { firebaseApp, firestoreDatabase };
