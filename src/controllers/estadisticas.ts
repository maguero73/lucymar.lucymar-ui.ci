import api from '@/helpers/api';

const estadisticasApi = {
    getTitulares() {
        return api.get('/titulares');
    },
    getTiposGasto() {
        return api.get('/tipos-gasto');
    },
    getTiposIngreso() {
        return api.get('/tipos-ingreso');
    },
    getAnios() {
        return api.get('/reportes/anios');
    },
    getReporteGastosAnuales(params: { cod_titular: number; cod_gasto: number }) {
        return api.get('/reportes/gastos-anuales', { params });
    },
    getReporteIngresosAnuales(params: { cod_titular: number; cod_ingreso: number }) {
        return api.get('/reportes/ingresos-anuales', { params });
    }
};

export default estadisticasApi;
