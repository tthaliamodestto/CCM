const API_URL = "http://localhost:8000/operacao";

const operacaoService = {
    cadastrar: async (dados) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(
                resultado.errorMessage || resultado.message || "Erro ao cadastrar operação."
            );
        }

        return resultado;
    },

    editar: async (idOperacao, dados) => {
        const response = await fetch(`${API_URL}/${idOperacao}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(
                resultado.errorMessage || resultado.message || "Erro ao editar operação."
            );
        }

        return resultado;
    },

    deletar: async (idOperacao) => {
        const response = await fetch(`${API_URL}/${idOperacao}`, {
            method: "DELETE"
        });

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(
                resultado.errorMessage || resultado.message || "Erro ao excluir operação."
            );
        }

        return resultado;
    },

    selecionar: async () => {
        const response = await fetch(API_URL);

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(
                resultado.errorMessage || resultado.message || "Erro ao buscar operações."
            );
        }

        return resultado.result || [];
    }
};

export default operacaoService;
