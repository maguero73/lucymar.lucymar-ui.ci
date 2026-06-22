<template>
  <div class="modern-form-container">
    <div class="form-header">
      <h2>Carga de Ingresos</h2>
      <p class="description">Registra tus ingresos para mantener un balance saludable.</p>
    </div>

    <div class="glass-card">
      <form @submit.prevent="guardarIngreso" class="form-grid">
        <!-- Titular -->
        <div class="form-group">
          <label for="titular">Titular del Ingreso</label>
          <select id="titular" v-model="formIngreso.cod_titular" :disabled="loading">
            <option disabled value="">Seleccione un titular</option>
            <option v-for="titular in titulares" :key="titular.codigo" :value="titular.codigo">
              {{ titular.nombre }}
            </option>
          </select>
          <span v-if="!titulares.length && loading" class="loading-text">Cargando titulares...</span>
        </div>

        <!-- Tipo de Ingreso -->
        <div class="form-row">
          <div class="form-group" :class="{ 'half-width': isOtros }">
            <label for="tipo_ingreso">Tipo de Ingreso</label>
            <select id="tipo_ingreso" v-model="formIngreso.cod_ingreso" :disabled="loading">
              <option disabled value="">Seleccione un concepto</option>
              <option v-for="tipo in tiposIngreso" :key="tipo.codigo" :value="tipo.codigo">
                {{ tipo.descripcion }}
              </option>
            </select>
            <span v-if="!tiposIngreso.length && loading" class="loading-text">Cargando conceptos...</span>
          </div>

          <transition name="slide-fade">
            <div v-if="isOtros" class="form-group half-width">
              <label for="detalle">Detalle</label>
              <input 
                type="text" 
                id="detalle" 
                v-model="formIngreso.detalle" 
                placeholder="Especifique el ingreso"
                :disabled="loading"
                required
              />
            </div>
          </transition>
        </div>

        <!-- Fecha -->
        <div class="form-group">
          <label for="fecha">Fecha del Ingreso</label>
          <input type="date" id="fecha" v-model="formIngreso.fecha" :disabled="loading" />
        </div>

        <!-- Moneda -->
        <div class="form-group">
          <label>Moneda</label>
          <div class="modern-radio-group">
            <input type="radio" id="ARS_ING" value="ARS" v-model="formIngreso.cod_moneda" :disabled="loading" />
            <label for="ARS_ING">Pesos (ARS)</label>

            <input type="radio" id="USD_ING" value="USD" v-model="formIngreso.cod_moneda" :disabled="loading" />
            <label for="USD_ING">Dólares (USD)</label>
          </div>
        </div>

        <!-- Monto -->
        <div class="form-group">
          <label for="monto">Monto del Ingreso</label>
          <input 
            type="number" 
            id="monto" 
            v-model="formIngreso.monto" 
            required 
            min="0" 
            step="0.01" 
            placeholder="0.00"
            :disabled="loading" 
          />
        </div>

        <!-- Acciones -->
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Guardar Ingreso' }}
          </button>
          <button type="button" @click="resetIngreso" class="btn-secondary" :disabled="loading">
            Nuevo Ingreso
          </button>
        </div>
      </form>

      <!-- Mensajes -->
      <div v-if="success" class="msg msg-success">{{ success }}</div>
      <div v-if="error" class="msg msg-error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/modern-forms.css'
import { reactive, ref, onMounted, computed } from 'vue'
import ingresosApi from '@/controllers/ingresos'
import { useIngresosStore } from '@/store/useIngresosStore'

const ingresosStore = useIngresosStore()
const titulares = computed(() => ingresosStore.titulares)
const tiposIngreso = computed(() => ingresosStore.tiposIngreso)
const loading = computed(() => ingresosStore.loading)

const error = ref('')
const success = ref('')

const formIngreso = reactive({
  cod_titular: '',
  cod_ingreso: '',
  detalle: '',
  fecha: new Date().toISOString().split('T')[0],
  monto: '',
  cod_moneda: 'ARS'
})

const isOtros = computed(() => {
  if (!formIngreso.cod_ingreso) return false
  const tipo = tiposIngreso.value.find(t => t.codigo === formIngreso.cod_ingreso)
  return tipo && tipo.descripcion.toLowerCase() === 'otros'
})

onMounted(async () => {
  await ingresosStore.fetchInitialData()
  if (ingresosStore.error) {
    error.value = ingresosStore.error
  }
})

const guardarIngreso = async () => {
  success.value = ''
  error.value = ''

  if (!formIngreso.cod_ingreso || !formIngreso.cod_titular || formIngreso.monto === '' || !formIngreso.fecha || !formIngreso.cod_moneda) {
    error.value = 'Por favor, complete todos los campos.'
    return
  }

  if (isOtros.value && !formIngreso.detalle) {
    error.value = 'Por favor, complete el detalle del ingreso.'
    return
  }

  const ingreso = {
    cod_ingreso: Number(formIngreso.cod_ingreso),
    cod_titular: Number(formIngreso.cod_titular),
    monto: parseFloat(formIngreso.monto),
    fecha: new Date(formIngreso.fecha).toISOString(),
    cod_moneda: formIngreso.cod_moneda,
    detalle: isOtros.value ? formIngreso.detalle : '',
    tipo_cambio: 1200,
    fecha_creacion: new Date().toISOString()
  }

  try {
    const response = await ingresosApi.saveIngreso(ingreso)
    success.value = response.data.mensaje || 'Ingreso guardado correctamente'
    formIngreso.monto = ''
    formIngreso.detalle = ''
  } catch (err) {
    console.error('Error al guardar ingreso:', err)
    error.value = 'Error al guardar el ingreso. Intente nuevamente.'
  }
}

function resetIngreso() {
  formIngreso.cod_titular = ''
  formIngreso.cod_ingreso = ''
  formIngreso.detalle = ''
  formIngreso.monto = ''
  formIngreso.fecha = new Date().toISOString().split('T')[0]
  formIngreso.cod_moneda = 'ARS'
  success.value = ''
  error.value = ''
}
</script>

<style scoped>
.loading-text {
  font-size: 0.8rem;
  opacity: 0.5;
  margin-top: 0.2rem;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }
  .half-width {
    flex: 1 1 100% !important;
  }
}
</style>
