const _ = require('lodash');
const { global_parameters } = require('../utils/global_parameters.js');
let charge_new_time = 0;
let charge_old_time = 0;
let discharge_new_time = 0;
let discharge_old_time = 0;
let record_start = new Date();

function calculateChargeCapacity(value) {
    if (global_parameters.profile === 'hh') {
        const [capacity] = value;
        if (capacity >= 0) return capacity;
        return null;
    } else if (global_parameters.profile === 'regatron') {
        const [time, current] = value;
        if (!isNaN(time)) {
            charge_new_time = time - charge_old_time;
            charge_old_time = time;
        }
        if (current >= 0) return charge_new_time * current;
        return null;
    }
}

function calculateDischargeCapacity(value) {
    if (global_parameters.profile === 'hh') {
        const [capacity] = value;
        if (capacity < 0) return capacity;
        return null;
    } else if (global_parameters.profile === 'regatron') {
        const [time, current] = value;
        if (!isNaN(time)) {
            discharge_new_time = time - discharge_old_time;
            discharge_old_time = time;
        }
        if (current < 0) return discharge_new_time * current;
        return null;
    }
}

function convertTextToNumber(value, params) {
    const [from, to] = params;
    const number_value = Number(_.replace(value.trim(), from, to));
    return isNaN(number_value) ? value : number_value;
}

/**
 * Divide o primeiro valor do array values pelo primeiro valor do array params.
 *
 * @param {Array} values
 * Array contendo o valor do dividendo.
 *
 * @param {Array<number>} params
 * Array contendo o valor do divisor.
 *
 * @returns {number}
 * O resultado da divisão.
 */
function divideOneByOther(values, params) {
    if (_.isEmpty(params)) return 0;
    if (!_.every(values, _.isNumber)) return 0;
    const [dividend] = values;
    const [divisor] = params;
    return dividend / divisor;
}

function extractRecordStart(value) {
    if (global_parameters.profile === 'hh') {
        const data_value = value.toString();
        const regex = /record start at [a-z]+, (.*), (.*)/;
        const match = data_value.match(regex);
        if (match && match.length > 1) {
            const data = match[1];
            const hora = _.replace(match[2], /\./g, ':');
            record_start = new Date(`${data} ${hora}`);
        }
        return record_start;
    } else if (global_parameters.profile === 'regatron') {
        const data_value = global_parameters.file_name.toString();
        const regex = /(.{10})T(.{8})/;
        const match = data_value.match(regex);
        if (match && match.length > 1) {
            const data = match[1];
            const hora = _.replace(match[2], /_/g, ':');
            record_start = new Date(`${data} ${hora}`);
        }
        return record_start;
    }
}

/**
 * Multiplica todos os valores passados como parâmetro.
 *
 * @param {Array} values
 * Array contendo os valores a serem multiplicados.
 *
 * @returns {number}
 * O resultado da multiplicação dos valores.
 */
function multiplyValues(values) {
    if (!_.every(values, _.isNumber)) return 0;
    return _.reduce(values, (acc, value) => acc * value, 1);
}

function recordDate(value) {
    const [date_time, step_time] = value;
    const new_date_time = new Date(date_time).getTime();
    return new Date(new_date_time + step_time * 1000);
}

/**
 * Retorna um determinado item a partir do objeto params fornnecido.
 * Se o item for uma chave do objeto params e seu valor for um array,
 * retorna o primeiro elemento do array, senão, retorna o seu valor.
 * Se o item não for uma chave do objeto params, retorna o próprio item.
 *
 * @param {*} value -
 * O nome da chave ou o valor para gravação.
 *
 * @param {Object} params
 * O objeto global_parameters com os valores para gravação.
 *
 * @returns {*}
 * O valor para a gravação.
 */
function recordValue(value, params) {
    if (_.has(params, value)) {
        return _.isArray(params[value]) ? params[value][0] : params[value];
    } else {
        return value;
    }
}

const normalize_formulas = {
    calculateChargeCapacity,
    calculateDischargeCapacity,
    convertTextToNumber,
    divideOneByOther,
    extractRecordStart,
    multiplyValues,
    recordDate,
    recordValue
};

module.exports = normalize_formulas;
