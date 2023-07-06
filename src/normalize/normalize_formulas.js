let record_start;

function extractRecordStart(values) {
    const data_value = values.toString();
    const regex = /record start at [a-z]+, (.*), (.*)/;
    const match = data_value.match(regex);

    if (match && match.length > 1) {
        const data = match[1];
        const hora = match[2].replace(/\./g, ':');
        record_start = new Date(`${data} ${hora}`);
    }

    return record_start;
}

function recordDate(value) {
    return value.time;
}

function recordFileName(value) {
    return value.files[0];
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
    const [capacity] = values;
    if (capacity >= 0) return capacity;
    return null;
}

function calculateDischargeCapacity(values) {
    const [capacity] = values;
    if (capacity < 0) return capacity;
    return null;
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

const normalize_formulas = {
    calculateChargeCapacity,
    calculateChargeEnergy,
    calculateCoulombicEfficiency,
    calculateDischargeCapacity,
    calculateDischargeEnergy,
    calculateMilliampereHoursPerGramMass,
    calculatePower,
    extractRecordStart,
    recordDate,
    recordFileName,
    recordNull,
    recordOne
};

module.exports = normalize_formulas;
