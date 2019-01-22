import firebase from 'firebase/app';
import 'firebase/firebase-firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAW7ZZO1Q2eS6UrHYDSJpCFBblMuTzUbto",
  authDomain: "admusuarios-b86f7.firebaseapp.com",
  projectId: "admusuarios-b86f7",
});

let db = firebase.firestore();
/*db.settings({
  timestampsInSnapshots: true
});*/

export default db;