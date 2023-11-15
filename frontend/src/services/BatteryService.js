import axios from 'axios';

export const Axios = axios.create({
    baseURL: 'http://localhost:3000/'
});

const getAll = async (page = 0, limit = 100, profile = '', start = '', end = '') => {
    try {
        const url = `battery?page=${page}&limit=${limit}&profile=${profile}&start=${start}&end=${end}`;
        const { data, headers } = await Axios.get(url);
        if (data) {
            return {
                data,
                total: Number(headers['x-total-count'])
            };
        }
        return new Error('Erro ao listar os registros');
    } catch (error) {
        return new Error(error.message || 'Erro ao listar os registros');
    }
};

export const BatteryService = {
    getAll
};
