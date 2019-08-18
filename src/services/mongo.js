require('dotenv').config();
const mongoose = require('mongoose');

module.exports.mongoConnect = () => {
    mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true }, function (err) {
        if (err) {
            console.log(`Connection error to database: ${process.env.MONGO_DB_URL}`);
            throw err;
        }
        console.log(`Mongoose DB successfully connected: ${process.env.MONGO_DB_URL}`);
    });

}