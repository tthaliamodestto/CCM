import { DadosFaceamento } from "../models/dadosFaceamento.js";
import dadosFaceamentoRepositories from "../repositories/dadosFaceamentoRepositories.js";
import operacaoProcessoRepositories from "../repositories/operacaoProcessoRepositories.js";
import parametroCorteRepositories from "../repositories/parametroCorteRepositories.js";
import operacaoRepositories from "../repositories/operacaoRepositories.js";
import { recalcularOperacaoProcesso } from "../utils/recalcularOperacaoProcesso.js";

const dadosFaceamentoController = {

    criar: async (req, res) => {
        try {
            const { idOperacaoProcesso, diametroFaceamento, espessuraFaceada } = req.body;
            const etapa = await operacaoProcessoRepositories.selecionarUm(idOperacaoProcesso);
            if (!etapa || etapa.length === 0) {
                return res.status(404).json({ message: "Operação do processo não encontrada." });
            }
            const parametro = await parametroCorteRepositories.selecionarUm(etapa[0].idParametro);
            if (!parametro || parametro.length === 0) {
                return res.status(404).json({ message: "Parâmetro de corte não encontrado." });
            }
            const operacao = await operacaoRepositories.selecionarUm(parametro[0].idOperacao);
            if (!operacao || operacao.length === 0 || operacao[0].tipo !== "faceamento") {
                return res.status(400).json({ message: "Dados incompatíveis com o tipo de operação selecionado." });
            }
            const registros = await dadosFaceamentoRepositories.selecionar();
            if (registros.some(r => Number(r.idOperacaoProcesso) === Number(idOperacaoProcesso))) {
                return res.status(409).json({ message: "Esta operação já possui dados cadastrados." });
            }
            let registro;
            try {
                registro = DadosFaceamento.criar({ idOperacaoProcesso, diametroFaceamento, espessuraFaceada });
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            const result = await dadosFaceamentoRepositories.criar(registro);
            let calculos = null;
            try { calculos = await recalcularOperacaoProcesso(idOperacaoProcesso); } catch (erroCalculo) { console.warn('Cálculo pendente: ' + erroCalculo.message); }
            res.status(201).json({ message: "Dados de faceamento cadastrados com sucesso.", result, calculos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao cadastrar dados de faceamento.", errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idDadosFaceamento } = req.params;
            const existente = await dadosFaceamentoRepositories.selecionarUm(idDadosFaceamento);
            if (!existente || existente.length === 0) {
                return res.status(404).json({ message: "Dados de faceamento não encontrados." });
            }
            const { idOperacaoProcesso, diametroFaceamento, espessuraFaceada } = req.body;
            const etapa = await operacaoProcessoRepositories.selecionarUm(idOperacaoProcesso);
            if (!etapa || etapa.length === 0) {
                return res.status(404).json({ message: "Operação do processo não encontrada." });
            }
            const parametro = await parametroCorteRepositories.selecionarUm(etapa[0].idParametro);
            if (!parametro || parametro.length === 0) {
                return res.status(404).json({ message: "Parâmetro de corte não encontrado." });
            }
            const operacao = await operacaoRepositories.selecionarUm(parametro[0].idOperacao);
            if (!operacao || operacao.length === 0 || operacao[0].tipo !== "faceamento") {
                return res.status(400).json({ message: "Dados incompatíveis com o tipo de operação selecionado." });
            }
            const registros = await dadosFaceamentoRepositories.selecionar();
            if (registros.some(r => Number(r.idOperacaoProcesso) === Number(idOperacaoProcesso) && Number(r.idDadosFaceamento) !== Number(idDadosFaceamento))) {
                return res.status(409).json({ message: "Esta operação já possui outro registro de dados." });
            }
            let registro;
            try {
                registro = DadosFaceamento.editar({ idDadosFaceamento, idOperacaoProcesso, diametroFaceamento, espessuraFaceada });
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            const result = await dadosFaceamentoRepositories.editar(registro);
            let calculos = null;
            try { calculos = await recalcularOperacaoProcesso(idOperacaoProcesso); } catch (erroCalculo) { console.warn('Cálculo pendente: ' + erroCalculo.message); }
            res.status(200).json({ message: "Dados de faceamento atualizados com sucesso.", result, calculos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao editar dados de faceamento.", errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idDadosFaceamento } = req.params;
            const existente = await dadosFaceamentoRepositories.selecionarUm(idDadosFaceamento);
            if (!existente || existente.length === 0) {
                return res.status(404).json({ message: "Dados de faceamento não encontrados." });
            }
            const result = await dadosFaceamentoRepositories.deletar(idDadosFaceamento);
            res.status(200).json({ message: "Dados de faceamento excluídos com sucesso.", result });
        } catch (error) {
            console.error(error);
            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({ message: "Não é possível excluir um registro que ainda possui dados vinculados." });
            }
            res.status(500).json({ message: "Erro ao excluir dados de faceamento.", errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await dadosFaceamentoRepositories.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao selecionar dados de faceamento.", errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const { idDadosFaceamento } = req.params;
            const result = await dadosFaceamentoRepositories.selecionarUm(idDadosFaceamento);
            if (!result || result.length === 0) {
                return res.status(404).json({ message: "Dados de faceamento não encontrados." });
            }
            res.status(200).json({ result: result[0] });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao buscar dados de faceamento.", errorMessage: error.message });
        }
    }
};

export default dadosFaceamentoController;
