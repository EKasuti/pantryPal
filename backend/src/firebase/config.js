const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../../config/serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  
  initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore();
  console.log('Firestore initialized successfully');
  
  module.exports = { db };
} catch (error) {
  console.error('Error initializing Firebase:', error);
  process.exit(1);
}