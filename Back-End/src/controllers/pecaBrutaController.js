import { PecaBruta } from "../models/pecaBruta.js";
import pecaBrutaRepositories from "../repositories/pecaBrutaRepositories.js";
import materialPecaRepositories from "../repositories/materialPecaRepositories.js";
import { calcularVolumePeso } from "../utils/calculoVolumePeso.js";

const pecaBrutaController = {
    criar: async (req, res) => {
        try {
            // Recebe idCliente no req.body
            const { idMaterial, idCliente, nome, forma, comprimento, diametro, largura, altura } = req.body;

            const material = await materialPecaRepositories.selecionarUm(idMaterial);
            if (material.length === 0) {
                return res.status(404).json({ message: "Material não encontrado." });
            }

            const resultadoCalculo = calcularVolumePeso(forma, dimensoes, materialPeca.densidade);
            const custoDaPeca = (resultadoCalculo.peso * materialPeca.custoPerKg).toFixed(2);

            // Adicionado idCliente na criação
            const peca = PecaBruta.criar({ idMaterial, idCliente, nome, forma, comprimento, diametro, largura, altura });
            const result = await pecaBrutaRepositories.criar(peca);

            const result = await pecaBrutaRepositories.criar(peca);
            return res.status(201).json({
                message: "Peça bruta criada com sucesso.",
                result,
                calculos: { volumeCm3: calculos.volume, pesoKg: calculos.peso, custoEstimadoReais }
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Não foi possível criar a peça bruta.", errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idPeca } = req.params;
            // Recebe idCliente no req.body
            const { idMaterial, idCliente, nome, forma, comprimento, diametro, largura, altura } = req.body;

            const pecaAtual = await pecaBrutaRepositories.selecionarUm(idPeca);
            if (pecaAtual.length === 0) {
                return res.status(404).json({ message: "Peça bruta não encontrada." });
            }
            const material = await materialPecaRepositories.selecionarUm(idMaterial);
            if (material.length === 0) {
                return res.status(404).json({ message: "Material não encontrado." });
            }

            const resultadoCalculo = calcularVolumePeso(forma, dimensoes, materialPeca.densidade);
            const custoDaPeca = (resultadoCalculo.peso * materialPeca.custoPerKg).toFixed(2);

            // Adicionado idCliente no objeto de edição
            const peca = PecaBruta.editar({ idPeca, idMaterial, idCliente, nome, forma, comprimento, diametro, largura, altura });
            const result = await pecaBrutaRepositories.editar(peca);
            return res.status(200).json({
                message: "Peça bruta atualizada com sucesso.",
                result,
                calculos: { volumeCm3: calculos.volume, pesoKg: calculos.peso, custoEstimadoReais }
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Não foi possível atualizar a peça bruta.", errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idPeca } = req.params;
            const peca = await pecaBrutaRepositories.selecionarUm(idPeca);
            if (peca.length === 0) {
                return res.status(404).json({ message: "Peça bruta não encontrada." });
            }
            const result = await pecaBrutaRepositories.deletar(idPeca);
            return res.status(200).json({ message: "Peça bruta deletada com sucesso.", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao deletar peça bruta.", errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await pecaBrutaRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar peças brutas.", errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const { idPeca } = req.params;
            const result = await pecaBrutaRepositories.selecionarUm(idPeca);
            if (result.length === 0) {
                return res.status(404).json({ message: "Peça bruta não encontrada." });
            }
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar peça bruta.", errorMessage: error.message });
        }
    }
};

export default pecaBrutaController;
