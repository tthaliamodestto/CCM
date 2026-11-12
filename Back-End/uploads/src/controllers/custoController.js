import { Custo } from '../models/custo.js';
import custoRepositories from '../repositories/custoRepositories.js';
import processoUsinagemRepositories from '../repositories/processoUsinagemRepositories.js';
import { calcularVolumePeso } from '../utils/calculoVolumePeso.js';
import { obterTarifaEnergia, calcularCustoMaterial, calcularCustoMaquina } from '../utils/calculoCusto.js';

const custoController = {
    calcular: async (req, res) => {
        try {
            const { idProcesso } = req.params;
            const dados = await custoRepositories.buscarDadosParaCalculo(idProcesso);
            if (!dados) return res.status(404).json({ message: 'Processo de usinagem ou dados da peça/material não encontrados.' });

            const operacoes = await custoRepositories.buscarOperacoesParaCalculo(idProcesso);
            if (operacoes.length === 0) return res.status(422).json({ message: 'Cadastre ao menos uma operação para calcular os custos.' });

            const { volume, peso } = calcularVolumePeso(dados.forma, {
                comprimento: Number(dados.comprimento),
                diametro: Number(dados.diametro) || 0,
                largura: Number(dados.largura) || 0,
                altura: Number(dados.altura) || 0
            }, Number(dados.densidade));
            const custoMaterial = calcularCustoMaterial(peso, Number(dados.custoPerKg));

            let tarifaEnergiaAplicada = null;
            let custoMaquina = 0;
            const detalhamentoMaquinas = [];

            for (const operacao of operacoes) {
                const tempoMinutos = Number(operacao.tempoUsinagem);
                if (!Number.isFinite(tempoMinutos) || tempoMinutos <= 0) {
                    return res.status(422).json({
                        message: `A operação ${operacao.idOperacaoProcesso} ainda não possui tempo de usinagem calculado.`
                    });
                }

                if (operacao.tipoUtilizacao === 'propria' && tarifaEnergiaAplicada === null) {
                    tarifaEnergiaAplicada = obterTarifaEnergia(req.body?.tarifaEnergia);
                }

                const calculo = calcularCustoMaquina({
                    tipoUtilizacao: operacao.tipoUtilizacao,
                    custoHora: operacao.custoHora,
                    potencialKw: operacao.potencialKw,
                    tempoMinutos,
                    tarifaEnergia: tarifaEnergiaAplicada ?? req.body?.tarifaEnergia
                });
                custoMaquina += calculo.custo;
                detalhamentoMaquinas.push({
                    idOperacaoProcesso: operacao.idOperacaoProcesso,
                    maquina: operacao.nomeMaquina,
                    tipoUtilizacao: operacao.tipoUtilizacao,
                    tempoMinutos,
                    custo: calculo.custo,
                    baseCalculo: calculo.baseCalculo
                });
            }

            custoMaquina = Number(custoMaquina.toFixed(2));
            const existente = await custoRepositories.selecionarPorProcesso(idProcesso);
            const custo = existente.length > 0
                ? Custo.editar({ idCusto: existente[0].idCusto, idProcesso, custoMaterial, custoMaquina, tarifaEnergiaAplicada })
                : Custo.criar({ idProcesso, custoMaterial, custoMaquina, tarifaEnergiaAplicada });
            const result = existente.length > 0
                ? await custoRepositories.editar(custo)
                : await custoRepositories.criar(custo);

            return res.status(existente.length > 0 ? 200 : 201).json({
                message: existente.length > 0 ? 'Custo recalculado com sucesso.' : 'Custo calculado com sucesso.',
                result,
                custo: {
                    idProcesso: custo.idProcesso,
                    custoMaterial: custo.custoMaterial,
                    custoMaquina: custo.custoMaquina,
                    custoTotal: custo.custoTotal,
                    tarifaEnergiaAplicada: custo.tarifaEnergiaAplicada
                },
                detalhamento: {
                    peca: dados.nomePeca,
                    material: dados.nomeMaterial,
                    volumeCm3: volume,
                    pesoKg: peso,
                    maquinas: detalhamentoMaquinas
                }
            });
        } catch (error) {
            return res.status(422).json({ message: 'Erro ao calcular custo.', errorMessage: error.message });
        }
    },

    criar: async (req, res) => {
        try {
            const { idProcesso, custoMaterial, custoMaquina, tarifaEnergiaAplicada = null } = req.body;
            const processo = await processoUsinagemRepositories.selecionarUm(idProcesso);
            if (processo.length === 0) return res.status(404).json({ message: 'Processo de usinagem não encontrado.' });
            const existente = await custoRepositories.selecionarPorProcesso(idProcesso);
            if (existente.length > 0) return res.status(409).json({ message: 'Este processo já possui um custo cadastrado. Use PUT para atualizar ou a rota de cálculo.' });
            const custo = Custo.criar({ idProcesso, custoMaterial, custoMaquina, tarifaEnergiaAplicada });
            const result = await custoRepositories.criar(custo);
            return res.status(201).json({ message: 'Custo cadastrado com sucesso.', idCusto: result.insertId, custoTotal: custo.custoTotal });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível cadastrar o custo.', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idCusto } = req.params;
            const atual = await custoRepositories.selecionarUm(idCusto);
            if (atual.length === 0) return res.status(404).json({ message: 'Custo não encontrado.' });
            const dados = { ...atual[0], ...req.body, idCusto };
            const custo = Custo.editar(dados);
            const result = await custoRepositories.editar(custo);
            return res.status(200).json({ message: 'Custo atualizado com sucesso.', result, custoTotal: custo.custoTotal });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível atualizar o custo.', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await custoRepositories.selecionar();
            const totalGeral = result.reduce((soma, linha) => soma + Number(linha.custoTotal), 0);
            return res.status(200).json({ result, totalGeral: Number(totalGeral.toFixed(2)) });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao listar custos.', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const result = await custoRepositories.selecionarUm(req.params.idCusto);
            if (result.length === 0) return res.status(404).json({ message: 'Custo não encontrado.' });
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar custo.', errorMessage: error.message });
        }
    },

    resumoPecaFinal: async (req, res) => {
        try {
            const linhas = await custoRepositories.selecionarPorPecaFinal(req.params.idPecaFinal);
            if (linhas.length === 0) return res.status(404).json({ message: 'Nenhum custo calculado para esta peça final.' });
            const custoMaterial = Number(linhas.reduce((maior, linha) => Math.max(maior, Number(linha.custoMaterial)), 0));
            const custoMaquina = linhas.reduce((soma, linha) => soma + Number(linha.custoMaquina), 0);
            const tempoTotalMinutos = linhas.reduce((soma, linha) => soma + Number(linha.tempoUsinagem), 0);
            return res.status(200).json({
                idPecaFinal: Number(req.params.idPecaFinal),
                processos: linhas,
                resumo: {
                    custoMaterial: Number(custoMaterial.toFixed(2)),
                    custoMaquina: Number(custoMaquina.toFixed(2)),
                    custoTotal: Number((custoMaterial + custoMaquina).toFixed(2)),
                    tempoTotalMinutos: Number(tempoTotalMinutos.toFixed(2))
                }
            });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao gerar resumo de custos.', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const result = await custoRepositories.deletar(req.params.idCusto);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Custo não encontrado.' });
            return res.status(200).json({ message: 'Custo deletado com sucesso.', result });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar custo.', errorMessage: error.message });
        }
    }
};

export default custoController;
