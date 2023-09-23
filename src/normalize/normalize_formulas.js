const _ = require('lodash');
const { global_parameters } = require('../utils/global_parameters.js');
let charge_new_time = 0;
let charge_old_time = 0;
let discharge_new_time = 0;
let discharge_old_time = 0;
let record_start_new = new Date();
let record_start_old = null;

function calculateChargeCapacity(value) {
    if (global_parameters.profile === 'hh') {
        const [capacity] = value;
        if (_.toNumber(capacity) && capacity >= 0) return capacity;
        return null;
    } else if (global_parameters.profile === 'regatron') {
        const [time, current] = value;
        if (!_.isNaN(time)) {
            charge_new_time = time - charge_old_time;
            charge_old_time = time;
        }
        if (_.toNumber(current) && current >= 0) return charge_new_time * current;
        return null;
    } else if (global_parameters.profile === 'bk') {
        return null;
    } else if (global_parameters.profile === 'itech') {
        const [capacity] = value;
        if (_.toNumber(capacity) && capacity >= 0) return capacity;
        return null;
    }
}

function calculateDischargeCapacity(value) {
    if (global_parameters.profile === 'hh') {
        const [capacity] = value;
        if (_.toNumber(capacity) && capacity < 0) return capacity;
        return null;
    } else if (global_parameters.profile === 'regatron') {
        const [time, current] = value;
        if (!isNaN(time)) {
            discharge_new_time = time - discharge_old_time;
            discharge_old_time = time;
        }
        if (_.toNumber(current) && current < 0) return discharge_new_time * current;
        return null;
    } else if (global_parameters.profile === 'bk') {
        const [action, capacity] = value;
        if (_.toLower(action) === 'discharge(cc)') {
            return capacity;
        }
        return null;
    } else if (global_parameters.profile === 'itech') {
        const [capacity] = value;
        if (_.toNumber(capacity) && capacity < 0) return capacity;
        return null;
    }
}

function calculateTestTime(value) {
    const [record_start, step_time] = value;
    if (global_parameters.profile === 'hh') {
        if (record_start_old === null) record_start_old = record_start.getTime();
        const new_record_start = new Date(record_start).getTime();
        const new_step_time = _.round(step_time);
        return (new_record_start - record_start_old) / 1000 + new_step_time;
    }
}

function convertTextToNumber(value, params) {
    const [from, to] = params;
    const number_value = Number(_.replace(value.trim(), from, to));
    return isNaN(number_value) ? value : number_value;
}

/**
 * Calcula a diferença em segundos entre duas datas.
 *
 * @param {Array<Date>} values
 * Array contendo as duas datas para cálculo da diferença.
 *
 * @returns {number}
 * A diferença em segundos entre as duas datas.
 */
function differenceInSecondsBetweenDates(values) {
    const [first_date, second_date] = values;
    if (_.isDate(first_date) && _.isDate(second_date)) {
        return Math.abs(first_date.getTime() - second_date.getTime()) / 1000;
    }
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
// function divideOneByOther(values, params) {
//     if (_.isEmpty(params)) return 0;
//     if (_.isEmpty(values)) return 0;
//     if (!_.every(values, _.isNumber)) return 0;
//     const [dividend] = values;
//     const [divisor] = params;
//     return dividend / divisor;
// }
function divideOneByOther(params) {
    const [dividend, divisor] = params;
    const result = dividend / divisor;
    if (_.isNaN(result)) return 0;
    return result;
}

function extractRecordStart(value) {
    if (global_parameters.profile === 'hh') {
        const data_value = value.toString();
        const regex = /record start at [a-z]+, (.*), (.*)/;
        const match = data_value.match(regex);
        if (match && match.length > 1) {
            const data = match[1];
            const hora = _.replace(match[2], /\./g, ':');
            record_start_new = new Date(`${data} ${hora}`);
        }
        return record_start_new;
    } else if (global_parameters.profile === 'regatron') {
        const data_value = global_parameters.file_name.toString();
        const regex = /(.{10})T(.{8})/;
        const match = data_value.match(regex);
        if (match && match.length > 1) {
            const data = match[1];
            const hora = _.replace(match[2], /_/g, ':');
            record_start_new = new Date(`${data} ${hora}`);
        }
        return record_start_new;
    } else if (global_parameters.profile === 'bk') {
        const [start_value, data_value] = value;
        if (_.toLower(start_value) === 'start time') {
            const regex = /(.{2})\/(.{2})\/(.{4}) (.{8})/;
            const match = data_value.match(regex);
            const data = `${match[3]}-${match[2]}-${match[1]}`;
            const hora = match[4];
            record_start_new = new Date(new Date(`${data} ${hora}`));
        }
        return record_start_new;
    } else if (global_parameters.profile === 'digatron') {
        const [start_value, data_value] = value;
        if (_.toLower(start_value) === 'start time') {
            record_start_new = new Date(_.trim(data_value));
        }
        return record_start_new;
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
    let [date_time, step_time] = value;
    if (global_parameters.profile === 'hh') {
        const new_date_time = new Date(date_time).getTime();
        return new Date(new_date_time + _.round(step_time) * 1000);
    } else if (global_parameters.profile === 'regatron') {
        const new_date_time = new Date(date_time).getTime();
        return new Date(new_date_time + step_time * 1000);
    } else if (global_parameters.profile === 'bk') {
        let new_date_time;
        if (/(.{10}) (.{8})/.test(date_time)) {
            const regex = /(.{2})\/(.{2})\/(.{4}) (.{8})/;
            const match = date_time.match(regex);
            const data = `${match[3]}-${match[2]}-${match[1]}`;
            const hora = match[4];
            new_date_time = new Date(`${data} ${hora}`);
            return new_date_time;
        }
    } else if (global_parameters.profile === 'digatron') {
        const new_date_time = new Date(date_time);
        if (!_.isNil(step_time)) {
            const [horas, minutos, segundos] = step_time.split(':');
            const new_step_time = parseInt(horas) * 3600 + parseInt(minutos) * 60 + parseInt(segundos);
            return new Date(new_date_time.setSeconds(new_date_time.getSeconds() + new_step_time));
        }
    }
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

function returnValue(value, params) {
    if (_.isEmpty(params)) {
        return _.isNil(value[0]) ? null : value[0];
    } else if (_.isEmpty(value)) {
        return _.isNil(params[0]) ? null : params[0];
    }
}

const normalize_formulas = {
    calculateChargeCapacity,
    calculateDischargeCapacity,
    calculateTestTime,
    convertTextToNumber,
    differenceInSecondsBetweenDates,
    divideOneByOther,
    extractRecordStart,
    multiplyValues,
    recordDate,
    recordValue,
    returnValue
};

module.exports = normalize_formulas;
