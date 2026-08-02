import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://parkease-ai-b2c42-default-rtdb.firebaseio.com'
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function checkFacilities() {
  const snapshot = await get(ref(db, 'facilities'));
  console.log(JSON.stringify(snapshot.val(), null, 2));
  process.exit(0);
}
checkFacilities();
