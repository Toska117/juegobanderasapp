// firebase.js
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase (la encuentras en la consola de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyDQiCrfRMs3AnCe4BIsN_hQO-aiNrCNrDg",
  authDomain: "sasa-a87eb.firebaseapp.com",
  projectId: "sasa-a87eb",
  storageBucket: "sasa-a87eb.firebasestorage.app",
  messagingSenderId: "394239044863",
  appId: "1:394239044863:web:909a2d659adbf92f4b30ca",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener la instancia de Firestore
const db = getFirestore(app);

export { db };
