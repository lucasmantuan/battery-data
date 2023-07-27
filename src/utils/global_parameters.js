const global_parameters = {
    _file_name: [],
    _header: [],
    _id: 0,
    _profile: '',
    _raw_numbers: true,
    _record_start: new Date(),
    _time: new Date(),

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

    get record_start() {
        return this._record_start;
    },

    set record_start(value) {
        this._record_start = value;
    },

    get time() {
        return this._time;
    },

    set time(value) {
        this._time = value;
    }
};

module.exports = { global_parameters };
