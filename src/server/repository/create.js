const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { parseToObject } = require('../../utils/utils');

async function create(profile, database) {
    const script = `node src/normalizer/index -${profile} -${database}`;

    try {
        const { stdout, stderr } = await exec(script);
        console.log(stderr);
        return parseToObject(stdout);
    } catch (error) {
        return new Error(error.message);
    }
}

module.exports = { create };
