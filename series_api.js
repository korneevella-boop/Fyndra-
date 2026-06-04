// Chipp AI Configuration for TV Series Bot
    const API_KEY = "chipp_3d334j733n4y714m376q275r2x523q4o";
    const WEBHOOK_URL = "https://dino-mullet.chipp.ai/api/webhooks/inbound/2fcafbec-4fc8-422e-becf-10929a7184c9";
    
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
        loadingDiv.innerText = 'AI is looking for shows...';
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