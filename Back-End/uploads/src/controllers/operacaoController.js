import { Operacao } from '../models/operacao.js';
import operacaoRepositories from '../repositories/operacaoRepositories.js';

const operacaoController = {
    criar: async (req, res) => {
        try {
            const { nome, tipo, descricao } = req.body;
            const operacao = Operacao.criar({ nome, tipo, descricao });
            const result = await operacaoRepositories.criar(operacao);
            return res.status(201).json({ message: 'Operação cadastrada com sucesso.', idOperacao: result.insertId });
        } catch (error) {
            return res.status(400).json({ message: 'Erro ao cadastrar operação.', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idOperacao } = req.params;
            const atual = await operacaoRepositories.selecionarUm(idOperacao);
            if (atual.length === 0) return res.status(404).json({ message: 'Operação não encontrada.' });
            const { nome, tipo, descricao } = req.body;
            const operacao = Operacao.editar({
                idOperacao,
                nome: nome ?? atual[0].nome,
                tipo: tipo ?? atual[0].tipo,
                descricao: descricao === undefined ? atual[0].descricao : descricao
            });
            const result = await operacaoRepositories.editar(operacao);
            return res.status(200).json({ message: 'Operação atualizada com sucesso.', result });
        } catch (error) {
            return res.status(400).json({ message: 'Erro ao atualizar operação.', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const result = await operacaoRepositories.deletar(req.params.idOperacao);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Operação não encontrada.' });
            return res.status(200).json({ message: 'Operação deletada com sucesso.', result });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ message: 'Não é possível excluir esta operação porque existem parâmetros de corte vinculados.' });
            return res.status(500).json({ message: 'Erro ao deletar operação.', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await operacaoRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao listar operações.', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const result = await operacaoRepositories.selecionarUm(req.params.idOperacao);
            if (result.length === 0) return res.status(404).json({ message: 'Operação não encontrada.' });
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar operação.', errorMessage: error.message });
        }
    }
};

export default operacaoController;
