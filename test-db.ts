import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import fs from 'fs';

// Manually parse .env
const env = fs.readFileSync('.env', 'utf-8');
env.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: 'https://parkease-ai-b2c42-default-rtdb.firebaseio.com'
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function test() {
  try {
    const snapshot = await get(ref(db, 'users'));
    if (snapshot.exists()) {
      console.log("Users in DB:");
      const users = snapshot.val();
      for (const [uid, user] of Object.entries(users)) {
        console.log(`- ${uid}: ${(user as any).email} (${(user as any).role})`);
      }
    } else {
      console.log("No users in DB");
    }
  } catch (e: any) {
    console.error("DB Error:", e.message);
  }
  process.exit(0);
}

test();
