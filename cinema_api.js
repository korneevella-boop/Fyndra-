// Chipp AI Configuration for Cinema Bot
    const API_KEY = "chipp_6e3m683n1k093v2k6d0l3y0r4p2y581t";
    const WEBHOOK_URL = "https://dino-mullet.chipp.ai/api/webhooks/inbound/eca9e765-e7a0-495c-9212-3212f0bd6c6c";
    
    // Tracks unique conversation states so the bot remembers context across questions
    let currentSessionId = "session_" + Math.random().toString(36).substring(2, 11);

    function appendMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerText = text;
        messagesContainer.appendChild(messageDiv);
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendMessage() {
        const inputElement = document.getElementById('userInput');
        const userText = inputElement.value.trim();
        
        if (!userText) return;

        appendMessage(userText, 'user');
        inputElement.value = '';

        const messagesContainer = document.getElementById('chatMessages');
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot', 'loading');
        loadingDiv.innerText = 'AI is searching the archives...';
        loadingDiv.id = 'loadingMessage';
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    message: userText,
                    sessionId: currentSessionId
                })
            });

            document.getElementById('loadingMessage').remove();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            const botReply = data.response || data.text || data.reply || "I've processed your response. What's next?";
            appendMessage(botReply, 'bot');

        } catch (error) {
            console.error('API Error Details:', error);
            document.getElementById('loadingMessage').remove();
            appendMessage('Sorry, a connection error occurred. Please try again.', 'bot');
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }