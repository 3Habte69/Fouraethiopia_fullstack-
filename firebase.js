import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export const firebaseConfig = {
  apiKey: "AIzaSyC0L4R-YOUR_API_KEY_GOES_HERE",
  authDomain: "fouraethiopia-e175e.firebaseapp.com",
  projectId: "fouraethiopia-e175e",
  storageBucket: "fouraethiopia-e175e.appspot.com",
  messagingSenderId: "634683882169",
  appId: "1:634683882169:web:aBcDeFgHiJkLmNoPqRsTuV"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
