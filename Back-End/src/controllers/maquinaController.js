import { tipoUtilizacao } from '../enums/tipoUtilizacao.js';
import { Maquina } from '../models/maquina.js';
import maquinaRepositories from '../repositories/maquinaRepositories.js';

const maquinaController = {
    criar: async (req, res) => {
        try {
            const { nome, tipoUtilizacao: utilizacao, custoHora, potencialKw } = req.body;
            const imagem = req.file ? `/uploads/images/${req.file.filename}` : null;
            const maquina = Maquina.criar({
                nome,
                tipoUtilizacao: utilizacao,
                custoHora: utilizacao === tipoUtilizacao.PROPRIA ? null : custoHora,
                potencialKw: utilizacao === tipoUtilizacao.TERCEIROS ? null : potencialKw,
                imagem
            });
            const result = await maquinaRepositories.criar(maquina);
            return res.status(201).json({ message: 'Máquina cadastrada com sucesso.', idMaquina: result.insertId });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível cadastrar a máquina.', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idMaquina } = req.params;
            const atual = await maquinaRepositories.selecionarUm(idMaquina);
            if (atual.length === 0) return res.status(404).json({ message: 'Máquina não encontrada.' });
            const { nome, tipoUtilizacao: utilizacaoInformada, custoHora, potencialKw } = req.body;
            const utilizacao = utilizacaoInformada ?? atual[0].tipoUtilizacao;
            const imagem = req.file ? `/uploads/images/${req.file.filename}` : atual[0].imagem;
            const maquina = Maquina.editar({
                idMaquina,
                nome: nome ?? atual[0].nome,
                tipoUtilizacao: utilizacao,
                custoHora: utilizacao === tipoUtilizacao.PROPRIA ? null : (custoHora ?? atual[0].custoHora),
                potencialKw: utilizacao === tipoUtilizacao.TERCEIROS ? null : (potencialKw ?? atual[0].potencialKw),
                imagem
            });
            const result = await maquinaRepositories.editar(maquina);
            return res.status(200).json({ message: 'Máquina atualizada com sucesso.', result });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível atualizar a máquina.', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const result = await maquinaRepositories.deletar(req.params.idMaquina);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Máquina não encontrada.' });
            return res.status(200).json({ message: 'Máquina deletada com sucesso.', result });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ message: 'Não é possível excluir a máquina porque existem operações vinculadas a ela.' });
            return res.status(500).json({ message: 'Erro ao deletar máquina.', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await maquinaRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar máquinas.', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const result = await maquinaRepositories.selecionarUm(req.params.idMaquina);
            if (result.length === 0) return res.status(404).json({ message: 'Máquina não encontrada.' });
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar máquina.', errorMessage: error.message });
        }
    }
};

export default maquinaController;
