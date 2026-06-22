import api from '@/helpers/api';
import { Ingreso } from '@/models/ingresos';

const ingresosApi = {
    getTitulares() {
        return api.get('/titulares');
    },
    getTiposIngreso() {
        return api.get('/tipos-ingreso');
    },
    saveIngreso(ingreso: Ingreso) {
        return api.post('/ingresos', ingreso);
    }
};

export default ingresosApi;
