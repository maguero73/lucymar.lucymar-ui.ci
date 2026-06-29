import api from '@/helpers/api'

export default {

    async obtenerVersion() {
        const response = await api.get('/version')
        return response.data
    }

}