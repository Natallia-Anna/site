// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // Load chat messages
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        if (chatMessages) {
            chatMessages.innerHTML = messages.map(msg => `
                <div class="message">
                    <span class="message-sender">${msg.sender}:</span>
                    <span class="message-text">${msg.text}</span>
                    <small class="message-time">${msg.time}</small>
                </div>
            `).join('');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Send message
    function sendMessage() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const messageText = messageInput.value.trim();

        if (!messageText || !currentUser) return;

        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        const newMessage = {
            sender: currentUser.username,
            text: messageText,
            time: new Date().toLocaleTimeString()
        };

        messages.push(newMessage);
        
        // Keep only last 50 messages
        if (messages.length > 50) {
            messages.splice(0, messages.length - 50);
        }

        localStorage.setItem('chatMessages', JSON.stringify(messages));
        messageInput.value = '';
        loadMessages();
    }

    // Event listeners
    if (sendButton && messageInput) {
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Auto-refresh messages every 5 seconds
    setInterval(loadMessages, 5000);
    loadMessages();
});