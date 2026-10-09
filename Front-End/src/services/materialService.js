import axios from "axios";

const API_URL = "http://localhost:8000/material";

export const materialService = {

    criar: async (material) => {
        const resposta = await axios.post(API_URL, material);
        return resposta.data
    },

    selecionar: async () => {
        const resposta = await axios.get(API_URL);
        return resposta.data;
    },

    deletar: async (idMaterial) => {
        const resposta = await axios.delete(`${API_URL}/${idMaterial}`);
        return resposta.data;
    }

};