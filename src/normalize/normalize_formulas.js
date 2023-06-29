function multiplyValues(values) {
    return values.reduce((acc, value) => acc * value, 1);
}

function sumValues(values) {
    return values.reduce((acc, value) => acc + value, 0);
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
    if (mass === '0') return 0;
    return discharge_capacity / mass;
}

const normalize_formulas = {
    calculateCoulombicEfficiency,
    calculateMilliampereHoursPerGramMass,
    multiplyValues,
    recordDate,
    recordFileName,
    recordNull,
    recordOne,
    sumValues
};

module.exports = normalize_formulas;
