const { global_parameters } = require('../utils/global_parameters.js');
let charge_new_time = 0;
let charge_old_time = 0;
let discharge_new_time = 0;
let discharge_old_time = 0;
let record_start = new Date();

function extractRecordStart(values) {
    if (global_parameters.profile === 'hh') {
        const data_value = values.toString();
        const regex = /record start at [a-z]+, (.*), (.*)/;
        const match = data_value.match(regex);
        if (match && match.length > 1) {
            const data = match[1];
            const hora = match[2].replace(/\./g, ':');
            record_start = new Date(`${data} ${hora}`);
        }
        return record_start;
    } else if (global_parameters.profile === 'regatron') {
        const data_value = global_parameters.file_name.toString();
        const regex = /(.{10})T(.{8})/;
        const match = data_value.match(regex);
        if (match && match.length > 1) {
            const data = match[1];
            const hora = match[2].replace(/_/g, ':');
            record_start = new Date(`${data} ${hora}`);
        }
        return record_start;
    }
}

function recordDateFile(values) {
    const [date_time, step_time] = values;
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

function calculateCoulombicEfficiency(values) {
    const [discharge_capacity, charge_capacity] = values;
    const result = (100 * discharge_capacity) / charge_capacity;
    if (result == null || isNaN(result)) return 0;
    return result;
}

function calculateMilliampereHoursPerGramMass(values, new_values) {
    const [discharge_capacity] = values;
    const [mass] = new_values;
    if (mass === 0) return 0;
    const result = discharge_capacity / mass;
    if (result == null || isNaN(result)) return 0;
    return result;
}

function calculateChargeCapacity(values) {
    if (global_parameters.profile === 'hh') {
        const [capacity] = values;
        if (capacity >= 0) return capacity;
        return null;
    } else if (global_parameters.profile === 'regatron') {
        const [time, current] = values;
        if (!isNaN(time)) {
            charge_new_time = time - charge_old_time;
            charge_old_time = time;
        }
        if (current >= 0) return charge_new_time * current;
        return null;
    }
}

function calculateDischargeCapacity(values) {
    if (global_parameters.profile === 'hh') {
        const [capacity] = values;
        if (capacity < 0) return capacity;
        return null;
    } else if (global_parameters.profile === 'regatron') {
        const [time, current] = values;
        if (!isNaN(time)) {
            discharge_new_time = time - discharge_old_time;
            discharge_old_time = time;
        }
        if (current < 0) return discharge_new_time * current;
        return null;
    }
}

function calculateChargeEnergy(values) {
    const [voltage, charge_capacity] = values;
    const result = voltage * charge_capacity;
    if (result == null || isNaN(result)) return 0;
    return result;
}

function calculateDischargeEnergy(values) {
    const [voltage, discharge_capacity] = values;
    const result = voltage * discharge_capacity;
    if (result == null || isNaN(result)) return 0;
    return result;
}

function calculatePower(values) {
    const [voltage, current] = values;
    const result = voltage * current;
    if (result == null || isNaN(result)) return 0;
    return result;
}

function calculateTestTime(values) {
    const [time] = values;
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
    extractRecordStart,
    recordDate,
    recordDateFile,
    recordFileName,
    recordNull,
    recordOne
};

module.exports = normalize_formulas;
