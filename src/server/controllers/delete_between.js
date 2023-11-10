const { StatusCodes } = require('http-status-codes');
const BatteryProvider = require('../repository');

async function deleteBetween(request, response) {
    const result = await BatteryProvider.deleteBetween(request.body.date || {});

    if (result instanceof Error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: result.message }
        });
    }

    return response.status(StatusCodes.OK).json(result);
}

module.exports = { deleteBetween };
