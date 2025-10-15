const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Настройки CORS для Socket.io
const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:8080"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware CORS для Express
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:8080"],
    credentials: true
}));

// Раздаем статические файлы из корневой папки проекта
app.use(express.static(path.join(__dirname, '../')));

// Маршрут для проверки работы сервера
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Tic-Tac-Toe Server is running',
        timestamp: new Date().toISOString(),
        games: games.size,
        players: players.size
    });
});

// Маршрут для получения списка комнат
app.get('/api/rooms', (req, res) => {
    const rooms = Array.from(games.entries()).map(([roomId, game]) => ({
        roomId,
        players: game.players.length,
        status: game.status,
        hasPassword: false
    }));
    res.json(rooms);
});

// Хранилище игр и игроков
const games = new Map();
const players = new Map();

class TicTacToeGame {
    constructor(roomId) {
        this.roomId = roomId;
        this.board = Array(9).fill('');
        this.players = [];
        this.currentPlayer = 'X';
        this.status = 'waiting'; // waiting, playing, finished
        this.winner = null;
        this.moves = 0;
        this.createdAt = new Date();
    }

    addPlayer(playerId, username) {
        if (this.players.length >= 2) return false;
        
        const symbol = this.players.length === 0 ? 'X' : 'O';
        const player = { 
            id: playerId, 
            username, 
            symbol,
            connected: true
        };
        
        this.players.push(player);
        
        if (this.players.length === 2) {
            this.status = 'playing';
        }
        
        return true;
    }

    removePlayer(playerId) {
        const playerIndex = this.players.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
            this.players.splice(playerIndex, 1);
            
            if (this.players.length === 0) {
                this.status = 'finished';
            } else if (this.status === 'playing') {
                this.status = 'waiting';
            }
            
            return true;
        }
        return false;
    }

    makeMove(playerId, position) {
        if (this.status !== 'playing') {
            return { success: false, message: 'Игра не активна' };
        }
        
        if (position < 0 || position > 8 || this.board[position] !== '') {
            return { success: false, message: 'Неверный ход' };
        }
        
        const player = this.players.find(p => p.id === playerId);
        if (!player || player.symbol !== this.currentPlayer) {
            return { success: false, message: 'Не ваш ход' };
        }

        this.board[position] = this.currentPlayer;
        this.moves++;
        
        // Проверка победы
        if (this.checkWinner()) {
            this.status = 'finished';
            this.winner = playerId;
            return { 
                success: true, 
                winner: playerId,
                winningLine: this.getWinningLine()
            };
        }
        
        // Проверка ничьи
        if (this.moves === 9) {
            this.status = 'finished';
            this.winner = 'draw';
            return { success: true, winner: 'draw' };
        }
        
        // Смена игрока
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        return { success: true };
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] !== '' && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }

    getWinningLine() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] !== '' && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                return pattern;
            }
        }
        return null;
    }

    getGameState() {
        return {
            board: this.board,
            players: this.players.map(p => ({
                id: p.id,
                username: p.username,
                symbol: p.symbol,
                connected: p.connected
            })),
            currentPlayer: this.currentPlayer,
            status: this.status,
            winner: this.winner,
            moves: this.moves,
            roomId: this.roomId
        };
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.status = 'playing';
        this.winner = null;
        this.moves = 0;
    }
}

// Socket.io соединения
io.on('connection', (socket) => {
    console.log('🔗 User connected:', socket.id);

    // Присоединение к игре
    socket.on('join-game', (data) => {
        const { username, roomId = 'default' } = data;
        
        console.log(`🎮 ${username} пытается присоединиться к комнате ${roomId}`);
        
        let game = games.get(roomId);
        if (!game) {
            game = new TicTacToeGame(roomId);
            games.set(roomId, game);
            console.log(`✅ Создана новая комната: ${roomId}`);
        }

        players.set(socket.id, { username, roomId, socketId: socket.id });

        if (game.addPlayer(socket.id, username)) {
            socket.join(roomId);
            
            const gameState = game.getGameState();
            socket.emit('joined-game', { 
                success: true, 
                symbol: game.players.find(p => p.id === socket.id).symbol,
                gameState: gameState
            });
            
            // Отправляем сообщение в чат о новом игроке
            io.to(roomId).emit('chat-message', {
                sender: 'Система',
                message: `Игрок ${username} присоединился к игре`,
                timestamp: new Date().toLocaleTimeString(),
                type: 'system'
            });
            
            // Обновляем состояние игры для всех в комнате
            io.to(roomId).emit('game-update', gameState);
            
            console.log(`✅ ${username} присоединился к комнате ${roomId} как ${gameState.players.find(p => p.id === socket.id).symbol}`);
        } else {
            socket.emit('joined-game', { 
                success: false, 
                message: 'Комната заполнена (максимум 2 игрока)' 
            });
            console.log(`❌ ${username} не смог присоединиться - комната ${roomId} заполнена`);
        }
    });

    // Ход игрока
    socket.on('make-move', (data) => {
        const { position, roomId } = data;
        const player = players.get(socket.id);
        
        if (!player) {
            socket.emit('move-error', { message: 'Игрок не найден' });
            return;
        }
        
        const game = games.get(roomId || player.roomId);
        if (!game) {
            socket.emit('move-error', { message: 'Игра не найдена' });
            return;
        }

        console.log(`🎯 ${player.username} делает ход на позицию ${position} в комнате ${game.roomId}`);

        const result = game.makeMove(socket.id, position);
        
        if (result.success) {
            const gameState = game.getGameState();
            
            // Отправляем обновление всем в комнате
            io.to(game.roomId).emit('game-update', gameState);
            
            // Отправляем сообщение в чат о ходе
            io.to(game.roomId).emit('chat-message', {
                sender: 'Система',
                message: `Игрок ${player.username} поставил ${gameState.board[position]} на позицию ${position + 1}`,
                timestamp: new Date().toLocaleTimeString(),
                type: 'system'
            });

            // Если игра окончена
            if (game.status === 'finished') {
                let winnerMessage = '';
                if (game.winner === 'draw') {
                    winnerMessage = 'Ничья!';
                } else {
                    const winner = game.players.find(p => p.id === game.winner);
                    winnerMessage = `Победил ${winner.username}!`;
                }
                
                io.to(game.roomId).emit('chat-message', {
                    sender: 'Система',
                    message: `🎉 Игра окончена! ${winnerMessage}`,
                    timestamp: new Date().toLocaleTimeString(),
                    type: 'system'
                });

                // Автоматический перезапуск через 5 секунд
                setTimeout(() => {
                    if (game.players.length === 2) {
                        game.resetGame();
                        const newGameState = game.getGameState();
                        io.to(game.roomId).emit('game-update', newGameState);
                        
                        io.to(game.roomId).emit('chat-message', {
                            sender: 'Система',
                            message: '🔄 Новая игра началась!',
                            timestamp: new Date().toLocaleTimeString(),
                            type: 'system'
                        });
                    }
                }, 5000);
            }
        } else {
            socket.emit('move-error', { message: result.message });
        }
    });

    // Перезапуск игры
    socket.on('reset-game', (data) => {
        const { roomId } = data;
        const player = players.get(socket.id);
        
        if (!player) return;
        
        const game = games.get(roomId || player.roomId);
        if (!game) return;

        // Проверяем, что игрок находится в этой игре
        if (!game.players.find(p => p.id === socket.id)) return;

        game.resetGame();
        const gameState = game.getGameState();
        
        io.to(game.roomId).emit('game-update', gameState);
        io.to(game.roomId).emit('chat-message', {
            sender: 'Система',
            message: `🔄 ${player.username} начал новую игру`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'system'
        });
    });

    // Сообщения в чат игры
    socket.on('game-chat-message', (data) => {
        const player = players.get(socket.id);
        
        if (!player) return;
        
        const game = games.get(player.roomId);
        if (!game) return;

        const messageData = {
            sender: player.username,
            message: data.message,
            timestamp: new Date().toLocaleTimeString(),
            type: 'chat'
        };

        io.to(game.roomId).emit('chat-message', messageData);
    });

    // Пинг для проверки подключения
    socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date().toISOString() });
    });

    // Отключение игрока
    socket.on('disconnect', (reason) => {
        console.log('🔌 User disconnected:', socket.id, reason);
        
        const player = players.get(socket.id);
        if (player) {
            const game = games.get(player.roomId);
            if (game) {
                // Помечаем игрока как отключенного
                const gamePlayer = game.players.find(p => p.id === socket.id);
                if (gamePlayer) {
                    gamePlayer.connected = false;
                }
                
                // Отправляем сообщение в чат
                io.to(player.roomId).emit('chat-message', {
                    sender: 'Система',
                    message: `Игрок ${player.username} отключился`,
                    timestamp: new Date().toLocaleTimeString(),
                    type: 'system'
                });

                // Если в игре остался 1 игрок, ставим на паузу
                if (game.status === 'playing' && game.players.filter(p => p.connected).length === 1) {
                    game.status = 'waiting';
                    io.to(player.roomId).emit('game-update', game.getGameState());
                }

                // Удаляем игру если нет игроков
                setTimeout(() => {
                    if (game.players.length === 0) {
                        games.delete(player.roomId);
                        console.log(`🗑️ Комната ${player.roomId} удалена (нет игроков)`);
                    }
                }, 60000); // Удаляем через 1 минуту
            }
            
            players.delete(socket.id);
        }
    });

    // Восстановление подключения
    socket.on('reconnect-player', (data) => {
        const { username, roomId } = data;
        const player = Array.from(players.values()).find(p => p.username === username && p.roomId === roomId);
        
        if (player) {
            // Обновляем socket.id
            player.socketId = socket.id;
            players.set(socket.id, player);
            players.delete(player.socketId); // Удаляем старую запись
            
            socket.join(roomId);
            
            const game = games.get(roomId);
            if (game) {
                const gamePlayer = game.players.find(p => p.username === username);
                if (gamePlayer) {
                    gamePlayer.connected = true;
                    gamePlayer.id = socket.id;
                    
                    // Если оба игрока онлайн, возобновляем игру
                    if (game.status === 'waiting' && game.players.filter(p => p.connected).length === 2) {
                        game.status = 'playing';
                    }
                    
                    io.to(roomId).emit('game-update', game.getGameState());
                    io.to(roomId).emit('chat-message', {
                        sender: 'Система',
                        message: `Игрок ${username} переподключился`,
                        timestamp: new Date().toLocaleTimeString(),
                        type: 'system'
                    });
                }
            }
        }
    });
});

// Функция для очистки неактивных игр
setInterval(() => {
    const now = new Date();
    let cleanedCount = 0;
    
    for (let [roomId, game] of games.entries()) {
        // Удаляем игры, созданные более 2 часов назад и без игроков
        if (now - game.createdAt > 2 * 60 * 60 * 1000 && game.players.length === 0) {
            games.delete(roomId);
            cleanedCount++;
        }
    }
    
    if (cleanedCount > 0) {
        console.log(`🧹 Очищено ${cleanedCount} неактивных игр`);
    }
}, 30 * 60 * 1000); // Проверяем каждые 30 минут

// Запуск сервера
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🎮 Tic-Tac-Toe Server running on http://localhost:${PORT}`);
    console.log(`📡 API Status: http://localhost:${PORT}/api/status`);
    console.log(`📋 Rooms API: http://localhost:${PORT}/api/rooms`);
    console.log('=========================================');
});