// Mashg'ulot rejalari
const LESSONS = [
  {
    id: 1, age: "kichik", ageLabel: "3–4 yosh", icon: "🍎",
    area: "Matematika", title: "Bitta va ko'p",
    goal: "Bolalarda «bitta» va «ko'p» tushunchalarini shakllantirish, narsalarni guruhlashga o'rgatish.",
    materials: ["Savatcha", "Olma, nok muljlari (o'yinchoq)", "Rangli kartochkalar"],
    duration: "15 daqiqa",
    steps: [
      "Kirish (2 daq): Tarbiyachi savatcha bilan kiradi: «Bolalar, qarang, Quyoncha bizga sovg'a olib keldi!»",
      "Asosiy qism (8 daq): Savatdan bitta olma olinadi — «Bu nechta? — Bitta». Keyin hamma olmalar stolga qo'yiladi — «Endi-chi? — Ko'p».",
      "Har bir bolaga bittadan olma beriladi: «Senda nechta? — Bitta. Savatda-chi? — Ko'p».",
      "Dinamik pauza: «Quyoncha sakraydi» — bolalar bir marta, keyin ko'p marta sakraydilar.",
      "Yakun (3 daq): Bolalar olmalarni qaytarib savatga soladilar va «ko'p bo'ldi» deb aytadilar."
    ],
    end: "Bolalar maqtaladi, Quyoncha har biriga rahmat aytadi."
  },
  {
    id: 2, age: "kichik", ageLabel: "3–4 yosh", icon: "🐱",
    area: "Nutq o'stirish", title: "Uy hayvonlari",
    goal: "Uy hayvonlari nomlari va ovozlarini bilish, so'z boyligini oshirish, hayvonlarga mehr uyg'otish.",
    materials: ["Mushuk, it, sigir, qo'y, xo'roz rasmlari yoki o'yinchoqlari", "Qo'g'irchoq-Buvi"],
    duration: "15 daqiqa",
    steps: [
      "Kirish: «Buvijon qishloqdan mehmonga keldi, u o'z do'stlarini olib kelibdi».",
      "Har bir hayvon ko'rsatiladi: nomi aytiladi, bolalar takrorlaydi va ovozini chiqaradi (mushuk — miyov, it — vov, sigir — mo'o).",
      "O'yin «Kim qichqirdi?»: tarbiyachi ovoz chiqaradi, bolalar hayvonni topadi.",
      "Barmoq o'yini: «Mushukcha yuvinadi» — barmoqlar bilan yuz silash harakatlari.",
      "Yakun: «Buvining do'stlari sizga yoqdimi? Qaysi biri ko'proq yoqdi?»"
    ],
    end: "Bolalar hayvonlar bilan xayrlashadilar."
  },
  {
    id: 3, age: "orta", ageLabel: "4–5 yosh", icon: "🍂",
    area: "Atrofimizdagi olam", title: "Oltin kuz",
    goal: "Kuz fasli belgilari bilan tanishtirish: barglar sarg'ayadi, havo soviydi, qushlar issiq o'lkalarga uchadi.",
    materials: ["Turli rangdagi barglar", "Kuz manzarasi rasmi", "Savatcha", "Musiqa yozuvi"],
    duration: "20 daqiqa",
    steps: [
      "Kirish: Topishmoq — «Bog'larda barglar sarg'ayar, qushlar uchib ketar. Bu qaysi fasl?» (Kuz).",
      "Suhbat rasm asosida: Kuzda daraxtlar qanday bo'ladi? Odamlar nima kiyadi? Qaysi mevalar pishadi?",
      "Barglarni ko'rib chiqish: rangi, shakli. «Qaysi barg sariq? Qaysi biri qizil?»",
      "Dinamik pauza «Barglar raqsi»: musiqa ostida bolalar barg ushlab aylanadi, musiqa to'xtasa — o'tirishadi.",
      "Didaktik o'yin «Bir xil bargni top»: bolalar juftlikni topadilar.",
      "Yakun: Kuz haqida nimalarni bilib oldik?"
    ],
    end: "Barglardan guruh xonasi uchun «Kuz daraxti» yasaladi."
  },
  {
    id: 4, age: "orta", ageLabel: "4–5 yosh", icon: "🎨",
    area: "Tasviriy faoliyat", title: "Kamalak chizamiz",
    goal: "Asosiy ranglarni mustahkamlash, mo'yqalamni to'g'ri ushlash, yoysimon chiziq chizishni o'rgatish.",
    materials: ["Albom varag'i", "Guash bo'yoqlar", "Mo'yqalam", "Suv idishi", "Salfetka"],
    duration: "20 daqiqa",
    steps: [
      "Kirish: Yomg'irdan keyin osmonda nima paydo bo'ladi? Kamalak rasmi ko'rsatiladi.",
      "Ranglarni sanash: qizil, to'q sariq, sariq, yashil, havorang, ko'k, binafsha.",
      "Ko'rsatish: tarbiyachi yoysimon chiziqni qanday chizishni ko'rsatadi.",
      "Barmoq gimnastikasi: «Yomg'ir tomchilari» — barmoqlar bilan stolga taqillatish.",
      "Mustaqil ish: bolalar kamalak chizadilar, tarbiyachi yordam beradi.",
      "Yakun: ko'rgazma — eng chiroyli kamalaklar doskaga ilinadi."
    ],
    end: "Har bir bola o'z rasmidagi ranglarni aytib beradi."
  },
  {
    id: 5, age: "katta", ageLabel: "5–6 yosh", icon: "🔢",
    area: "Matematika", title: "1 dan 10 gacha sanash",
    goal: "10 gacha tartib bilan sanash, sonni miqdor bilan moslash, «ko'p–kam–teng» tushunchalarini mustahkamlash.",
    materials: ["1–10 raqamli kartochkalar", "Sanoq tayoqchalari", "Rasmli kartochkalar"],
    duration: "25 daqiqa",
    steps: [
      "Kirish: «Sanoq qo'shig'i» — bolalar 1 dan 10 gacha qarsak chalib sanaydilar.",
      "O'yin «Raqamni top»: tarbiyachi raqam aytadi, bolalar kartochkani ko'taradi.",
      "Tayoqchalar bilan ish: «Raqam nechta bo'lsa, shuncha tayoqcha qo'y».",
      "Dinamik pauza: «Nechta qarsak — shuncha sakrash».",
      "Taqqoslash: ikki qatordagi narsalar — qayerda ko'p, qayerda kam? Qanday qilib teng qilamiz?",
      "Yakun: interaktiv «Sanab ko'r!» o'yini (saytdagi o'yinlar bo'limi)."
    ],
    end: "Bolalar bugun eng ko'p qaysi songacha sanaganlarini aytadilar."
  },
  {
    id: 6, age: "katta", ageLabel: "5–6 yosh", icon: "🔺",
    area: "Matematika", title: "Geometrik shakllar",
    goal: "Doira, kvadrat, uchburchak, to'rtburchak shakllarini farqlash, atrofdagi narsalardan shakllarni topish.",
    materials: ["Rangli qog'ozdan shakllar", "Konvertlar", "Magnit doska"],
    duration: "25 daqiqa",
    steps: [
      "Kirish: «Shakllar mamlakatiga sayohat» — xat keladi, ichida shakllar.",
      "Har bir shakl ko'rib chiqiladi: burchaklari nechta, tomonlari nechta?",
      "«Atrofimizda qidiramiz»: soat — doira, deraza — to'rtburchak, tom — uchburchak.",
      "Dinamik pauza: «Shakl yasaymiz» — bolalar qo'l ushlashib doira, uchburchak hosil qiladi.",
      "Ijodiy ish: shakllardan uycha, mashina, robot yopishtiriladi.",
      "Yakun: kim qaysi shakllarni ishlatdi?"
    ],
    end: "«Shaklni top!» interaktiv o'yini bilan mustahkamlanadi."
  },
  {
    id: 7, age: "katta", ageLabel: "5–6 yosh", icon: "🤸",
    area: "Jismoniy tarbiya", title: "Quvnoq badantarbiya",
    goal: "Muvozanat saqlash, sakrash, chaqqonlik va jamoada o'ynash ko'nikmalarini rivojlantirish.",
    materials: ["Gimnastika halqalari", "To'plar", "Arqon", "Kubiklar"],
    duration: "25 daqiqa",
    steps: [
      "Qatorga turish, salomlashish, yurish va yengil yugurish (3 daq).",
      "Umumrivojlantiruvchi mashqlar: qo'llarni yuqoriga, yon tomonga; egilish; o'tirib-turish (5 daq).",
      "Asosiy harakatlar: arqon ustidan yurish (muvozanat), halqadan halqaga sakrash, to'pni ikki qo'llab otish.",
      "Harakatli o'yin «Quyon va bo'ri»: bo'ri ushlashga harakat qiladi, quyonlar uyga qochadi.",
      "Tinchlantiruvchi qism: nafas mashqi «Gulni hidlaymiz, shamni puflaymiz»."
    ],
    end: "Bolalar maqtaladi, eng faol ishtirokchilar aytiladi."
  },
  {
    id: 8, age: "tayyorlov", ageLabel: "6–7 yosh", icon: "🔤",
    area: "Savod o'rgatish", title: "«A» tovushi va harfi",
    goal: "«A» unli tovushini ajratish, harf bilan tanishtirish, so'z boshida, o'rtasida, oxirida topish.",
    materials: ["A harfi kartochkasi", "Rasmlar: anor, ari, olma, tarvuz", "Qizil fishkalar", "Daftar"],
    duration: "30 daqiqa",
    steps: [
      "Kirish: Topishmoq — «Qizil qutichada marjon donalar» (Anor). So'z qaysi tovush bilan boshlanadi?",
      "Tovushni talaffuz qilish: og'iz keng ochiladi, ovoz erkin chiqadi — bu unli tovush (qizil fishka).",
      "O'yin «Tovushni ushla»: tarbiyachi so'zlar aytadi, «A» eshitilsa bolalar qarsak chaladi.",
      "Harf bilan tanishish: «A» qanday ko'rinadi? Tayoqchalardan yasash.",
      "Dinamik pauza: «Ari uchadi» — bolalar ari kabi g'uvillab aylanadi.",
      "Daftarda ish: «A» harfini nuqtalar bo'yicha yozish.",
      "Yakun: «A» bilan boshlanadigan so'zlarni aytish (ana, aka, archa, avtobus)."
    ],
    end: "Har bir bola bitta so'z aytib, yulduzcha oladi."
  },
  {
    id: 9, age: "tayyorlov", ageLabel: "6–7 yosh", icon: "🇺🇿",
    area: "Vatan tuyg'usi", title: "Mening Vatanim — O'zbekiston",
    goal: "Vatan, davlat ramzlari (bayroq, gerb, madhiya) haqida tushuncha berish, Vatanga muhabbat tarbiyalash.",
    materials: ["O'zbekiston bayrog'i va gerbi rasmi", "Xarita", "Madhiya yozuvi", "Rangli qalamlar"],
    duration: "30 daqiqa",
    steps: [
      "Kirish: Madhiya tinglanadi, bolalar tik turadilar. «Bu qanday qo'shiq?»",
      "Suhbat: Bizning Vatanimiz qanday ataladi? Poytaxtimiz qaysi shahar?",
      "Bayroq ranglari: havorang — osmon va suv, oq — tinchlik, yashil — tabiat, qizil chiziqlar — hayot kuchi. Yarim oy va 12 yulduz.",
      "She'r yodlash: «Vatanim» haqida qisqa she'r.",
      "Dinamik pauza: «Bog'imizda» — daraxt o'tqazish harakatlari.",
      "Amaliy ish: bolalar bayroqni bo'yaydilar.",
      "Yakun: Vatanimiz haqida nimalarni bilib oldik?"
    ],
    end: "Bolalarning ishlaridan «Mening Vatanim» ko'rgazmasi tashkil etiladi."
  },
  {
    id: 10, age: "tayyorlov", ageLabel: "6–7 yosh", icon: "🎵",
    area: "Musiqa", title: "Tez va sekin",
    goal: "Musiqa tempini (tez–sekin) farqlash, ritmni his qilish, musiqaga mos harakat qilish.",
    materials: ["Doira, qo'ng'iroqchalar, qoshiqlar", "Tez va sekin kuylar yozuvi", "Ro'molchalar"],
    duration: "25 daqiqa",
    steps: [
      "Musiqiy salomlashuv: «Assalomu alaykum» kuylab aytiladi.",
      "Tinglash: ikki kuy — biri tez (lazgi), biri sekin (alla). Qaysi biri qanday?",
      "Harakat: tez musiqa — yugurish, sekin musiqa — oyoq uchida yurish.",
      "Ritm o'yini: doira bilan tarbiyachi ritm chaladi, bolalar qarsak bilan takrorlaydi.",
      "Cholg'ular orkestri: bolalar qo'ng'iroqcha va qoshiqlarda jo'r bo'ladi.",
      "Yakun: sevimli qo'shiq birgalikda kuylanadi."
    ],
    end: "Bolalar qaysi cholg'u yoqqanini aytadilar."
  }
];

