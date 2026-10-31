// =====================================================================
//  O'yinlar uchun ma'lumotlar va barcha ovozli iboralar
//  Har bir ibora "kalit" orqali chaqiriladi. Tarbiyachi panelida
//  har bir kalit uchun o'z ovozingizni yozib qo'yishingiz mumkin.
// =====================================================================

const PHRASES = {};       // kalit -> matn
const PHRASE_GROUPS = []; // ovoz yozish paneli uchun guruhlar

function addGroup(title, entries) {
  PHRASE_GROUPS.push({
    title,
    keys: entries.map(([key, text]) => { PHRASES[key] = text; return key; })
  });
}

// ---------- Umumiy iboralar ----------
addGroup("Umumiy", [
  ["welcome", "Salom, do'stlar! Keling, birga o'ynaymiz! Bugun o'yinlarda yulduzchalar yig'amiz!"],
  ["guide", "O'yin rasmini bos. Savolni diqqat bilan tingla va to'g'ri rasmni top! Karnayni bossang, savol yana aytiladi."],
  ["tip", "Har kuni kamida uchta o'yin o'ynagan bolajonlar eng chaqqon va bilimdon bo'lishadi!"],
  ["praise1", "Barakalla! To'g'ri!"],
  ["praise2", "Zo'r! Juda yaxshi!"],
  ["praise3", "Qoyil! Ofarin!"],
  ["praise4", "Sen juda aqllisan!"],
  ["retry1", "Yana bir bor urinib ko'r!"],
  ["retry2", "Yo'q, bu emas. Yana qara!"],
  ["reward", "Ofarin! Sen kubok yutding!"]
]);

// ---------- Sanash ----------
const NUMBERS = ["Bir", "Ikki", "Uch", "To'rt", "Besh", "Olti", "Yetti", "Sakkiz", "To'qqiz", "O'n"];
const COUNT_ITEMS = ["🍎", "🐤", "⭐", "🎈", "🌸", "🐟", "🚗", "🍓", "🐞", "🧸", "🍌", "🐝"];
addGroup("Sanash", [
  ["count_q", "Nechta? Barmog'ing bilan bosib sanab ko'r!"],
  ...NUMBERS.map((n, i) => ["n" + (i + 1), n])
]);

// 11–50 gacha sonlar bo'laklardan yig'iladi: 23 = "Yigirma" + "Uch"
addGroup("O'nliklar (50 gacha)", [
  ["n0", "Nol"],
  ["t20", "Yigirma"],
  ["t30", "O'ttiz"],
  ["t40", "Qirq"],
  ["t50", "Ellik"]
]);

// Son uchun ovoz kalitlari ro'yxati (0–50)
function numberKeys(v) {
  if (v === 0) return ["n0"];
  if (v <= 10) return ["n" + v];
  const tens = Math.floor(v / 10) * 10, ones = v % 10;
  const head = tens === 10 ? "n10" : "t" + tens;
  return ones ? [head, "n" + ones] : [head];
}

// ---------- Ranglar ----------
const COLORS = [
  { id: "qizil", hex: "#e53935", text: "Qizil rangni top!" },
  { id: "sariq", hex: "#fdd835", text: "Sariq rangni top!" },
  { id: "yashil", hex: "#43a047", text: "Yashil rangni top!" },
  { id: "kok", hex: "#1e88e5", text: "Ko'k rangni top!" },
  { id: "toqsariq", hex: "#fb8c00", text: "To'q sariq rangni top!" },
  { id: "binafsha", hex: "#8e24aa", text: "Binafsha rangni top!" },
  { id: "pushti", hex: "#f48fb1", text: "Pushti rangni top!" },
  { id: "qora", hex: "#263238", text: "Qora rangni top!" },
  { id: "jigarrang", hex: "#795548", text: "Jigarrangni top!" }
];
addGroup("Ranglar", COLORS.map((c) => ["color_" + c.id, c.text]));

// ---------- Shakllar ----------
const SHAPES = [
  { id: "doira", svg: '<circle cx="50" cy="50" r="42"/>', text: "Doirani top!" },
  { id: "kvadrat", svg: '<rect x="10" y="10" width="80" height="80"/>', text: "Kvadratni top!" },
  { id: "uchburchak", svg: '<polygon points="50,6 94,92 6,92"/>', text: "Uchburchakni top!" },
  { id: "tortburchak", svg: '<rect x="4" y="26" width="92" height="48"/>', text: "To'rtburchakni top!" },
  { id: "yulduz", svg: '<polygon points="50,4 62,38 97,38 69,59 80,94 50,73 20,94 31,59 3,38 38,38"/>', text: "Yulduzni top!" },
  { id: "yurak", svg: '<path d="M50 90 L10 50 A21 21 0 0 1 50 22 A21 21 0 0 1 90 50 Z"/>', text: "Yurakni top!" },
  { id: "oval", svg: '<ellipse cx="50" cy="50" rx="46" ry="30"/>', text: "Ovalni top!" }
];
addGroup("Shakllar", SHAPES.map((s) => ["shape_" + s.id, s.text]));

// ---------- Hayvonlar ----------
const ANIMALS = [
  { id: "mushuk", emoji: "🐱", text: "Mushukni top!" },
  { id: "it", emoji: "🐶", text: "Itni top!" },
  { id: "sigir", emoji: "🐄", text: "Sigirni top!" },
  { id: "qoy", emoji: "🐑", text: "Qo'yni top!" },
  { id: "ot", emoji: "🐴", text: "Otni top!" },
  { id: "tovuq", emoji: "🐔", text: "Tovuqni top!" },
  { id: "quyon", emoji: "🐰", text: "Quyonni top!" },
  { id: "sher", emoji: "🦁", text: "Sherni top!" },
  { id: "fil", emoji: "🐘", text: "Filni top!" },
  { id: "maymun", emoji: "🐒", text: "Maymunni top!" },
  { id: "ayiq", emoji: "🐻", text: "Ayiqni top!" },
  { id: "tulki", emoji: "🦊", text: "Tulkini top!" },
  { id: "bori", emoji: "🐺", text: "Bo'rini top!" },
  { id: "baliq", emoji: "🐟", text: "Baliqni top!" },
  { id: "qurbaqa", emoji: "🐸", text: "Qurbaqani top!" },
  { id: "tuya", emoji: "🐫", text: "Tuyani top!" }
];
addGroup("Hayvonlar", ANIMALS.map((a) => ["animal_" + a.id, a.text]));

// ---------- Meva va sabzavotlar ----------
const FRUITS = [
  { id: "olma", emoji: "🍎", text: "Olmani top!" },
  { id: "nok", emoji: "🍐", text: "Nokni top!" },
  { id: "banan", emoji: "🍌", text: "Bananni top!" },
  { id: "uzum", emoji: "🍇", text: "Uzumni top!" },
  { id: "tarvuz", emoji: "🍉", text: "Tarvuzni top!" },
  { id: "qulupnay", emoji: "🍓", text: "Qulupnayni top!" },
  { id: "gilos", emoji: "🍒", text: "Gilosni top!" },
  { id: "limon", emoji: "🍋", text: "Limonni top!" },
  { id: "sabzi", emoji: "🥕", text: "Sabzini top!" },
  { id: "pomidor", emoji: "🍅", text: "Pomidorni top!" },
  { id: "bodring", emoji: "🥒", text: "Bodringni top!" },
  { id: "kartoshka", emoji: "🥔", text: "Kartoshkani top!" },
  { id: "piyoz", emoji: "🧅", text: "Piyozni top!" },
  { id: "makka", emoji: "🌽", text: "Makkajo'xorini top!" }
];
addGroup("Meva va sabzavotlar", FRUITS.map((f) => ["fruit_" + f.id, f.text]));

// ---------- Transport ----------
const TRANSPORT = [
  { id: "mashina", emoji: "🚗", text: "Mashinani top!" },
  { id: "avtobus", emoji: "🚌", text: "Avtobusni top!" },
  { id: "poyezd", emoji: "🚂", text: "Poyezdni top!" },
  { id: "samolyot", emoji: "✈️", text: "Samolyotni top!" },
  { id: "kema", emoji: "🚢", text: "Kemani top!" },
  { id: "velosiped", emoji: "🚲", text: "Velosipedni top!" },
  { id: "vertolyot", emoji: "🚁", text: "Vertolyotni top!" },
  { id: "raketa", emoji: "🚀", text: "Raketani top!" },
  { id: "traktor", emoji: "🚜", text: "Traktorni top!" },
  { id: "otochirish", emoji: "🚒", text: "O't o'chirish mashinasini top!" },
  { id: "tez", emoji: "🚑", text: "Tez yordam mashinasini top!" }
];
addGroup("Transport", TRANSPORT.map((t) => ["transport_" + t.id, t.text]));

// ---------- Kim nima yeydi ----------
const FOODS = [
  { id: "quyon", animal: "🐰", food: "🥕", text: "Quyoncha nima yeydi?" },
  { id: "maymun", animal: "🐒", food: "🍌", text: "Maymuncha nima yeydi?" },
  { id: "olmaxon", animal: "🐿️", food: "🌰", text: "Olmaxon nima yeydi?" },
  { id: "ayiq", animal: "🐻", food: "🍯", text: "Ayiqcha nima yeydi?" },
  { id: "sigir", animal: "🐄", food: "🌾", text: "Sigir nima yeydi?" },
  { id: "sichqon", animal: "🐭", food: "🧀", text: "Sichqoncha nima yeydi?" },
  { id: "panda", animal: "🐼", food: "🎋", text: "Panda nima yeydi?" },
  { id: "mushuk", animal: "🐱", food: "🐟", text: "Mushukcha nima yeydi?" },
  { id: "it", animal: "🐶", food: "🦴", text: "Kuchukcha nima yeydi?" }
];
addGroup("Kim nima yeydi", FOODS.map((f) => ["food_" + f.id, f.text]));

// ---------- Katta va kichik ----------
const SIZE_ITEMS = ["🐘", "🐻", "🍎", "🐱", "🚗", "🌳", "⭐", "🐟", "🏠", "🎈"];
addGroup("Katta va kichik", [
  ["size_big", "Qaysi biri katta?"],
  ["size_small", "Qaysi biri kichik?"]
]);

// ---------- Ortiqchasini top ----------
const CATEGORIES = [
  ["🍎", "🍌", "🍇", "🍐", "🍓", "🍉", "🍒"],
  ["🐶", "🐱", "🐰", "🐻", "🦁", "🐘", "🐒"],
  ["🚗", "🚌", "🚂", "✈️", "🚢", "🚲", "🚜"],
  ["👕", "👖", "👗", "🧦", "🧢", "🧥", "👟"],
  ["🧸", "⚽", "🎈", "🪀", "🪁", "🎲", "🛝"],
  ["🥕", "🍅", "🥒", "🥔", "🧅", "🌽", "🥦"]
];
addGroup("Ortiqchasini top", [["odd_q", "Qaysi biri ortiqcha? Boshqalariga o'xshamaganini top!"]]);

// ---------- Juftini top (xotira) ----------
const MEMORY_ITEMS = ["🐶", "🐱", "🍎", "🚗", "⭐", "🎈", "🐸", "🌸", "🦋", "🐟"];
addGroup("Juftini top", [
  ["memory_q", "Bir xil rasmlarni top!"],
  ["memory_done", "Hammasini topding! Barakalla!"]
]);

// ---------- Odob va xavfsizlik (tarbiya) ----------
const MANNERS = [
  { id: "qol", text: "Ovqatdan oldin nima qilamiz?", ok: "🧼🙌", no: ["📱", "⚽"] },
  { id: "tish", text: "Tishimizni nima bilan yuvamiz?", ok: "🪥", no: ["🍭", "🥄"] },
  { id: "chiroq", text: "Yo'ldan qaysi chiroqda o'tamiz?", ok: "🟢", no: ["🔴", "🟡"] },
  { id: "yomgir", text: "Yomg'ir yog'sa nima olamiz?", ok: "☂️", no: ["🕶️", "🏖️"] },
  { id: "qish", text: "Qishda nima kiyamiz?", ok: "🧥", no: ["🩳", "👙"] },
  { id: "axlat", text: "Axlatni qayerga tashlaymiz?", ok: "🗑️", no: ["🌳", "🛝"] },
  { id: "dost", text: "Do'sting yiqilsa nima qilasan?", ok: "🤝", no: ["😂", "🏃"] },
  { id: "uyqu", text: "Kechqurun nima qilamiz?", ok: "🛏️", no: ["🎮", "🏊"] },
  { id: "kasal", text: "Kasal bo'lsak kimga boramiz?", ok: "👩‍⚕️", no: ["👨‍🍳", "🤡"] },
  { id: "olov", text: "Olov chiqsa kim yordam beradi?", ok: "👨‍🚒", no: ["👩‍🎨", "🧑‍🌾"] },
  { id: "salom", text: "Kattalarni ko'rsak nima qilamiz?", ok: "👋😊", no: ["😠", "🙈"] },
  { id: "suv", text: "Chanqasak nima ichamiz?", ok: "💧", no: ["🧴", "🧪"] }
];
addGroup("Odob va xavfsizlik", MANNERS.map((m) => ["manner_" + m.id, m.text]));

// ---------- Alifbo ----------
const LETTERS = [
  ["A", "🐝", "Ari"], ["B", "🐟", "Baliq"], ["D", "🌳", "Daraxt"], ["E", "🚪", "Eshik"],
  ["F", "🐘", "Fil"], ["G", "🌸", "Gul"], ["H", "🌙", "Hilol"], ["I", "🐶", "It"],
  ["J", "🐥", "Jo'ja"], ["K", "📖", "Kitob"], ["L", "🍋", "Limon"], ["M", "🐱", "Mushuk"],
  ["N", "🍐", "Nok"], ["O", "🍎", "Olma"], ["P", "🍅", "Pomidor"], ["Q", "☀️", "Quyosh"],
  ["R", "🚀", "Raketa"], ["S", "🥕", "Sabzi"], ["T", "🍉", "Tarvuz"], ["U", "🍇", "Uzum"],
  ["V", "🚲", "Velosiped"], ["X", "🐓", "Xo'roz"], ["Y", "⭐", "Yulduz"], ["Z", "🦓", "Zebra"],
  ["O'", "🦆", "O'rdak"], ["G'", "🧱", "G'isht"], ["Sh", "🎈", "Shar"], ["Ch", "🐜", "Chumoli"],
  ["Ng", "🌅", "Tong"]
].map(([letter, emoji, word], i) => ({ id: "l" + i, letter, emoji, word }));
addGroup("Alifbo", [
  ["letters_q", "Harfni bos va tingla!"],
  ...LETTERS.map((l) => ["letter_" + l.id, `${l.letter}. ${l.word}.`])
]);

// =====================================================================
//  TAYYORLOV GURUHI (6–7 yosh) — maktabga tayyorlov o'yinlari
// =====================================================================

// ---------- Qo'shish va ayirish ----------
const MATH_ITEMS = ["🍎", "🍐", "🎈", "⭐", "🐤", "🍬", "🌸", "🧁"];
addGroup("Qo'shish va ayirish", [
  ["math_plus", "Qo'shamiz! Nechta bo'ldi?"],
  ["math_minus", "Ayiramiz! Nechta qoldi?"],
  ["op_plus", "qo'shuv"],
  ["op_minus", "ayiruv"],
  ["op_eq", "Nechchi bo'ladi?"]
]);

// ---------- Birinchi harf ----------
// "Ng" so'z boshida kelmaydi, shuning uchun bu o'yinga kirmaydi
const FIRST_LETTERS = LETTERS.filter((l) => l.letter !== "Ng");
addGroup("Birinchi harf", FIRST_LETTERS.map((l) =>
  ["first_" + l.id, `${l.word}. ${l.word} qaysi harf bilan boshlanadi?`]));

// ---------- So'z va bo'g'in ----------
const SYLLABLE_WORDS = [
  // 1 bo'g'in
  ["fil", "🐘", ["Fil"]], ["gul", "🌸", ["Gul"]], ["non", "🍞", ["Non"]], ["uy", "🏠", ["Uy"]],
  ["oy", "🌙", ["Oy"]], ["shar", "🎈", ["Shar"]], ["nok", "🍐", ["Nok"]], ["ot", "🐴", ["Ot"]],
  // 2 bo'g'in
  ["olma", "🍎", ["Ol", "ma"]], ["ari", "🐝", ["A", "ri"]], ["baliq", "🐟", ["Ba", "liq"]],
  ["kitob", "📖", ["Ki", "tob"]], ["tarvuz", "🍉", ["Tar", "vuz"]], ["uzum", "🍇", ["U", "zum"]],
  ["sabzi", "🥕", ["Sab", "zi"]], ["limon", "🍋", ["Li", "mon"]], ["quyosh", "☀️", ["Qu", "yosh"]],
  ["yulduz", "⭐", ["Yul", "duz"]], ["mushuk", "🐱", ["Mu", "shuk"]], ["quyon", "🐰", ["Qu", "yon"]],
  ["kalit", "🔑", ["Ka", "lit"]], ["zebra", "🦓", ["Zeb", "ra"]],
  // 3 bo'g'in
  ["mashina", "🚗", ["Ma", "shi", "na"]], ["raketa", "🚀", ["Ra", "ke", "ta"]],
  ["pomidor", "🍅", ["Po", "mi", "dor"]], ["qurbaqa", "🐸", ["Qur", "ba", "qa"]],
  ["kapalak", "🦋", ["Ka", "pa", "lak"]], ["chumoli", "🐜", ["Chu", "mo", "li"]],
  ["avtobus", "🚌", ["Av", "to", "bus"]], ["telefon", "📱", ["Te", "le", "fon"]],
  ["kartoshka", "🥔", ["Kar", "tosh", "ka"]], ["samolyot", "✈️", ["Sa", "mo", "lyot"]],
  // 4 bo'g'in
  ["velosiped", "🚲", ["Ve", "lo", "si", "ped"]], ["televizor", "📺", ["Te", "le", "vi", "zor"]]
].map(([id, emoji, syl]) => ({ id, emoji, syl, word: syl.join("").replace(/^./, (c) => c.toUpperCase()) }));

addGroup("So'z va bo'g'in", [
  ["syl_count_q", "Bu so'zda nechta bo'g'in bor? Qarsak chalib sana!"],
  ["syl_build_q", "Bo'g'inlardan so'zni yig'!"],
  ...SYLLABLE_WORDS.map((w) => ["word_" + w.id, w.word + "."]),
  ...SYLLABLE_WORDS.map((w) => ["sylls_" + w.id, w.syl.join("... ") + ". " + w.word + "."])
]);

// ---------- Ketma-ketlik (naqsh) ----------
const PATTERN_SETS = [
  ["🔴", "🔵", "🟢", "🟡"],
  ["🍎", "🍌", "🍇", "🍐"],
  ["⭐", "🌙", "☀️", "☁️"],
  ["🐶", "🐱", "🐰", "🐻"],
  ["🔺", "🟦", "🟣", "🔶"]
];
const PATTERN_TYPES = ["AB", "AAB", "ABB", "ABC"];
addGroup("Ketma-ketlik", [["pattern_q", "Keyingisi qaysi? Naqshni davom ettir!"]]);

// ---------- Sonlarni taqqoslash ----------
addGroup("Sonlarni taqqoslash", [
  ["num_big", "Qaysi son katta?"],
  ["num_small", "Qaysi son kichik?"]
]);

// ---------- Fasllar ----------
const SEASONS = [
  { id: "qish", pic: "⛄❄️", text: "Qishni top! Qor yog'adi, sovuq bo'ladi." },
  { id: "bahor", pic: "🌷🌱", text: "Bahorni top! Gullar ochiladi." },
  { id: "yoz", pic: "☀️🍉", text: "Yozni top! Havo issiq bo'ladi." },
  { id: "kuz", pic: "🍂🍁", text: "Kuzni top! Barglar sarg'ayib to'kiladi." }
];
addGroup("Fasllar", SEASONS.map((s) => ["season_" + s.id, s.text]));

// ---------- Kasblar olami ----------
// find: "…ni top!", about: kasb haqida qisqa ma'lumot,
// tool/toolName: mehnat quroli, place/placeQ: ish joyi va savol
const PROFESSIONS = [
  { id: "shifokor", emoji: "👩‍⚕️", find: "Shifokorni top!", about: "Shifokor. U kasallarni davolaydi.",
    tool: "🩺", toolName: "Stetoskop", place: "🏥", placeQ: "Shifokor qayerda ishlaydi?" },
  { id: "oshpaz", emoji: "👨‍🍳", find: "Oshpazni top!", about: "Oshpaz. U mazali ovqat pishiradi.",
    tool: "🍳", toolName: "Tova", place: "🍽️", placeQ: "Oshpaz qayerda ishlaydi?" },
  { id: "otochiruvchi", emoji: "👨‍🚒", find: "O't o'chiruvchini top!", about: "O't o'chiruvchi. U olovni o'chiradi va odamlarni qutqaradi.",
    tool: "🧯", toolName: "O't o'chirgich", place: "🚒", placeQ: "O't o'chiruvchi nimada yuradi?" },
  { id: "politsiya", emoji: "👮", find: "Politsiyachini top!", about: "Politsiyachi. U tartibni saqlaydi va bizni himoya qiladi.",
    tool: "🚓", toolName: "Politsiya mashinasi", place: "🚦", placeQ: "Politsiyachi qayerda tartib saqlaydi?" },
  { id: "quruvchi", emoji: "👷", find: "Quruvchini top!", about: "Quruvchi. U uylar va maktablar quradi.",
    tool: "🧱", toolName: "G'isht", place: "🏗️", placeQ: "Quruvchi qayerda ishlaydi?" },
  { id: "oqituvchi", emoji: "👩‍🏫", find: "O'qituvchini top!", about: "O'qituvchi. U maktabda bolalarga dars beradi.",
    tool: "📚", toolName: "Kitoblar", place: "🏫", placeQ: "O'qituvchi qayerda ishlaydi?" },
  { id: "dehqon", emoji: "🧑‍🌾", find: "Dehqonni top!", about: "Dehqon. U dalada ekin ekadi va hosil yig'adi.",
    tool: "🚜", toolName: "Traktor", place: "🌾", placeQ: "Dehqon qayerda ishlaydi?" },
  { id: "uchuvchi", emoji: "🧑‍✈️", find: "Uchuvchini top!", about: "Uchuvchi. U samolyotni boshqaradi.",
    tool: "✈️", toolName: "Samolyot", place: "☁️", placeQ: "Uchuvchi qayerda uchadi?" },
  { id: "rassom", emoji: "👩‍🎨", find: "Rassomni top!", about: "Rassom. U chiroyli rasmlar chizadi.",
    tool: "🎨", toolName: "Bo'yoqlar", place: "🖼️", placeQ: "Rassomning ishi qaysi?" },
  { id: "kosmonavt", emoji: "🧑‍🚀", find: "Kosmonavtni top!", about: "Kosmonavt. U raketada koinotga uchadi.",
    tool: "🚀", toolName: "Raketa", place: "🪐", placeQ: "Kosmonavt qayerga uchadi?" },
  { id: "sartarosh", emoji: "💇", find: "Sartaroshni top!", about: "Sartarosh. U sochni chiroyli qilib oladi.",
    tool: "✂️", toolName: "Qaychi", place: "💈", placeQ: "Sartarosh qayerda ishlaydi?" },
  { id: "mexanik", emoji: "🧑‍🔧", find: "Ustani top!", about: "Usta. U mashinalarni tuzatadi.",
    tool: "🔧", toolName: "Kalit", place: "🚗", placeQ: "Usta nimani tuzatadi?" },
  { id: "olim", emoji: "🧑‍🔬", find: "Olimni top!", about: "Olim. U tajribalar o'tkazib, yangi narsalar kashf qiladi.",
    tool: "🔬", toolName: "Mikroskop", place: "🧪", placeQ: "Olim nima bilan tajriba qiladi?" },
  { id: "qoshiqchi", emoji: "🧑‍🎤", find: "Qo'shiqchini top!", about: "Qo'shiqchi. U sahnada qo'shiq aytadi.",
    tool: "🎤", toolName: "Mikrofon", place: "🎭", placeQ: "Qo'shiqchi qayerda chiqish qiladi?" }
];
addGroup("Kasblar olami", [
  ["prof_tool_q", "Bu kimning asbobi?"],
  ["prof_album_q", "Rasmni bos va kasb haqida tingla!"],
  ...PROFESSIONS.map((p) => ["prof_" + p.id, p.find]),
  ...PROFESSIONS.map((p) => ["about_" + p.id, p.about]),
  ...PROFESSIONS.map((p) => ["tool_" + p.id, p.toolName + "."]),
  ...PROFESSIONS.map((p) => ["place_" + p.id, p.placeQ])
]);

// ---------- Maktabga tayyorlanamiz ----------
const SCHOOL_ITEMS = ["🎒", "📚", "✏️", "📏", "🖍️", "📓", "✂️"];
const NOT_SCHOOL_ITEMS = ["🧸", "🍭", "🎮", "⚽", "🛝", "🎈", "🪀", "🍦"];
// O'quvchi odobi va maktab qoidalari
const SCHOOL_RULES = [
  { id: "qol", text: "Darsda javob bermoqchi bo'lsang nima qilasan?", ok: "🙋", no: ["🗣️", "🤸"] },
  { id: "tingla", text: "O'qituvchi gapirganda nima qilamiz?", ok: "👂", no: ["😴", "🏃"] },
  { id: "salom", text: "O'qituvchini ko'rsak nima qilamiz?", ok: "👋😊", no: ["😝", "🙈"] },
  { id: "kim", text: "Maktabda kim dars beradi?", ok: "👩‍🏫", no: ["👨‍🍳", "👨‍🚒"] },
  { id: "tanaffus", text: "Tanaffusda nima qilamiz?", ok: "⚽", no: ["🛏️", "📺"] },
  { id: "kiyim", text: "Maktabga qanday kiyimda boramiz?", ok: "👔", no: ["🩱", "🩴"] },
  { id: "uy", text: "Maktabdan keyin uyda nima qilamiz?", ok: "📝", no: ["🗑️", "🧨"] },
  { id: "yol", text: "Maktabga ketayotganda yo'lni qayerdan kesib o'tamiz?", ok: "🚸", no: ["🚧", "🌊"] }
];
// Ertalabki kun tartibi (to'g'ri tartibda)
const MORNING = [
  { id: "m1", emoji: "⏰", text: "Uyg'onamiz." },
  { id: "m2", emoji: "🪥", text: "Yuvinamiz, tishimizni tozalaymiz." },
  { id: "m3", emoji: "🥣", text: "Nonushta qilamiz." },
  { id: "m4", emoji: "👔", text: "Kiyinamiz." },
  { id: "m5", emoji: "🏫", text: "Maktabga boramiz!" }
];
addGroup("Men maktabga boraman", [
  ["school_q", "Maktabga qaysi birini olib boramiz?"],
  ["bag_q", "Portfelni yig'! Maktabga kerakli hamma narsani bos!"],
  ["bag_done", "Portfel tayyor! Endi maktabga borsa bo'ladi!"],
  ["morning_q", "Ertalab nimadan boshlaymiz? Rasmlarni tartib bilan bos!"],
  ...SCHOOL_RULES.map((r) => ["rule_" + r.id, r.text]),
  ...MORNING.map((m) => ["morning_" + m.id, m.text])
]);
