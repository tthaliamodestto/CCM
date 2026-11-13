const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    // errorMessage primeiro: é o motivo real vindo do back-end
    const detalhe = data?.errorMessage || data?.message;
    throw new Error(detalhe || `Falha na requisição (HTTP ${response.status}).`);
  }

  return data;
}

// O login atual é local (localStorage) e não tem id numérico do banco.
// Usa o idCliente da sessão se existir; senão, o padrão do .env; senão, 1.
export function obterIdCliente() {
  try {
    const sessao = JSON.parse(localStorage.getItem("ccm_session"));
    const idSessao = Number(sessao?.idCliente);
    if (Number.isInteger(idSessao) && idSessao > 0) return idSessao;
  } catch {
    /* ignora sessão inválida */
  }

  const idPadrao = Number(import.meta.env.VITE_ID_CLIENTE_PADRAO);
  if (Number.isInteger(idPadrao) && idPadrao > 0) return idPadrao;

  return 1;
}

export const pecaService = {
  listar: () => request("/peca-bruta"),

  buscarPorId: (idPeca) => request(`/peca-bruta/${idPeca}`),

  cadastrar: (peca) =>
    request("/peca-bruta", {
      method: "POST",
      body: JSON.stringify({ idCliente: obterIdCliente(), ...peca }),
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

    if (Array.isArray(resposta)) return resposta;
    if (Array.isArray(resposta?.result)) return resposta.result;
    if (Array.isArray(resposta?.data)) return resposta.data;
    if (Array.isArray(resposta?.materiais)) return resposta.materiais;

    return [];
  },

  buscarMaterialPorId: (idMaterial) => request(`/material/${idMaterial}`),
};