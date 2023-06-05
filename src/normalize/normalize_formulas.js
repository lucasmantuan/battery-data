function multiply(values) {
    return values.reduce((acc, value) => acc * value, 1);
}

function sum(values) {
    return values.reduce((acc, value) => acc + value, 0);
}

const normalize_formulas = {
    multiply,
    sum
};

module.exports = normalize_formulas;
