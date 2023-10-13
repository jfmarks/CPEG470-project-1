import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
  
            // Your web app's Firebase configuration
            const firebaseConfig = {
                apiKey: "AIzaSyAnAXJ-jUQ_ns4VJaxgprA12vvPZ-bfyE8",
                authDomain: "tournamentwebapp.firebaseapp.com",
                databaseURL: "https://tournamentwebapp-default-rtdb.firebaseio.com",
                projectId: "tournamentwebapp",
                storageBucket: "tournamentwebapp.appspot.com",
                messagingSenderId: "280371859456",
                appId: "1:280371859456:web:50e509564cdcb1aaa208e5"
            };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {app, db}