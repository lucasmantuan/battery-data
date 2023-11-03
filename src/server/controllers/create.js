const fs = require('fs');
const multer = require('multer');
const { StatusCodes } = require('http-status-codes');
const BatteryProvider = require('../repository');
require('dotenv').config();

// const { createHash, randomBytes } = require('node:crypto');

// function generateFolderName() {
//     const random_bytes = randomBytes(32);
//     const hash = createHash('sha256');
//     hash.update(random_bytes);
//     return hash.digest('hex');
// }

// let folder = generateFolderName();

const storage = multer.diskStorage({
    destination: function (request, response, callback) {
        if (!fs.existsSync(process.env.PATH_TEMP)) fs.mkdirSync(process.env.PATH_TEMP);
        callback(null, process.env.PATH_TEMP);
    },
    filename: function (request, response, callback) {
        callback(null, response.originalname);
    }
});

const upload = multer({ storage });

async function create(request, response) {
    const result = await BatteryProvider.create(
        request.body.profile || '',
        request.body.database || '',
        request.files || []
    );

    if (result instanceof Error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return response.status(StatusCodes.OK).json(result);
}

module.exports = { upload, create };
