const nerdamer = require('nerdamer');
const path = require('path');
const regression = require('regression');
require('nerdamer/Calculus');

function parseToObject(data) {
    return JSON.parse(data);
}

function getFileName(data) {
    return data.map((file_name) => path.basename(file_name));
}

function calculateIntegral(data_points, order_degree, lower_limit, upper_limit) {
    // @ts-ignore
    const regression_result = regression.polynomial(data_points, { order: order_degree });
    const expression_regression = regression_result.string.slice(4);
    const integral_result = nerdamer(`defint(${expression_regression}, ${lower_limit}, ${upper_limit})`).text();

    return integral_result;
}

module.exports = { parseToObject, getFileName, calculateIntegral };
