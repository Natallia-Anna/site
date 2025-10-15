// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!username || !password) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            // Check if user exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // Store current user session
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('Успешный вход!');
                window.location.href = 'games.html';
            } else {
                alert('Неверное имя пользователя или пароль');
            }
        });
    }

    // Registration form handler
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (!username || !email || !password || !confirmPassword) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Пароли не совпадают');
                return;
            }
            
            if (password.length < 6) {
                alert('Пароль должен содержать минимум 6 символов');
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.username === username)) {
                alert('Пользователь с таким именем уже существует');
                return;
            }
            
            if (users.find(u => u.email === email)) {
                alert('Пользователь с таким email уже существует');
                return;
            }
            
            // Create new user
            const newUser = {
                username,
                email,
                password,
                balance: 0,
                subscription: 'free',
                registrationDate: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto-login after registration
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            alert('Регистрация успешна!');
            window.location.href = 'games.html';
        });
    }
});