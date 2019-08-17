const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        login: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('User', userSchema);
