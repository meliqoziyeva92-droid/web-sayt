// =====================================================================
//  Ilova: bosh sahifa, o'yin ekrani, mukofotlar, tarbiyachi paneli
// =====================================================================

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const PROGRESS_KEY = "bogcha-progress";
const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); // gameId -> to'g'ri javoblar
const saveProgress = () => localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
const totalStars = () => Object.values(progress).reduce((a, b) => a + b, 0);
const STARS_PER_CARD = 5; // har 5 ta to'g'ri javob = kartadagi 1 yulduz (maks. 3)
const ROUND_GOAL = 5;     // 5 ta to'g'ri javobdan keyin kubok

// =====================================================================
//  UI — o'yinlar ishlatadigan umumiy funksiyalar
// =====================================================================
const UI = {
  game: null,
  prompt: [],
  locked: false,
  streak: 0,

  gameCorrect: (id) => progress[id] || 0,

  open(game) {
    UI.game = game;
    UI.streak = 0;
    $("#home").hidden = true;
    $("#game").hidden = false;
    $("#game-name").innerHTML = `<span>${game.icon}</span> ${game.title}`;
    $("#game").dataset.theme = game.theme;
    $("#game").dataset.id = game.id;
    renderProgress();
    window.scrollTo(0, 0);
    game.round();
  },

  close() {
    Voice.stop();
    UI.game = null;
    $("#game").hidden = true;
    $("#home").hidden = false;
    renderHome();
  },

  // Rasmli javoblar bilan savol
  ask({ prompt, visual = "", options }) {
    UI.prompt = prompt;
    UI.locked = false;
    $("#visual").innerHTML = visual;
    $("#visual").hidden = !visual;
    const box = $("#answers");
    box.innerHTML = "";
    box.hidden = false;
    box.dataset.count = options.length;
    options.forEach((o, i) => {
      const b = document.createElement("button");
      b.className = "answer pop";
      b.style.animationDelay = i * 70 + "ms";
      b.innerHTML = o.html;
      b.onclick = () => UI.answer(b, o);
      box.append(b);
    });
    $("#hint").textContent = prompt.map((k) => PHRASES[k]).join(" ");
    Voice.speak(prompt);
  },

  // O'yin o'zi chizadigan maxsus maydon (xotira, alifbo)
  custom(html, prompt) {
    UI.prompt = prompt;
    UI.locked = false;
    $("#visual").innerHTML = html;
    $("#visual").hidden = false;
    $("#answers").hidden = true;
    $("#hint").textContent = prompt.map((k) => PHRASES[k]).join(" ");
    Voice.speak(prompt);
  },

  answer(btn, opt) {
    if (UI.locked) return;
    if (opt.ok) {
      UI.locked = true;
      btn.classList.add("right");
      $$("#answers .answer").forEach((b) => { if (b !== btn) b.classList.add("dim"); });
      UI.win(opt.after || []);
    } else {
      btn.classList.remove("wrong");
      void btn.offsetWidth; // animatsiyani qayta boshlash
      btn.classList.add("wrong");
      Voice.speak(R.one(["retry1", "retry2"]));
    }
  },

  // To'g'ri javob: yulduz, konfetti, maqtov, keyingi savol
  win(after = []) {
    const game = UI.game;
    progress[game.id] = (progress[game.id] || 0) + 1;
    saveProgress();
    UI.streak++;
    updateStars();
    renderProgress(true);
    confetti();

    const isReward = UI.streak % ROUND_GOAL === 0;
    const speech = Voice.speak([...after, R.one(["praise1", "praise2", "praise3", "praise4"])]);
    const minWait = new Promise((r) => setTimeout(r, 1300));
    const maxWait = new Promise((r) => setTimeout(r, 5000));

    Promise.race([Promise.all([speech, minWait]), maxWait]).then(() => {
      if (UI.game !== game) return; // bola bosh sahifaga qaytgan
      if (isReward) showReward();
      else game.round();
    });
  }
};

// =====================================================================
//  Bosh sahifa
// =====================================================================
let activeCat = "all";

function renderChips() {
  const cats = [["all", `Barcha o'yinlar (${GAMES.length})`], ...Object.entries(CATEGORY_NAMES)];
  $("#chips").innerHTML = cats.map(([id, name]) =>
    `<button class="chip ${id === activeCat ? "active" : ""}" data-cat="${id}">${name}</button>`).join("");
}

function renderHome() {
  const list = activeCat === "all" ? GAMES : GAMES.filter((g) => g.cat === activeCat);
  $("#game-grid").innerHTML = list.map((g) => {
    const stars = Math.min(3, Math.floor((progress[g.id] || 0) / STARS_PER_CARD));
    return `
    <button class="game-card t-${g.theme}" data-id="${g.id}">
      <span class="card-top">
        <span class="card-tag">${g.tag}</span>
        <span class="card-stars">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</span>
      </span>
      <span class="card-icon">${g.icon}</span>
      <span class="card-title">${g.title}</span>
      <span class="card-sub">${g.sub}</span>
    </button>`;
  }).join("");
  updateStars();
}

function updateStars() {
  $("#stars-total").textContent = totalStars();
}

function renderProgress(animateLast) {
  const filled = UI.streak % ROUND_GOAL || (UI.streak && animateLast ? ROUND_GOAL : 0);
  $("#progress").innerHTML = Array.from({ length: ROUND_GOAL }, (_, i) =>
    `<span class="pstar ${i < filled ? "on" : ""} ${animateLast && i === filled - 1 ? "pop" : ""}">⭐</span>`).join("");
}

// =====================================================================
//  Effektlar
// =====================================================================
function confetti() {
  const box = $("#confetti");
  const items = ["⭐", "🎉", "✨", "🌟", "🎈", "💖"];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.textContent = R.one(items);
    s.style.left = 10 + Math.random() * 80 + "%";
    s.style.setProperty("--dx", (Math.random() * 200 - 100) + "px");
    s.style.animationDelay = Math.random() * 0.25 + "s";
    s.style.fontSize = 22 + Math.random() * 26 + "px";
    box.append(s);
    setTimeout(() => s.remove(), 1800);
  }
}

function showReward() {
  $("#reward").hidden = false;
  confetti();
  setTimeout(confetti, 500);
  Voice.speak("reward");
}

$("#reward-next").onclick = () => {
  $("#reward").hidden = true;
  UI.streak = 0;
  renderProgress();
  if (UI.game) UI.game.round();
};

// =====================================================================
//  Hodisalar
// =====================================================================
$("#start-btn").onclick = () => {
  $("#start").classList.add("gone");
  setTimeout(() => $("#start").remove(), 500);
  Voice.speak("welcome");
};

$("#chips").onclick = (e) => {
  const c = e.target.closest(".chip");
  if (!c) return;
  activeCat = c.dataset.cat;
  renderChips();
  renderHome();
};

$("#game-grid").onclick = (e) => {
  const card = e.target.closest(".game-card");
  if (card) UI.open(GAMES.find((g) => g.id === card.dataset.id));
};

$("#home-btn").onclick = UI.close;
$("#logo").onclick = () => { if (UI.game) UI.close(); };
$("#repeat-btn").onclick = () => Voice.speak(UI.prompt);
$("#voice-guide").onclick = () => Voice.speak(UI.game ? UI.prompt : "guide");
$("#hero-listen").onclick = () => Voice.speak("welcome");
$("#mascot").onclick = () => Voice.speak("welcome");
$("#tip-listen").onclick = () => Voice.speak("tip");

// =====================================================================
//  Tarbiyachi: kattalar tekshiruvi
// =====================================================================
let gateAnswer = 0;
$("#teacher-btn").onclick = () => {
  const a = R.int(6) + 3, b = R.int(6) + 3;
  gateAnswer = a + b;
  $("#gate-q").textContent = `${a} + ${b} = ?`;
  $("#gate-input").value = "";
  $("#gate-err").textContent = "";
  $("#gate").hidden = false;
  $("#gate-input").focus();
};
function checkGate() {
  if (Number($("#gate-input").value) === gateAnswer) {
    $("#gate").hidden = true;
    openTeacher();
  } else {
    $("#gate-err").textContent = "Javob noto'g'ri";
  }
}
$("#gate-ok").onclick = checkGate;
$("#gate-input").onkeydown = (e) => { if (e.key === "Enter") checkGate(); };
$("#gate-cancel").onclick = () => ($("#gate").hidden = true);

function openTeacher() {
  Voice.stop();
  $("#teacher").hidden = false;
  document.body.classList.add("no-scroll");
  renderLessons();
  renderPhrases();
  renderSettings();
}
$("#teacher-close").onclick = () => {
  stopRecording();
  $("#teacher").hidden = true;
  document.body.classList.remove("no-scroll");
  renderHome();
};

$$(".t-tab").forEach((t) => {
  t.onclick = () => {
    $$(".t-tab").forEach((x) => x.classList.toggle("active", x === t));
    $$(".t-page").forEach((p) => (p.hidden = p.id !== "tab-" + t.dataset.tab));
  };
});

// ---------- Mashg'ulot rejalari ----------
let activeAge = "all";
function renderLessons() {
  const list = activeAge === "all" ? LESSONS : LESSONS.filter((l) => l.age === activeAge);
  $("#lesson-detail").hidden = true;
  $("#lesson-grid").hidden = false;
  $("#lesson-grid").innerHTML = list.map((l) => `
    <button class="lesson-card" data-id="${l.id}">
      <span class="l-icon">${l.icon}</span>
      <span class="card-tag">${l.area}</span>
      <b>${l.title}</b>
      <small>👶 ${l.ageLabel} · ⏱ ${l.duration}</small>
      <span class="l-goal">${l.goal}</span>
    </button>`).join("");
}
$("#age-chips").onclick = (e) => {
  const c = e.target.closest(".chip");
  if (!c) return;
  activeAge = c.dataset.age;
  $$("#age-chips .chip").forEach((x) => x.classList.toggle("active", x === c));
  renderLessons();
};
$("#lesson-grid").onclick = (e) => {
  const c = e.target.closest(".lesson-card");
  if (!c) return;
  const l = LESSONS.find((x) => x.id === Number(c.dataset.id));
  $("#lesson-grid").hidden = true;
  const d = $("#lesson-detail");
  d.hidden = false;
  d.innerHTML = `
    <button class="btn-flat no-print" id="lesson-back">← Orqaga</button>
    <div class="l-head"><span class="l-icon">${l.icon}</span><div>
      <span class="card-tag">${l.area}</span><h2>${l.title}</h2>
      <small>👶 ${l.ageLabel} · ⏱ ${l.duration}</small></div></div>
    <h4>🎯 Maqsad</h4><p>${l.goal}</p>
    <h4>🧺 Jihozlar</h4><ul>${l.materials.map((m) => `<li>${m}</li>`).join("")}</ul>
    <h4>📝 Mashg'ulotning borishi</h4><ol>${l.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
    <h4>🏁 Yakun</h4><p>${l.end}</p>
    <button class="btn3d green pill no-print" onclick="window.print()">🖨️ Chop etish</button>`;
  $("#lesson-back").onclick = renderLessons;
  $(".t-main").scrollTop = 0;
};

// ---------- Ovoz yozish ----------
let recorder = null, recStream = null, recKey = null;

function renderPhrases() {
  const sel = $("#group-select");
  if (!sel.options.length) {
    sel.innerHTML = PHRASE_GROUPS.map((g, i) => `<option value="${i}">${g.title} (${g.keys.length})</option>`).join("");
  }
  const group = PHRASE_GROUPS[Number(sel.value) || 0];
  $("#phrase-list").innerHTML = group.keys.map((k) => {
    const has = Voice.has(k);
    const isRec = recKey === k;
    return `<div class="phrase ${has ? "done" : ""} ${isRec ? "recording" : ""}" data-key="${k}">
      <span class="dot" title="${has ? "Yozilgan" : "Yozilmagan"}"></span>
      <span class="p-text">${PHRASES[k]}</span>
      <button class="icon-btn rec" data-act="rec" title="Yozish">${isRec ? "⏹" : "🎙️"}</button>
      <button class="icon-btn" data-act="play" title="Tinglash">▶️</button>
      <button class="icon-btn" data-act="del" title="O'chirish" ${has ? "" : "disabled"}>🗑️</button>
    </div>`;
  }).join("");
  const total = Object.keys(PHRASES).length;
  const done = Voice.recordedCount();
  $("#rec-count").textContent = `${done} / ${total} yozildi`;
  $("#rec-bar").style.width = (done / total) * 100 + "%";
}

$("#group-select").onchange = renderPhrases;

$("#phrase-list").onclick = async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const key = btn.closest(".phrase").dataset.key;
  const act = btn.dataset.act;
  if (act === "play") Voice.speak(key);
  if (act === "del") { await Voice.remove(key); renderPhrases(); }
  if (act === "rec") {
    if (recKey === key) stopRecording();
    else startRecording(key);
  }
};

async function startRecording(key) {
  stopRecording();
  Voice.stop();
  $("#rec-err").textContent = "";
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    $("#rec-err").textContent = "Bu brauzerda ovoz yozib bo'lmaydi. Saytni https:// manzilda Chrome yoki Edge'da oching.";
    return;
  }
  try {
    recStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    $("#rec-err").textContent = "Mikrofonga ruxsat berilmadi. Brauzer sozlamalarida mikrofonga ruxsat bering.";
    return;
  }
  const chunks = [];
  recorder = new MediaRecorder(recStream);
  recKey = key;
  recorder.ondataavailable = (ev) => ev.data.size && chunks.push(ev.data);
  recorder.onstop = async () => {
    recStream.getTracks().forEach((t) => t.stop());
    const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
    const savedKey = recKey;
    recKey = null; recorder = null;
    if (blob.size > 0) await Voice.save(savedKey, blob);
    renderPhrases();
    if (blob.size > 0) Voice.speak(savedKey); // darhol eshittiramiz
  };
  recorder.start();
  renderPhrases();
}

function stopRecording() {
  if (recorder && recorder.state === "recording") recorder.stop();
}

$("#export-btn").onclick = async () => {
  const data = await Voice.exportAll();
  if (!Object.keys(data).length) { $("#rec-err").textContent = "Hali birorta ovoz yozilmagan."; return; }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
  a.download = "bogcha-ovozlar.json";
  a.click();
};

$("#import-input").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const n = await Voice.importAll(JSON.parse(await file.text()));
    $("#rec-err").textContent = `✅ ${n} ta ovoz yuklandi.`;
  } catch (err) {
    $("#rec-err").textContent = "Faylni o'qib bo'lmadi.";
  }
  e.target.value = "";
  renderPhrases();
};

// ---------- Sozlamalar ----------
function renderSettings() {
  const s = Voice.settings;
  const opts = [["auto", "Avtomatik (o'zbekcha / turkcha)"], ["off", "O'chirilgan"],
    ...Voice.voices().map((v) => [v.name, `${v.name} (${v.lang})`])];
  $("#voice-select").innerHTML = opts.map(([v, t]) =>
    `<option value="${v}" ${v === s.voiceName ? "selected" : ""}>${t}</option>`).join("");
  const cur = Voice.currentVoiceName();
  $("#voice-info").innerHTML = cur
    ? `Hozir ishlatilmoqda: <b>${cur}</b>`
    : "⚠️ Bu qurilmada o'zbekcha/turkcha kompyuter ovozi topilmadi. Iboralarni o'z ovozingiz bilan yozing yoki Microsoft Edge brauzeridan foydalaning.";
  $("#rate").value = s.rate;
  $("#rate-val").textContent = s.rate;
}
$("#voice-select").onchange = (e) => { Voice.saveSettings({ voiceName: e.target.value }); renderSettings(); };
$("#rate").oninput = (e) => { Voice.saveSettings({ rate: Number(e.target.value) }); $("#rate-val").textContent = e.target.value; };
$("#test-voice").onclick = () => Voice.speak("welcome");
$("#reset-stars").onclick = () => {
  if (!confirm("Barcha yulduzlar va natijalar o'chirilsinmi?")) return;
  Object.keys(progress).forEach((k) => delete progress[k]);
  saveProgress();
  updateStars();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!$("#gate").hidden) $("#gate").hidden = true;
  }
});

// =====================================================================
//  Ishga tushirish
// =====================================================================
Voice.init();
renderChips();
renderHome();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
