import { MaterialPeca } from "../models/materialPeca.js";
import materialPecaRepositories from "../repositories/materialPecaRepositories.js";

const materialPecaController = {
    criar: async (req, res) => {
        try {
            const { nome, densidade, custoPerKg } = req.body;
            const imagem = req.file ? `/uploads/images/${req.file.filename}` : null;

            const material = MaterialPeca.criar({ nome, densidade, custoPerKg, imagem });
            const result = await materialPecaRepositories.criar(material);

            return res.status(201).json({ message: "Material cadastrado com sucesso.", result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Não foi possível cadastrar o material.", errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idMaterial } = req.params;
            const { nome, densidade, custoPerKg } = req.body;

            const materialAtual = await materialPecaRepositories.selecionarUm(idMaterial);
            if (materialAtual.length === 0) {
                return res.status(404).json({ message: "Material não encontrado." });
            }

            const imagem = req.file
                ? `/uploads/images/${req.file.filename}`
                : materialAtual[0].imagem;

            const material = MaterialPeca.editar({ idMaterial, nome, densidade, custoPerKg, imagem });
            const result = await materialPecaRepositories.editar(material);

            return res.status(200).json({ message: "Material atualizado com sucesso.", result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Não foi possível atualizar o material.", errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idMaterial } = req.params;
            const material = await materialPecaRepositories.selecionarUm(idMaterial);
            if (material.length === 0) {
                return res.status(404).json({ message: "Material não encontrado." });
            }

            const result = await materialPecaRepositories.deletar(idMaterial);
            return res.status(200).json({ message: "Material deletado com sucesso.", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao deletar material.", errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await materialPecaRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar materiais.", errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const { idMaterial } = req.params;
            const result = await materialPecaRepositories.selecionarUm(idMaterial);
            if (result.length === 0) {
                return res.status(404).json({ message: "Material não encontrado." });
            }
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar material.", errorMessage: error.message });
        }
    }
};

export default materialPecaController;
