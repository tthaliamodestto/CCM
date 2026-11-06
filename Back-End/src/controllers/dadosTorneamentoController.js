import { DadosTorneamento } from "../models/dadosTorneamento.js";
import dadosTorneamentoRepositories from "../repositories/dadosTorneamentoRepositories.js";
import operacaoProcessoRepositories from "../repositories/operacaoProcessoRepositories.js";
import parametroCorteRepositories from "../repositories/parametroCorteRepositories.js";
import operacaoRepositories from "../repositories/operacaoRepositories.js";

const dadosTorneamentoController = {

    criar: async (req, res) => {
        try {
            const { idOperacaoProcesso, comprimentoTorneamento, diametroInicial, diametroFinal } = req.body;
            const etapa = await operacaoProcessoRepositories.selecionarUm(idOperacaoProcesso);
            if (!etapa || etapa.length === 0) {
                return res.status(404).json({ message: "Operação do processo não encontrada." });
            }
            const parametro = await parametroCorteRepositories.selecionarUm(etapa[0].idParametro);
            if (!parametro || parametro.length === 0) {
                return res.status(404).json({ message: "Parâmetro de corte não encontrado." });
            }
            const operacao = await operacaoRepositories.selecionarUm(parametro[0].idOperacao);
            if (!operacao || operacao.length === 0 || operacao[0].tipo !== "torneamento_longitudinal") {
                return res.status(400).json({ message: "Dados incompatíveis com o tipo de operação selecionado." });
            }
            const registros = await dadosTorneamentoRepositories.selecionar();
            if (registros.some(r => Number(r.idOperacaoProcesso) === Number(idOperacaoProcesso))) {
                return res.status(409).json({ message: "Esta operação já possui dados cadastrados." });
            }
            if (Number(diametroInicial) <= Number(diametroFinal)) {
                return res.status(400).json({ message: "O diâmetro inicial deve ser maior que o final no torneamento." });
            }
            let registro;
            try {
                registro = DadosTorneamento.criar({ idOperacaoProcesso, comprimentoTorneamento, diametroInicial, diametroFinal });
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            const result = await dadosTorneamentoRepositories.criar(registro);
            res.status(201).json({ message: "Dados de torneamento cadastrados com sucesso.", result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao cadastrar dados de torneamento.", errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idDadosTorneamento } = req.params;
            const existente = await dadosTorneamentoRepositories.selecionarUm(idDadosTorneamento);
            if (!existente || existente.length === 0) {
                return res.status(404).json({ message: "Dados de torneamento não encontrados." });
            }
            const { idOperacaoProcesso, comprimentoTorneamento, diametroInicial, diametroFinal } = req.body;
            const etapa = await operacaoProcessoRepositories.selecionarUm(idOperacaoProcesso);
            if (!etapa || etapa.length === 0) {
                return res.status(404).json({ message: "Operação do processo não encontrada." });
            }
            const parametro = await parametroCorteRepositories.selecionarUm(etapa[0].idParametro);
            if (!parametro || parametro.length === 0) {
                return res.status(404).json({ message: "Parâmetro de corte não encontrado." });
            }
            const operacao = await operacaoRepositories.selecionarUm(parametro[0].idOperacao);
            if (!operacao || operacao.length === 0 || operacao[0].tipo !== "torneamento_longitudinal") {
                return res.status(400).json({ message: "Dados incompatíveis com o tipo de operação selecionado." });
            }
            const registros = await dadosTorneamentoRepositories.selecionar();
            if (registros.some(r => Number(r.idOperacaoProcesso) === Number(idOperacaoProcesso) && Number(r.idDadosTorneamento) !== Number(idDadosTorneamento))) {
                return res.status(409).json({ message: "Esta operação já possui outro registro de dados." });
            }
            if (Number(diametroInicial) <= Number(diametroFinal)) {
                return res.status(400).json({ message: "O diâmetro inicial deve ser maior que o final no torneamento." });
            }
            let registro;
            try {
                registro = DadosTorneamento.editar({ idDadosTorneamento, idOperacaoProcesso, comprimentoTorneamento, diametroInicial, diametroFinal });
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            const result = await dadosTorneamentoRepositories.editar(registro);
            res.status(200).json({ message: "Dados de torneamento atualizados com sucesso.", result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao editar dados de torneamento.", errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idDadosTorneamento } = req.params;
            const existente = await dadosTorneamentoRepositories.selecionarUm(idDadosTorneamento);
            if (!existente || existente.length === 0) {
                return res.status(404).json({ message: "Dados de torneamento não encontrados." });
            }
            const result = await dadosTorneamentoRepositories.deletar(idDadosTorneamento);
            res.status(200).json({ message: "Dados de torneamento excluídos com sucesso.", result });
        } catch (error) {
            console.error(error);
            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({ message: "Não é possível excluir um registro que ainda possui dados vinculados." });
            }
            res.status(500).json({ message: "Erro ao excluir dados de torneamento.", errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await dadosTorneamentoRepositories.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao selecionar dados de torneamento.", errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const { idDadosTorneamento } = req.params;
            const result = await dadosTorneamentoRepositories.selecionarUm(idDadosTorneamento);
            if (!result || result.length === 0) {
                return res.status(404).json({ message: "Dados de torneamento não encontrados." });
            }
            res.status(200).json({ result: result[0] });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao buscar dados de torneamento.", errorMessage: error.message });
        }
    }
};

export default dadosTorneamentoController;
