const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const prisma = require('./db');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const players = {};
const monsters = {};
let lobbyTimer = 5;
let gameStarted = false;

// Maxluqlarni yaratish (Lobby tugagach)
function spawnMonsters() {
    for (let i = 0; i < 10; i++) {
        const id = `mob_${i}`;
        monsters[id] = {
            id,
            position: { 
                x: (Math.random() - 0.5) * 60, 
                y: 1, 
                z: (Math.random() - 0.5) * 60 
            },
            health: 50,
            type: 'zombie'
        };
    }
    io.emit('updateMonsters', monsters);
}

io.on('connection', (socket) => {
    console.log('Foydalanuvchi ulandi:', socket.id);

    // Yangi o'yinchini qo'shish
    players[socket.id] = {
        id: socket.id,
        position: { x: 0, y: 1, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        role: 'none',
        team: null,
        health: 100,
        lvl: 1,
        exp: 0,
        state: { isCrouching: false, isLying: false, isPunching: false, isHanging: false, isUsingSkill: false }
    };

    // Barcha o'yinchilarga yangi o'yinchi haqida xabar berish
    io.emit('updatePlayers', players);
    
    // Joriy holatni yangi o'yinchiga yuborish
    socket.emit('lobbyTimer', lobbyTimer);
    if (gameStarted) {
        const task = Object.keys(players).length === 1 ? 'Solo Labirint' : 'Team Survival';
        socket.emit('startGame', { task });
    }

    // Harakatni sinxronlash
    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].position = data.position;
            players[socket.id].rotation = data.rotation;
            players[socket.id].state = data.state;
            players[socket.id].lastUpdate = Date.now();
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    // Rol tanlash
    socket.on('selectRole', (role) => {
        if (players[socket.id]) {
            players[socket.id].role = role;
            io.emit('updatePlayers', players);
        }
    });

    // Chat xabari
    socket.on('chatMessage', (text) => {
        const player = players[socket.id];
        if (player) {
            // Komandalar
            if (text === '/start') {
                gameStarted = true;
                const playerCount = Object.keys(players).length;
                const task = playerCount === 1 ? 'Solo Labirint' : 'Team Survival';
                io.emit('startGame', { task });
                return;
            }
            if (text === '/reset') {
                lobbyTimer = 5;
                gameStarted = false;
                io.emit('lobbyTimer', lobbyTimer);
                return;
            }
            if (text === '/xp') {
                grantXP(socket.id, 50);
                return;
            }

            const msg = { id: Date.now().toString(), text, sender: socket.id };
            if (player.team) {
                // Faqat jamoaga
                io.to(player.team).emit('chatMessage', msg);
            } else {
                // Global
                io.emit('chatMessage', msg);
            }
        }
    });

    // Qobiliyatdan foydalanish
    socket.on('useSkill', () => {
        const player = players[socket.id];
        if (player && !player.skillCooldown) {
            console.log(`${socket.id} qobiliyatni ishlatdi: ${player.role}`);
            
            // Rolga qarab effektlar
            let effect = {};
            switch(player.role) {
                case 'warrior': effect = { type: 'dash', power: 10 }; break;
                case 'mage': effect = { type: 'fireball', damage: 20 }; break;
                case 'healer': effect = { type: 'regen', amount: 30 }; break;
                case 'tank': effect = { type: 'shield', duration: 3000 }; break;
                default: effect = { type: 'basic', power: 5 };
            }

            io.emit('skillEffect', { playerId: socket.id, effect });

            // Cooldown (5 soniya)
            player.skillCooldown = true;
            setTimeout(() => { player.skillCooldown = false; }, 5000);
        }
    });

    // Jamoaga qo'shilish
    socket.on('joinTeam', (teamId) => {
        const player = players[socket.id];
        if (player) {
            // Avvalgi jamoadan chiqish
            if (player.team) {
                socket.leave(player.team);
            }
            player.team = teamId;
            socket.join(teamId);
            console.log(`${socket.id} jamoaga qo'shildi: ${teamId}`);
            io.emit('updatePlayers', players);
            socket.emit('chatMessage', { id: 'sys', text: `${teamId} jamoasiga qo'shildingiz`, sender: 'System' });
        }
    });

    // Zarba berish (Attack)
    socket.on('action', (data) => {
        if (data.type === 'punch') {
            const player = players[socket.id];
            if (!player) return;

            // Maxluqlarga zarar yetkazishni tekshirish
            Object.values(monsters).forEach(mob => {
                const dist = Math.sqrt(
                    Math.pow(player.position.x - mob.position.x, 2) +
                    Math.pow(player.position.z - mob.position.z, 2)
                );
                if (dist < 2) {
                    mob.health -= 25;
                    console.log(`Maxluq ${mob.id} urildi! HP: ${mob.health}`);
                    if (mob.health <= 0) {
                        delete monsters[mob.id];
                        grantXP(socket.id, 20); // Maxluq o'ldirilgani uchun XP
                    }
                    io.emit('updateMonsters', monsters);
                }
            });
        }
    });

    // Uzilish
    socket.on('disconnect', () => {
        console.log('Foydalanuvchi uzildi:', socket.id);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

// XP Berish va Darajani Oshirish
async function grantXP(playerId, amount) {
    const player = players[playerId];
    if (!player) return;

    player.exp += amount;
    const nextLevelExp = player.lvl * 100;

    if (player.exp >= nextLevelExp) {
        player.lvl += 1;
        player.exp = 0;
        io.emit('levelUp', { playerId, level: player.lvl });
        console.log(`${playerId} yangi darajaga ko'tarildi: ${player.lvl}`);
        
        // Bazaga saqlash (agar ro'yxatdan o'tgan bo'lsa)
        if (player.dbId) {
            try {
                await prisma.playerProfile.update({
                    where: { userId: player.dbId },
                    data: { level: player.lvl, exp: player.exp }
                });
            } catch (e) { console.error('DB update error:', e); }
        }
    }
    io.emit('updatePlayers', players);
}

// Lobby va O'yin Taymeri
setInterval(() => {
    const playerCount = Object.keys(players).length;
    
    if (playerCount > 0 && lobbyTimer > 0 && !gameStarted) {
        lobbyTimer--;
        io.emit('lobbyTimer', lobbyTimer);
    } else if (playerCount > 0 && lobbyTimer === 0 && !gameStarted) {
        gameStarted = true;
        const task = playerCount === 1 ? 'Solo Labirint' : 'Team Survival';
        spawnMonsters();
        io.emit('startGame', { task });
    } else if (playerCount === 0) {
        // Reset lobby if no players
        lobbyTimer = 5;
        gameStarted = false;
    }

    // "Ghost" ulanishlarni tozalash (30 soniya harakatsizlik)
    const now = Date.now();
    Object.keys(players).forEach(id => {
        if (players[id].lastUpdate && now - players[id].lastUpdate > 30000) {
            console.log('Ghost o\'yinchi o\'chirildi:', id);
            delete players[id];
            io.emit('updatePlayers', players);
        }
    });

    // Maxluqlarni harakatlantirish
    if (gameStarted) {
        Object.values(monsters).forEach(mob => {
            if (Math.random() > 0.8) {
                mob.position.x += (Math.random() - 0.5) * 2;
                mob.position.z += (Math.random() - 0.5) * 2;
                io.emit('updateMonsters', monsters);
            }
        });
    }
}, 1000);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishlamoqda`);
});
