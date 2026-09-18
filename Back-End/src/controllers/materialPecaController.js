import { MaterialPeca } from "../models/materialPeca.js";
import materialPecaRepositories from "../repositories/materialPecaRepositories.js";

const materialPecaController = {
    criar: async (req, res) => {
      console.log("🔥 CHEGOU NO BACK-END! Dados recebidos:", req.body);
        try {
            const { nome, densidade, custoPerKg, custo, precoKg } = req.body;

            // Aceita variações de nome do front-end e garante tipo número
            const densidadeNum = Number(densidade) || 0;
            const custoNum = Number(custoPerKg ?? custo ?? precoKg) || 0;

            const material = MaterialPeca.criar({ 
                nome: nome?.trim(), 
                densidade: densidadeNum, 
                custoPerKg: custoNum 
            });

            const result = await materialPecaRepositories.criar(material);

            return res.status(201).json({ result });
        } catch (error) {
            console.error("Erro no cadastro de material:", error);
            return res.status(500).json({ 
                message: 'Ocorreu um erro no servidor', 
                errorMessage: error.message 
            });
        }
    },
    
    editar: async (req, res) => {
        try {
            const id = req.params.idMaterial;
            const { nome, densidade, custoPerKg, custo, precoKg } = req.body;

            const densidadeNum = Number(densidade) || 0;
            const custoNum = Number(custoPerKg ?? custo ?? precoKg) || 0;

            const material = MaterialPeca.editar({ 
                idMaterial: id, 
                nome: nome?.trim(), 
                densidade: densidadeNum, 
                custoPerKg: custoNum 
            });

            const result = await materialPecaRepositories.editar(material);

            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    
    deletar: async (req, res) => {
        try {
            const id = req.params.idMaterial;
            const result = await materialPecaRepositories.deletar(id);

            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    
    selecionar: async (req, res) => {
        try {
            const result = await materialPecaRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const id = req.params.idMaterial;
            const result = await materialPecaRepositories.selecionarUm(id);
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
};

export default materialPecaController;