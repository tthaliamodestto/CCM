import { DadosFuracao } from "../models/dadosFuracao.js";
import dadosFuracaoRepositories from "../repositories/dadosFuracaoRepositories.js";
import operacaoProcessoRepositories from "../repositories/operacaoProcessoRepositories.js";
import parametroCorteRepositories from "../repositories/parametroCorteRepositories.js";
import operacaoRepositories from "../repositories/operacaoRepositories.js";
import { recalcularOperacaoProcesso } from "../utils/recalcularOperacaoProcesso.js";

const dadosFuracaoController = {

    criar: async (req, res) => {
        try {
            const { idOperacaoProcesso, diametroFuro, profundidadeFuro, quantidadeFuros = 1 } = req.body;
            const etapa = await operacaoProcessoRepositories.selecionarUm(idOperacaoProcesso);
            if (!etapa || etapa.length === 0) {
                return res.status(404).json({ message: "Operação do processo não encontrada." });
            }
            const parametro = await parametroCorteRepositories.selecionarUm(etapa[0].idParametro);
            if (!parametro || parametro.length === 0) {
                return res.status(404).json({ message: "Parâmetro de corte não encontrado." });
            }
            const operacao = await operacaoRepositories.selecionarUm(parametro[0].idOperacao);
            if (!operacao || operacao.length === 0 || operacao[0].tipo !== "furacao") {
                return res.status(400).json({ message: "Dados incompatíveis com o tipo de operação selecionado." });
            }
            const registros = await dadosFuracaoRepositories.selecionar();
            if (registros.some(r => Number(r.idOperacaoProcesso) === Number(idOperacaoProcesso))) {
                return res.status(409).json({ message: "Esta operação já possui dados cadastrados." });
            }
            let registro;
            try {
                registro = DadosFuracao.criar({ idOperacaoProcesso, diametroFuro, profundidadeFuro, quantidadeFuros });
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            const result = await dadosFuracaoRepositories.criar(registro);
            let calculos = null;
            try { calculos = await recalcularOperacaoProcesso(idOperacaoProcesso); } catch (erroCalculo) { console.warn('Cálculo pendente: ' + erroCalculo.message); }
            res.status(201).json({ message: "Dados de furação cadastrados com sucesso.", result, calculos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao cadastrar dados de furação.", errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idDadosFuracao } = req.params;
            const existente = await dadosFuracaoRepositories.selecionarUm(idDadosFuracao);
            if (!existente || existente.length === 0) {
                return res.status(404).json({ message: "Dados de furação não encontrados." });
            }
            const { idOperacaoProcesso, diametroFuro, profundidadeFuro, quantidadeFuros = 1 } = req.body;
            const etapa = await operacaoProcessoRepositories.selecionarUm(idOperacaoProcesso);
            if (!etapa || etapa.length === 0) {
                return res.status(404).json({ message: "Operação do processo não encontrada." });
            }
            const parametro = await parametroCorteRepositories.selecionarUm(etapa[0].idParametro);
            if (!parametro || parametro.length === 0) {
                return res.status(404).json({ message: "Parâmetro de corte não encontrado." });
            }
            const operacao = await operacaoRepositories.selecionarUm(parametro[0].idOperacao);
            if (!operacao || operacao.length === 0 || operacao[0].tipo !== "furacao") {
                return res.status(400).json({ message: "Dados incompatíveis com o tipo de operação selecionado." });
            }
            const registros = await dadosFuracaoRepositories.selecionar();
            if (registros.some(r => Number(r.idOperacaoProcesso) === Number(idOperacaoProcesso) && Number(r.idDadosFuracao) !== Number(idDadosFuracao))) {
                return res.status(409).json({ message: "Esta operação já possui outro registro de dados." });
            }
            let registro;
            try {
                registro = DadosFuracao.editar({ idDadosFuracao, idOperacaoProcesso, diametroFuro, profundidadeFuro, quantidadeFuros });
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            const result = await dadosFuracaoRepositories.editar(registro);
            let calculos = null;
            try { calculos = await recalcularOperacaoProcesso(idOperacaoProcesso); } catch (erroCalculo) { console.warn('Cálculo pendente: ' + erroCalculo.message); }
            res.status(200).json({ message: "Dados de furação atualizados com sucesso.", result, calculos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao editar dados de furação.", errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idDadosFuracao } = req.params;
            const existente = await dadosFuracaoRepositories.selecionarUm(idDadosFuracao);
            if (!existente || existente.length === 0) {
                return res.status(404).json({ message: "Dados de furação não encontrados." });
            }
            const result = await dadosFuracaoRepositories.deletar(idDadosFuracao);
            res.status(200).json({ message: "Dados de furação excluídos com sucesso.", result });
        } catch (error) {
            console.error(error);
            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({ message: "Não é possível excluir um registro que ainda possui dados vinculados." });
            }
            res.status(500).json({ message: "Erro ao excluir dados de furação.", errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await dadosFuracaoRepositories.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao selecionar dados de furação.", errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const { idDadosFuracao } = req.params;
            const result = await dadosFuracaoRepositories.selecionarUm(idDadosFuracao);
            if (!result || result.length === 0) {
                return res.status(404).json({ message: "Dados de furação não encontrados." });
            }
            res.status(200).json({ result: result[0] });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao buscar dados de furação.", errorMessage: error.message });
        }
    }
};

export default dadosFuracaoController;
