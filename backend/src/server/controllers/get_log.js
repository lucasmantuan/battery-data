const { StatusCodes } = require('http-status-codes');
const BatteryProvider = require('../repository');

async function getLog(request, response) {
    const result = await BatteryProvider.getLog(
        request.params.date || new Date().toISOString().slice(0, 10)
    );

    if (result instanceof Error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: result.message }
        });
    }

    return response.status(StatusCodes.OK).json(result);
}

module.exports = { getLog };
