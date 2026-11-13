const API_URL = 'http://localhost:8000/maquina';

let maquinasLocais = [];

const extrairId = (obj) => {
    if (!obj) return null;

    return obj.idMaquina ?? obj.id ?? obj.id_maquina ?? null;
};

export const maquinaService = {

    cadastrar: async (dados) => {
        try {
            const formData = new FormData();

            formData.append("nome", dados.nome);
            formData.append("tipoUtilizacao", dados.tipoUtilizacao);

            if (dados.tipoUtilizacao === "propria") {
                formData.append("potencialKw", dados.potencialKw);
            }

            if (dados.tipoUtilizacao === "terceiros") {
                formData.append("custoHora", dados.custoHora);
            }

            if (dados.imagem) {
                formData.append("imagem", dados.imagem);
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const resultado = await response.json();

            if (!response.ok) {
                throw new Error(
                    resultado.errorMessage || resultado.message || "Erro ao cadastrar máquina."
                );
            }

            console.log("RESPOSTA DO CADASTRO:", resultado);

            const maquinaCriada = {
                ...dados,
                idMaquina: resultado.idMaquina
            };

            maquinasLocais.unshift(maquinaCriada);

            return maquinaCriada;

        } catch (error) {
            console.error("Erro ao cadastrar máquina:", error.message);
            throw error;
        }
    },

    deletar: async (id) => {
        if (!id) {
            throw new Error("ID inválido para exclusão.");
        }

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error("Erro ao excluir máquina.");
        }

        maquinasLocais = maquinasLocais.filter(
            (m) => String(extrairId(m)) !== String(id)
        );

        return true;
    },

    selecionar: async () => {
        return await maquinaService.listar();
    },

    listar: async () => {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Erro ao buscar máquinas.");
        }

        const dados = await response.json();

        maquinasLocais = dados.result || [];

        return maquinasLocais;
    }
};
