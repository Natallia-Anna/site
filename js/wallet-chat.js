// Глобальные функции для чата и кошелька

// ===== ЧАТ =====
function openChat() {
    console.log('Opening chat...');
    const modal = document.getElementById('chatModal');
    if (!modal) {
        console.error('Chat modal not found!');
        return;
    }
    modal.style.display = 'block';
    loadChatMessages();
    
    // Фокусируемся на поле ввода
    setTimeout(() => {
        const input = document.getElementById('globalChatInput');
        if (input) input.focus();
    }, 100);
}

function closeChat() {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function sendGlobalMessage() {
    const input = document.getElementById('globalChatInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Пожалуйста, войдите в систему чтобы писать в чат');
        return;
    }
    
    // Добавляем сообщение в чат
    addMessageToChat(currentUser.username, message);
    
    // Сохраняем в localStorage
    saveMessageToStorage(currentUser.username, message);
    
    input.value = '';
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('globalChatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    messageElement.innerHTML = `
        <div class="message-sender">${sender}:</div>
        <div class="message-text">${message}</div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveMessageToStorage(sender, message) {
    const messages = JSON.parse(localStorage.getItem('globalChat') || '[]');
    messages.push({
        sender,
        message,
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString()
    });
    
    // Сохраняем только последние 100 сообщений
    if (messages.length > 100) {
        messages.splice(0, messages.length - 100);
    }
    
    localStorage.setItem('globalChat', JSON.stringify(messages));
}

function loadChatMessages() {
    const chatMessages = document.getElementById('globalChatMessages');
    if (!chatMessages) return;
    
    const messages = JSON.parse(localStorage.getItem('globalChat') || '[]');
    
    // Оставляем только системное сообщение приветствия
    chatMessages.innerHTML = '<div class="system-message">Добро пожаловать в общий чат GameHub! 🎮</div>';
    
    // Загружаем сохраненные сообщения
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <div class="message-sender">${msg.sender}:</div>
            <div class="message-text">${msg.message}</div>
            <div class="message-time">${msg.time}</div>
        `;
        chatMessages.appendChild(messageElement);
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===== КОШЕЛЕК =====
function openWallet() {
    console.log('Opening wallet...');
    const modal = document.getElementById('walletModal');
    if (!modal) {
        console.error('Wallet modal not found!');
        return;
    }
    modal.style.display = 'block';
    updateBalanceDisplay();
    loadTransactionHistory();
    
    // Скрываем формы при открытии
    hideAddCardForm();
    hideAddMoneyForm();
}

function closeWallet() {
    const modal = document.getElementById('walletModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateBalanceDisplay() {
    const currentUser = getCurrentUser();
    const balanceAmount = document.getElementById('balanceAmount');
    if (balanceAmount && currentUser) {
        balanceAmount.textContent = `${currentUser.balance || 0} ₽`;
    }
}

function showAddCardForm() {
    const addCardForm = document.getElementById('addCardForm');
    const addMoneyForm = document.getElementById('addMoneyForm');
    if (addCardForm) addCardForm.style.display = 'block';
    if (addMoneyForm) addMoneyForm.style.display = 'none';
}

function hideAddCardForm() {
    const addCardForm = document.getElementById('addCardForm');
    if (addCardForm) {
        addCardForm.style.display = 'none';
        // Очищаем поля формы
        document.getElementById('cardNumber').value = '';
        document.getElementById('cardExpiry').value = '';
        document.getElementById('cardCvv').value = '';
    }
}

function showAddMoneyForm() {
    const addCardForm = document.getElementById('addCardForm');
    const addMoneyForm = document.getElementById('addMoneyForm');
    if (addCardForm) addCardForm.style.display = 'none';
    if (addMoneyForm) addMoneyForm.style.display = 'block';
}

function hideAddMoneyForm() {
    const addMoneyForm = document.getElementById('addMoneyForm');
    if (addMoneyForm) {
        addMoneyForm.style.display = 'none';
        // Очищаем поле суммы
        document.getElementById('addAmount').value = '';
    }
}

// Форматирование номера карты
function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
        input.value = parts.join(' ');
    } else {
        input.value = value;
    }
}

// Форматирование срока действия
function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
        input.value = value;
    }
}

function linkCard() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCvv = document.getElementById('cardCvv').value;
    
    // Простая валидация
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        alert('Пожалуйста, введите корректный 16-значный номер карты');
        return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        alert('Пожалуйста, введите срок действия в формате ММ/ГГ');
        return;
    }
    
    if (cardCvv.length !== 3 || !/^\d+$/.test(cardCvv)) {
        alert('Пожалуйста, введите корректный CVV код (3 цифры)');
        return;
    }
    
    // Сохраняем информацию о карте
    const currentUser = getCurrentUser();
    if (currentUser) {
        currentUser.cardLinked = true;
        currentUser.cardLastDigits = cardNumber.slice(-4);
        saveUserData(currentUser);
        
        // Добавляем транзакцию
        addTransaction('card_linked', 'Привязка карты', 0, 'Карта успешно привязана');
        
        alert('✅ Карта успешно привязана! Мы проверим её в течение 10 минут.');
        hideAddCardForm();
        loadTransactionHistory();
    }
}

function addMoney() {
    const amountInput = document.getElementById('addAmount');
    if (!amountInput) return;
    
    const amount = parseInt(amountInput.value);
    
    if (!amount || amount < 100) {
        alert('Минимальная сумма пополнения - 100 ₽');
        return;
    }
    
    const currentUser = getCurrentUser();
    if (currentUser) {
        if (!currentUser.cardLinked) {
            alert('Пожалуйста, сначала привяжите карту');
            showAddCardForm();
            return;
        }
        
        // Обновляем баланс
        currentUser.balance = (currentUser.balance || 0) + amount;
        saveUserData(currentUser);
        
        // Добавляем транзакцию
        addTransaction('deposit', 'Пополнение баланса', amount, `Пополнение с карты ****${currentUser.cardLastDigits}`);
        
        updateBalanceDisplay();
        loadTransactionHistory();
        hideAddMoneyForm();
        
        alert(`✅ Баланс успешно пополнен на ${amount} ₽`);
    }
}

function addTransaction(type, description, amount, details = '') {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        transactions.unshift({
            userId: currentUser.username,
            type: type,
            description: description,
            amount: amount,
            details: details,
            date: new Date().toLocaleString()
        });
        
        // Сохраняем только последние 50 транзакций
        if (transactions.length > 50) {
            transactions.splice(50);
        }
        
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
}

function loadTransactionHistory() {
    const transactionList = document.getElementById('transactionList');
    if (!transactionList) return;
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const currentUser = getCurrentUser();
    
    transactionList.innerHTML = '';
    
    if (!currentUser) {
        transactionList.innerHTML = '<div class="transaction-item">Войдите в систему</div>';
        return;
    }
    
    // Фильтруем транзакции текущего пользователя
    const userTransactions = transactions.filter(t => t.userId === currentUser.username);
    
    if (userTransactions.length === 0) {
        transactionList.innerHTML = '<div class="transaction-item">История операций пуста</div>';
        return;
    }
    
    userTransactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        
        const amountClass = transaction.amount > 0 ? 'positive' : transaction.amount < 0 ? 'negative' : '';
        
        transactionElement.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-type">${transaction.description}</div>
                <div class="transaction-details">${transaction.details}</div>
                <div class="transaction-date">${transaction.date}</div>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${transaction.amount > 0 ? '+' : ''}${transaction.amount} ₽
            </div>
        `;
        
        transactionList.appendChild(transactionElement);
    });
}

// Вспомогательные функции
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {
        console.error('Error getting current user:', e);
        return null;
    }
}

function saveUserData(userData) {
    try {
        // Обновляем текущего пользователя
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Обновляем в списке пользователей
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.username === userData.username);
        if (userIndex !== -1) {
            users[userIndex] = userData;
            localStorage.setItem('users', JSON.stringify(users));
        }
    } catch (e) {
        console.error('Error saving user data:', e);
    }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    console.log('Wallet-chat initialized');
    
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function(event) {
        const chatModal = document.getElementById('chatModal');
        const walletModal = document.getElementById('walletModal');
        
        if (event.target === chatModal) {
            closeChat();
        }
        if (event.target === walletModal) {
            closeWallet();
        }
    });
    
    // Enter для отправки сообщения в чате
    const chatInput = document.getElementById('globalChatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendGlobalMessage();
            }
        });
    }
    
    // Обновляем навигацию
    updateNavigation();
});

// Добавляем кнопки в навигацию для авторизованных пользователей
function updateNavigation() {
    const currentUser = getCurrentUser();
    const navLinks = document.querySelector('.nav-links');
    
    if (currentUser && navLinks && !document.querySelector('.chat-btn')) {
        // Создаем кнопку чата
        const chatBtn = document.createElement('button');
        chatBtn.className = 'nav-link chat-btn';
        chatBtn.innerHTML = '💬 Чат';
        chatBtn.onclick = openChat;
        
        // Создаем кнопку кошелька
        const walletBtn = document.createElement('button');
        walletBtn.className = 'nav-link wallet-btn';
        walletBtn.innerHTML = '💰 Кошелек';
        walletBtn.onclick = openWallet;
        
        // Находим кнопку выхода
        const logoutBtn = document.querySelector('#logoutBtn');
        if (logoutBtn) {
            // Вставляем перед кнопкой выхода
            navLinks.insertBefore(chatBtn, logoutBtn);
            navLinks.insertBefore(walletBtn, logoutBtn);
        } else {
            // Если кнопки выхода нет, добавляем в конец
            navLinks.appendChild(chatBtn);
            navLinks.appendChild(walletBtn);
        }
        
        console.log('Navigation updated with chat and wallet buttons');
    }
}