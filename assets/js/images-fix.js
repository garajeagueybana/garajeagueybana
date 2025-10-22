// assets/js/images-fix.js
// Usa las imágenes del repo anterior (el commit que me pasaste)
const IMG_BASE = "https://raw.githubusercontent.com/RubenCentenoRoman/Website---Agueybana/192dfcb2c3a48b4789e13a05bc90c75cfa941094/Images/";

function full(f) { return IMG_BASE + f; }

document.addEventListener("DOMContentLoaded", () => {
  // 1) Reescribe los <img src="Images/...">
  document.querySelectorAll('img[src^="Images/"]').forEach(img => {
    const file = img.getAttribute('src').replace(/^Images\//,'');
    img.src = full(file);
  });

  // 2) Inyecta overrides para las imágenes de fondo definidas en CSS
  const style = document.createElement("style");
  style.textContent = `
    html{ background-image: url("${full('Default_BG.webp')}") !important; }
    .heading{ background-image: url("${full('Top_BG_3.webp')}") !important; }
    .summary-services{ background-image:
      linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),
      url("${full('Speedometer_Sum.webp')}") !important; }
    .subscription{ background-image: url("${full('Car_Brand_BG_2.webp')}") !important; }
    footer{ background-image:
      linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.2)),
      url("${full('bottom_part_BG_2.webp')}") !important; }
  `;
  document.head.appendChild(style);

  // 3) Si el carrusel usa rutas relativas en JS, actualiza también
  const left = document.getElementById("mainImgLeft");
  const right = document.getElementById("mainImgRight");
  if (left && right) {
    // valor inicial por si el script del carrusel tarda
    left.src  = full("1.jpg");
    right.src = full("1.jpg");
  }
});
