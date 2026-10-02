const API_URL = 'http://localhost:8000/material';

export const materialService = {
  cadastrar: async (dados) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        const erroBody = await response.json().catch(() => ({}));
        throw new Error(erroBody.errorMessage || erroBody.message || "Erro ao cadastrar material.");
      }

      return await response.json();
    } catch (error) {
      console.warn("API offline:", error.message);
      return dados;
    }
  },

  listar: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Erro ao buscar materiais.");
      return await response.json();
    } catch (error) {
      console.warn("API offline. Retornando lista vazia.");
      return [];
    }
  }
};