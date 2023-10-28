const cors = require('cors');
const express = require('express');
const router = require('../routes/routes');
const server = express();

server.use(cors());
server.use(express.json());
server.use(router);

module.exports = server;
