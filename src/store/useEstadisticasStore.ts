import { defineStore } from 'pinia';
import estadisticasApi from '@/controllers/estadisticas';

export const useEstadisticasStore = defineStore('estadisticas', {
    state: () => ({
        titulares: [],
        tiposGasto: [],
        tiposIngreso: [],
        anios: [],
        reporteData: [],
        tabActiva: 'gastos',
        loading: false,
        error: null as string | null
    }),
    actions: {
        setTab(tab: string) {
            this.tabActiva = tab;
            this.reporteData = [];
            this.error = null;
        },
        async fetchInitialData() {
            this.loading = true;
            this.error = null;
            try {
                const [resTitulares, resTiposG, resTiposI, resAnios] = await Promise.all([
                    estadisticasApi.getTitulares(),
                    estadisticasApi.getTiposGasto(),
                    estadisticasApi.getTiposIngreso(),
                    estadisticasApi.getAnios()
                ]);
                this.titulares = resTitulares.data || [];
                this.tiposGasto = resTiposG.data || [];
                this.tiposIngreso = resTiposI.data || [];
                this.anios = resAnios.data || [];
            } catch (err: any) {
                this.error = 'Error al cargar filtros de estadísticas';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        async fetchReportData(params: { cod_titular: number; cod_gasto: number }) {
            this.loading = true;
            this.error = null;
            try {
                const response = await estadisticasApi.getReporteGastosAnuales(params);
                this.reporteData = response.data || [];
            } catch (err: any) {
                this.error = 'Error al obtener datos del reporte de gastos';
                console.error(err);
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async fetchReportDataIngresos(params: { cod_titular: number; cod_ingreso: number }) {
            this.loading = true;
            this.error = null;
            try {
                const response = await estadisticasApi.getReporteIngresosAnuales(params);
                this.reporteData = response.data || [];
            } catch (err: any) {
                this.error = 'Error al obtener datos del reporte de ingresos';
                console.error(err);
                throw err;
            } finally {
                this.loading = false;
            }
        }
    }
});
