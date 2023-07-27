const global_parameters = {
    _id: 0,
    _time: new Date(),
    _record_start: new Date(),
    _file_name: [],
    _header: [],
    _profile: '',

    get id() {
        return this._id;
    },

    set id(value) {
        this._id = value;
    },

    get time() {
        return this._time;
    },

    set time(value) {
        this._time = value;
    },

    get record_start() {
        return this._record_start;
    },

    set record_start(value) {
        this._record_start = value;
    },

    get files() {
        return this._file_name;
    },

    set files(value) {
        this._file_name = value;
    },

    get header() {
        return this._header;
    },

    set header(value) {
        this._header = value;
    },

    get profile() {
        return this._profile;
    },

    set profile(value) {
        this._profile = value;
    }
};

module.exports = { global_parameters };
