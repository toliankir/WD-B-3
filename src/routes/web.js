const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userLogin = require('../controllers/user');

router.post('/', async ({ body: { login, password } }, res) => {
    if (!login || !password) {
        res.send({ status: 'error: wrong request' });
        return;
    }

    let userId;
    if (!(userId = await userLogin({login, password}))) {
        res.send({ status: 'error' });
        return;
    }
    const token = jwt.sign({
        login: login,
        _id: userId
    }, process.env.JWT_SECRET);
    res.send({ token: token });
});

module.exports = router;
