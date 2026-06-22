<template>
  <div class="finanzas-dashboard">
    <div class="dashboard-header">
      <h1>Módulo de Finanzas</h1>
      <p>Gestiona tus recursos, analiza estadísticas y genera reportes detallados.</p>
    </div>

    <div class="dashboard-grid">
      <!-- Gestión Financiera -->
      <router-link to="/finanzas/gestion" class="dashboard-card">
        <div class="card-icon">💼</div>
        <h3>Gestión Financiera</h3>
        <p>Carga de gastos e ingresos con una interfaz moderna y organizada.</p>
        <span class="card-badge">Acceder</span>
      </router-link>

      <!-- Gráficos (Estadísticas) -->
      <router-link to="/finanzas/estadisticas" class="dashboard-card">
        <div class="card-icon">📈</div>
        <h3>Estadísticas</h3>
        <p>Visualización de datos anuales mediante gráficos interactivos.</p>
        <span class="card-badge">Acceder</span>
      </router-link>

      <!-- Reportes -->
      <router-link to="/finanzas/reportes" class="dashboard-card">
        <div class="card-icon">📄</div>
        <h3>Reportes</h3>
        <p>Estado de resultados y consolidados financieros detallados.</p>
        <span class="card-badge">Acceder</span>
      </router-link>
    </div>

    <router-link to="/home" class="btn-back-home">
      <span>←</span> Volver al Inicio
    </router-link>
  </div>
</template>

<script setup>
import '@/assets/finanzas.css'
</script>
