// assets/js/main.js
// Carrusel de servicios (Index)
const slides = [
  {t:"Mecánica liviana",
   c:"Mantenimiento y reparaciones esenciales para prolongar la vida útil de tu vehículo. Cambio de aceite, filtros, frenos, correas, etc.",
   i:"Images/Liviana_Sum.webp"},
  {t:"Electromecánica",
   c:"Diagnóstico y reparación de sistemas eléctricos y electrónicos: batería, alternador, motor de arranque, luces y cableado.",
   i:"Images/Electro_Sum.webp"},
  {t:"Inspección de vehículo",
   c:"Revisión general: frenos, suspensión, dirección, motor, transmisión, luces y fluidos.",
   i:"Images/Inspection_Sum.webp"},
  {t:"Alineamiento",
   c:"Ajuste de ángulos de rueda para estabilidad, menor desgaste de neumáticos y mejor dirección.",
   i:"Images/Alignment_Sum.webp"}
];
let idx = 0;
function show() {
  const textContent = document.querySelector(".summary-text");
  const title = document.getElementById("title");
  const text  = document.getElementById("text");
  const smallTitle = document.getElementById("smallTitle");
  const mainImgLeft  = document.getElementById("mainImgLeft");
  const mainImgRight = document.getElementById("mainImgRight");
  textContent?.classList.remove("animate-text");
  void textContent?.offsetWidth;
  if(title&&text&&smallTitle&&mainImgLeft&&mainImgRight){
    title.textContent = slides[idx].t;
    text.textContent  = slides[idx].c;
    smallTitle.textContent = slides[idx].t;
    mainImgLeft.src  = slides[idx].i;
    mainImgRight.src = slides[idx].i;
    textContent?.classList.add("animate-text");
  }
}
function prev() { idx = (idx - 1 + slides.length) % slides.length; show(); }
function next() { idx = (idx + 1) % slides.length; show(); }
window.addEventListener("DOMContentLoaded", show);

// Menú hamburguesa
window.toggleMenu = function(){
  const navCenter = document.querySelector('.nav-center');
  const hamburger = document.querySelector('.hamburger');
  navCenter?.classList.toggle('active');
  hamburger?.classList.toggle('active');
};
document.addEventListener("click",(e)=>{
  if (e.target?.closest(".nav-center button")) {
    document.querySelector('.nav-center')?.classList.remove('active');
    document.querySelector('.hamburger')?.classList.remove('active');
  }
});
