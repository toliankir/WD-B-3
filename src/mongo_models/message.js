const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    data: String
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Message', messageSchema);
