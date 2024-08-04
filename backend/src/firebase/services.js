const { db } = require('./config');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const auth = getAuth();

const addEmailToWaitlist = async (email) => {
  try {
    // Check if email already exists
    const querySnapshot = await db.collection('waitlist')
      .where('email', '==', email)
      .get();

    if (!querySnapshot.empty) {
      return { success: false, error: 'Email already exists in the waitlist' };
    }

    // If email doesn't exist, add it
    const docRef = await db.collection('waitlist').add({
      email: email,
      timestamp: new Date()
    });
    console.log('Document written with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding document: ', error);
    return { success: false, error: error.message };
  }
};

const getAllWaitlistEntries = async () => {
  try {
    const snapshot = await db.collection('waitlist').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};

async function signUpUser(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Add user to users collection
    await db.collection('users').doc(user.uid).set({
      name: name,
      email: email
    });

    return { success: true, userId: user.uid };
  } catch (error) {
    console.error('Error signing up user:', error);
    return { success: false, error: error.message };
  }
}

async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    return { success: true, userId: user.uid, token: token };
  } catch (error) {
    console.error('Error logging in user:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { addEmailToWaitlist, getAllWaitlistEntries, signUpUser, loginUser };