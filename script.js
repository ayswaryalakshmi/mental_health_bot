document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const typingIndicator = document.getElementById('typing-indicator');
    const quickBtns = document.querySelectorAll('.quick-btn');
    const crisisModal = document.getElementById('crisis-modal');
    const closeModal = document.querySelector('.close');

    // Crisis keywords that might trigger the modal
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'harm myself', 'no point living'];

    // Initialize the app
    init();

    function init() {
        // Focus on input
        userInput.focus();

        // Event listeners
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', handleKeyPress);
        userInput.addEventListener('input', handleInputChange);
        
        // Quick action buttons
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                userInput.value = message;
                sendMessage();
            });
        });

        // Modal events
        closeModal.addEventListener('click', () => {
            crisisModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === crisisModal) {
                crisisModal.style.display = 'none';
            }
        });
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    function handleInputChange() {
        // Enable/disable send button based on input
        const hasText = userInput.value.trim().length > 0;
        sendBtn.disabled = !hasText;
        
        // Auto-resize textarea effect (for future enhancement)
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Check for crisis keywords
        if (containsCrisisKeywords(message)) {
            showCrisisModal();
        }

        // Disable input and show user message
        setInputState(false);
        appendMessage(message, 'user-message');
        userInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        try {
            // Send request to backend
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Hide typing indicator and show bot response
            hideTypingIndicator();
            
            if (data.reply) {
                appendMessage(data.reply, 'bot-message');
            } else if (data.error) {
                appendMessage(`I apologize, but I encountered an issue: ${data.error}. Please try again.`, 'bot-message');
            } else {
                throw new Error('Unexpected response format');
            }

        } catch (error) {
            console.error('Error:', error);
            hideTypingIndicator();
            
            // Fallback empathetic response
            const fallbackMessage = "I'm experiencing some technical difficulties right now, but I want you to know that I'm here for you. Your feelings and concerns are important. If you need immediate support, please consider reaching out to a mental health professional or crisis helpline.";
            appendMessage(fallbackMessage, 'bot-message');
        } finally {
            // Re-enable input
            setInputState(true);
            userInput.focus();
        }
    }

    function appendMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.innerHTML = formatMessage(text);
        
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('message-time');
        timeDiv.textContent = getCurrentTime();
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        
        // Insert before typing indicator or at the end
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator && typingIndicator.style.display !== 'none') {
            chatBox.insertBefore(messageDiv, typingIndicator);
        } else {
            chatBox.appendChild(messageDiv);
        }
        
        // Smooth scroll to bottom
        setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);
    }

    function formatMessage(text) {
        // Simple formatting for better readability
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/\n/g, '<br>') // Line breaks
            .replace(/(\d+\.\s)/g, '<br>$1'); // Numbered lists
    }

    function showTypingIndicator() {
        typingIndicator.style.display = 'block';
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    function setInputState(enabled) {
        userInput.disabled = !enabled;
        sendBtn.disabled = !enabled;
        
        if (enabled) {
            userInput.placeholder = "Share what's on your mind...";
        } else {
            userInput.placeholder = "Thinking...";
        }
    }

    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        const minuteStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hour12}:${minuteStr} ${ampm}`;
    }

    function containsCrisisKeywords(message) {
        const lowerMessage = message.toLowerCase();
        return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
    }

    function showCrisisModal() {
        crisisModal.style.display = 'flex';
    }

    // Accessibility improvements
    userInput.setAttribute('aria-label', 'Type your message here');
    sendBtn.setAttribute('aria-label', 'Send message');
    
    // Handle connection status
    let isOnline = navigator.onLine;
    const statusDot = document.querySelector('.status-dot');
    const statusText = statusDot.nextElementSibling;

    function updateConnectionStatus() {
        if (navigator.onLine) {
            statusDot.style.background = '#4ade80';
            statusText.textContent = 'Online';
            isOnline = true;
        } else {
            statusDot.style.background = '#ef4444';
            statusText.textContent = 'Offline';
            isOnline = false;
        }
    }

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    
    // Initial status check
    updateConnectionStatus();

    // Prevent form submission on enter in input
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
        }
    });

    // Auto-focus on input when page loads
    setTimeout(() => {
        userInput.focus();
    }, 500);

    // Add some helpful debugging
    console.log('Mental Health Bot initialized successfully!');
    console.log('Backend endpoint:', '/chat');
});