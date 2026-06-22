<template>
  <div class="estado-resultados-container">
    <div class="header-section">
      <h2>Estado de Resultados</h2>
      <p class="description">Consulta el consolidado de tus movimientos financieros.</p>
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
          <label for="fecha_desde">Fecha Desde</label>
          <input type="date" id="fecha_desde" v-model="store.filtros.fecha_desde">
        </div>
        <div class="form-group">
          <label for="fecha_hasta">Fecha Hasta</label>
          <input type="date" id="fecha_hasta" v-model="store.filtros.fecha_hasta">
        </div>
        <div class="form-group">
          <label for="cod_titular">Cód. Titular (0 = todos)</label>
          <input type="text" id="cod_titular" v-model="store.filtros.cod_titular" placeholder="Ej: 1, 2">
        </div>
        <div class="form-group">
          <label for="cod_concepto">{{ store.tabActiva === 'gastos' ? 'Cód. Gasto' : 'Cód. Ingreso' }} (0 = todos)</label>
          <input type="text" id="cod_concepto" v-model="store.filtros.cod_gasto" placeholder="Ej: 10, 20">
        </div>
        <div class="form-group">
          <label for="codigo_moneda">Moneda</label>
          <select id="codigo_moneda" v-model="store.filtros.codigo_moneda">
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div class="actions">
        <button @click="store.consolidar" :disabled="store.loading" class="btn-modern">
          <div v-if="store.loading" class="loader-spinner"></div>
          <span v-else>Consolidar {{ store.tabActiva === 'gastos' ? 'Gastos' : 'Ingresos' }}</span>
        </button>
      </div>
    </div>

    <!-- Mensajes de Error -->
    <div v-if="store.error" class="error-card">
      <p>{{ store.error }}</p>
    </div>

    <!-- Resultados -->
    <div v-if="store.resultados && store.resultados.length > 0" class="resultados-section">
      <div class="table-container">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Titular</th>
              <th>{{ store.tabActiva === 'gastos' ? 'Gasto' : 'Ingreso' }}</th>
              <th>Moneda</th>
              <th style="text-align: right;">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in store.resultados" :key="index">
              <td>{{ formatDate(item.fecha) }}</td>
              <td>{{ item.titular || item.cod_titular || 'Sin datos' }}</td>
              <td>{{ item.nombre_gasto || item.nombre_ingreso || item.cod_gasto || item.cod_ingreso || 'Sin datos' }}</td>
              <td>{{ item.codigo_moneda }}</td>
              <td class="monto" :class="store.tabActiva === 'gastos' ? 'monto-negativo' : 'monto-positivo'" style="text-align: right;">
                {{ formatCurrency(item.monto, item.codigo_moneda) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="store.resultados && store.resultados.length === 0" class="no-results-card">
      <p>No se encontraron resultados para los filtros seleccionados.</p>
    </div>
  </div>
</template>

<script setup>
import '@/assets/estadoResultados.css'
import { useEstadoResultadosStore } from '@/store/useEstadoResultadosStore'

const store = useEstadoResultadosStore()

const formatCurrency = (value, currency) => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('es-AR', { 
      style: 'currency', 
      currency: currency || store.filtros.codigo_moneda 
    }).format(value)
  }
  return value
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}
</script>