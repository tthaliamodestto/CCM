const API_URL = 'http://localhost:8000/maquina';

export const maquinaService = {
  cadastrar: async (dados) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      const erroBody = await response.json().catch(() => ({}));
      throw new Error(erroBody.errorMessage || erroBody.message || "Erro ao cadastrar máquina.");
    }

    return await response.json();
  },

  selecionar: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar máquinas.");
    return await response.json();
  },

  listar: async function () {
    return this.selecionar();
  }
};