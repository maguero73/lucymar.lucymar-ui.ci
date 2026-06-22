<template>
  <div class="modern-form-container">
    <div class="form-header">
      <h2>Carga de Gastos</h2>
      <p class="description">Registra tus gastos con precisión y claridad.</p>
    </div>

    <div class="glass-card">
      <form @submit.prevent="guardarGasto" class="form-grid">
        <!-- Titular -->
        <div class="form-group">
          <label for="titular">Titular del Gasto</label>
          <select id="titular" v-model="form.cod_titular" :disabled="loading">
            <option disabled value="">Seleccione un titular</option>
            <option v-for="titular in titulares" :key="titular.codigo" :value="titular.codigo">
              {{ titular.nombre }}
            </option>
          </select>
          <span v-if="!titulares.length && loading" class="loading-text">Cargando titulares...</span>
        </div>

        <!-- Tipo de Gasto -->
        <div class="form-row">
          <div class="form-group" :class="{ 'half-width': isOtros }">
            <label for="tipo_gasto">Tipo de Gasto</label>
            <select id="tipo_gasto" v-model="form.cod_gasto" :disabled="loading">
              <option disabled value="">Seleccione un concepto</option>
              <option v-for="tipo in tipos_gasto" :key="tipo.codigo" :value="tipo.codigo">
                {{ tipo.descripcion }}
              </option>
            </select>
            <span v-if="!tipos_gasto.length && loading" class="loading-text">Cargando conceptos...</span>
          </div>

          <transition name="slide-fade">
            <div v-if="isOtros" class="form-group half-width">
              <label for="detalle">Detalle</label>
              <input 
                type="text" 
                id="detalle" 
                v-model="form.detalle" 
                placeholder="Especifique el gasto"
                :disabled="loading"
                required
              />
            </div>
          </transition>
        </div>

        <!-- Fecha -->
        <div class="form-group">
          <label for="fecha">Fecha del Gasto</label>
          <input type="date" id="fecha" v-model="form.fecha" :disabled="loading" />
        </div>

        <!-- Moneda -->
        <div class="form-group">
          <label>Moneda</label>
          <div class="modern-radio-group">
            <input type="radio" id="ARS" value="ARS" v-model="form.codigo_moneda" :disabled="loading" />
            <label for="ARS">Pesos (ARS)</label>

            <input type="radio" id="USD" value="USD" v-model="form.codigo_moneda" :disabled="loading" />
            <label for="USD">Dólares (USD)</label>
          </div>
        </div>

        <!-- Monto -->
        <div class="form-group">
          <label for="monto">Monto del Gasto</label>
          <input 
            type="number" 
            id="monto" 
            v-model="form.monto" 
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
            {{ loading ? 'Guardando...' : 'Guardar Gasto' }}
          </button>
          <button type="button" @click="resetGasto" class="btn-secondary" :disabled="loading">
            Nuevo Gasto
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
import { ref, reactive, onMounted, computed } from 'vue'
import gastosApi from '@/controllers/gastos'
import { useGastosStore } from '@/store/useGastosStore'

const gastosStore = useGastosStore()
const titulares = computed(() => gastosStore.titulares)
const tipos_gasto = computed(() => gastosStore.tiposGasto)
const loading = computed(() => gastosStore.loading)

const error = ref('')
const success = ref('')

const form = reactive({
  cod_titular: '',
  cod_gasto: '',
  detalle: '',
  monto: '',
  fecha: new Date().toISOString().split('T')[0],
  codigo_moneda: 'ARS'
})

const isOtros = computed(() => {
  if (!form.cod_gasto) return false
  const tipo = tipos_gasto.value.find(t => t.codigo === form.cod_gasto)
  return tipo && tipo.descripcion.toLowerCase() === 'otros'
})

onMounted(async () => {
  await gastosStore.fetchInitialData()
  if (gastosStore.error) {
    error.value = gastosStore.error
  }
})

const guardarGasto = async () => {
  success.value = ''
  error.value = ''

  if (!form.cod_gasto || !form.cod_titular || form.monto === '' || !form.fecha || !form.codigo_moneda) {
    error.value = 'Por favor, complete todos los campos.'
    return
  }

  if (isOtros.value && !form.detalle) {
    error.value = 'Por favor, complete el detalle del gasto.'
    return
  }

  const gasto = {
    cod_gasto: Number(form.cod_gasto),
    cod_titular: Number(form.cod_titular),
    monto: parseFloat(form.monto),
    fecha: new Date(form.fecha).toISOString(),
    codigo_moneda: form.codigo_moneda,
    detalle: isOtros.value ? form.detalle : '',
    tipo_cambio: 1200, // Valor por defecto según código previo
    fecha_creacion: new Date().toISOString()
  }

  try {
    const response = await gastosApi.saveGasto(gasto)
    success.value = response.data.mensaje || 'Gasto guardado con éxito'
    // Opcional: resetear monto después de guardar
    form.monto = ''
    form.detalle = ''
  } catch (err) {
    console.error('Error al guardar gasto:', err)
    error.value = 'Error al guardar el gasto. Intente nuevamente.'
  }
}

function resetGasto() {
  form.cod_titular = ''
  form.cod_gasto = ''
  form.detalle = ''
  form.monto = ''
  form.fecha = new Date().toISOString().split('T')[0]
  form.codigo_moneda = 'ARS'
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
