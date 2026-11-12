import { OperacaoProcesso } from '../models/operacaoProcesso.js';
import operacaoProcessoRepositories from '../repositories/operacaoProcessoRepositories.js';
import processoUsinagemRepositories from '../repositories/processoUsinagemRepositories.js';
import maquinaRepositories from '../repositories/maquinaRepositories.js';
import parametroCorteRepositories from '../repositories/parametroCorteRepositories.js';
import { recalcularOperacaoProcesso } from '../utils/recalcularOperacaoProcesso.js';

const operacaoProcessoController = {
    criar: async (req, res) => {
        try {
            const { idProcesso, idMaquina, idParametro, ordem, localOperacao } = req.body;
            const [processo, maquina, parametro] = await Promise.all([
                processoUsinagemRepositories.selecionarUm(idProcesso),
                maquinaRepositories.selecionarUm(idMaquina),
                parametroCorteRepositories.selecionarUm(idParametro)
            ]);
            if (processo.length === 0) return res.status(404).json({ message: 'Processo de usinagem não encontrado.' });
            if (maquina.length === 0) return res.status(404).json({ message: 'Máquina não encontrada.' });
            if (parametro.length === 0) return res.status(404).json({ message: 'Parâmetro de corte não encontrado.' });

            const registro = OperacaoProcesso.criar({ idProcesso, idMaquina, idParametro, ordem, localOperacao });
            const result = await operacaoProcessoRepositories.criar(registro);
            return res.status(201).json({ message: 'Operação do processo cadastrada com sucesso.', idOperacaoProcesso: result.insertId });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Já existe uma operação com esta ordem neste processo.' });
            return res.status(400).json({ message: 'Não foi possível cadastrar a operação do processo.', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idOperacaoProcesso } = req.params;
            const atual = await operacaoProcessoRepositories.selecionarUm(idOperacaoProcesso);
            if (atual.length === 0) return res.status(404).json({ message: 'Operação do processo não encontrada.' });
            const dados = { ...atual[0], ...req.body, idOperacaoProcesso };
            const [processo, maquina, parametro] = await Promise.all([
                processoUsinagemRepositories.selecionarUm(dados.idProcesso),
                maquinaRepositories.selecionarUm(dados.idMaquina),
                parametroCorteRepositories.selecionarUm(dados.idParametro)
            ]);
            if (processo.length === 0) return res.status(404).json({ message: 'Processo de usinagem não encontrado.' });
            if (maquina.length === 0) return res.status(404).json({ message: 'Máquina não encontrada.' });
            if (parametro.length === 0) return res.status(404).json({ message: 'Parâmetro de corte não encontrado.' });
            const registro = OperacaoProcesso.editar(dados);
            const result = await operacaoProcessoRepositories.editar(registro);
            return res.status(200).json({ message: 'Operação do processo atualizada com sucesso.', result });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Já existe uma operação com esta ordem neste processo.' });
            return res.status(400).json({ message: 'Não foi possível atualizar a operação do processo.', errorMessage: error.message });
        }
    },

    calcular: async (req, res) => {
        try {
            const calculos = await recalcularOperacaoProcesso(req.params.idOperacaoProcesso);
            return res.status(200).json({ message: 'Cálculos da operação atualizados com sucesso.', calculos });
        } catch (error) {
            return res.status(422).json({ message: 'Não foi possível calcular a operação.', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const result = await operacaoProcessoRepositories.deletar(req.params.idOperacaoProcesso);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Operação do processo não encontrada.' });
            return res.status(200).json({ message: 'Operação do processo excluída com sucesso.', result });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ message: 'Exclua primeiro os dados específicos desta operação.' });
            return res.status(500).json({ message: 'Erro ao excluir operação do processo.', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await operacaoProcessoRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao listar operações do processo.', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const result = await operacaoProcessoRepositories.selecionarUm(req.params.idOperacaoProcesso);
            if (result.length === 0) return res.status(404).json({ message: 'Operação do processo não encontrada.' });
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar operação do processo.', errorMessage: error.message });
        }
    }
};

export default operacaoProcessoController;
