// ================= FIREBASE CONFIGURATION =================
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Firebase configuration (DO NOT EXPOSE KEYS PUBLICLY)
const firebaseConfig = {
    apiKey: "AIzaSyBr0k-tSymwI_yqTRSNL3jxu30WbFzJ4ak",
    authDomain: "travelgram-260aa.firebaseapp.com",
    projectId: "travelgram-260aa",
    storageBucket: "travelgram-260aa.firebasestorage.app",
    messagingSenderId: "784349147253",
    appId: "1:784349147253:web:828d603cdb1d4318cec83c",
    measurementId: "G-C4NFTWY0VX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
