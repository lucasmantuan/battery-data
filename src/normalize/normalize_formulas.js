const _ = require('lodash');
const { global_parameters } = require('../utils/global_parameters.js');
let charge_new_time = 0;
let charge_old_time = 0;
let discharge_new_time = 0;
let discharge_old_time = 0;
let record_start = new Date();

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

function recordDateFile(value) {
    const [date_time, step_time] = value;
    const new_date_time = new Date(date_time).getTime();
    return new Date(new_date_time + step_time * 1000);
}

function recordDate(value) {
    return value.time;
}

function recordFileName(value) {
    return value.file_name[0];
}

function recordNull() {
    return null;
}

function recordOne() {
    return 1;
}

function convertTextToNumber(value, params) {
    const [from, to] = params;
    const number_value = Number(_.replace(value.trim(), from, to));
    return isNaN(number_value) ? value : number_value;
}

function calculateCoulombicEfficiency(values) {
    const [discharge_capacity, charge_capacity] = values;
    const result = (100 * discharge_capacity) / charge_capacity;
    if (result == null || isNaN(result)) return 0;
    return result;
}

function calculateMilliampereHoursPerGramMass(value, params) {
    const [discharge_capacity] = value;
    const [mass] = params;
    if (mass === 0) return 0;
    const result = discharge_capacity / mass;
    if (result == null || isNaN(result)) return 0;
    return result;
}

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

function calculateChargeEnergy(value) {
    const [voltage, charge_capacity] = value;
    const result = voltage * charge_capacity;
    if (result == null || isNaN(result)) return 0;
    return result;
}

function calculateDischargeEnergy(value) {
    const [voltage, discharge_capacity] = value;
    const result = voltage * discharge_capacity;
    if (result == null || isNaN(result)) return 0;
    return result;
}

function calculatePower(value) {
    const [voltage, current] = value;
    const result = voltage * current;
    if (result == null || isNaN(result)) return 0;
    return result;
}

function calculateTestTime(value) {
    const [time] = value;
    const result = time / 1000;
    return result;
}

const normalize_formulas = {
    calculateChargeCapacity,
    calculateChargeEnergy,
    calculateCoulombicEfficiency,
    calculateDischargeCapacity,
    calculateDischargeEnergy,
    calculateMilliampereHoursPerGramMass,
    calculatePower,
    calculateTestTime,
    convertTextToNumber,
    extractRecordStart,
    recordDate,
    recordDateFile,
    recordFileName,
    recordNull,
    recordOne
};

module.exports = normalize_formulas;
