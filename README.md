# Blocky Battle Royale

Minecraft uslubidagi multiplayer 3D web-o'yin.

## Texnologiyalar
- **Frontend:** Next.js, Three.js (@react-three/fiber), TailwindCSS
- **Backend:** Node.js, Express, Socket.io
- **Database:** PostgreSQL (Prisma ORM)

## O'yin Xususiyatlari
- **Multiplayer:** Bir vaqtda 1-100 o'yinchi.
- **Rollar:** 10 ta xil personaj roli (Warrior, Mage, Healer va h.k.).
- **Dinamik Maydon:** Labirint va maxluqlar (mobs).
- **Harakatlar:** Yurish, sakrash, egilish, yotish, devorga osilish.
- **LVL Tizimi:** Maxluqlarni o'ldirish orqali XP yig'ish va darajani oshirish.
- **Chat:** Jamoaviy va global chat tizimi.

## Ishga Tushirish

### 1. Serverni sozlash
```bash
cd server
npm install
# .env fayliga DATABASE_URL ni yozing
npx prisma generate
node server.js
```

### 2. Clientni sozlash
```bash
cd client
npm install
npm run dev
```

## Boshqaruv
- **W, A, S, D:** Yurish
- **SPACE:** Sakrash / Devorga osilish
- **Sichqoncha:** Atrofga qarash va Urish (Punch)
- **Q:** Maxsus qobiliyat (Skill)
- **C:** Egilish
- **X:** Yotish
