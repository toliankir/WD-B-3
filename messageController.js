const mongoose = require('mongoose');

const Message = require('./messageModel');

module.exports.saveMessage = async function (ownerId, data) {
    const newMessage = new Message({
        _id: new mongoose.Types.ObjectId,
        owner: ownerId,
        data: data
    });
    return await newMessage.save();
};


module.exports.getHistory = async function getHistory() {
    return new Promise((resolve, reject) => {
        Message
            .find({})
            .select('data createdAt -_id')
            .populate('owner', 'login -_id')
            .exec((err, data) => {
                if (err) reject(err);
                resolve(data);
            });
    });
};