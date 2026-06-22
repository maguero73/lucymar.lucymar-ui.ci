import api from '@/helpers/api';

const reportesApi = {
    getAnios() {
        return api.get('/reportes/anios');
    },

    getGastosAnuales(codTitular: number, codGasto: number) {
        return api.get('/reportes/gastos-anuales', {
            params: {
                cod_titular: codTitular,
                cod_gasto: codGasto
            }
        });
    },

    getIngresosAnuales(codTitular: number, codIngreso: number) {
        return api.get('/reportes/ingresos-anuales', {
            params: {
                cod_titular: codTitular,
                cod_ingreso: codIngreso
            }
        });
    },

    consolidarGastos(filtros: any) {
        return api.post('/consolidado_gastos', filtros);
    },

    consolidarIngresos(filtros: any) {
        return api.post('/consolidado_ingresos', filtros);
    }
};

export default reportesApi;