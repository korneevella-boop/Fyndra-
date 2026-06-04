// Chipp AI Configuration
    const API_KEY = "chipp_1d3f47395d0s27215b0j6q6f2l0k1u22";
    const WEBHOOK_URL = "https://dino-mullet.chipp.ai/api/webhooks/inbound/c91b8cad-7e42-4b64-974e-6557c1b93ef1";
    
    // Generates a unique session ID so the AI tracks the conversation state
    let currentSessionId = "session_" + Math.random().toString(36).substring(2, 11);

    // Appends a chat bubble to the display
    function appendMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerText = text;
        messagesContainer.appendChild(messageDiv);
        
        // Auto-scroll to the bottom of the chat
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Handles sending the message to the API
    async function sendMessage() {
        const inputElement = document.getElementById('userInput');
        const userText = inputElement.value.trim();
        
        if (!userText) return; // Do nothing if input is empty

        // 1. Display user message and clear input field
        appendMessage(userText, 'user');
        inputElement.value = '';

        // 2. Display a temporary loading indicator
        const messagesContainer = document.getElementById('chatMessages');
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot', 'loading');
        loadingDiv.innerText = 'AI is thinking...';
        loadingDiv.id = 'loadingMessage';
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // 3. POST request to the Chipp Inbound Webhook
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

            // Remove the loading indicator
            document.getElementById('loadingMessage').remove();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // 4. Extract reply from response payload
            const botReply = data.response || data.text || data.reply || "I've processed your response. What's next?";
            appendMessage(botReply, 'bot');

        } catch (error) {
            console.error('API Error Details:', error);
            document.getElementById('loadingMessage').remove();
            appendMessage('Sorry, a connection error occurred. Please try again.', 'bot');
        }
    }

    // Allows hitting 'Enter' to send messages
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }