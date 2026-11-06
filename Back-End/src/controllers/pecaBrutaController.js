import { PecaBruta } from "../models/pecaBruta.js";
import pecaBrutaRepositories from "../repositories/pecaBrutaRepositories.js";
import materialPecaRepositories from "../repositories/materialPecaRepositories.js";
import { calcularVolumePeso } from "../utils/calculoVolumePeso.js";

const pecaBrutaController = {
    criar: async (req, res) => {
        try {
            const { idMaterial, nome, forma, comprimento, diametro, largura, altura } = req.body;
            const material = await materialPecaRepositories.selecionarUm(idMaterial);
            if (material.length === 0) {
                return res.status(404).json({ message: "Material não encontrado." });
            }

            const peca = PecaBruta.criar({ idMaterial, nome, forma, comprimento, diametro, largura, altura });
            const calculos = calcularVolumePeso(peca.forma, {
                comprimento: peca.comprimento,
                diametro: peca.diametro || 0,
                largura: peca.largura || 0,
                altura: peca.altura || 0
            }, material[0].densidade);
            const custoEstimadoReais = Number((calculos.peso * Number(material[0].custoPerKg)).toFixed(2));

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
            const { idMaterial, nome, forma, comprimento, diametro, largura, altura } = req.body;

            const pecaAtual = await pecaBrutaRepositories.selecionarUm(idPeca);
            if (pecaAtual.length === 0) {
                return res.status(404).json({ message: "Peça bruta não encontrada." });
            }
            const material = await materialPecaRepositories.selecionarUm(idMaterial);
            if (material.length === 0) {
                return res.status(404).json({ message: "Material não encontrado." });
            }

            const peca = PecaBruta.editar({ idPeca, idMaterial, nome, forma, comprimento, diametro, largura, altura });
            const calculos = calcularVolumePeso(peca.forma, {
                comprimento: peca.comprimento,
                diametro: peca.diametro || 0,
                largura: peca.largura || 0,
                altura: peca.altura || 0
            }, material[0].densidade);
            const custoEstimadoReais = Number((calculos.peso * Number(material[0].custoPerKg)).toFixed(2));

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
