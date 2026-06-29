<template>
  <div class="estado-resultados-container">
    <div class="header-section">
      <h2>Flujo de Efectivo</h2>
      <p class="description">Carga tus movimientos diarios de gastos e ingresos.</p>
    </div>

    <!-- Pestañas Superiores -->
    <div class="tabs-modernas">
      <button 
        class="tab-btn" 
        :class="{ active: tabActiva === 'gastos' }"
        @click="tabActiva = 'gastos'"
      >
        Carga de Gastos
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: tabActiva === 'ingresos' }"
        @click="tabActiva = 'ingresos'"
      >
        Carga de Ingresos
      </button>
    </div>

    <!-- Contenido de las Pestañas -->
    <transition name="fade" mode="out-in">
      <div :key="tabActiva" class="tab-content">
        <GuardarGasto v-if="tabActiva === 'gastos'" />
        <GuardarIngreso v-else />
      </div>
    </transition>

    <div class="actions" style="margin-top: 3rem;">
      <router-link to="/finanzas" class="btn-modern" style="text-decoration: none;">
        <span>←</span> Volver al Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import '@/assets/estadoResultados.css'
import { ref } from 'vue'
import GuardarGasto from '../dashboard/GuardarGasto.vue'
import GuardarIngreso from '../dashboard/GuardarIngreso.vue'

const tabActiva = ref('gastos')
</script>

<style scoped>
.tab-content {
  animation: slideUp 0.4s ease-out;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
