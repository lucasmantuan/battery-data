function multiplyValues(values) {
    return values.reduce((acc, value) => acc * value, 1);
}

function sumValues(values) {
    return values.reduce((acc, value) => acc + value, 0);
}

function recordDate() {
    return new Date();
}

const normalize_formulas = {
    multiplyValues,
    sumValues,
    recordDate
};

module.exports = normalize_formulas;
