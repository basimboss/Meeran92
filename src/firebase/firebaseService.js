// Firebase Firestore Service — All database operations for Meeran Portal
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from './config';

// ─── COLLECTION NAMES ─────────────────────────────────────────────────────────
const MOBILES_COL = 'mobiles';
const ACTIVITIES_COL = 'activities';
const PERSONS_COL = 'persons';

// ─── MOBILES ──────────────────────────────────────────────────────────────────

// Listen to all mobiles in real time
export const subscribeMobiles = (callback) => {
  const q = query(collection(db, MOBILES_COL), orderBy('inDate', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const mobiles = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(mobiles);
  }, (error) => {
    console.error('Mobiles listener error:', error);
    callback([]);
  });
};

// Add a new mobile to Firestore
export const addMobileToDb = async (mobileData) => {
  const docRef = doc(collection(db, MOBILES_COL), mobileData.id);
  await setDoc(docRef, { ...mobileData, updatedAt: serverTimestamp() });
  return mobileData.id;
};

// Update an existing mobile
export const updateMobileInDb = async (id, updatedFields) => {
  const docRef = doc(db, MOBILES_COL, id);
  await updateDoc(docRef, { ...updatedFields, updatedAt: serverTimestamp() });
};

// Delete a mobile
export const deleteMobileFromDb = async (id) => {
  await deleteDoc(doc(db, MOBILES_COL, id));
};

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────

// Listen to activities in real time
export const subscribeActivities = (callback) => {
  const q = query(collection(db, ACTIVITIES_COL), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(activities);
  }, (error) => {
    console.error('Activities listener error:', error);
  });
};

// Add activity log
export const addActivityToDb = async (activity) => {
  const docRef = doc(collection(db, ACTIVITIES_COL), activity.id);
  await setDoc(docRef, { ...activity, createdAt: serverTimestamp() });
};

// ─── PERSONS ──────────────────────────────────────────────────────────────────

// Listen to all persons in real time
export const subscribePersons = (callback) => {
  return onSnapshot(collection(db, PERSONS_COL), (snapshot) => {
    const persons = {};
    snapshot.docs.forEach(d => {
      persons[d.id] = { id: d.id, ...d.data(), customerId: d.data().customerId || d.id };
    });
    callback(persons);
  }, (error) => {
    console.error('Persons listener error:', error);
  });
};

// Upsert (create or update) a person record
export const upsertPersonInDb = async (phone, personData) => {
  const key = phone ? phone.replace(/[^\d]/g, '') : personData.name?.replace(/\s+/g, '_').toLowerCase();
  if (!key) return;
  const docRef = doc(db, PERSONS_COL, key);
  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(docRef);
    const current = existing.exists() ? existing.data() : {};
    transaction.set(docRef, {
      ...current,
      ...personData,
      customerId: personData.customerId || current.customerId || key,
      events: personData.events || current.events || [],
      createdAt: current.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });
  return key;
};

export const appendPersonEventToDb = async (phone, profile, event) => {
  const key = phone ? phone.replace(/[^\d]/g, '') : profile.name?.replace(/\s+/g, '_').toLowerCase();
  if (!key) return;
  const docRef = doc(db, PERSONS_COL, key);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(docRef);
    const current = snapshot.exists() ? snapshot.data() : {};
    const events = current.events || [];
    transaction.set(docRef, {
      ...current,
      ...profile,
      customerId: profile.customerId || current.customerId || key,
      events: [event, ...events],
      createdAt: current.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });
  return key;
};

// ─── SEED INITIAL DATA ────────────────────────────────────────────────────────
// Call once to push mock data into Firestore on first load

export const seedInitialData = async (mobiles, activities, personHistories) => {
  try {
    // Check if already seeded
    const mobilesSnap = await getDocs(collection(db, MOBILES_COL));
    if (!mobilesSnap.empty) {
      console.log('Firestore already has data — skipping seed.');
      return false;
    }

    console.log('Seeding initial data to Firestore...');
    const batch = writeBatch(db);

    // Seed mobiles
    mobiles.forEach(mob => {
      const ref = doc(db, MOBILES_COL, mob.id);
      batch.set(ref, { ...mob, updatedAt: serverTimestamp() });
    });

    // Seed activities
    activities.forEach(act => {
      const ref = doc(db, ACTIVITIES_COL, act.id);
      batch.set(ref, { ...act, createdAt: serverTimestamp() });
    });

    // Seed persons
    Object.entries(personHistories).forEach(([phone, person]) => {
      const ref = doc(db, PERSONS_COL, phone);
      batch.set(ref, { ...person, createdAt: serverTimestamp() });
    });

    await batch.commit();
    console.log('✅ Firestore seeded successfully!');
    return true;
  } catch (err) {
    console.error('❌ Seed error:', err);
    return false;
  }
};
