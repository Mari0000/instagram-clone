import firebase from "firebase";


const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAYUoTWRUlc0ohZc6clNFPlHAVV5wurqMo",
  authDomain: "instagram-clone-806f8.firebaseapp.com",
  databaseURL: "https://instagram-clone-806f8.firebaseio.com",
  projectId: "instagram-clone-806f8",
  storageBucket: "instagram-clone-806f8.appspot.com",
  messagingSenderId: "869152460090",
  appId: "1:869152460090:web:d7fde6b118871330bf9403",
  measurementId: "G-39GEQ33Z8X"
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


  export { db, auth, storage };