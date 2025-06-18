let socket;

function connect(channel) {
    socket = new WebSocket(`ws://${location.host}/ws/${channel}`);
    socket.onmessage = (event) => {
        document.getElementById('messages').innerText = event.data;
    };
}

function sendMessage() {
    const msg = document.getElementById('message').value;
    socket.send(msg);
    document.getElementById('message').value = '';
}

function createChannel() {
    const newChannel = document.getElementById('new-channel').value;
    if (!newChannel) return;
    fetch(`/channels/${newChannel}`, {method: 'POST'})
        .then(loadChannels);
}

function loadChannels() {
    fetch('/channels')
        .then(resp => resp.json())
        .then(data => {
            const select = document.getElementById('channel');
            select.innerHTML = '';
            data.channels.forEach(ch => {
                const opt = document.createElement('option');
                opt.value = ch;
                opt.textContent = ch;
                select.appendChild(opt);
            });
            connect(select.value);
        });
}

document.addEventListener('DOMContentLoaded', loadChannels);

document.getElementById('channel').addEventListener('change', (e) => {
    connect(e.target.value);
});
