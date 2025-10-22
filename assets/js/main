// Hamburguesa + cierre automático
(function(){
  const hamburger = document.querySelector(".hamburger");
  const mainMenu = document.getElementById("main-menu");
  if (!hamburger || !mainMenu) return;

  function setMenu(open) {
    mainMenu.classList.toggle("active", open);
    hamburger.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
  }

  hamburger.addEventListener("click", () => {
    setMenu(!hamburger.classList.contains("active"));
  });

  mainMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => setMenu(false));
  });
})();

// Tarjetas (index) clicables por teclado/ratón
(function(){
  document.querySelectorAll(".subscription article[data-link]").forEach(card=>{
    card.addEventListener("click", ()=> location.href = card.dataset.link);
    card.addEventListener("keydown", (e)=> {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        location.href = card.dataset.link;
      }
    });
  });
})();

// Carrusel de servicios (index)
(function(){
  const IMG_PREFIX = "https://raw.githubusercontent.com/RubenCentenoRoman/Website---Agueybana/192dfcb2c3a48b4789e13a05bc90c75cfa941094/Images/";

  const slides = [
    { t:"Mecánica liviana",
      c:"Mantenimiento y reparaciones esenciales para prolongar la vida útil de tu vehículo. Cambio de aceite, filtros, frenos y ajustes.",
      i: IMG_PREFIX + "Liviana_Sum.webp" },
    { t:"Electromecánica",
      c:"Diagnóstico y reparación de sistemas eléctricos y electrónicos. Batería, alternador, arranque, luces y cableado.",
      i: IMG_PREFIX + "Electro_Sum.webp" },
    { t:"Inspección de vehículo",
      c:"Revisión de frenos, suspensión, dirección, motor, transmisión, luces y fluidos.",
      i: IMG_PREFIX + "Inspection_Sum.webp" },
    { t:"Alineamiento",
      c:"Ajuste de ángulos de ruedas para estabilidad, menor desgaste y mejor dirección.",
      i: IMG_PREFIX + "Alignment_Sum.webp" }
  ];

  const title = document.getElementById("title");
  const text  = document.getElementById("text");
  const smallTitle = document.getElementById("smallTitle");
  const mainImgLeft = document.getElementById("mainImgLeft");
  const mainImgRight= document.getElementById("mainImgRight");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!title || !text || !smallTitle || !mainImgLeft || !mainImgRight) return;

  let idx = 0;
  function show() {
    const textContent = document.querySelector(".summary-text");
    textContent?.classList.remove("animate-text");
    // reflow
    void textContent?.offsetWidth;
    title.textContent = slides[idx].t;
    text.textContent = slides[idx].c;
    smallTitle.textContent = slides[idx].t;
    mainImgLeft.src = slides[idx].i;
    mainImgRight.src = slides[idx].i;
    textContent?.classList.add("animate-text");
  }
  function prev(){ idx = (idx - 1 + slides.length) % slides.length; show(); }
  function next(){ idx = (idx + 1) % slides.length; show(); }

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);
  show();
})();
