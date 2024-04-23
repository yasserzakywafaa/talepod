import { getAnalytics } from "firebase/analytics";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5F__YNFm_Ibvv0F7_p22S2erRwSF1M0U",
  authDomain: "ai-story-creator.firebaseapp.com",
  projectId: "ai-story-creator",
  storageBucket: "ai-story-creator.appspot.com",
  messagingSenderId: "646497665840",
  appId: "1:646497665840:web:c3a264c3e0bdb3e3967ef5",
  measurementId: "G-PTZSYFT2SR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log("firebase analytics", {
  analytics,
});
