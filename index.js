require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const userLogin = require("./userController");

const connections = [];
const authUsers = [];


mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true}, function (err) {
    if (err) throw err;
    console.log(`Mongoose DB successfully connected: ${process.env.MONGO_DB_URL}`);
});

server.listen(process.env.HTTP_SERVER_PORT, err => {
    if (err) throw err;
    console.log(`Server start on port ${process.env.HTTP_SERVER_PORT}`);
});

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

io.use((socket, next) => {
    const token = socket.handshake.query.token;
    jwt.verify(token, process.env.CRYPT_SALT_ROUNDS, (err, decoded) => {
        if (err) socket.disconnect();
    });
    next();
});


app.post("/", (req, res) => {
    userPostLogin(req.body, res);
});

socketHandler(io);


async function userPostLogin(user, response) {
    if (!(await userLogin(user))) {
        response.send({status: "error"});
        return;
    }
    const token = jwt.sign(user, process.env.CRYPT_SALT_ROUNDS);
    response.send({token: token});
}

async function socketHandler(io) {
    io.sockets.on("connection", (socket) => {
        // connections.push(socket);
        console.log('User connected');

        socket.on("disconnect", () => {
            connections.splice(connections.indexOf(socket) - 1);
            console.log("User disconnected");
        });

        socket.on("statusRequest", () => {
            socket.emit("statusResponse", {
                userAuth: "test"
            });
        });

        socket.on("loginRequest", async (user) => {
            if (await userLogin(user)) {
                authUsers.push(socket);
                socket.emit("loginResponse", {
                    userStatus: "user login"
                });
            }
        });
    });
}

