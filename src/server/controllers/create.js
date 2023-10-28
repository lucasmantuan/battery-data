const BatteryProvider = require('../repository');
const multer = require('multer');
const { StatusCodes } = require('http-status-codes');

const storage = multer.diskStorage({
    destination: function (request, response, callback) {
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
        request.body.database || '',
        request.files || []
    );

    return response.status(StatusCodes.OK).json(result);
}

module.exports = { upload, create };
