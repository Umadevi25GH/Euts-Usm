// Your web app's Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";


// alert("test firebase");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDcuV0KDE2YwUaNcvTXuzbHdkLBU6tJG7E",
    authDomain: "euts-1ca62.firebaseapp.com",
    databaseURL: "https://euts-1ca62-default-rtdb.firebaseio.com",
    projectId: "euts-1ca62",
    storageBucket: "euts-1ca62.appspot.com",
    messagingSenderId: "724926563194",
    appId: "1:724926563194:web:5e2fb6aedcb1cdf57cccc3",
    measurementId: "G-JW8L099ZC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
var storage = getStorage();

const db = getFirestore(app);
const auth = getAuth(app);


// //making as administrator
// import admin from 'firebase-admin'; // Import the necessary Firebase modules

// // Initialize the Admin SDK
// admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//     // Replace with your Firebase project ID
//     projectId: 'euts-1ca62'
//   });

//   // Set the admin custom claim for a specific user
// const userEmail = 'ahmad.ali@eutscorp.com'; // Replace with the desired email
// const uid = 'OgMljJ3OMyU3qq1OXpfM2Ed6VO43'; // Replace with the UID of the user

// admin.auth().setCustomUserClaims(uid, { admin: true })
//   .then(() => {
//     console.log('Successfully added admin role to user:', userEmail);
//   })
//   .catch((error) => {
//     console.error('Error adding admin role to user:', error);
// });




// import { initializeApp, credential as _credential } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-admin.js";

// // Initialize the app with the service account credentials
// import serviceAccount from "./euts-1ca62-firebase-adminsdk-wsbq9-93bdcb7848.json";

// // Your code using the Firebase Admin SDK
// initializeApp({
//     credential: _credential.cert(serviceAccount),
//     databaseURL: "https://euts-1ca62-default-rtdb.firebaseio.com"
// });








export { storage, auth, db, app};
