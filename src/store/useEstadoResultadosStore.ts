import { defineStore } from 'pinia';
import reportesApi from '@/controllers/reportes';

export const useEstadoResultadosStore = defineStore('estadoResultados', {
    state: () => ({
        resultados: null as any[] | null,
        loading: false,
        error: null as string | null,
        tabActiva: 'gastos',
        filtros: {
            fecha_desde: new Date().toISOString().split('T')[0],
            fecha_hasta: new Date().toISOString().split('T')[0],
            cod_titular: '0',
            cod_gasto: '0',
            codigo_moneda: 'ARS'
        }
    }),
    actions: {
        setTab(tab: string) {
            this.tabActiva = tab;
            this.resultados = null;
            this.error = null;
        },
        async consolidar() {
            this.loading = true;
            this.error = null;
            this.resultados = null;

            try {
                const codigos = this.filtros.cod_gasto.split(',').map((n: string) => parseInt(n.trim()) || 0);

                const payload: any = {
                    fecha_desde: this.filtros.fecha_desde,
                    fecha_hasta: this.filtros.fecha_hasta,
                    cod_titular: this.filtros.cod_titular.split(',').map((n: string) => parseInt(n.trim()) || 0),
                    codigo_moneda: this.filtros.codigo_moneda
                };

                let response;
                if (this.tabActiva === 'gastos') {
                    payload.cod_gasto = codigos;
                    response = await reportesApi.consolidarGastos(payload);
                } else {
                    payload.cod_ingreso = codigos;
                    response = await reportesApi.consolidarIngresos(payload);
                }

                console.log(`Respuesta consolidado ${this.tabActiva}:`, response.data);
                this.resultados = Array.isArray(response.data) ? response.data : [response.data];
            } catch (err: any) {
                console.error(`Error al consolidar ${this.tabActiva}:`, err);
                if (err.response) {
                    const detail = err.response.data?.detail || err.response.statusText || 'Error desconocido';
                    this.error = `Error del servidor (${err.response.status}): ${typeof detail === 'object' ? JSON.stringify(detail) : detail}`;
                } else if (err.request) {
                    this.error = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
                } else {
                    this.error = `Error de configuración: ${err.message}`;
                }
            } finally {
                this.loading = false;
            }
        }
    }
});
