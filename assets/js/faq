// FAQ accesible (toggle uno a la vez)
(function(){
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-answer");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      // Cierra todos
      items.forEach(i=>{
        const b = i.querySelector(".faq-question");
        const p = i.querySelector(".faq-answer");
        b?.setAttribute("aria-expanded","false");
        p?.setAttribute("hidden","");
      });
      // Abre el actual si estaba cerrado
      if (!isOpen) {
        btn.setAttribute("aria-expanded","true");
        panel.removeAttribute("hidden");
      }
    });
  });
})();
