const API_URL = 'http://localhost:8000/material'; 

export const materialService = {
  criar: async (dados) => {
    const payload = {
      nome: dados.nome,
      densidade: Number(dados.densidade) || 0,
      custoPerKg: Number(dados.custoPerKg ?? dados.custo ?? dados.precoKg) || 0,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const erroBody = await response.json().catch(() => ({}));
      throw new Error(erroBody.errorMessage || erroBody.message || "Erro ao cadastrar material.");
    }

    return await response.json();
  },

  selecionar: async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Erro ao buscar materiais.");
    }

    return await response.json();
  },

  deletar: async (idMaterial) => {
    const response = await fetch(`${API_URL}/${idMaterial}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const erroBody = await response.json().catch(() => ({}));
      throw new Error(erroBody.errorMessage || erroBody.message || "Erro ao deletar material.");
    }

    return await response.json();
  },

  // Aliases para compatibilidade
  listar: async function () {
    return this.selecionar();
  },

  listarMateriais: async function () {
    return this.selecionar();
  }
};