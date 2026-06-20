import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "parabolic-doodad-cqmt3",
  appId: "1:331932830054:web:532cd7a9b5d21369dce0a7",
  apiKey: "AIzaSyCXAKlsD_hlE3HA-3aZTVVPMiCPh3Qvg3M",
  authDomain: "parabolic-doodad-cqmt3.firebaseapp.com",
  storageBucket: "parabolic-doodad-cqmt3.firebasestorage.app",
  messagingSenderId: "331932830054"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore using the configured database ID
export const db = getFirestore(app, "ai-studio-0ccbfb47-f90b-4222-8fbd-404005314e3b");

// Validate connection on startup per Firebase Skill instruction
async function validateConnection() {
  try {
    await getDocFromServer(doc(db, 'test-connection-validation', 'status'));
    console.log("Firebase connection verified successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Firebase is offline. Check credentials or network connectivity:", error);
    } else {
      console.log("Firebase initialized. Setup complete.", error);
    }
  }
}

validateConnection();
