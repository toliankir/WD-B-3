const loginSection = document.querySelector('#loginContainer');
const loadingSection = document.querySelector('#loadingContainer');
const chatSection = document.querySelector('#chatContainer');
const chatData = document.querySelector('#chatData');
const chatDataList = document.querySelector('#chatDataList');
const chatLogout = document.querySelector('#chatLogout');
const sendContainer = document.querySelector('#sendContainer');
const sendForm = document.querySelector('#sendForm');
const message = document.querySelector('#message');


const loginForm = document.querySelector('#loginForm');
const userName = document.querySelector('#userName');
const userPassword = document.querySelector('#userPassword');

let socket = null;
let token = window.localStorage.getItem('token') ?
    { token: window.localStorage.getItem('token') }
    : null;

function showChat(state) {
    chatSection.style.display = state;
    chatLogout.style.display = state;
    sendContainer.style.display = state;
}

function login(login, password) {
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: login,
            password: password
        }),
    })
        .then(resp => resp.json())
        .then(resp => {
            token = resp;
            socketConnect();
        });
}

document.addEventListener('DOMContentLoaded', function (event) {
    socketConnect();
    loginForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        if (!userName.value || !userPassword.value) {
            console.log('%cName and password mast be entered', 'color:orange')
        }
        login(userName.value, userPassword.value);
    });

    chatLogout.addEventListener('click', () => {
        if (!socket) {
            return;
        }
        socket.close();
        window.localStorage.removeItem('token');
    });

    sendForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        if (!message.value.trim()) {
            console.log('%cMessage is empty', 'color:red');
            return;
        }
        socket.emit('messageRequest', message.value);
        message.value = '';
    });

});

function messageAdd(message) {
    const messageElement = document.createElement('li');
    messageElement.innerHTML = `<span class='chat-bold'>${message.owner.login}: </span>${
        message.data
            .replace(/:\)/g, '<img alt="smile" class="image-smile" src="img/smile1.png">')
            .replace(/:\(/g, '<img alt="smile" class="image-smile" src="img/smile2.png">')}`;
    chatDataList.appendChild(messageElement);
    chatData.scrollTop = chatDataList.offsetHeight + (2 * parseInt(getComputedStyle(chatData).padding)) - chatData.offsetHeight;
}

function socketConnect() {
    loadingSection.style.display = 'none';
    if (!token || !token.token) {
        return;
    }
    socket = io.connect({
        query: token
    });


    socket.on('connect', () => {
        window.localStorage.setItem('token', token.token);
    
        loginSection.style.display = 'none';
        showChat('block');
        console.info('%cUser is authorized', 'color:green');
        socket.emit('historyRequest');
    });

    socket.on('disconnect', () => {
        showChat('none');
        loadingSection.style.display = 'none';
        loginSection.style.display = 'block';
        console.log('%cUser is unauthorized', 'color:red');
    });

    socket.on('historyResponse', (response) => {
        chatDataList.innerHTML = '';
        response.forEach(message => messageAdd(message));
    });

    socket.on('messageResponse', (response) => {
        messageAdd(response);
    });
}
