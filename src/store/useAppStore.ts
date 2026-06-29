import { defineStore } from 'pinia'
import { ref } from 'vue'

import versionApi from '@/controllers/version'

export const useAppStore = defineStore('app', () => {

    const version = ref('')

    async function cargarVersion() {

        if (version.value) {
            return
        }

        const data = await versionApi.obtenerVersion()

        version.value = data.version

    }

    return {

        version,
        cargarVersion

    }

})