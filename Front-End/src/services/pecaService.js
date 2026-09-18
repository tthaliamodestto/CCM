const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.errorMessage || "Não foi possível concluir a requisição."
    );
  }

  return data;
}

export const pecaService = {
  listar: () => request("/peca-bruta"),

  buscarPorId: (idPeca) => request(`/peca-bruta/${idPeca}`),

  cadastrar: (peca) =>
    request("/peca-bruta", {
      method: "POST",
      body: JSON.stringify(peca),
    }),

  editar: (idPeca, peca) =>
    request(`/peca-bruta/${idPeca}`, {
      method: "PUT",
      body: JSON.stringify(peca),
    }),

  deletar: (idPeca) =>
    request(`/peca-bruta/${idPeca}`, {
      method: "DELETE",
    }),

  listarMateriais: async () => {
    const resposta = await request("/material");

    if (Array.isArray(resposta)) {
      return resposta;
    }
    if (resposta && Array.isArray(resposta.result)) {
      return resposta.result;
    }
    if (resposta && Array.isArray(resposta.data)) {
      return resposta.data;
    }
    if (resposta && Array.isArray(resposta.materiais)) {
      return resposta.materiais;
    }

    return [];
  },

  buscarMaterialPorId: (idMaterial) => request(`/material/${idMaterial}`),
};