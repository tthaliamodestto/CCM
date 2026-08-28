import { PecaBruta } from "../models/pecaBruta.js";
import pecaBrutaRepositories from "../repositories/pecaBrutaRepositories.js";
import materialPecaRepositories from "../repositories/materialPecaRepositories.js";
import { calcularVolumePeso } from "../utils/calculoVolumePeso.js";

const pecaBrutaController = {
    criar: async (req, res) => {
        try {
            const { idMaterial, nome, forma, comprimento, diametro, largura, altura } = req.body;

            const material = await materialPecaRepositories.selecionarUm(idMaterial);
            if (!material || material.length === 0) {
                return res.status(404).json({ message: "Material não encontrado." });
            }
            
            const materialPeca = material[0];
            const dimensoes = {
                diametro: diametro || 0,
                comprimento: comprimento || 0,
                largura: largura || 0,
                altura: altura || 0
            };

            const resultadoCalculo = calcularVolumePeso(forma, dimensoes, materialPeca.densidade);
            const custoDaPeca = (resultadoCalculo.peso * materialPeca.custoPerKg).toFixed(2);
            const peca = PecaBruta.criar({ idMaterial, nome, forma, comprimento, diametro, largura, altura });
            const result = await pecaBrutaRepositories.criar(peca);

            res.status(201).json({
                message: 'Peça bruta criada com sucesso',
                result,
                calculos: {
                    volumeCm3: resultadoCalculo.volume,
                    pesoKg: resultadoCalculo.peso,
                    custoEstimadoReais: parseFloat(custoDaPeca)
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao criar peça bruta', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idPeca } = req.params;
            const { idMaterial, nome, forma, comprimento, diametro, largura, altura } = req.body;

            const material = await materialPecaRepositories.selecionarUm(idMaterial);
            if (!material || material.length === 0) {
                return res.status(404).json({ message: "Material não encontrado." });
            }
            
            const materialPeca = material[0];
            const dimensoes = {
                diametro: diametro || 0,
                comprimento: comprimento || 0,
                largura: largura || 0,
                altura: altura || 0
            };

            const resultadoCalculo = calcularVolumePeso(forma, dimensoes, materialPeca.densidade);
            const custoDaPeca = (resultadoCalculo.peso * materialPeca.custoPerKg).toFixed(2);
            const peca = PecaBruta.editar({ idPeca: idPeca, idMaterial, nome, forma, comprimento, diametro, largura, altura });
            const result = await pecaBrutaRepositories.editar(peca);

            res.status(200).json({
                message: 'Peça bruta atualizada com sucesso',
                result,
                novosCalculos: {
                    volumeCm3: resultadoCalculo.volume,
                    pesoKg: resultadoCalculo.peso,
                    custoEstimadoReais: parseFloat(custoDaPeca)
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao editar peça bruta', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idPeca } = req.params;
            const result = await pecaBrutaRepositories.deletar(idPeca);

            res.status(200).json({ message: 'Peça bruta deletada com sucesso', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao deletar peça bruta', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await pecaBrutaRepositories.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao selecionar peças brutas', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const { idPeca } = req.params;
            const result = await pecaBrutaRepositories.selecionarUm(idPeca);
            
            if (result.length === 0) {
                return res.status(404).json({ message: "Peça bruta não encontrada." });
            }
            
            res.status(200).json({ result: result[0] });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar peça bruta', errorMessage: error.message });
        }
    }
};

export default pecaBrutaController;