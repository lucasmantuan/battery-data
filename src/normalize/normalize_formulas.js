function multiplicarTodosValores(valores) {
    return valores.reduce((acc, value) => acc * value, 1);
}

const normalize_formulas = {
    multiplicarTodosValores
};

module.exports = normalize_formulas;
