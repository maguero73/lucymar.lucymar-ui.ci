<template>
  <div class="finanzas-dashboard">
    <div class="dashboard-header">
      <h1>Control de Estudio</h1>
      <p>Organiza tu progreso académico y mantén tus metas al día.</p>
    </div>

    <div class="dashboard-grid">
      <!-- Calendario -->
      <div class="dashboard-card">
        <div class="card-icon">📅</div>
        <h3>Calendario</h3>
        <p>Seguimiento de fechas de exámenes, entregas y eventos importantes.</p>
        <span class="card-badge">Próximamente</span>
      </div>

      <!-- Materias -->
      <div class="dashboard-card">
        <div class="card-icon">📝</div>
        <h3>Materias</h3>
        <p>Gestión de contenidos, apuntes y progreso por cada asignatura.</p>
        <span class="card-badge">Próximamente</span>
      </div>

      <!-- Progreso -->
      <div class="dashboard-card">
        <div class="card-icon">📊</div>
        <h3>Progreso</h3>
        <p>Visualización de estadísticas de rendimiento y objetivos cumplidos.</p>
        <span class="card-badge">Próximamente</span>
      </div>
    </div>

    <router-link to="/home" class="btn-back-home">
      <span>←</span> Volver al Inicio
    </router-link>
  </div>
</template>

<script setup>
import '@/assets/finanzas.css' // Reutilizamos los estilos del dashboard de finanzas
</script>
