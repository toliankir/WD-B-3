require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const routes = require('./routes/web');
const { mongoConnect } =require('./services/mongo');
const HTTP_PORT = process.env.HTTP_SERVER_PORT || 3000;

// mongoConnect();

//express middlewares 
// require('./middleware/express')(app);
//express routes
// app.use(routes);
//Socket.io middlewares
// require('./middleware/io')(io);

require('./services/io')(io);

server.listen(HTTP_PORT, err => {
    if (err) throw err;
    console.log(`Server start on port ${HTTP_PORT}`);
});
