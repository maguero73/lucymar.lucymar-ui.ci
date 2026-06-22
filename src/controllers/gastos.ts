import api from '@/helpers/api';
import { Gasto } from '@/models/gastos';

const gastosApi = {
    getTitulares() {
        return api.get('/titulares');
    },
    getTiposGasto() {
        return api.get('/tipos-gasto');
    },
    saveGasto(gasto: Gasto) {
        return api.post('/gastos', gasto);
    }
};

export default gastosApi;
