// ---------- Yordamchi funksiyalar ----------
const $ = (id) => document.getElementById(id);
const rand = (n) => Math.floor(Math.random() * n);
const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
const pick = (arr, n) => shuffle(arr).slice(0, n);

let stars = 0;
function addStar() {
  stars++;
  $("stars").textContent = stars;
}

function feedback(el, ok, next) {
  el.textContent = ok ? "🎉 Barakalla! To'g'ri!" : "🙂 Yana bir bor urinib ko'r!";
  el.className = "feedback " + (ok ? "ok" : "bad");
  if (ok) {
    addStar();
    setTimeout(() => { el.textContent = ""; next(); }, 1200);
  }
}

// ---------- Mashg'ulot rejalari ----------
function renderCards(age) {
  const list = age === "all" ? LESSONS : LESSONS.filter((l) => l.age === age);
  $("cards").innerHTML = list.map((l) => `
    <article class="card" data-id="${l.id}" tabindex="0">
      <div class="card-icon">${l.icon}</div>
      <span class="tag">${l.area}</span>
      <h3>${l.title}</h3>
      <p class="meta">👶 ${l.ageLabel} · ⏱ ${l.duration}</p>
      <p>${l.goal}</p>
      <span class="more">Batafsil →</span>
    </article>`).join("");
}

function openLesson(id) {
  const l = LESSONS.find((x) => x.id === id);
  $("modal-content").innerHTML = `
    <div class="card-icon">${l.icon}</div>
    <span class="tag">${l.area}</span>
    <h2>${l.title}</h2>
    <p class="meta">👶 ${l.ageLabel} · ⏱ ${l.duration}</p>
    <h4>🎯 Maqsad</h4><p>${l.goal}</p>
    <h4>🧺 Jihozlar</h4><ul>${l.materials.map((m) => `<li>${m}</li>`).join("")}</ul>
    <h4>📝 Mashg'ulotning borishi</h4><ol>${l.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
    <h4>🏁 Yakun</h4><p>${l.end}</p>`;
  $("modal").hidden = false;
}

$("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
  renderCards(btn.dataset.age);
});

$("cards").addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) openLesson(Number(card.dataset.id));
});
$("cards").addEventListener("keydown", (e) => {
  const card = e.target.closest(".card");
  if (card && e.key === "Enter") openLesson(Number(card.dataset.id));
});

$("modal-close").onclick = () => ($("modal").hidden = true);
$("modal").addEventListener("click", (e) => { if (e.target.id === "modal") $("modal").hidden = true; });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("modal").hidden = true; });

// ---------- O'yin: Sanab ko'r ----------
function countGame() {
  const n = rand(10) + 1;
  const item = COUNT_ITEMS[rand(COUNT_ITEMS.length)];
  $("count-stage").textContent = item.repeat(n);
  const options = new Set([n]);
  while (options.size < 3) options.add(rand(10) + 1);
  $("count-answers").innerHTML = shuffle([...options])
    .map((o) => `<button class="ans" data-v="${o}">${o}</button>`).join("");
  $("count-answers").onclick = (e) => {
    const b = e.target.closest(".ans");
    if (b) feedback($("count-feedback"), Number(b.dataset.v) === n, countGame);
  };
}

// ---------- O'yin: Rangni top ----------
function colorGame() {
  const opts = pick(COLORS, 4);
  const target = opts[rand(4)];
  $("color-question").innerHTML = `<b>${target.name.toUpperCase()}</b> rangni bos!`;
  $("color-answers").innerHTML = opts
    .map((c) => `<button class="ans swatch" style="background:${c.hex}" data-v="${c.name}" aria-label="${c.name}"></button>`).join("");
  $("color-answers").onclick = (e) => {
    const b = e.target.closest(".ans");
    if (b) feedback($("color-feedback"), b.dataset.v === target.name, colorGame);
  };
}

// ---------- O'yin: Shaklni top ----------
function shapeGame() {
  const opts = pick(SHAPES, 3);
  const target = opts[rand(3)];
  $("shape-question").innerHTML = `<b>${target.name.toUpperCase()}</b>ni top!`;
  $("shape-answers").innerHTML = opts.map((s) => {
    const color = COLORS[rand(COLORS.length)].hex;
    return `<button class="ans shape" data-v="${s.name}" aria-label="${s.name}">
      <svg viewBox="0 0 100 100" fill="${color}">${s.svg}</svg></button>`;
  }).join("");
  $("shape-answers").onclick = (e) => {
    const b = e.target.closest(".ans");
    if (b) feedback($("shape-feedback"), b.dataset.v === target.name, shapeGame);
  };
}

// ---------- O'yin: Kim nima yeydi ----------
function foodGame() {
  const opts = pick(ANIMALS, 3);
  const target = opts[rand(3)];
  $("food-question").innerHTML = `<b>${target.name}</b> nima yeydi?`;
  $("food-animal").textContent = target.animal;
  $("food-answers").innerHTML = shuffle(opts)
    .map((a) => `<button class="ans emoji" data-v="${a.food}">${a.food}</button>`).join("");
  $("food-answers").onclick = (e) => {
    const b = e.target.closest(".ans");
    if (b) feedback($("food-feedback"), b.dataset.v === target.food, foodGame);
  };
}

// ---------- Ishga tushirish ----------
renderCards("all");
countGame();
colorGame();
shapeGame();
foodGame();
