/**
 * Objeto com parâmetros globais com diversas propriedades e métodos usados por toda a aplicação.
 *
 * @typedef {Object} global_parameters
 *
 * @property {Array<string>} _file_name
 * Um array com os nomes dos arquivos sendo processados.
 *
 * @property {Array<string>} _header
 * O cabeçalho utilizado para identificar as colunas nos arquivos que estão sendo processados.
 *
 * @property {number} _id
 *  O id do worker que está processando os dados.
 *
 * @property {string} _profile
 * O nome do perfil que está sendo utilizado para processamento.
 *
 * @property {boolean} _raw_numbers
 * Propriedade que indica se os valores numéricos devem ser os valores brutos ou os processados.
 *
 * @property {Date} _recorded_at
 * A data e hora de inicio do processamento do arquivo.
 *
 * @property {Array<string>} file_name
 * Um array com os nomes dos arquivos sendo processados.
 *
 * @property {Array<string>} header
 * O cabeçalho utilizado para identificar as colunas nos arquivos que estão sendo processados.
 *
 * @property {number} id
 * O id do worker que está processando os dados.
 *
 * @property {string} profile
 * O nome do perfil que está sendo utilizado para processamento.
 *
 * @property {boolean} raw_numbers
 * Propriedade que indica se os valores numéricos devem ser os valores brutos ou os processados.
 *
 * @property {Date} recorded_at
 * A data e hora de inicio do processamento do arquivo.
 */

/**
 * @type {global_parameters}
 */
const global_parameters = {
    _file_name: [],
    _header: [],
    _id: 0,
    _profile: '',
    _raw_numbers: true,
    _recorded_at: new Date(),

    get raw_numbers() {
        return this._raw_numbers;
    },

    set raw_numbers(value) {
        this._raw_numbers = value;
    },

    get file_name() {
        return this._file_name;
    },

    set file_name(value) {
        this._file_name = value;
    },

    get header() {
        return this._header;
    },

    set header(value) {
        this._header = value;
    },

    get id() {
        return this._id;
    },

    set id(value) {
        this._id = value;
    },

    get profile() {
        return this._profile;
    },

    set profile(value) {
        this._profile = value;
    },

    get recorded_at() {
        return this._recorded_at;
    },

    set recorded_at(value) {
        this._recorded_at = value;
    }
};

module.exports = { global_parameters };
