import app from "./firebase";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  query,
  getDocs,
  deleteDoc,
  where
} from "firebase/firestore";

const database = getFirestore(app);

async function save(tableName, _data, id) {
  try {
    const data = { ..._data };
    const date = new Date();

    if (!id) {
      data.InsertedDate = date;
    }
    data.LastChangeDate = date;

    if (id) {
      return await update(tableName, data, id);
    } else {
      return await create(tableName, data);
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function create(tableName, data) {
  const docRef = await addDoc(collection(database, tableName), data);

  const savedData = {
    id: docRef.id,
    ...data
  }

  return savedData;
}

async function update(tableName, data, id) {
  await setDoc(doc(database, tableName, id), data);
  const savedData = {
    id: id,
    ...data
  }

  return savedData;
}

async function get(tableName, filters = []) {
  const docsRef = collection(database, tableName);

  const addFilters = [];
  if(Array.isArray(filters)) {
    filters.forEach(query => {
      if(query.operator && query.property && query.value !== undefined) {
        addFilters.push(where(query.property, query.operator, query.value))
      }
    })
  }

  const queryRef = query(docsRef, ...addFilters);
  const querySnapshot = await getDocs(queryRef);
  const list = [];
  
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());

    const data = {
      id: doc.id,
      ...doc.data()
    }

    list.push(data);
  });

  return list;
}

async function _delete(tableName, id) {
  return await deleteDoc(doc(database, tableName, id));
}

const crud = {
  save,
  get,
  delete: _delete
}

export default crud;