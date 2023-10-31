const fs = require('fs');
const BatteryProvider = require('../repository');
const multer = require('multer');
const { StatusCodes } = require('http-status-codes');

const storage = multer.diskStorage({
    destination: function (request, response, callback) {
        if (!fs.existsSync('src/temp')) fs.mkdirSync('src/temp');
        callback(null, 'src/temp');
    },
    filename: function (request, response, callback) {
        callback(null, response.originalname);
    }
});

const upload = multer({ storage: storage });

async function create(request, response) {
    const result = await BatteryProvider.create(
        request.body.profile || '',
        request.body.database || ''
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
