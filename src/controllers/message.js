const mongoose = require('mongoose');

const Message = require('../mongo_models/message');

module.exports.saveMessage = async (ownerId, data) => {
    const newMessage = new Message({
        _id: new mongoose.Types.ObjectId,
        owner: ownerId,
        data
    });
    return await newMessage.save();
};

module.exports.getHistory = async () => {
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
