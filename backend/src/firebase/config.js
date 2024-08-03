const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

try {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  };

  initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = getFirestore();
  console.log('Firestore initialized successfully');
  
  module.exports = { db };
} catch (error) {
  console.error('Error initializing Firebase:', error);
  process.exit(1);
}