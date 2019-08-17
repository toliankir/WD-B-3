require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('../mongo_models/user');

function hashedPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, parseInt(process.env.CRYPT_SALT_ROUNDS), (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
}

function createUser(login, password) {
    return new Promise(async (resolve, reject) => {
        User.create({
            _id: new mongoose.Types.ObjectId,
            login,
            password: await hashedPassword(password)
        }, (err) => {
            if (err) reject(err);
            console.log(`User '${login}' created`);
            resolve();
        });
    });
}

function userExist(login) {
    return new Promise((resolve, reject) => {
        User.find({ login: login }, (err, users) => {
            if (err) reject(err);
            resolve(users.length > 0);
        });
    })
}

async function checkUser(login, password) {
    const userHashed = await User.findOne({ login });
    return await bcrypt.compare(password, userHashed.password) ? userHashed._id : false;
}

module.exports.userLogin = async ({ login, password }) => {
    if (!(await userExist(login))) {
        console.log(`User ${login} don't exist`);
        await createUser(login, password);
    }
    let userId;
    if (!(userId = await checkUser(login, password))) {
        console.log(`User ${login} wrong password '${password}'`);
        return false;
    }
    console.log(`User ${login} login`);
    return userId;
};
