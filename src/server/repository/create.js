const _ = require('lodash');
const { parseToObject, stringifyObject } = require('../../utils/utils');
const { spawn } = require('child_process');
require('dotenv').config();

function create(profile, database, files) {
    const script = process.env.PATH_SCRIPT;
    const list = stringifyObject(_.map(files, (file) => [file.path]));
    const normalizer = spawn('node', [script, profile, database, list]);
    let result = [];

    normalizer.stdout.on('data', (data) => {
        result.push(parseToObject(data.toString()));
    });

    // normalizer.stderr.on('data', (data) => {
    //     result = parseToObject(data.toString());
    // });

    return new Promise((resolve, reject) => {
        normalizer.on('close', (code) => {
            if (code === 0) {
                resolve(result);
            } else {
                reject(new Error('o processo foi encerrado com erro'));
            }
        });
    });
}

module.exports = { create };
