const { db, admin } = require('./config');

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

async function createUser(email, password) {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    await db.collection('users').doc(userRecord.uid).set({
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, uid: userRecord.uid };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message);
    }

    return {
      success: true,
      user: {
        uid: data.localId,
        email: data.email,
      },
      token: data.idToken
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    return { success: false, error: error.message };
  }
}

async function createPantry(userId, name) {
  try {
    const pantryRef = await db.collection('pantries').add({
      name: name,
      userId: userId,
      categories: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const pantryData = (await pantryRef.get()).data();

    return {
      success: true,
      pantry: {
        id: pantryRef.id,
        ...pantryData
      }
    };
  } catch (error) {
    console.error('Error creating pantry:', error);
    return { success: false, error: error.message };
  }
}

async function addItemToPantry(pantryId, item) {
  try {
    const pantryRef = db.collection('pantries').doc(pantryId);
    const pantry = await pantryRef.get();

    if (!pantry.exists) {
      throw new Error('Pantry not found');
    }

    const newItem = {
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      purchaseDate: item.purchaseDate || null,
      expiryDate: item.expiryDate || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const itemRef = await pantryRef.collection('items').add(newItem);
    const addedItem = await itemRef.get();

    // Update the categories count
    const categories = new Set((await pantryRef.collection('items').get()).docs.map(doc => doc.data().category));
    await pantryRef.update({ categories: categories.size });

    return {
      success: true,
      item: {
        id: itemRef.id,
        ...addedItem.data()
      }
    };
  } catch (error) {
    console.error('Error adding item to pantry:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { addEmailToWaitlist, getAllWaitlistEntries, createUser, loginUser, createPantry, addItemToPantry };