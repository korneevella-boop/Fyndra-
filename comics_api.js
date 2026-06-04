// Chipp AI Configuration for Comics Bot
    const API_KEY = "chipp_6c2w624u4y5y331v1c490p0v615a3n3g";
    const WEBHOOK_URL = "https://dino-mullet.chipp.ai/api/webhooks/inbound/f2565325-6782-4516-93aa-fd8db6d2d565";
    
    // Tracks unique conversation states so the bot remembers answers across questions
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
        loadingDiv.innerText = 'AI is thinking...';
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