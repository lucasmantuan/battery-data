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

const normalize_formulas = {
    multiplyValues,
    sumValues,
    recordDate,
    recordFileName
};

module.exports = normalize_formulas;
