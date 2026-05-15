import { Orcamento } from "../models/orcamento.js";
import orcamentoRepository from "../repositories/orcamentoRepository.js";

const orcamentoController = {
    criar: async (req, res) => {
        try {
            const orcamento = Orcamento.criar(req.body);
            const result = await orcamentoRepository.criar(orcamento);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao salvar orçamento', error: error.message });
        }
    },

    listar: async (req, res) => {
        try {
            const result = await orcamentoRepository.selecionarTodos();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar dados', error: error.message });
        }
    }
};

export default orcamentoController;