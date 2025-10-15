// Wallet functionality
document.addEventListener('DOMContentLoaded', function() {
    const balanceElement = document.getElementById('balance');
    const addBalanceBtn = document.getElementById('addBalanceBtn');
    const subscriptionPlans = document.getElementById('subscriptionPlans');

    // Update balance display
    function updateBalance() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && balanceElement) {
            balanceElement.textContent = `${currentUser.balance} ₽`;
        }
    }

    // Add balance
    if (addBalanceBtn) {
        addBalanceBtn.addEventListener('click', function() {
            const amount = parseFloat(prompt('Введите сумму для пополнения:'));
            if (amount && amount > 0) {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                
                const userIndex = users.findIndex(u => u.username === currentUser.username);
                if (userIndex !== -1) {
                    users[userIndex].balance += amount;
                    currentUser.balance += amount;
                    
                    localStorage.setItem('users', JSON.stringify(users));
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    updateBalance();
                    alert(`Баланс пополнен на ${amount} ₽`);
                }
            }
        });
    }

    // Subscription plans
    const plans = [
        {
            name: "Базовый",
            price: 0,
            features: ["Бесплатные игры", "Базовый чат"],
            featured: false
        },
        {
            name: "Премиум",
            price: 299,
            features: ["Все бесплатные игры", "Расширенный чат", "Приоритетная поддержка"],
            featured: true
        },
        {
            name: "Про",
            price: 599,
            features: ["Все игры", "Эксклюзивный контент", "Персональная поддержка", "Ранний доступ"],
            featured: false
        }
    ];

    // Display subscription plans
    if (subscriptionPlans) {
        subscriptionPlans.innerHTML = plans.map(plan => `
            <div class="plan-card ${plan.featured ? 'featured' : ''}">
                <h3>${plan.name}</h3>
                <div class="plan-price">${plan.price === 0 ? 'Бесплатно' : plan.price + ' ₽/мес'}</div>
                <ul>
                    ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <button class="btn ${plan.price === 0 ? 'btn-secondary' : 'btn-primary'}" 
                        onclick="subscribeToPlan('${plan.name}', ${plan.price})">
                    ${plan.price === 0 ? 'Текущий' : 'Выбрать'}
                </button>
            </div>
        `).join('');
    }

    updateBalance();
});

function subscribeToPlan(planName, price) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (price === 0) {
        alert('У вас уже активирован базовый тариф');
        return;
    }

    if (currentUser.balance < price) {
        alert('Недостаточно средств на балансе');
        return;
    }

    if (confirm(`Вы уверены, что хотите приобрести подписку "${planName}" за ${price} ₽?`)) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        
        if (userIndex !== -1) {
            users[userIndex].balance -= price;
            users[userIndex].subscription = planName.toLowerCase();
            
            currentUser.balance -= price;
            currentUser.subscription = planName.toLowerCase();
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            alert(`Подписка "${planName}" успешно активирована!`);
            window.location.reload();
        }
    }
}