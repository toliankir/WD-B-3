const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const appRootDir = require('../helpers/app_root_dir');

module.exports = (app) => {
    app.use('/', express.static(path.join(appRootDir, 'public')));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
}
