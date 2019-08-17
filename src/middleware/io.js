const jwt = require('jsonwebtoken');

module.exports = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) socket.disconnect();
        });
        next();
    });
}