import { PecaFinal } from "../models/pecaFinal.js";
import pecaFinalRepositories from "../repositories/pecaFinalRepositories.js";

const pecaFinalController = {
    criar: async (req, res) => {
        try {
            // Adicionado idCliente na desestruturação
            const { idPeca, idCliente, nome, profundidadeFinal, alturaFinal, diametroFinal, larguraFinal } = req.body;
            const imagem = req.file ? `/uploads/images/${req.file.filename}` : null;

            // Passando idCliente para o model
            const peca = PecaFinal.criar({ idPeca, idCliente, nome, profundidadeFinal, alturaFinal, diametroFinal, larguraFinal, imagem });
            const result = await pecaFinalRepositories.criar(peca);

            const pecaFinal = PecaFinal.criar({ nome, forma, comprimentoFinal, diametroMaximoFinal, larguraFinal, alturaFinal, imagem });
            const result = await pecaFinalRepositories.criar(pecaFinal);
            return res.status(201).json({ message: "Peça final cadastrada com sucesso.", result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Não foi possível cadastrar a peça final.", errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const id = req.params.idPecaFinal;
            // Adicionado idCliente na desestruturação
            const { idPeca, idCliente, nome, profundidadeFinal, alturaFinal, diametroFinal, larguraFinal } = req.body;

            // Passando idCliente para o model
            const peca = PecaFinal.editar({ idPecaFinal: id, idPeca, idCliente, nome, profundidadeFinal, alturaFinal, diametroFinal, larguraFinal });
            const result = await pecaFinalRepositories.editar(peca);

            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Não foi possível atualizar a peça final.", errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idPecaFinal } = req.params;
            const peca = await pecaFinalRepositories.selecionarUm(idPecaFinal);
            if (peca.length === 0) {
                return res.status(404).json({ message: "Peça final não encontrada." });
            }
            const result = await pecaFinalRepositories.deletar(idPecaFinal);
            return res.status(200).json({ message: "Peça final deletada com sucesso.", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao deletar peça final.", errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await pecaFinalRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar peças finais.", errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const { idPecaFinal } = req.params;
            const result = await pecaFinalRepositories.selecionarUm(idPecaFinal);
            if (result.length === 0) {
                return res.status(404).json({ message: "Peça final não encontrada." });
            }
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar peça final.", errorMessage: error.message });
        }
    }
};

export default pecaFinalController;
