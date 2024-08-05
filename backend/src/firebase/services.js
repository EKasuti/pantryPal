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
    return { success: true, id: docRef.id };
  } catch (error) {
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
    return { success: false, error: error.message };
  }
}

async function createPantry(userId, name, notes = '') {
  try {
    const pantryRef = await db.collection('pantries').add({
      name: name,
      userId: userId,
      categories: 0,
      items: 0,
      quantity: 0,
      notes: notes,
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
      category: item.category || "-",
      quantity: item.quantity,
      purchaseDate: item.purchaseDate || "-",
      expiryDate: item.expiryDate || "-",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const itemRef = await pantryRef.collection('items').add(newItem);
    const addedItem = await itemRef.get();

    const categories = new Set((await pantryRef.collection('items').get()).docs.map(doc => doc.data().category));
    await pantryRef.update({ 
      categories: categories.size,
      items: admin.firestore.FieldValue.increment(1),
      quantity: admin.firestore.FieldValue.increment(item.quantity)
    });

    return {
      success: true,
      item: {
        id: itemRef.id,
        ...addedItem.data()
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function getPantriesForUser(userId) {
  try {
    const pantriesRef = db.collection('pantries');
    const snapshot = await pantriesRef.where('userId', '==', userId).get();

    if (snapshot.empty) {
      return [];
    }

    const pantries = [];
    snapshot.forEach(doc => {
      pantries.push({ id: doc.id, ...doc.data() });
    });

    return pantries;
  } catch (error) {
    throw error;
  }
}

async function getPantryByNameAndUser(pantryId, userId) {
  try {
    const pantryRef = db.collection('pantries').doc(pantryId);
    const pantry = await pantryRef.get();

    if (!pantry.exists) {
      return null;
    }

    const pantryData = pantry.data();

    if (pantryData.userId !== userId) {
      return null;
    }

    return { id: pantry.id, ...pantryData };
  } catch (error) {
    throw error;
  }
}

async function getItemsForPantry(pantryId) {
  try {
    const pantryRef = db.collection('pantries').doc(pantryId);
    const itemsSnapshot = await pantryRef.collection('items').get();
    
    const items = itemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return items;
  } catch (error) {
    throw error;
  }
}

async function deletePantry(userId, pantryId) {
  try {
    const pantryRef = db.collection('pantries').doc(pantryId);
    const pantry = await pantryRef.get();

    if (!pantry.exists) {
      throw new Error('Pantry not found');
    }

    if (pantry.data().userId !== userId) {
      throw new Error('Unauthorized: User does not own this pantry');
    }

    const itemsSnapshot = await pantryRef.collection('items').get();
    const batch = db.batch();

    itemsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.delete(pantryRef);

    await batch.commit();

    return { success: true, message: 'Pantry and all its items deleted successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function updateItemQuantity(pantryId, itemId, newQuantity) {
  try {
    const pantryRef = db.collection('pantries').doc(pantryId);
    const itemRef = pantryRef.collection('items').doc(itemId);

    const oldItemData = (await itemRef.get()).data();
    const quantityDifference = newQuantity - oldItemData.quantity;

    await itemRef.update({
      quantity: newQuantity,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await pantryRef.update({
      quantity: admin.firestore.FieldValue.increment(quantityDifference)
    });

    const updatedItem = await itemRef.get();

    return {
      success: true,
      item: {
        id: itemId,
        ...updatedItem.data()
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function deleteItemFromPantry(pantryId, itemId) {
  try {
    const pantryRef = db.collection('pantries').doc(pantryId);
    const itemRef = pantryRef.collection('items').doc(itemId);

    const itemData = (await itemRef.get()).data();
    await itemRef.delete();

    const categories = new Set((await pantryRef.collection('items').get()).docs.map(doc => doc.data().category));
    await pantryRef.update({ 
      categories: categories.size,
      items: admin.firestore.FieldValue.increment(-1),
      quantity: admin.firestore.FieldValue.increment(-itemData.quantity)
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function updateItemDetails(pantryId, itemId, updatedDetails) {
  try {
    const pantryRef = db.collection('pantries').doc(pantryId);
    const itemRef = pantryRef.collection('items').doc(itemId);

    await itemRef.update(updatedDetails);

    const updatedItem = await itemRef.get();
    return { success: true, item: { id: updatedItem.id, ...updatedItem.data() } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function updatePantryNotes(pantryId, notes) {
  try {
    const pantryRef = db.collection('pantries').doc(pantryId);
    await pantryRef.update({ 
      notes: notes,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const updatedPantry = await pantryRef.get();
    return { id: updatedPantry.id, ...updatedPantry.data() };
  } catch (error) {
    throw error;
  }
}

module.exports = { addEmailToWaitlist, getAllWaitlistEntries, createUser, loginUser, createPantry, addItemToPantry, getPantriesForUser, getPantryByNameAndUser, getItemsForPantry, deletePantry, updateItemQuantity, deleteItemFromPantry, updateItemDetails, updatePantryNotes };