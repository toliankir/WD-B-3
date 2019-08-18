const jwt = require('jsonwebtoken');
const { getHistory, saveMessage } = require('../controllers/message');

module.exports = (io) => {
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
            socket.emit('historyResponse', await getHistory());
        });

        socket.on('messageRequest', (data) => {
            const token = socket.handshake.query.token;
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                const savedMessage = await saveMessage(decoded._id, data);
                io.emit('messageResponse', {
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