// assets/js/auth.js
import { firebaseConfig } from "../../firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// Inserta link "Iniciar sesión / Mi cuenta" en la barra
(function injectAuthButtons(){
  const container = document.querySelector(".nav-center");
  if (!container) return;

  const a = document.createElement("a");
  a.id = "accountLink";
  a.style.background = "transparent";
  a.style.color = "white";
  a.style.textDecoration = "underline";
  a.style.padding = "0.8rem 1rem";
  a.style.cursor = "pointer";
  container.appendChild(a);

  onAuthStateChanged(auth, (user) => {
    if (user) { a.textContent = "Mi cuenta"; a.href = "account.html"; }
    else      { a.textContent = "Iniciar sesión / Crear cuenta"; a.href = "login.html"; }
  });
})();

export async function logout(){
  await signOut(auth);
  location.href = "index.html";
}
