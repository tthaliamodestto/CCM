
import { MaterialPeca } from "../models/materialPeca.js";
import materialPecaRepositories from "../repositories/materialPecaRepositories.js";

const materialPecaController = {

    criar: async (req, res) => {
        try {
            const { nome, densidade, custoPerKg } = req.body;

            const imagem = req.file
                ? `/uploads/images/${req.file.filename}`
                : null;

            const materialPeca = MaterialPeca.criar({
                nome,
                densidade,
                custoPerKg,
                imagem
            });

            const result = await materialPecaRepositories.criar(materialPeca);

            res.status(201).json({ result });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    },

    editar: async (req, res) => {
        try {
            const id = req.params.idMaterial;

            const { nome, densidade, custoPerKg } = req.body;

            const materialPeca = MaterialPeca.editar({
                idMaterial: id,
                nome,
                densidade,
                custoPerKg
            });

            const result = await materialPecaRepositories.editar(materialPeca);

            res.status(200).json({ result });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = req.params.idMaterial;

            const result = await materialPecaRepositories.deletar(id);

            res.status(200).json({ result });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await materialPecaRepositories.selecionar();

            res.status(200).json({ result });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const id = req.params.idMaterial;

            const result = await materialPecaRepositories.selecionarUm(id);

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Material da peça não encontrado."
                });
            }

            res.status(200).json({ result });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    }
};

export default materialPecaController;
