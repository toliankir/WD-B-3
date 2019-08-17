require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const jwt = require('jsonwebtoken');

const message = require('./controllers/message');
const routes = require('./routes/web');
const { mongoConnect } =require('./services/mongo');
const HTTP_PORT = process.env.HTTP_SERVER_PORT || 3000;

mongoConnect();

//express middlewares 
require('./middleware/express')(app);
//express routes
app.use(routes);
//Socket.io middlewares
require('./middleware/io')(io);



socketHandler(io);

function socketHandler(io) {
    io.sockets.on('connection', (socket) => {
        console.log('User connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('statusRequest', () => {
            socket.emit('statusResponse', {
                userAuth: true
            });
        });

        socket.on('historyRequest', async () => {
            socket.emit('historyResponse', await message.getHistory());
        });

        socket.on('messageRequest', (data) => {
            const token = socket.handshake.query.token;
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                const savedMessage = await message.saveMessage(decoded._id, data);
                socket.emit('messageResponse', {
                    data: savedMessage.data,
                    createdAt: savedMessage.createdAt,
                    owner: {
                        login: decoded.login
                    }
                });
            });
        });
    });
}

server.listen(HTTP_PORT, err => {
    if (err) throw err;
    console.log(`Server start on port ${HTTP_PORT}`);
});
