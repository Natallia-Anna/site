// Enhanced GameManager with local HTML5 games
class GameManager {
    constructor() {
        this.games = [];
        this.init();
    }

    init() {
        this.loadLocalGames();
        this.bindEvents();
    }

    loadLocalGames() {

// В games.js добавьте все игры:

        this.games = [
          {
            id: 1,
            title: "Шахматы",
            thumbnail:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA3OTZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imaXvuI88L3RleHQ+PC9zdmc+",
            genre: "Стратегия",
            platform: "Browser",
            short_description: "Классические шахматы против компьютера",
            game_url: "games/chess.html",
            type: "local",
          },
          {
            id: 2,
            title: "2048",
            thumbnail:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA0ZDQwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4yMDQ4PC90ZXh0Pjwvc3ZnPg==",
            genre: "Головоломка",
            platform: "Browser",
            short_description: "Объединяйте числа чтобы получить 2048",
            game_url: "games/2048.html",
            type: "local",
          },
          {
            id: 3,
            title: "Змейка",
            thumbnail:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNERCQTZDIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5qNPC90ZXh0Pjwvc3ZnPg==",
            genre: "Аркада",
            platform: "Browser",
            short_description: "Классическая игра в змейку",
            game_url: "games/snake.html",
            type: "local",
          },
          {
            id: 4,
            title: "Крестики-нолики",
            thumbnail:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA3OTZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqPvuI88L3RleHQ+PC9zdmc+",
            genre: "Логика",
            platform: "Browser",
            short_description: "Игра против компьютера",
            game_url: "games/tictactoe.html",
            type: "local",
          },
          {
            id: 5,
            title: "Пазлы",
            thumbnail:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA0ZDQwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5GpPC90ZXh0Pjwvc3ZnPg==",
            genre: "Головоломка",
            platform: "Browser",
            short_description: "Собирайте пазлы разных сложностей",
            game_url: "games/puzzle.html",
            type: "local",
          },
          {
            id: 6,
            title: "Крестики-нолики Multiplayer",
            thumbnail:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNERCQTZDIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqPvuI8gTXVsdGlwbGF5ZXI8L3RleHQ+PC9zdmc+",
            genre: "Стратегия",
            platform: "Multiplayer",
            short_description: "Играйте с друзьями онлайн в реальном времени",
            game_url: "games/tictactoe-multiplayer.html",
            type: "multiplayer",
          },
        ];
        this.displayGames(this.games);
    }

    bindEvents() {
        const searchInput = document.getElementById('searchInput');
        const genreFilter = document.getElementById('genreFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterGames(e.target.value));
        }
        
        if (genreFilter) {
            genreFilter.addEventListener('change', (e) => this.filterByGenre(e.target.value));
        }
    }

    displayGames(games) {
        const gamesGrid = document.getElementById('gamesGrid');
        if (!gamesGrid) return;

        gamesGrid.innerHTML = games.map(game => `
            <div class="game-card" data-genre="${game.genre.toLowerCase()}">
                <div class="game-image">
                    <div style="width:100%;height:200px;background:linear-gradient(45deg,#00796b,#004d40);display:flex;align-items:center;justify-content:center;color:white;font-size:48px">
                        ${this.getGameEmoji(game.title)}
                    </div>
                    <div class="game-badge">${game.platform}</div>
                    ${game.type === 'local' ? '<div class="game-badge" style="left:10px;background:#4CAF50">Локальная</div>' : ''}
                </div>
                <div class="game-content">
                    <h3>${game.title}</h3>
                    <p><strong>Жанр:</strong> ${game.genre}</p>
                    <p class="game-description">${game.short_description}</p>
                    <div class="game-actions">
                        <button class="btn btn-primary" onclick="gameManager.playGame(${game.id})">
                            🎮 Играть сейчас
                        </button>
                        ${game.type === 'local' ? '<span style="color:#4CAF50;font-size:12px">✓ Не требует интернета</span>' : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getGameEmoji(title) {
        const emojis = {
            'Шахматы': '♟️',
            '2048': '🔢',
            'Змейка': '🐍',
            'Крестики-нолики': '⭕',
            'Пазлы': '🧩',
            'Тетрис': '🧱'
        };
        return emojis[title] || '🎮';
    }

    playGame(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (!game) return;

        if (game.type === 'local') {
            // Открываем локальную игру в новом окне
            window.open(game.game_url, '_blank', 'width=800,height=600');
        } else if (game.game_url) {
            // Внешняя игра
            window.open(game.game_url, '_blank');
        } else {
            alert('Игра временно недоступна');
        }
    }

    filterGames(searchTerm) {
        const filteredGames = this.games.filter(game =>
            game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.short_description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.displayGames(filteredGames);
    }

    filterByGenre(genre) {
        if (!genre) {
            this.displayGames(this.games);
            return;
        }

        const filteredGames = this.games.filter(game =>
            game.genre.toLowerCase().includes(genre.toLowerCase())
        );
        this.displayGames(filteredGames);
    }
}

// Initialize game manager
let gameManager;

document.addEventListener('DOMContentLoaded', function() {
    gameManager = new GameManager();
});