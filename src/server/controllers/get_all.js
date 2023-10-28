const { StatusCodes } = require('http-status-codes');
const BatteryProvider = require('../repository');

async function getAll(request, response) {
    const result = await BatteryProvider.getAll(
        request.body.page || 1,
        request.body.limit || 100,
        request.body.profile || '',
        request.body.date || {}
    );

    const total_count = await BatteryProvider.totalCount(request.body.profile || '');

    if (result instanceof Error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: result.message }
        });
    } else if (total_count instanceof Error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: total_count.message }
        });
    }

    response.set('Access-Control-Expose-Headers', 'x-total-count');
    response.set('x-total-count', total_count);

    return response.status(StatusCodes.OK).json(result);
}

module.exports = { getAll };
