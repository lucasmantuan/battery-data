const global_parameters = {
    _id: 0,
    _time: new Date(),
    _files: [],
    _header: [],

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

    get files() {
        return this._files;
    },

    set files(value) {
        this._files = value;
    },

    get header() {
        return this._header;
    },

    set header(value) {
        this._header = value;
    }
};

module.exports = { global_parameters };
