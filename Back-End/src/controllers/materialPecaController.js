import { MaterialPeca } from "../models/materialPeca.js";
import materialPecaRepositories from "../repositories/materialPecaRepositories.js";

const materialPecaController = {
    criar: async (req, res) => {
        try {
            const { nome, medidas, custoPerKg } = req.body;
            const material = MaterialPeca.criar({ nome, medidas, custoPerKg });
            const result = await materialPecaRepositories.criar(material);

            res.status(201).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    
    editar: async (req, res) => {
        try {
            const id = req.params.idMaterial;
            const { nome, medidas, custoPerKg } = req.body;
            const material = MaterialPeca.editar({ idMaterial: id, nome, medidas, custoPerKg });
            const result = await materialPecaRepositories.editar(material);

            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    
    deletar: async (req, res) => {
        try {
            const id = req.params.idMaterial;
            const result = await materialPecaRepositories.deletar(id);

            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    
    selecionar: async (req, res) => {
        try {
            const result = await materialPecaRepositories.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const id = req.params.idMaterial;
            const result = await materialPecaRepositories.selecionarUm(id);
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
};

export default materialPecaController;