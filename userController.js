require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('./userModel');

async function hashedPassword(password) {
    return await new Promise((resolve, reject) => {
        bcrypt.hash(password, parseInt(process.env.CRYPT_SALT_ROUNDS), (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
}

async function createUser(user) {
    return new Promise(async (resolve, reject) => {
        User.create({
            _id: new mongoose.Types.ObjectId,
            login: user.login,
            password: await hashedPassword(user.password)
        }, (err) => {
            if (err) reject(err);
            console.log(`User '${user.login}' created`);
            resolve();
        });
    });
}

function userExist(login) {
    return new Promise((resolve, reject) => {
        User.find({login: login}, (err, users) => {
            if (err) reject(err);
            resolve(users.length > 0);
        });
    })
}

async function checkUser(user) {
    const userHashed = await User.findOne({login: user.login});
    return await bcrypt.compare(user.password, userHashed.password) ? userHashed._id : false;
}

module.exports = async function userLogin(user) {
    if (!(await userExist(user.login))) {
        console.log(`User ${user.login} don't exist`);
        await createUser(user);
    }
    let userId;
    if (!(userId = await checkUser(user))) {
        console.log(`User ${user.login} wrong password '${user.password}'`);
        return false;
    }
    console.log(`User ${user.login} login`);
    return userId;
};
