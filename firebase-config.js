<!-- firebase-config.js -->
<script type="module">
 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiaxxwsZrCYJPZpvZuM6Imjac25ctwyi4",
  authDomain: "authentication-d736c.firebaseapp.com",
  projectId: "authentication-d736c",
  storageBucket: "authentication-d736c.firebasestorage.app",
  messagingSenderId: "878744309223",
  appId: "1:878744309223:web:77090259458f75c9448142",
  measurementId: "G-VEPL7E7Q14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  };
</script>
