// assets/js/subs.js

// Utilidades de UI
function showLoading(element, text = "Cargando...") {
  element.innerHTML = '';
  const option = document.createElement('option');
  option.value = '';
  option.textContent = text;
  option.disabled = true;
  element.appendChild(option);
}

// Detección rápida (no EV en planes)
function isElectricVehicle(make, model, fuelType='') {
  const combined = `${make} ${model} ${fuelType}`.toLowerCase();
  const kw = ['electric','hybrid','plug-in','phev','bev','ev','e-tron','bolt','leaf','ioniq','mach-e','lightning','id.4','ev6','kona electric'];
  if (fuelType.toLowerCase().includes('electric') || fuelType.toLowerCase().includes('hybrid')) return true;
  return kw.some(k => combined.includes(k));
}

// Estimar aceite
function estimateOilCapacity({ displacement=2.5, cylinders=4, vehicleType="" } = {}) {
  let oil = 4.5;
  const l = parseFloat(displacement)||2.5;
  if (l<2.0) oil=4.0; else if (l<2.5) oil=4.5; else if (l<3.0) oil=4.8; else if (l<3.5) oil=5.0; else if (l<4.0) oil=5.5; else oil=6.0;
  if (cylinders>=8) oil=Math.max(oil,5.5);
  if ((vehicleType||"").toLowerCase().match(/truck|suv|van/)) oil=Math.max(oil,5.0);
  return oil;
}

// Reglas por modelo (heurística)
function estimateEngineFromModel(model, vehicleType){
  const m = (model||"").toLowerCase();
  let displacement = 2.5, cylinders=4, vt=vehicleType||'Passenger';
  if (m.match(/f-\d{3}|silverado|sierra|ram \d{4}|tundra|titan/)) { vt='Truck'; displacement=5.0; cylinders=8; }
  else if (m.match(/tahoe|suburban|expedition|yukon|escalade|navigator|armada/)) { vt='Large SUV'; displacement=5.3; cylinders=8; }
  else if (m.match(/explorer|pilot|highlander|traverse|atlas|telluride|palisade/)) { vt='SUV'; displacement=3.5; cylinders=6; }
  return { displacement, cylinders, vehicleType: vt, engineConfig: cylinders<=4?'Inline':'V' };
}

// Clasificación principal
export async function classifyVehicle(year, make, model) {
  if (isElectricVehicle(make, model)) return { type:'electric', oilCapacity:0 };

  const engineData = estimateEngineFromModel(model,'');
  const oil = estimateOilCapacity(engineData);

  // Mapear a tus tiers renombrados
  // <5 qt => Naboria ; >=5 qt => Nitaíno ; Premium = "El Cacique" (elige aparte)
  return { type: (oil<5 ? "Naboria" : "Nitaíno"), oilCapacity: oil };
}

// --------- Vincular al formulario de subscripcion.html ---------
const yearSelect = document.getElementById("year");
const makeSelect = document.getElementById("make");
const modelSelect = document.getElementById("model");
const planDiv    = document.getElementById("plan");
const planHidden = document.getElementById("plan_hidden");
const form       = document.getElementById("vehicleForm");
const resultDiv  = document.getElementById("result");

// Poblar años
if (yearSelect){
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 30; y--) yearSelect.add(new Option(y, y));
}

function resetPlan(){ if(planDiv){ planDiv.textContent="—"; planHidden.value=""; hideError(); } }
function showError(message, type="error"){
  if(!resultDiv) return;
  resultDiv.className = `result-card ${type}`;
  resultDiv.innerHTML = `<p>${message}</p>`;
  resultDiv.classList.remove("hidden");
}
function hideError(){ if(resultDiv){ resultDiv.innerHTML=""; resultDiv.className="result-card hidden"; } }

if (makeSelect) makeSelect.addEventListener("change", resetPlan);
if (modelSelect) modelSelect.addEventListener("change", resetPlan);
if (yearSelect)  yearSelect.addEventListener("change", resetPlan);

// Calcular plan cuando haya datos
if (modelSelect){
  modelSelect.addEventListener("change", async ()=>{
    if (!yearSelect.value || !makeSelect.value || !modelSelect.value) return;
    planDiv.innerHTML = '<small>Calculando...</small>';
    const classification = await classifyVehicle(yearSelect.value, makeSelect.value, modelSelect.value);
    if (classification.type === 'electric') {
      planDiv.textContent = "No disponible";
      planHidden.value = "";
      showError("Los vehículos eléctricos o híbridos no están disponibles en nuestros planes.", "electric");
      return;
    }
    planDiv.innerHTML = `${classification.type} <br><small>(${classification.oilCapacity.toFixed(1)} qt de aceite)</small>`;
    planHidden.value  = classification.type;
    hideError();
  });
}

// Submit del formulario (solo muestra el resultado)
if (form){
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    if (!yearSelect.value || !makeSelect.value || !modelSelect.value || !planHidden.value) {
      showError("Por favor completa todos los campos para continuar."); return;
    }
    const oil = parseFloat(planDiv?.dataset?.oilCapacity) || 4.5;
    let className = planHidden.value === "Naboria" ? "sedan" : "suv";
    resultDiv.className = `result-card ${className}`;
    resultDiv.innerHTML = `
      <div class="vehicle-info"><strong>${yearSelect.value} ${makeSelect.value} ${modelSelect.value}</strong></div>
      <div class="plan-info">Tu plan: <b>${planHidden.value}</b></div>
      <p class="oil-note">*Regla: &lt; 5 qt ⇒ <b>Naboria</b>; ≥ 5 qt ⇒ <b>Nitaíno</b>. Para beneficios extra, elige <b>El Cacique</b>.</p>
    `;
    resultDiv.classList.remove("hidden");
  });
}
