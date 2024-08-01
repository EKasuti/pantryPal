const { db } = require('./config');

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

module.exports = { addEmailToWaitlist, getAllWaitlistEntries };