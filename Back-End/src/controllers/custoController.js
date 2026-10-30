import { Custo } from "../models/custo.js";
import custoRepositories from "../repositories/custoRepositories.js";
import { calcularVolumePeso } from "../utils/calculoVolumePeso.js";
import { obterTarifaEnergia, calcularCustoMaterial, calcularCustoMaquina } from "../utils/calculoCusto.js";

const custoController = {
    // Calcula o custo de um processo de usinagem e grava na tabela Custo.
    // Se o processo já tem custo, ele é recalculado (atualizado).
    calcular: async (req, res) => {
        try {
            const { idProcesso } = req.params;
            const tarifaEnergia = obterTarifaEnergia(req.body?.tarifaEnergia);

            const dados = await custoRepositories.buscarDadosParaCalculo(idProcesso);
            if (!dados) {
                return res.status(404).json({ message: "Processo de usinagem não encontrado (ou sem peça/máquina/material vinculados)." });
            }

            const tempoMinutos = Number(dados.tempoUsinagem);
            if (!Number.isFinite(tempoMinutos) || tempoMinutos <= 0) {
                return res.status(422).json({ message: "O processo não possui tempo de usinagem calculado." });
            }

            if (dados.tipoUtilizacao === 'terceiros' && (dados.custoHora === null || Number(dados.custoHora) < 0)) {
                return res.status(422).json({ message: "A máquina de terceiros não possui custo por hora cadastrado." });
            }

            // Material
            const { volume, peso } = calcularVolumePeso(
                dados.forma,
                {
                    comprimento: Number(dados.comprimento) || 0,
                    diametro: Number(dados.diametro) || 0,
                    largura: Number(dados.largura) || 0,
                    altura: Number(dados.altura) || 0
                },
                Number(dados.densidade)
            );
            const custoMaterial = calcularCustoMaterial(peso, dados.custoPerKg);

            // Máquina
            const maquina = calcularCustoMaquina({
                tipoUtilizacao: dados.tipoUtilizacao,
                custoHora: dados.custoHora,
                potencialKw: dados.potencialKw,
                tempoMinutos,
                tarifaEnergia
            });

            const existente = await custoRepositories.selecionarPorProcesso(idProcesso);
            let custo;
            let result;
            let status;

            if (existente.length > 0) {
                custo = Custo.editar({ idCusto: existente[0].idCusto, idProcesso, custoMaterial, custoMaquina: maquina.custo });
                result = await custoRepositories.editar(custo);
                status = 200;
            } else {
                custo = Custo.criar({ idProcesso, custoMaterial, custoMaquina: maquina.custo });
                result = await custoRepositories.criar(custo);
                status = 201;
            }

            res.status(status).json({
                message: status === 201 ? "Custo calculado com sucesso." : "Custo recalculado com sucesso.",
                result,
                custo: {
                    idProcesso: custo.idProcesso,
                    custoMaterial: custo.custoMaterial,
                    custoMaquina: custo.custoMaquina,
                    custoTotal: custo.custoTotal
                },
                detalhamento: {
                    peca: dados.nomePeca,
                    material: dados.nomeMaterial,
                    volumeCm3: volume,
                    pesoKg: peso,
                    maquina: dados.nomeMaquina,
                    tipoUtilizacao: dados.tipoUtilizacao,
                    tempoMinutos,
                    horasMaquina: maquina.horas,
                    baseCalculoMaquina: maquina.baseCalculo,
                    tarifaEnergiaKwh: maquina.tarifaEnergia
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao calcular custo.", errorMessage: error.message });
        }
    },

    // Tabela de custos completa
    selecionar: async (req, res) => {
        try {
            const result = await custoRepositories.selecionar();
            const totalGeral = result.reduce((soma, linha) => soma + Number(linha.custo_total), 0);

            res.status(200).json({ result, totalGeral: parseFloat(totalGeral.toFixed(2)) });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao listar custos.", errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const { idCusto } = req.params;
            const result = await custoRepositories.selecionarUm(idCusto);

            if (result.length === 0) {
                return res.status(404).json({ message: "Custo não encontrado." });
            }

            res.status(200).json({ result: result[0] });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao buscar custo.", errorMessage: error.message });
        }
    },

    // Resumo de uma peça final: o material entra UMA vez e as máquinas somam por processo
    resumoPecaFinal: async (req, res) => {
        try {
            const { idPecaFinal } = req.params;
            const linhas = await custoRepositories.selecionarPorPecaFinal(idPecaFinal);

            if (linhas.length === 0) {
                return res.status(404).json({ message: "Nenhum custo calculado para esta peça final." });
            }

            const custoMaterial = Number(linhas[0].custo_material);
            const custoMaquina = linhas.reduce((soma, l) => soma + Number(l.custo_maquina), 0);
            const tempoTotalMinutos = linhas.reduce((soma, l) => soma + Number(l.tempoUsinagem), 0);

            res.status(200).json({
                idPecaFinal: Number(idPecaFinal),
                processos: linhas,
                resumo: {
                    custoMaterial: parseFloat(custoMaterial.toFixed(2)),
                    custoMaquina: parseFloat(custoMaquina.toFixed(2)),
                    custoTotal: parseFloat((custoMaterial + custoMaquina).toFixed(2)),
                    tempoTotalMinutos: parseFloat(tempoTotalMinutos.toFixed(2))
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao gerar resumo de custos.", errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idCusto } = req.params;
            const result = await custoRepositories.deletar(idCusto);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Custo não encontrado." });
            }

            res.status(200).json({ message: "Custo deletado com sucesso.", result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao deletar custo.", errorMessage: error.message });
        }
    }
};

export default custoController;
