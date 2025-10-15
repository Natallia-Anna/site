// Main application JavaScript
console.log('GameHub application loaded');

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && !window.location.pathname.includes('index.html') && 
        !window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
    
    // Display current user if logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        console.log('User logged in:', user.username);
    }
});