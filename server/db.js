const { PrismaClient } = require('@prisma/client');

let prisma;
try {
    // DATABASE_URL mavjudligini tekshirish
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== "") {
        prisma = new PrismaClient();
        console.log('Prisma mijoz muvaffaqiyatli yuklandi');
    } else {
        throw new Error('DATABASE_URL topilmadi');
    }
} catch (e) {
    console.warn('Baza ulanishida xato, mock-ob\'ektdan foydalaniladi:', e.message);
    prisma = {
        playerProfile: {
            update: async () => { return null; },
            findUnique: async () => { return null; }
        }
    };
}

module.exports = prisma;
