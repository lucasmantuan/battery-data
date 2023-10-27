const cors = require('cors');
const express = require('express');
const router = require('../routes/routes');
const server = express();

// const https = require('https');
// http.globalAgent.keepAlive = true;
// https.globalAgent.keepAlive = true;

server.use(cors());
server.use(express.json());
server.use(router);

// server.use(express.urlencoded({ extended: true }));
// server.get('/favicon.ico', home.favicon);

module.exports = server;
