const loginSection = document.querySelector("#loginContainer");
const loadingSection = document.querySelector("#loadingContainer");
const chatSection = document.querySelector("#chatContainer");
const chatLogout = document.querySelector("#chatLogout");
const sendContainer = document.querySelector("#sendContainer ");
const sendForm = document.querySelector("#sendForm");
const message = document.querySelector("#message");


const loginForm = document.querySelector("#loginForm");
const userName = document.querySelector("#userName");
const userPassword = document.querySelector("#userPassword");

let socket = null;
let token = window.localStorage.getItem("token") ?
    {token: window.localStorage.getItem("token")}
    : null;

function showChat(state) {
    chatSection.style.display = state;
    chatLogout.style.display = state;
    sendContainer.style.display = state;
}

function login(login, password) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
            token = JSON.parse(xhr.responseText);
            socketConnect();
        }
    };

    xhr.open("POST", "/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        login: login,
        password: password
    }));
}

document.addEventListener("DOMContentLoaded", function (event) {
    socketConnect();
    loginForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        if (!userName.value || !userPassword.value) {
            console.log("%cName and password mast be entered", "color:orange")
        }
        login(userName.value, userPassword.value);
    });

    chatLogout.addEventListener("click", () => {
        if (!socket) {
            return;
        }
        socket.close();
        window.localStorage.removeItem("token");
    });

    sendForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        if (!message.value.trim()) {
            console.log("%cMessage is empty", "color:red");
            return;
        }
        socket.emit("messageRequest", "test");
    });

});


function socketConnect() {
    if (!token.token) {
        return;
    }
    socket = io.connect({
        query: token
    });

    socket.on("connect", () => {
        window.localStorage.setItem("token", token.token);
        loadingSection.style.display = "none";
        loginSection.style.display = "none";
        showChat("block");
        console.info("%cUser is authorized", "color:green");
    });

    socket.on("disconnect", () => {
        showChat("none");
        loadingSection.style.display = "none";
        loginSection.style.display = "block";
        console.log("%cUser is unauthorized", "color:red");
    });
}