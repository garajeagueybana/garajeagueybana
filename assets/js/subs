// ===== Utilidades DOM =====
const $ = (sel) => document.querySelector(sel);

// ===== Referencias =====
const yearSelect = $("#year");
const makeSelect = $("#make");
const modelSelect = $("#model");
const planDiv = $("#plan");
const planHidden = $("#plan_hidden");
const form = $("#vehicleForm");
const resultDiv = $("#result");

// ===== Config =====
const allowedMakes = [
  "Toyota","Hyundai","Kia","Honda","Nissan","Mitsubishi","Mazda",
  "Ford","Chevrolet","Jeep","Subaru","Volkswagen","Chrysler",
  "Dodge","Ram","GMC","Buick","Acura","Infiniti","Lexus",
  "Mercedes-Benz","BMW","Audi","Lincoln","Cadillac",
  "MINI","Porsche","Volvo","Land Rover","Jaguar","Alfa Romeo","FIAT"
];

// Cache simple
const vehicleDataCache = {};

// ===== Helpers =====
function isElectricVehicle(make, model, fuelType = "") {
  const combined = `${make} ${model} ${fuelType}`.toLowerCase();
  const electricKeywords = [
    "electric","hybrid","plug-in","phev","bev","ev","prime","energi","e-tron",
    "bolt","leaf","volt","ioniq","clarity","taycan","mach-e","lightning",
    "i-pace","model s","model 3","model x","model y","id.4","id.3","ev6","niro ev","kona electric"
  ];
  if (fuelType.toLowerCase().includes("electric") || fuelType.toLowerCase().includes("hybrid")) return true;
  return electricKeywords.some((k) => combined.includes(k));
}

function estimateEngineFromModel(model, vehicleType) {
  const modelLower = model.toLowerCase();
  let displacement = 2.5, cylinders = 4;
  let estimatedType = vehicleType || "Passenger Car";

  if (modelLower.match(/f-\d{3}|silverado|sierra|ram \d{4}|tundra|titan/)) {
    estimatedType = "Truck"; displacement = 5.0; cylinders = 8;
  } else if (modelLower.match(/tahoe|suburban|expedition|yukon|escalade|navigator|armada/)) {
    estimatedType = "Large SUV"; displacement = 5.3; cylinders = 8;
  } else if (modelLower.match(/explorer|pilot|highlander|traverse|atlas|telluride|palisade/)) {
    estimatedType = "SUV"; displacement = 3.5; cylinders = 6;
  } else if (modelLower.match(/rav4|cr-v|escape|rogue|equinox|tucson|sportage|compass/)) {
    estimatedType = "Compact SUV"; displacement = 2.5; cylinders = 4;
  } else if (modelLower.match(/corolla|civic|sentra|elantra|forte|impreza|mazda3/)) {
    estimatedType = "Compact"; displacement = 2.0; cylinders = 4;
  } else if (modelLower.match(/camry|accord|altima|sonata|optima|legacy|mazda6/)) {
    estimatedType = "Midsize"; displacement = 2.5; cylinders = 4;
  } else if (modelLower.match(/mustang|camaro|challenger|charger|corvette/)) {
    estimatedType = "Sports Car"; displacement = 5.0; cylinders = 8;
  } else if (modelLower.match(/miata|mx-5|brz|86|370z|350z/)) {
    estimatedType = "Sports Car"; displacement = 2.0; cylinders = 4;
  } else if (modelLower.match(/odyssey|sienna|pacifica|carnival/)) {
    estimatedType = "Minivan"; displacement = 3.5; cylinders = 6;
  } else if (modelLower.match(/ranger|colorado|canyon|tacoma|frontier|maverick/)) {
    estimatedType = "Compact Truck"; displacement = 2.5; cylinders = 4;
  }

  if (modelLower.includes("v8") || modelLower.includes("5.0") || modelLower.includes("5.7") || modelLower.includes("6.2")) {
    cylinders = 8; displacement = 5.0;
  } else if (modelLower.includes("v6") || modelLower.includes("3.5") || modelLower.includes("3.6")) {
    cylinders = 6; displacement = 3.5;
  } else if (modelLower.includes("turbo") || modelLower.includes("2.0t")) {
    cylinders = 4; displacement = 2.0;
  }

  const dispMatch = modelLower.match(/(\d\.\d)l?/);
  if (dispMatch) displacement = parseFloat(dispMatch[1]);

  return { displacement, cylinders, vehicleType: estimatedType, engineConfig: cylinders <= 4 ? "Inline" : "V" };
}

function estimateOilCapacity(engineData) {
  if (!engineData) return 4.5;
  const { displacement, cylinders, vehicleType } = engineData;

  let oilCapacity = 4.0;
  if (displacement) {
    const l = parseFloat(displacement);
    if (l < 1.5) oilCapacity = 3.5;
    else if (l < 2.0) oilCapacity = 4.0;
    else if (l < 2.5) oilCapacity = 4.5;
    else if (l < 3.0) oilCapacity = 4.8;
    else if (l < 3.5) oilCapacity = 5.0;
    else if (l < 4.0) oilCapacity = 5.5;
    else if (l < 5.0) oilCapacity = 6.0;
    else if (l < 6.0) oilCapacity = 6.5;
    else oilCapacity = 7.0;
  }

  if (cylinders) {
    const c = parseInt(cylinders, 10);
    if (c <= 4) oilCapacity = Math.min(oilCapacity, 4.5);
    else if (c === 6) oilCapacity = Math.max(oilCapacity, 4.5);
    else if (c >= 8) oilCapacity = Math.max(oilCapacity, 5.5);
  }

  if (vehicleType) {
    const t = vehicleType.toLowerCase();
    if (t.includes("truck") || t.includes("suv") || t.includes("van")) oilCapacity = Math.max(oilCapacity, 5.0);
    if (t.includes("heavy") || t.includes("full-size")) oilCapacity += 0.5;
  }
  return oilCapacity;
}

// ===== API VPIC =====
async function getMakeId(makeName) {
  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakeForManufacturer/${encodeURIComponent(makeName)}?format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.Results?.length) return data.Results[0].Make_ID;

    const allMakesUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json`;
    const res2 = await fetch(allMakesUrl);
    const data2 = await res2.json();
    const match = data2.Results?.find(m => m.Make_Name.toLowerCase() === makeName.toLowerCase());
    return match ? match.Make_ID : null;
  } catch {
    return null;
  }
}

async function getVehicleDetails(year, make, model) {
  const cacheKey = `${year}-${make}-${model}`;
  if (vehicleDataCache[cacheKey]) return vehicleDataCache[cacheKey];

  try {
    const makeId = await getMakeId(make);
    if (makeId) {
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`;
      const res = await fetch(url);
      const data = await res.json();
      const found = data.Results?.find(m =>
        m.Model_Name.toLowerCase().includes(model.toLowerCase()) ||
        model.toLowerCase().includes(m.Model_Name.toLowerCase())
      );

      let vehicleType = "Passenger Car";
      const typeUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${makeId}?format=json`;
      const tr = await fetch(typeUrl);
      const td = await tr.json();
      if (td.Results?.length) vehicleType = td.Results[0].VehicleTypeName || "Passenger Car";

      const engineData = estimateEngineFromModel(found ? found.Model_Name : model, vehicleType);
      vehicleDataCache[cacheKey] = engineData;
      return engineData;
    }
    const engineData = estimateEngineFromModel(model, "");
    vehicleDataCache[cacheKey] = engineData;
    return engineData;
  } catch {
    return estimateEngineFromModel(model, "");
  }
}

// ===== Clasificación =====
async function classifyVehicle(year, make, model) {
  if (isElectricVehicle(make, model)) return { type: "electric", oilCapacity: 0 };
  const vehicleData = await getVehicleDetails(year, make, model);
  const oilCapacity = estimateOilCapacity(vehicleData);
  return oilCapacity < 5.0 ? { type: "Sedan", oilCapacity } : { type: "Guagua", oilCapacity };
}

// ===== UI helpers =====
function showLoading(selectEl, text = "Cargando...") {
  selectEl.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = text;
  opt.disabled = true;
  opt.selected = true;
  selectEl.appendChild(opt);
}

function resetPlan() {
  planDiv.textContent = "—";
  planDiv.removeAttribute("data-oil-capacity");
  planHidden.value = "";
  hideResult();
}

function showResult(html, className) {
  resultDiv.className = `result-card ${className || ""}`.trim();
  resultDiv.innerHTML = html;
  resultDiv.hidden = false;
}

function hideResult() {
  resultDiv.hidden = true;
  resultDiv.className = "result-card";
  resultDiv.innerHTML = "";
}

// ===== Poblar años =====
(function initYears() {
  const cur = new Date().getFullYear();
  for (let y = cur; y >= cur - 30; y--) {
    yearSelect.add(new Option(y, y));
  }
})();

// ===== Eventos =====
yearSelect.addEventListener("change", async () => {
  resetPlan();
  makeSelect.innerHTML = '<option value="">Selecciona marca</option>';
  modelSelect.innerHTML = '<option value="">Selecciona modelo</option>';
  makeSelect.disabled = true;
  modelSelect.disabled = true;

  if (!yearSelect.value) return;

  try {
    showLoading(makeSelect, "Cargando marcas…");
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json`);
    const data = await res.json();

    const sortedMakes = (data.Results || [])
      .map(i => i.MakeName.trim())
      .filter(m => allowedMakes.some(a => a.toLowerCase() === m.toLowerCase()))
      .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

    makeSelect.innerHTML = '<option value="">Selecciona marca</option>';
    if (!sortedMakes.length) {
      const opt = new Option("No hay marcas disponibles", "");
      opt.disabled = true;
      makeSelect.add(opt);
      return;
    }
    sortedMakes.forEach(m => makeSelect.add(new Option(m, m)));
    makeSelect.disabled = false;
  } catch (e) {
    showResult("<p>Error al cargar las marcas. Verifica tu conexión e inténtalo de nuevo.</p>", "error");
  }
});

makeSelect.addEventListener("change", async () => {
  resetPlan();
  modelSelect.innerHTML = '<option value="">Selecciona modelo</option>';
  modelSelect.disabled = true;

  if (!makeSelect.value || !yearSelect.value) return;

  try {
    showLoading(modelSelect, "Cargando modelos…");
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(makeSelect.value)}/modelyear/${yearSelect.value}?format=json`
    );
    const data = await res.json();

    const filteredModels = (data.Results || [])
      .map(i => i.Model_Name.trim())
      .filter(name => !isElectricVehicle(makeSelect.value, name))
      .filter((name, idx, arr) => arr.indexOf(name) === idx)
      .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

    modelSelect.innerHTML = '<option value="">Selecciona modelo</option>';
    if (!filteredModels.length) {
      const opt = new Option("No hay modelos de gasolina disponibles", "");
      opt.disabled = true;
      modelSelect.add(opt);
    } else {
      filteredModels.forEach(m => modelSelect.add(new Option(m, m)));
      modelSelect.disabled = false;
    }
  } catch (e) {
    showResult("<p>Error al cargar los modelos. Inténtalo de nuevo.</p>", "error");
  }
});

modelSelect.addEventListener("change", async () => {
  resetPlan();
  if (!modelSelect.value) return;
  planDiv.innerHTML = "<small>Calculando…</small>";

  try {
    const c = await classifyVehicle(yearSelect.value, makeSelect.value, modelSelect.value);
    if (c.type === "electric") {
      planDiv.textContent = "No disponible";
      planHidden.value = "";
      showResult("Los vehículos eléctricos e híbridos no están disponibles en nuestros planes de mantenimiento.", "electric");
      return;
    }
    planDiv.innerHTML = `${c.type} <br><small>(${c.oilCapacity.toFixed(1)} qt de aceite)</small>`;
    planDiv.dataset.oilCapacity = String(c.oilCapacity);
    planHidden.value = c.type;
    hideResult();
  } catch {
    planDiv.textContent = "Error";
    showResult("Error al clasificar el vehículo. Inténtalo de nuevo.", "error");
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!yearSelect.value || !makeSelect.value || !modelSelect.value || !planHidden.value) {
    showResult("Por favor completa todos los campos para continuar.", "error");
    return;
  }
  if (planHidden.value === "electric") {
    showResult("Este vehículo no es compatible con nuestros planes de mantenimiento.", "electric");
    return;
  }

  const oil = parseFloat(planDiv.dataset.oilCapacity || "4.5");
  let className = "", planInfo = "";
  if (planHidden.value === "Sedan") { className = "sedan"; planInfo = "Sedán Básico – $400/año"; }
  else if (planHidden.value === "Guagua") { className = "suv"; planInfo = "Guagua Básica – $500/año"; }
  else { showResult("Error en la clasificación del vehículo.", "error"); return; }

  const vehicleInfo = `${yearSelect.value} ${makeSelect.value} ${modelSelect.value}`;
  showResult(`
    <div class="vehicle-info"><strong>${vehicleInfo}</strong></div>
    <div class="oil-info">Capacidad de aceite: <b>${oil.toFixed(1)} cuartos</b></div>
    <div class="plan-info">Tu plan: <b>${planInfo}</b></div>
    <div class="extra-info">
      <p>*Incluye 4 mantenimientos al año: inspección, cambio de fluidos, revisión básica de frenos y sistemas eléctricos.</p>
      <p class="oil-note">Regla: &lt; 5 qt = Sedán, ≥ 5 qt = Guagua.</p>
    </div>
    <button type="button" class="reset-btn" id="resetBtn">Nuevo cálculo</button>
  `, className);

  // deshabilita selects para confirmación visual
  yearSelect.disabled = true;
  makeSelect.disabled = true;
  modelSelect.disabled = true;

  $("#resetBtn").addEventListener("click", () => {
    // reset sin recargar
    form.reset();
    hideResult();
    resetPlan();
    yearSelect.disabled = false;
    makeSelect.disabled = true;
    modelSelect.disabled = true;
    makeSelect.innerHTML = '<option value="">Selecciona marca</option>';
    modelSelect.innerHTML = '<option value="">Selecciona modelo</option>';
  });
});

// Fallback hamburguesa por si falla main.js
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
  mainMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", ()=> setMenu(false)));
})();
