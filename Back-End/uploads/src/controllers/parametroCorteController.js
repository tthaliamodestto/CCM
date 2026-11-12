import { ParametroCorte } from '../models/parametroCorte.js';
import parametroCorteRepositories from '../repositories/parametroCorteRepositories.js';
import materialPecaRepositories from '../repositories/materialPecaRepositories.js';
import operacaoRepositories from '../repositories/operacaoRepositories.js';

const parametroCorteController = {
    criar: async (req, res) => {
        try {
            const { idMaterial, idOperacao, velocidadeCorte, avanco, tipoAvanco, profundidadeCorte } = req.body;
            const material = await materialPecaRepositories.selecionarUm(idMaterial);
            if (material.length === 0) return res.status(404).json({ message: 'Material não encontrado.' });
            const operacao = await operacaoRepositories.selecionarUm(idOperacao);
            if (operacao.length === 0) return res.status(404).json({ message: 'Operação não encontrada.' });
            const parametro = ParametroCorte.criar({ idMaterial, idOperacao, velocidadeCorte, avanco, tipoAvanco, profundidadeCorte });
            const result = await parametroCorteRepositories.criar(parametro);
            return res.status(201).json({ message: 'Parâmetro de corte cadastrado com sucesso.', idParametro: result.insertId });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível cadastrar o parâmetro de corte.', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idParametro } = req.params;
            const atual = await parametroCorteRepositories.selecionarUm(idParametro);
            if (atual.length === 0) return res.status(404).json({ message: 'Parâmetro de corte não encontrado.' });
            const dados = { ...atual[0], ...req.body, idParametro };
            const material = await materialPecaRepositories.selecionarUm(dados.idMaterial);
            if (material.length === 0) return res.status(404).json({ message: 'Material não encontrado.' });
            const operacao = await operacaoRepositories.selecionarUm(dados.idOperacao);
            if (operacao.length === 0) return res.status(404).json({ message: 'Operação não encontrada.' });
            const parametro = ParametroCorte.editar(dados);
            const result = await parametroCorteRepositories.editar(parametro);
            return res.status(200).json({ message: 'Parâmetro de corte atualizado com sucesso.', result });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível atualizar o parâmetro de corte.', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const result = await parametroCorteRepositories.deletar(req.params.idParametro);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Parâmetro de corte não encontrado.' });
            return res.status(200).json({ message: 'Parâmetro de corte deletado com sucesso.', result });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ message: 'Não é possível excluir o parâmetro porque existem operações de processo vinculadas a ele.' });
            return res.status(500).json({ message: 'Erro ao deletar parâmetro de corte.', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await parametroCorteRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar parâmetros de corte.', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const result = await parametroCorteRepositories.selecionarUm(req.params.idParametro);
            if (result.length === 0) return res.status(404).json({ message: 'Parâmetro de corte não encontrado.' });
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar parâmetro de corte.', errorMessage: error.message });
        }
    }
};

export default parametroCorteController;
