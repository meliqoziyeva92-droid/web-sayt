// =====================================================================
//  O'yinlar
//  Har bir o'yin round() funksiyasi orqali yangi savol beradi.
//  UI.ask(...) — rasmli javoblar bilan savol (app.js da)
// =====================================================================

const R = {
  int: (n) => Math.floor(Math.random() * n),
  shuffle: (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1]),
  pick: (arr, n) => R.shuffle(arr).slice(0, n),
  one: (arr) => arr[R.int(arr.length)]
};

// Oldingi savol takrorlanmasligi uchun
const lastTarget = {};
function pickTarget(gameId, options) {
  let t = R.one(options);
  if (options.length > 1) {
    while (t === lastTarget[gameId]) t = R.one(options);
  }
  lastTarget[gameId] = t;
  return t;
}

const emo = (e) => `<span class="emo">${e}</span>`;

// Umumiy "…ni top!" o'yini
function findGame(id, items, keyPrefix, render, count = 4) {
  return function round() {
    const opts = R.pick(items, count);
    const target = pickTarget(id, opts);
    UI.ask({
      prompt: [keyPrefix + target.id],
      options: opts.map((o) => ({ html: render(o), ok: o === target }))
    });
  };
}

const GAMES = [
  {
    id: "count", icon: "🔢", title: "Sanash", sub: "Raqamlar va sanoq", tag: "3-5 yosh",
    theme: "yellow", cat: "aql",
    round() {
      const level = Math.min(10, 5 + Math.floor((UI.gameCorrect("count")) / 3));
      const n = R.int(level) + 1;
      const item = R.one(COUNT_ITEMS);
      const opts = new Set([n]);
      while (opts.size < 3) opts.add(R.int(level) + 1);
      let counted = 0;
      const visual = `<div class="count-field">${Array.from({ length: n },
        () => `<button class="count-item">${item}</button>`).join("")}</div>`;
      UI.ask({
        prompt: ["count_q"],
        visual,
        options: R.shuffle([...opts]).map((v) => ({
          html: `<span class="num">${v}</span><span class="dots">${"●".repeat(v)}</span>`,
          ok: v === n,
          after: ["n" + v]
        }))
      });
      // Bola har bir narsani bosganda sanab beriladi
      document.querySelectorAll(".count-item").forEach((b) => {
        b.onclick = () => {
          if (b.classList.contains("counted")) return;
          counted++;
          b.classList.add("counted");
          b.dataset.n = counted;
          Voice.speak("n" + counted);
        };
      });
    }
  },
  {
    id: "colors", icon: "🎨", title: "Ranglar", sub: "Rang-barang bo'yoqlar", tag: "Yangi",
    theme: "pink", cat: "ijod",
    round: findGame("colors", COLORS, "color_",
      (c) => `<span class="swatch" style="background:${c.hex}"></span>`)
  },
  {
    id: "shapes", icon: "🔷", title: "Shakllar", sub: "Doira, kvadrat, uchburchak", tag: "Geometriya",
    theme: "blue", cat: "aql",
    round: findGame("shapes", SHAPES, "shape_", (s) => {
      const c = R.one(COLORS.filter((x) => x.id !== "qora")).hex;
      return `<svg class="shape" viewBox="0 0 100 100" fill="${c}">${s.svg}</svg>`;
    }, 3)
  },
  {
    id: "animals", icon: "🐾", title: "Hayvonlar", sub: "Uy va yovvoyi hayvonlar", tag: "Tabiat",
    theme: "brown", cat: "til",
    round: findGame("animals", ANIMALS, "animal_", (a) => emo(a.emoji))
  },
  {
    id: "fruits", icon: "🍎", title: "Mevalar", sub: "Meva va sabzavotlar", tag: "Salomatlik",
    theme: "pink", cat: "til",
    round: findGame("fruits", FRUITS, "fruit_", (f) => emo(f.emoji))
  },
  {
    id: "transport", icon: "🚗", title: "Transport", sub: "Mashina va samolyot", tag: "Mashinalar",
    theme: "blue", cat: "til",
    round: findGame("transport", TRANSPORT, "transport_", (t) => emo(t.emoji))
  },
  {
    id: "food", icon: "🥕", title: "Kim nima yeydi?", sub: "Hayvonlar va ovqatlar", tag: "Mantiq",
    theme: "yellow", cat: "aql",
    round() {
      const opts = R.pick(FOODS, 3);
      const target = pickTarget("food", opts);
      UI.ask({
        prompt: ["food_" + target.id],
        visual: `<div class="big-pic bounce">${target.animal}</div>`,
        options: opts.map((o) => ({ html: emo(o.food), ok: o === target }))
      });
    }
  },
  {
    id: "size", icon: "🐘", title: "Katta va kichik", sub: "O'lchamlarni taqqoslash", tag: "Taqqoslash",
    theme: "pink", cat: "aql",
    round() {
      const item = R.one(SIZE_ITEMS);
      const big = Math.random() < 0.5;
      const sizes = R.shuffle(["big", "small"]);
      UI.ask({
        prompt: [big ? "size_big" : "size_small"],
        options: sizes.map((s) => ({
          html: `<span class="emo size-${s}">${item}</span>`,
          ok: (s === "big") === big
        }))
      });
    }
  },
  {
    id: "odd", icon: "🤔", title: "Ortiqchasi", sub: "Qaysi biri boshqacha?", tag: "Topishmoq",
    theme: "blue", cat: "aql",
    round() {
      const [main, other] = R.pick(CATEGORIES, 2);
      const odd = R.one(other);
      const items = R.shuffle([...R.pick(main, 3), odd]);
      UI.ask({
        prompt: ["odd_q"],
        options: items.map((e) => ({ html: emo(e), ok: e === odd }))
      });
    }
  },
  {
    id: "memory", icon: "🃏", title: "Juftini top", sub: "Rasmli kartochkalar", tag: "Xotira",
    theme: "yellow", cat: "aql",
    round() {
      const pairs = R.pick(MEMORY_ITEMS, 6);
      const cards = R.shuffle([...pairs, ...pairs]);
      let open = [];
      let found = 0;
      UI.custom(`<div class="memory">${cards.map((e, i) =>
        `<button class="mcard" data-i="${i}" data-e="${e}"><span class="back">❓</span><span class="front">${e}</span></button>`).join("")}</div>`,
        ["memory_q"]);
      document.querySelectorAll(".mcard").forEach((card) => {
        card.onclick = () => {
          if (card.classList.contains("flip") || open.length === 2) return;
          card.classList.add("flip");
          open.push(card);
          if (open.length < 2) return;
          const [a, b] = open;
          if (a.dataset.e === b.dataset.e) {
            setTimeout(() => {
              a.classList.add("matched"); b.classList.add("matched");
              open = [];
              found++;
              if (found === pairs.length) UI.win(["memory_done"]);
              else Voice.speak(R.one(["praise1", "praise2"]));
            }, 400);
          } else {
            setTimeout(() => { a.classList.remove("flip"); b.classList.remove("flip"); open = []; }, 900);
          }
        };
      });
    }
  },
  {
    id: "manners", icon: "🌟", title: "Odob va qoidalar", sub: "Xavfsizlik va mehribonlik", tag: "Tarbiyaviy",
    theme: "pink", cat: "ijod",
    round() {
      const target = pickTarget("manners", MANNERS);
      UI.ask({
        prompt: ["manner_" + target.id],
        options: R.shuffle([
          { html: emo(target.ok), ok: true },
          ...target.no.map((n) => ({ html: emo(n), ok: false }))
        ])
      });
    }
  },
  {
    id: "letters", icon: "🔤", title: "Alifbo", sub: "Harflar va so'zlar", tag: "O'zbekcha",
    theme: "brown", cat: "til",
    round() {
      UI.custom(`<div class="letters">${LETTERS.map((l) =>
        `<button class="letter" data-id="${l.id}"><b>${l.letter}</b><span>${l.emoji}</span></button>`).join("")}</div>
        <div class="letter-big" id="letter-big" hidden></div>`, ["letters_q"]);
      const big = document.getElementById("letter-big");
      document.querySelectorAll(".letter").forEach((b) => {
        b.onclick = () => {
          const l = LETTERS.find((x) => x.id === b.dataset.id);
          big.innerHTML = `<b>${l.letter}</b><span class="bounce">${l.emoji}</span><i>${l.word}</i>`;
          big.hidden = false;
          b.classList.add("seen");
          Voice.speak("letter_" + l.id);
        };
      });
      big.onclick = () => { big.hidden = true; Voice.stop(); };
    }
  },
  // ================= TAYYORLOV GURUHI (6–7 yosh) =================
  {
    id: "math", icon: "➕", title: "Qo'shish va ayirish", sub: "10 gacha, rasmlar bilan", tag: "6-7 yosh",
    theme: "yellow", cat: "tayyor",
    round() {
      const item = R.one(MATH_ITEMS);
      const plus = Math.random() < 0.55;
      let a, b, ans, visual;
      const row = (n, cls = "") => `<span class="m-group">${Array.from({ length: n },
        () => `<span class="m-item ${cls}"><i>${item}</i></span>`).join("")}</span>`;
      if (plus) {
        a = R.int(5) + 1; b = R.int(Math.min(5, 10 - a)) + 1; ans = a + b;
        visual = `<div class="math">${row(a)}<span class="m-op">+</span>${row(b)}<span class="m-op">=</span><span class="m-q">?</span></div>`;
      } else {
        a = R.int(6) + 3; b = R.int(a - 1) + 1; ans = a - b;
        visual = `<div class="math">${row(a - b)}${row(b, "gone")}<span class="m-op">=</span><span class="m-q">?</span></div>`;
      }
      const opts = new Set([ans]);
      while (opts.size < 3) {
        const v = ans + R.one([-2, -1, 1, 2]);
        if (v >= 0 && v <= 10) opts.add(v);
      }
      UI.ask({
        prompt: [plus ? "math_plus" : "math_minus"],
        visual,
        options: R.shuffle([...opts]).map((v) => ({
          html: `<span class="num">${v}</span>`, ok: v === ans, after: v > 0 ? ["n" + v] : []
        }))
      });
    }
  },
  {
    id: "math50", icon: "🧮", title: "50 gacha misollar", sub: "O'nliklar va birliklar", tag: "6-7 yosh",
    theme: "blue", cat: "tayyor",
    round() {
      const plus = Math.random() < 0.5;
      const easy = Math.random() < 0.7; // ko'pincha o'nlikdan o'tmaydigan misollar
      let a, b;
      for (let tries = 0; tries < 100; tries++) {
        if (plus) {
          a = R.int(40) + 5; b = R.int(50 - a) + 1;
          if (!easy || (a % 10) + (b % 10) < 10) break;
        } else {
          a = R.int(41) + 10; b = R.int(a) + 1;
          if (!easy || (a % 10) >= (b % 10)) break;
        }
      }
      const ans = plus ? a + b : a - b;
      const opts = new Set([ans]);
      for (const d of R.shuffle([1, -1, 10, -10, 2, -2])) {
        if (opts.size === 3) break;
        if (ans + d >= 0 && ans + d <= 50) opts.add(ans + d);
      }
      const blocks = (n) => {
        const t = Math.floor(n / 10), o = n % 10;
        return `<span class="blocks">${'<span class="ten"></span>'.repeat(t)}<span class="ones">${'<span class="one"></span>'.repeat(o)}</span></span>`;
      };
      const part = (n) => `<span class="m50-part"><b>${n}</b>${blocks(n)}</span>`;
      UI.ask({
        prompt: [...numberKeys(a), plus ? "op_plus" : "op_minus", ...numberKeys(b), "op_eq"],
        visual: `<div class="math50">${part(a)}<span class="m-op">${plus ? "+" : "−"}</span>${part(b)}<span class="m-op">=</span><span class="m-q">?</span></div>`,
        options: R.shuffle([...opts]).map((v) => ({
          html: `<span class="num">${v}</span>`, ok: v === ans, after: numberKeys(v)
        }))
      });
    }
  },
  {
    id: "first", icon: "🅰️", title: "Birinchi harf", sub: "So'z qaysi harfdan boshlanadi?", tag: "6-7 yosh",
    theme: "pink", cat: "tayyor",
    round() {
      const target = pickTarget("first", FIRST_LETTERS);
      const others = R.pick(FIRST_LETTERS.filter((l) => l.letter[0] !== target.letter[0]), 2);
      UI.ask({
        prompt: ["first_" + target.id],
        visual: `<div class="big-pic bounce">${target.emoji}</div>`,
        options: R.shuffle([target, ...others]).map((l) => ({
          html: `<span class="letter-ans">${l.letter}</span>`, ok: l === target
        }))
      });
    }
  },
  {
    id: "syllables", icon: "👏", title: "So'z va bo'g'in", sub: "Bo'g'inni sana, so'zni yig'", tag: "6-7 yosh",
    theme: "yellow", cat: "tayyor",
    round() {
      const target = pickTarget("syllables", SYLLABLE_WORDS);
      const pic = `<div class="big-pic bounce">${target.emoji}</div>`;
      // 1) Bo'g'inlarni sanash (qarsak bilan)
      if (target.syl.length < 2 || Math.random() < 0.5) {
        UI.ask({
          prompt: ["word_" + target.id, "syl_count_q"],
          visual: pic,
          options: [1, 2, 3, 4].map((n) => ({
            html: `<span class="claps">${"👏".repeat(n)}</span><span class="clap-n">${n}</span>`,
            ok: n === target.syl.length,
            after: ["sylls_" + target.id]
          }))
        });
        return;
      }
      // 2) Bo'g'inlardan so'z yig'ish
      let tiles = R.shuffle(target.syl.map((t, i) => ({ t, i })));
      while (tiles.length > 1 && tiles.every((x, k) => x.i === k)) tiles = R.shuffle(tiles);
      UI.custom(`<div class="build">
          ${pic}
          <div class="slots">${target.syl.map(() => `<span class="slot"></span>`).join("")}</div>
          <div class="tiles">${tiles.map((x) => `<button class="tile" data-i="${x.i}">${x.t.toLowerCase()}</button>`).join("")}</div>
        </div>`, ["word_" + target.id, "syl_build_q"]);
      let next = 0;
      const slots = document.querySelectorAll(".slot");
      document.querySelectorAll(".tile").forEach((tile) => {
        tile.onclick = () => {
          if (tile.classList.contains("used") || UI.locked) return;
          if (Number(tile.dataset.i) === next) {
            slots[next].textContent = target.syl[next];
            slots[next].classList.add("filled");
            tile.classList.add("used");
            next++;
            if (next === target.syl.length) {
              UI.locked = true;
              UI.win(["sylls_" + target.id]);
            }
          } else {
            tile.classList.remove("wrong");
            void tile.offsetWidth;
            tile.classList.add("wrong");
            setTimeout(() => tile.classList.remove("wrong"), 600);
            Voice.speak(R.one(["retry1", "retry2"]));
          }
        };
      });
    }
  },
  {
    id: "pattern", icon: "🔴", title: "Ketma-ketlik", sub: "Naqshni davom ettir", tag: "6-7 yosh",
    theme: "blue", cat: "tayyor",
    round() {
      const set = R.pick(R.one(PATTERN_SETS), 3);
      const type = R.one(PATTERN_TYPES);
      const unit = [...type].map((ch) => set[ch.charCodeAt(0) - 65]);
      const seq = [];
      while (seq.length < 6 + R.int(2)) seq.push(unit[seq.length % unit.length]);
      const next = unit[seq.length % unit.length];
      const used = [...new Set(unit)];
      const opts = R.shuffle([...new Set([next, ...R.shuffle(used), ...set])].slice(0, 3));
      UI.ask({
        prompt: ["pattern_q"],
        visual: `<div class="pattern">${seq.map((e) => `<span>${e}</span>`).join("")}<span class="m-q">?</span></div>`,
        options: R.shuffle(opts).map((e) => ({ html: emo(e), ok: e === next }))
      });
    }
  },
  {
    id: "compare", icon: "⚖️", title: "Qaysi son katta?", sub: "Sonlarni taqqoslash", tag: "6-7 yosh",
    theme: "brown", cat: "tayyor",
    round() {
      const [a, b] = R.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2);
      const big = Math.random() < 0.5;
      const ans = big ? Math.max(a, b) : Math.min(a, b);
      UI.ask({
        prompt: [big ? "num_big" : "num_small"],
        options: [a, b].map((v) => ({
          html: `<span class="num">${v}</span><span class="dots">${"●".repeat(v)}</span>`,
          ok: v === ans, after: ["n" + v]
        }))
      });
    }
  },
  {
    id: "seasons", icon: "🍂", title: "Fasllar", sub: "Qish, bahor, yoz, kuz", tag: "6-7 yosh",
    theme: "yellow", cat: "tayyor",
    round() {
      const target = pickTarget("seasons", SEASONS);
      UI.ask({
        prompt: ["season_" + target.id],
        options: R.shuffle(SEASONS).map((s) => ({
          html: `<span class="emo season">${s.pic}</span>`, ok: s === target
        }))
      });
    }
  },
  {
    id: "professions", icon: "👩‍⚕️", title: "Kasblar olami", sub: "Kim? Asbobi? Qayerda?", tag: "6-7 yosh",
    theme: "pink", cat: "tayyor",
    round() {
      const opts = R.pick(PROFESSIONS, 3);
      const target = pickTarget("professions", opts);
      const mode = R.one(["find", "tool", "place"]);
      if (mode === "find") {
        // Kasb egasini top
        UI.ask({
          prompt: ["prof_" + target.id],
          options: opts.map((p) => ({ html: emo(p.emoji), ok: p === target, after: ["about_" + target.id] }))
        });
      } else if (mode === "tool") {
        // Asbob ko'rsatiladi — kimniki?
        UI.ask({
          prompt: ["tool_" + target.id, "prof_tool_q"],
          visual: `<div class="big-pic bounce">${target.tool}</div>`,
          options: opts.map((p) => ({ html: emo(p.emoji), ok: p === target, after: ["about_" + target.id] }))
        });
      } else {
        // Kasb egasi ko'rsatiladi — qayerda ishlaydi?
        UI.ask({
          prompt: ["place_" + target.id],
          visual: `<div class="big-pic bounce">${target.emoji}</div>`,
          options: opts.map((p) => ({ html: emo(p.place), ok: p === target, after: ["about_" + target.id] }))
        });
      }
    }
  },
  {
    id: "album", icon: "📒", title: "Kasblar albomi", sub: "Kasblar bilan tanishamiz", tag: "6-7 yosh",
    theme: "blue", cat: "tayyor",
    round() {
      UI.custom(`<div class="album">${PROFESSIONS.map((p) =>
        `<button class="album-card" data-id="${p.id}"><span>${p.emoji}</span></button>`).join("")}</div>
        <div class="letter-big prof-big" id="prof-big" hidden></div>`, ["prof_album_q"]);
      const big = document.getElementById("prof-big");
      document.querySelectorAll(".album-card").forEach((b) => {
        b.onclick = () => {
          const p = PROFESSIONS.find((x) => x.id === b.dataset.id);
          big.innerHTML = `<span class="bounce">${p.emoji}</span>
            <div class="prof-row"><span title="${p.toolName}">${p.tool}</span><span>${p.place}</span></div>
            <i>${p.about.split(".")[0]}</i>`;
          big.hidden = false;
          b.classList.add("seen");
          Voice.speak("about_" + p.id);
        };
      });
      big.onclick = () => { big.hidden = true; Voice.stop(); };
    }
  },
  {
    id: "school", icon: "🎒", title: "Maktabga tayyorlanamiz", sub: "Maktab buyumlari", tag: "6-7 yosh",
    theme: "blue", cat: "tayyor",
    round() {
      const ok = R.one(SCHOOL_ITEMS);
      UI.ask({
        prompt: ["school_q"],
        options: R.shuffle([ok, ...R.pick(NOT_SCHOOL_ITEMS, 2)]).map((e) => ({ html: emo(e), ok: e === ok }))
      });
    }
  }
];

const CATEGORY_NAMES = {
  aql: "🧠 Aqliy rivojlanish",
  til: "🗣️ Til va nutq",
  ijod: "🎨 Ijod va tarbiya",
  tayyor: "🎒 Tayyorlov guruhi (6–7 yosh)"
};
