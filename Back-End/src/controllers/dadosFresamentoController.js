import { DadosFresamento } from "../models/dadosFresamento.js";
import dadosFresamentoRepositories from "../repositories/dadosFresamentoRepositories.js";
import operacaoProcessoRepositories from "../repositories/operacaoProcessoRepositories.js";
import parametroCorteRepositories from "../repositories/parametroCorteRepositories.js";
import operacaoRepositories from "../repositories/operacaoRepositories.js";

const dadosFresamentoController = {

    criar: async (req, res) => {
        try {
            const { idOperacaoProcesso, diametroFresa, numeroDentes, comprimentoPercurso, profundidadeTotal, quantidadePercursos = 1 } = req.body;
            const etapa = await operacaoProcessoRepositories.selecionarUm(idOperacaoProcesso);
            if (!etapa || etapa.length === 0) {
                return res.status(404).json({ message: "Operação do processo não encontrada." });
            }
            const parametro = await parametroCorteRepositories.selecionarUm(etapa[0].idParametro);
            if (!parametro || parametro.length === 0) {
                return res.status(404).json({ message: "Parâmetro de corte não encontrado." });
            }
            const operacao = await operacaoRepositories.selecionarUm(parametro[0].idOperacao);
            if (!operacao || operacao.length === 0 || operacao[0].tipo !== "fresamento") {
                return res.status(400).json({ message: "Dados incompatíveis com o tipo de operação selecionado." });
            }
            const registros = await dadosFresamentoRepositories.selecionar();
            if (registros.some(r => Number(r.idOperacaoProcesso) === Number(idOperacaoProcesso))) {
                return res.status(409).json({ message: "Esta operação já possui dados cadastrados." });
            }
            let registro;
            try {
                registro = DadosFresamento.criar({ idOperacaoProcesso, diametroFresa, numeroDentes, comprimentoPercurso, profundidadeTotal, quantidadePercursos });
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            const result = await dadosFresamentoRepositories.criar(registro);
            res.status(201).json({ message: "Dados de fresamento cadastrados com sucesso.", result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao cadastrar dados de fresamento.", errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idDadosFresamento } = req.params;
            const existente = await dadosFresamentoRepositories.selecionarUm(idDadosFresamento);
            if (!existente || existente.length === 0) {
                return res.status(404).json({ message: "Dados de fresamento não encontrados." });
            }
            const { idOperacaoProcesso, diametroFresa, numeroDentes, comprimentoPercurso, profundidadeTotal, quantidadePercursos = 1 } = req.body;
            const etapa = await operacaoProcessoRepositories.selecionarUm(idOperacaoProcesso);
            if (!etapa || etapa.length === 0) {
                return res.status(404).json({ message: "Operação do processo não encontrada." });
            }
            const parametro = await parametroCorteRepositories.selecionarUm(etapa[0].idParametro);
            if (!parametro || parametro.length === 0) {
                return res.status(404).json({ message: "Parâmetro de corte não encontrado." });
            }
            const operacao = await operacaoRepositories.selecionarUm(parametro[0].idOperacao);
            if (!operacao || operacao.length === 0 || operacao[0].tipo !== "fresamento") {
                return res.status(400).json({ message: "Dados incompatíveis com o tipo de operação selecionado." });
            }
            const registros = await dadosFresamentoRepositories.selecionar();
            if (registros.some(r => Number(r.idOperacaoProcesso) === Number(idOperacaoProcesso) && Number(r.idDadosFresamento) !== Number(idDadosFresamento))) {
                return res.status(409).json({ message: "Esta operação já possui outro registro de dados." });
            }
            let registro;
            try {
                registro = DadosFresamento.editar({ idDadosFresamento, idOperacaoProcesso, diametroFresa, numeroDentes, comprimentoPercurso, profundidadeTotal, quantidadePercursos });
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            const result = await dadosFresamentoRepositories.editar(registro);
            res.status(200).json({ message: "Dados de fresamento atualizados com sucesso.", result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao editar dados de fresamento.", errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idDadosFresamento } = req.params;
            const existente = await dadosFresamentoRepositories.selecionarUm(idDadosFresamento);
            if (!existente || existente.length === 0) {
                return res.status(404).json({ message: "Dados de fresamento não encontrados." });
            }
            const result = await dadosFresamentoRepositories.deletar(idDadosFresamento);
            res.status(200).json({ message: "Dados de fresamento excluídos com sucesso.", result });
        } catch (error) {
            console.error(error);
            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({ message: "Não é possível excluir um registro que ainda possui dados vinculados." });
            }
            res.status(500).json({ message: "Erro ao excluir dados de fresamento.", errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await dadosFresamentoRepositories.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao selecionar dados de fresamento.", errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const { idDadosFresamento } = req.params;
            const result = await dadosFresamentoRepositories.selecionarUm(idDadosFresamento);
            if (!result || result.length === 0) {
                return res.status(404).json({ message: "Dados de fresamento não encontrados." });
            }
            res.status(200).json({ result: result[0] });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao buscar dados de fresamento.", errorMessage: error.message });
        }
    }
};

export default dadosFresamentoController;
