<template>
  <div class="estado-resultados-container" id="estadisticas">
    <div class="header-section">
      <h2>Estadísticas</h2>
      <p class="description">Visualiza el resumen anual de tus movimientos financieros.</p>
    </div>

    <!-- Pestañas Superiores -->
    <div class="tabs-modernas">
      <button 
        class="tab-btn" 
        :class="{ active: store.tabActiva === 'gastos' }"
        @click="store.setTab('gastos')"
      >
        Gastos
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: store.tabActiva === 'ingresos' }"
        @click="store.setTab('ingresos')"
      >
        Ingresos
      </button>
    </div>

    <!-- Filtros Glassmorphism -->
    <div class="filtros-glass">
      <div class="filtros-grid">
        <div class="form-group">
          <label for="anio">Año</label>
          <select id="anio" v-model="anioSeleccionado">
            <option disabled value="">Seleccione un año</option>
            <option v-for="anio in anios" :key="anio" :value="anio">{{ anio }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="titular">Titular</label>
          <select id="titular" v-model="codTitular">
            <option :value="0">Todos los titulares</option>
            <option v-for="titular in titulares" :key="titular.codigo" :value="titular.codigo">
              {{ titular.nombre }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="tipo_concepto">{{ store.tabActiva === 'gastos' ? 'Tipo de Gasto' : 'Tipo de Ingreso' }}</label>
          <select id="tipo_concepto" v-model="codConcepto">
            <option :value="0">Todos los conceptos</option>
            <option v-for="tipo in tiposConcepto" :key="tipo.codigo" :value="tipo.codigo">
              {{ tipo.descripcion }}
            </option>
          </select>
        </div>
      </div>

      <div class="actions">
        <button @click="fetchData" :disabled="loading" class="btn-modern">
          <div v-if="loading" class="loader-spinner"></div>
          <span v-else>Consultar Reporte</span>
        </button>
      </div>
    </div>

    <!-- Mensajes de Error -->
    <div v-if="store.error" class="error-card">
      <p>{{ store.error }}</p>
    </div>

    <!-- Resultados -->
    <transition name="fade">
      <div v-if="resultado !== null" class="resultados-section">
        <div class="table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Concepto</th>
                <th style="text-align: right;">Monto Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Año {{ anioSeleccionado }}</td>
                <td>{{ getConceptoLabel() }}</td>
                <td class="monto" :class="store.tabActiva === 'gastos' ? 'monto-negativo' : 'monto-positivo'" style="text-align: right;">
                  {{ formatCurrency(resultado.total || 0) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else-if="!loading && hasQueried" class="no-results-card">
        <p>No se encontraron datos para los filtros seleccionados en el año {{ anioSeleccionado }}.</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import '@/assets/estadoResultados.css' // Reutilizamos los estilos de Estado de Resultados
import { ref, onMounted, computed, watch } from 'vue'
import { useEstadisticasStore } from '@/store/useEstadisticasStore'

const store = useEstadisticasStore()

const resultado = ref(null)
const anioSeleccionado = ref("")
const hasQueried = ref(false)
const codTitular = ref(0)
const codConcepto = ref(0)

const titulares = computed(() => store.titulares)
const anios = computed(() => store.anios)
const loading = computed(() => store.loading)

const tiposConcepto = computed(() => {
  return store.tabActiva === 'gastos' ? store.tiposGasto : store.tiposIngreso
})

// Resetear filtros al cambiar de pestaña
watch(() => store.tabActiva, () => {
  resultado.value = null
  hasQueried.value = false
  codConcepto.value = 0
})

onMounted(async () => {
  await store.fetchInitialData()
})

const fetchData = async () => {
  if (!anioSeleccionado.value) {
    alert("Por favor seleccioná un año")
    return
  }

  resultado.value = null
  hasQueried.value = false

  try {
    if (store.tabActiva === 'gastos') {
      await store.fetchReportData({
        cod_titular: codTitular.value,
        cod_gasto: codConcepto.value
      })
    } else {
      await store.fetchReportDataIngresos({
        cod_titular: codTitular.value,
        cod_ingreso: codConcepto.value
      })
    }
    
    const dataForYear = store.reporteData.find(item => item.anio === parseInt(anioSeleccionado.value))
    
    if (dataForYear) {
      resultado.value = dataForYear
    } else {
      resultado.value = null
    }
    hasQueried.value = true
  } catch (error) {
    console.error("Error al obtener datos:", error)
  }
}

const getConceptoLabel = () => {
  if (codConcepto.value === 0) return 'Todos los conceptos'
  const tipo = tiposConcepto.value.find(t => t.codigo === codConcepto.value)
  return tipo ? tipo.descripcion : 'Concepto seleccionado'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(value)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
