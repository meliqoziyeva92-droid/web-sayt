// =====================================================================
//  Ovoz tizimi
//  Har bir ibora uchun ovoz quyidagi tartibda qidiriladi:
//   1) Tarbiyachi saytda yozib qo'ygan ovoz (brauzer xotirasida)
//   2) audio/<kalit>.mp3 fayli (agar papkaga qo'yilgan bo'lsa)
//   3) Kompyuterning o'zbekcha (yoki turkcha) ovozi
// =====================================================================

const Voice = (() => {
  const DB_NAME = "bogcha-ovoz";
  const STORE = "clips";
  const SETTINGS_KEY = "bogcha-voice-settings";

  let db = null;
  const urls = {};          // kalit -> objectURL (yozilgan ovozlar)
  const missingFiles = {};  // audio/ papkasida yo'q fayllar
  let token = 0;
  let current = null;       // { audio, done }
  let ttsVoice = null;

  const settings = Object.assign(
    { voiceName: "auto", rate: 0.9 },
    JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")
  );

  // ---------- IndexedDB ----------
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function store(mode) {
    return db.transaction(STORE, mode).objectStore(STORE);
  }

  function loadAll() {
    return new Promise((resolve) => {
      const req = store("readonly").openCursor();
      req.onsuccess = () => {
        const cur = req.result;
        if (!cur) return resolve();
        urls[cur.key] = URL.createObjectURL(cur.value);
        cur.continue();
      };
      req.onerror = () => resolve();
    });
  }

  async function init() {
    try {
      db = await openDB();
      await loadAll();
    } catch (e) {
      console.warn("Ovoz xotirasi ochilmadi:", e);
    }
    if ("speechSynthesis" in window) {
      pickVoice();
      speechSynthesis.addEventListener("voiceschanged", pickVoice);
    }
  }

  function save(key, blob) {
    return new Promise((resolve, reject) => {
      const req = store("readwrite").put(blob, key);
      req.onsuccess = () => {
        if (urls[key]) URL.revokeObjectURL(urls[key]);
        urls[key] = URL.createObjectURL(blob);
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  }

  function remove(key) {
    return new Promise((resolve) => {
      const req = store("readwrite").delete(key);
      req.onsuccess = req.onerror = () => {
        if (urls[key]) URL.revokeObjectURL(urls[key]);
        delete urls[key];
        resolve();
      };
    });
  }

  function getBlob(key) {
    return new Promise((resolve) => {
      const req = store("readonly").get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  }

  const has = (key) => !!urls[key];
  const recordedCount = () => Object.keys(urls).filter((k) => k in PHRASES).length;

  // ---------- Kompyuter ovozi (TTS) ----------
  function voices() {
    return "speechSynthesis" in window ? speechSynthesis.getVoices() : [];
  }

  function pickVoice() {
    const list = voices();
    if (settings.voiceName === "off") { ttsVoice = null; return; }
    if (settings.voiceName !== "auto") {
      ttsVoice = list.find((v) => v.name === settings.voiceName) || null;
      if (ttsVoice) return;
    }
    // Avval o'zbekcha, keyin turkcha ovoz (o'zbek matnini eng yaxshi o'qiydi)
    ttsVoice =
      list.find((v) => /^uz/i.test(v.lang)) ||
      list.find((v) => /^tr/i.test(v.lang)) ||
      null;
  }

  function ttsAvailable() {
    return !!ttsVoice;
  }

  function tts(text, myToken) {
    return new Promise((resolve) => {
      if (!ttsVoice || myToken !== token) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      u.voice = ttsVoice;
      u.lang = ttsVoice.lang;
      u.rate = settings.rate;
      u.pitch = 1.1;
      let finished = false;
      const done = () => { if (!finished) { finished = true; resolve(); } };
      u.onend = u.onerror = done;
      current = { audio: null, done };
      speechSynthesis.speak(u);
      setTimeout(done, 1500 + text.length * 120); // xavfsizlik uchun
    });
  }

  // ---------- Ijro etish ----------
  function playUrl(url, myToken) {
    return new Promise((resolve, reject) => {
      if (myToken !== token) return resolve();
      const audio = new Audio(url);
      let finished = false;
      const done = () => { if (!finished) { finished = true; resolve(); } };
      current = { audio, done };
      audio.onended = done;
      audio.onerror = () => { if (!finished) { finished = true; reject(new Error("audio")); } };
      audio.play().catch((e) => { if (!finished) { finished = true; reject(e); } });
    });
  }

  async function sayOne(key, myToken) {
    const text = PHRASES[key] || key;
    if (urls[key]) {
      try { return await playUrl(urls[key], myToken); } catch (e) { /* TTS ga o'tamiz */ }
    }
    if (!missingFiles[key]) {
      try { return await playUrl(`audio/${key}.mp3`, myToken); }
      catch (e) { missingFiles[key] = true; }
    }
    return tts(text, myToken);
  }

  function stop() {
    token++;
    if (current) {
      if (current.audio) current.audio.pause();
      current.done();
      current = null;
    }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }

  // Bir yoki bir nechta iborani ketma-ket aytadi
  async function speak(keys) {
    stop();
    const myToken = token;
    const list = Array.isArray(keys) ? keys : [keys];
    document.body.classList.add("speaking");
    for (const key of list) {
      if (myToken !== token) break;
      await sayOne(key, myToken);
    }
    if (myToken === token) document.body.classList.remove("speaking");
  }

  function saveSettings(patch) {
    Object.assign(settings, patch);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    pickVoice();
  }

  // ---------- Eksport / Import ----------
  async function exportAll() {
    const out = {};
    for (const key of Object.keys(urls)) {
      const blob = await getBlob(key);
      if (!blob) continue;
      out[key] = await new Promise((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.readAsDataURL(blob);
      });
    }
    return out;
  }

  async function importAll(obj) {
    let n = 0;
    for (const [key, dataUrl] of Object.entries(obj)) {
      if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:audio")) continue;
      const blob = await (await fetch(dataUrl)).blob();
      await save(key, blob);
      n++;
    }
    return n;
  }

  return {
    init, speak, stop, save, remove, has, recordedCount, settings, saveSettings,
    voices, ttsAvailable, exportAll, importAll,
    currentVoiceName: () => (ttsVoice ? `${ttsVoice.name} (${ttsVoice.lang})` : null)
  };
})();
