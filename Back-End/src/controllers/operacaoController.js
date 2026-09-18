import { Operacao } from "../models/operacao.js";
import operacaoRepositories from "../repositories/operacaoRepositories.js";

const operacaoController = {
    criar: async (req, res) => {
        try {
            const { nome, tipo } = req.body;
            const operacao = Operacao.criar({ nome, tipo });
            const result = await operacaoRepositories.criar(operacao);
            res.status(201).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const id = req.params.idOperacao;
            const { nome, tipo } = req.body;
            const operacao = Operacao.editar({ idOperacao: id, nome, tipo });
            const result = await operacaoRepositories.editar(operacao);
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = req.params.idOperacao;
            const result = await operacaoRepositories.deletar(id);
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await operacaoRepositories.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const id = req.params.idOperacao;
            const result = await operacaoRepositories.selecionarUm(id);
            if (result.length === 0) return res.status(404).json({ message: "Operação não encontrada." });
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
};

export default operacaoController;