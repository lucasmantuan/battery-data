const app = require('./app');
const home = require('./home');

const cors = require('cors');
const express = require('express');
const http = require('http');
const https = require('https');

const server = express();

// @ts-ignore
http.globalAgent.keepAlive = true;
// @ts-ignore
https.globalAgent.keepAlive = true;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/', home.index);
server.get('/favicon.ico', home.favicon);

server.use(app.notFound);
server.use(app.handleError);

module.exports = server;
