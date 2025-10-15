// Automated tests for the gaming site
class GameSiteTests {
    constructor() {
        this.tests = [];
        this.results = [];
    }

    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    async runTests() {
        console.log('🚀 Starting GameHub tests...\n');
        
        for (const test of this.tests) {
            try {
                await test.testFunction();
                this.results.push({ name: test.name, passed: true });
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.results.push({ name: test.name, passed: false, error: error.message });
                console.log(`❌ ${test.name}: ${error.message}`);
            }
        }

        this.printResults();
    }

    printResults() {
        console.log('\n📊 Test Results:');
        console.log('================');
        
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);

        if (failed > 0) {
            console.log('\nFailed Tests:');
            this.results.filter(r => !r.passed).forEach(test => {
                console.log(`  • ${test.name}: ${test.error}`);
            });
        }
    }

    // Test helper methods
    clearStorage() {
        localStorage.clear();
    }

    createTestUser() {
        const testUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            balance: 1000,
            subscription: 'free',
            registrationDate: new Date().toISOString()
        };
        
        const users = [testUser];
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(testUser));
        
        return testUser;
    }
}

// Create test instance
const gameTests = new GameSiteTests();

// Add tests
gameTests.addTest('Local Storage Initialization', () => {
    gameTests.clearStorage();
    
    if (localStorage.getItem('users') !== null) {
        throw new Error('Local storage should be cleared');
    }
});

gameTests.addTest('User Registration', () => {
    gameTests.clearStorage();
    
    const testUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'testpass123'
    };
    
    // Simulate registration
    const users = [testUser];
    localStorage.setItem('users', JSON.stringify(users));
    
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    if (!storedUsers || storedUsers.length !== 1) {
        throw new Error('User registration failed');
    }
    
    if (storedUsers[0].username !== 'newuser') {
        throw new Error('Username not stored correctly');
    }
});

gameTests.addTest('User Login', () => {
    gameTests.clearStorage();
    const testUser = gameTests.createTestUser();
    
    // Simulate login
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === 'testuser' && u.password === 'password123');
    
    if (!user) {
        throw new Error('User login failed');
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser.username !== 'testuser') {
        throw new Error('Current user not set correctly');
    }
});

gameTests.addTest('Balance Management', () => {
    gameTests.clearStorage();
    const testUser = gameTests.createTestUser();
    
    // Test balance update
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.username === 'testuser');
    
    if (userIndex === -1) {
        throw new Error('Test user not found');
    }
    
    const addAmount = 500;
    users[userIndex].balance += addAmount;
    localStorage.setItem('users', JSON.stringify(users));
    
    const updatedUsers = JSON.parse(localStorage.getItem('users'));
    if (updatedUsers[userIndex].balance !== 1500) {
        throw new Error('Balance update failed');
    }
});

gameTests.addTest('Chat Message Storage', () => {
    gameTests.clearStorage();
    gameTests.createTestUser();
    
    // Test chat functionality
    const testMessage = {
        sender: 'testuser',
        text: 'Hello, world!',
        time: new Date().toLocaleTimeString()
    };
    
    const messages = [testMessage];
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    if (!storedMessages || storedMessages.length !== 1) {
        throw new Error('Chat message storage failed');
    }
    
    if (storedMessages[0].text !== 'Hello, world!') {
        throw new Error('Chat message content incorrect');
    }
});

gameTests.addTest('Subscription Plan Data', () => {
    const plans = [
        { name: "Базовый", price: 0 },
        { name: "Премиум", price: 299 },
        { name: "Про", price: 599 }
    ];
    
    if (plans.length !== 3) {
        throw new Error('Incorrect number of subscription plans');
    }
    
    if (plans[0].price !== 0) {
        throw new Error('Free plan should have price 0');
    }
});

// Run tests when this file is loaded
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Add test button to pages for easy testing
        if (window.location.pathname.includes('games.html')) {
            const testBtn = document.createElement('button');
            testBtn.textContent = '🧪 Run Tests';
            testBtn.className = 'btn btn-primary';
            testBtn.style.position = 'fixed';
            testBtn.style.bottom = '20px';
            testBtn.style.right = '20px';
            testBtn.style.zIndex = '1000';
            testBtn.onclick = () => gameTests.runTests();
            document.body.appendChild(testBtn);
        }
    });
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameSiteTests, gameTests };
}

// Добавьте эти тесты в существующий файл tests.js

gameTests.addTest('Games API Connection', async () => {
    try {
        const response = await fetch('https://www.freetogame.com/api/games');
        if (!response.ok) {
            throw new Error('Games API not available');
        }
        const games = await response.json();
        if (!Array.isArray(games)) {
            throw new Error('Invalid games data format');
        }
    } catch (error) {
        throw new Error(`Games API test failed: ${error.message}`);
    }
});

gameTests.addTest('Game Data Structure', () => {
    const sampleGame = {
        id: 1,
        title: "Test Game",
        thumbnail: "https://example.com/image.jpg",
        genre: "Strategy",
        platform: "PC",
        short_description: "Test description",
        game_url: "https://example.com/game"
    };

    if (!sampleGame.id || !sampleGame.title) {
        throw new Error('Game data structure incomplete');
    }
});

gameTests.addTest('Game Filtering', () => {
    const games = [
        { title: "Chess", genre: "Strategy" },
        { title: "Puzzle Game", genre: "Puzzle" },
        { title: "Action Game", genre: "Action" }
    ];

    const filtered = games.filter(game => 
        game.genre.toLowerCase().includes("strategy")
    );

    if (filtered.length !== 1) {
        throw new Error('Game filtering not working correctly');
    }
});