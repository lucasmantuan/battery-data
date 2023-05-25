import fs from 'fs';
import _ from 'lodash';

function removerEspacosBranco(dados) {
    const resultado = _.map(dados, (array) => {
        const novo_array = _.map(array, (objeto) => {
            return _.mapKeys(
                _.mapValues(objeto, (value) => value),
                (value, key) => key.trim()
            );
        });
        return novo_array;
    });
    return resultado;
}

fs.readFile('dados.json', 'utf8', (err, data) => {
    if (err) throw err;
    const dados = JSON.parse(data);
    const resultado = removerEspacosBranco(dados);
    console.log(resultado);
});
