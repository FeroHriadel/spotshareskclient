import firebase from 'firebase';



var firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "spotshare-7bbaa.firebaseapp.com",
    projectId: "spotshare-7bbaa",
    storageBucket: "spotshare-7bbaa.appspot.com",
    // messagingSenderId: "754353839476",
    appId: "1:754353839476:web:6b33a1942dd1d9a7d72021",
    measurementId: "G-8RD6GNRMZS"
};



if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}


export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();