import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
const firebaseConfig = {
    apiKey: "AIzaSyC91yMq1n-1xQL4qyHZsWFypsrrJHdlI0s",
    authDomain: "my-dashborad-d84e0.firebaseapp.com",
    databaseURL: "https://my-dashborad-d84e0-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "my-dashborad-d84e0",
    storageBucket: "my-dashborad-d84e0.firebasestorage.app",
    messagingSenderId: "822468893324",
    appId: "1:822468893324:web:955791d3d3c52a1a9b39a9",
    measurementId: "G-K6SKL54EM8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

// Export the database reference
export { database };