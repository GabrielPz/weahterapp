import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCQFgynuAU15blESlGqxBpZSfrp_Kk7RM",
  authDomain: "weatherapp-9e855.firebaseapp.com",
  projectId: "weatherapp-9e855",
  storageBucket: "weatherapp-9e855.appspot.com",
  messagingSenderId: "624462492729",
  appId: "1:624462492729:web:c4dd684cd0755e12cbc9e8",
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
