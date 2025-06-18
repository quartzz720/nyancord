// Состояние приложения
const appState = {
    socket: null,
    currentUser: null,
    currentChannel: 1,
    isConnected: false
};

// DOM элементы
const ui = {
    messageInput: document.querySelector('.message-input'),
    messagesContainer: document.querySelector('.messages-container'),
    chatItems: document.querySelectorAll('.chat-item'),
    loginForm: document.getElementById('loginForm'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    connectionStatus: document.getElementById('connection-status'),
    emojiPicker: document.getElementById('emojiPicker'),
    filePicker: document.getElementById('filePicker'),
    callElements: {
        startBtn: document.getElementById('startCallBtn'),
        endBtn: document.getElementById('endCallBtn'),
        minimizedEndBtn: document.getElementById('endCallMinimized'),
        callContainer: document.getElementById('callInChat'),
        minimizedContainer: document.getElementById('callMinimized')
    }
};

// Инициализация приложения
function init() {
    setupEventListeners();
    checkAuthStatus();
}

// Проверка аутентификации
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
        initializeChat();
    } else {
        showLoginForm();
    }
}

// Показать форму входа
function showLoginForm() {
    if (!ui.loginForm) {
        const form = document.createElement('div');
        form.id = 'loginForm';
        form.innerHTML = `
            <div class="login-container">
                <h3>Login to Ellipse</h3>
                <input type="email" id="email" placeholder="Email" value="test@example.com">
                <input type="password" id="password" placeholder="Password" value="password123">
                <button id="loginBtn">Login</button>
                <div id="loginError" class="error-message"></div>
            </div>
        `;
        document.body.appendChild(form);
        
        document.getElementById('loginBtn').addEventListener('click', handleLogin);
    }
    ui.loginForm.style.display = 'block';
}

// Скрыть форму входа
function hideLoginForm() {
    if (ui.loginForm) {
        ui.loginForm.style.display = 'none';
    }
}

// Обработчик входа
async function handleLogin() {
    const email = ui.emailInput.value;
    const password = ui.passwordInput.value;
    const errorElement = document.getElementById('loginError');

    try {
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        hideLoginForm();
        initializeChat();
    } catch (error) {
        errorElement.textContent = error.message;
        console.error('Login error:', error);
    }
}

// Инициализация чата
function initializeChat() {
    connectWebSocket(appState.currentChannel);
    setupChatUI();
    updateUI();
}

// WebSocket соединение
function connectWebSocket(channelId) {
    if (appState.socket) {
        appState.socket.close();
    }

    const wsUrl = `ws://localhost:8080/ws`;
    appState.socket = new WebSocket(wsUrl);

    appState.socket.onopen = () => {
        console.log('WebSocket connected');
        appState.isConnected = true;
        updateConnectionStatus(true);
    };

    appState.socket.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            handleSocketMessage(message);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    appState.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        appState.isConnected = false;
        updateConnectionStatus(false);
    };

    appState.socket.onclose = () => {
        console.log('WebSocket disconnected');
        appState.isConnected = false;
        updateConnectionStatus(false);
        setTimeout(() => connectWebSocket(channelId), 5000);
    };
}


// Отрисовка сообщений
function renderMessages(messages) {
    ui.messagesContainer.innerHTML = '';
    messages.forEach(message => {
        addMessageToUI(message);
    });
    scrollToBottom();
}

// Добавление сообщения в UI
function addMessageToUI(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    messageElement.innerHTML = `
        <div class="message-avatar">${message.user.username.charAt(0).toUpperCase()}</div>
        <div class="message-content">
            <div class="message-header">
                <div class="message-sender">${message.user.username}</div>
                <div class="message-time">${formatTime(message.created_at)}</div>
            </div>
            <div class="message-text">${message.content}</div>
        </div>
    `;
    
    ui.messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

// Отправка сообщения
function sendMessage() {
    const content = ui.messageInput.value.trim();
    if (!content || !appState.socket || !appState.isConnected) return;

    const message = {
        type: 'chat',
        data: {
            content,
            channel_id: appState.currentChannel
        }
    };

    appState.socket.send(JSON.stringify(message));
    ui.messageInput.value = '';
    resetTextareaHeight();
}

// Обработчик сообщений WebSocket
function handleSocketMessage(message) {
    switch (message.type) {
        case 'chat':
            addMessageToUI(message.data);
            break;
        case 'typing':
            showTypingIndicator(message.data.user_id);
            break;
        default:
            console.log('Unknown message type:', message.type);
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Отправка сообщения
    ui.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Авто-высота textarea
    ui.messageInput.addEventListener('input', adjustTextareaHeight);

    // Выбор чата
    ui.chatItems.forEach(item => {
        item.addEventListener('click', () => {
            ui.chatItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const channelId = item.dataset.channelId || 1;
            switchChannel(parseInt(channelId));
        });
    });

    // Управление звонками
    if (ui.callElements.startBtn) {
        ui.callElements.startBtn.addEventListener('click', toggleCall);
    }
    if (ui.callElements.endBtn) {
        ui.callElements.endBtn.addEventListener('click', toggleCall);
    }
    if (ui.callElements.minimizedEndBtn) {
        ui.callElements.minimizedEndBtn.addEventListener('click', toggleCall);
    }

    // Эмодзи и вложения
    if (ui.emojiPicker) {
        document.addEventListener('click', (e) => {
            if (!ui.emojiPicker.contains(e.target)) {
                ui.emojiPicker.classList.remove('visible');
            }
        });
    }
}

// Переключение канала
function switchChannel(channelId) {
    appState.currentChannel = channelId;
    connectWebSocket(channelId);
}

// Управление звонком
function toggleCall() {
    const isCallActive = ui.callElements.callContainer.classList.toggle('active');
    ui.callElements.minimizedContainer.style.display = isCallActive ? 'flex' : 'none';
}

// Обновление статуса подключения
function updateConnectionStatus(connected) {
    if (!ui.connectionStatus) {
        ui.connectionStatus = document.createElement('div');
        ui.connectionStatus.id = 'connection-status';
        document.body.appendChild(ui.connectionStatus);
    }

    ui.connectionStatus.className = connected ? 'connected' : 'disconnected';
    ui.connectionStatus.textContent = connected ? 'Online' : 'Connecting...';
}

// Настройка UI чата
function setupChatUI() {
    // Инициализация элементов, которые могут отсутствовать при первой загрузке
    if (!ui.connectionStatus) {
        ui.connectionStatus = document.createElement('div');
        ui.connectionStatus.id = 'connection-status';
        document.body.appendChild(ui.connectionStatus);
    }
}

// Обновление UI
function updateUI() {
    // Здесь можно добавить обновление других элементов интерфейса
    updateConnectionStatus(appState.isConnected);
}

// Вспомогательные функции
function adjustTextareaHeight() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

function resetTextareaHeight() {
    ui.messageInput.style.height = 'auto';
}

function scrollToBottom() {
    ui.messagesContainer.scrollTop = ui.messagesContainer.scrollHeight;
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', init);