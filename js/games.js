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
  }
];

const CATEGORY_NAMES = {
  aql: "🧠 Aqliy rivojlanish",
  til: "🗣️ Til va nutq",
  ijod: "🎨 Ijod va tarbiya"
};
