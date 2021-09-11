const express = require('express');
const path = require('path');
const config = require('../config');
const cors = require('cors');
const logger = require('morgan')
global.fetch = require("node-fetch");
const errorHandler = require('../_helpers/error-handler');

const app = express();

//parsing body from api
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger('dev'))

//get dist folder
const distDir = path.join(__dirname, '../../dist');

//use dist folder as hosting folder by express
app.use(express.static(distDir));

//allow cors
app.use(cors());

app.use('/api/v1/user', require("../routes/index"))

// global error handler
app.use(errorHandler);

module.exports = app;