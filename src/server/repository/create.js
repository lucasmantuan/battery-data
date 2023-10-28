const { exec } = require('child_process');

const script = 'node src/normalizer/index.js -arbin -mysql';

async function create(profile, database, files) {
    exec(script, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(stdout);
    });
}

module.exports = { create };
