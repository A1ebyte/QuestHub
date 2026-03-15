import axios from 'axios'

const api = axios.create({
    baseURL:'http://localhost:8080/api'
});


export const getRecetas = async () => {
    try {
        const response = await api.get('/recetas');
        return response.data;
    } catch (error) {
        console.error('Error al traer la recetas',error)
        throw error;
    }
};

export const registrarUsuario = async (userData) => {
    return await api.post('/usuarios/registro',userData);
};

export default api;
