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

            res.status(201).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
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
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = req.params.idPecaFinal;
            const result = await pecaFinalRepositories.deletar(id);

            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await pecaFinalRepositories.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const id = req.params.idPecaFinal;
            const result = await pecaFinalRepositories.selecionarUm(id);
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
};

export default pecaFinalController;