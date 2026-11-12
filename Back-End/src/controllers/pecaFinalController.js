import { PecaFinal } from '../models/pecaFinal.js';
import pecaFinalRepositories from '../repositories/pecaFinalRepositories.js';
import clienteRepositories from '../repositories/clienteRepositories.js';

const pecaFinalController = {
    criar: async (req, res) => {
        try {
            const { idCliente, nome, forma, comprimentoFinal, diametroMaximoFinal, larguraFinal, alturaFinal } = req.body;
            const cliente = await clienteRepositories.selecionarUm(idCliente);
            if (cliente.length === 0) return res.status(404).json({ message: 'Cliente não encontrado.' });
            const imagem = req.file ? `/uploads/images/${req.file.filename}` : null;
            const pecaFinal = PecaFinal.criar({ idCliente, nome, forma, comprimentoFinal, diametroMaximoFinal, larguraFinal, alturaFinal, imagem });
            const result = await pecaFinalRepositories.criar(pecaFinal);
            return res.status(201).json({ message: 'Peça final cadastrada com sucesso.', idPecaFinal: result.insertId });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível cadastrar a peça final.', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idPecaFinal } = req.params;
            const atual = await pecaFinalRepositories.selecionarUm(idPecaFinal);
            if (atual.length === 0) return res.status(404).json({ message: 'Peça final não encontrada.' });
            const dados = { ...atual[0], ...req.body, idPecaFinal };
            dados.idCliente = dados.idCliente ?? dados.idClientes;
            const cliente = await clienteRepositories.selecionarUm(dados.idCliente);
            if (cliente.length === 0) return res.status(404).json({ message: 'Cliente não encontrado.' });
            dados.imagem = req.file ? `/uploads/images/${req.file.filename}` : atual[0].imagem;
            const pecaFinal = PecaFinal.editar(dados);
            const result = await pecaFinalRepositories.editar(pecaFinal);
            return res.status(200).json({ message: 'Peça final atualizada com sucesso.', result });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível atualizar a peça final.', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const result = await pecaFinalRepositories.deletar(req.params.idPecaFinal);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Peça final não encontrada.' });
            return res.status(200).json({ message: 'Peça final deletada com sucesso.', result });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ message: 'Não é possível excluir a peça final porque existem processos vinculados a ela.' });
            return res.status(500).json({ message: 'Erro ao deletar peça final.', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await pecaFinalRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar peças finais.', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const result = await pecaFinalRepositories.selecionarUm(req.params.idPecaFinal);
            if (result.length === 0) return res.status(404).json({ message: 'Peça final não encontrada.' });
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar peça final.', errorMessage: error.message });
        }
    }
};

export default pecaFinalController;
