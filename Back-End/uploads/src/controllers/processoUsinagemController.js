import { ProcessoUsinagem } from '../models/processoUsinagem.js';
import processoUsinagemRepositories from '../repositories/processoUsinagemRepositories.js';
import pecaBrutaRepositories from '../repositories/pecaBrutaRepositories.js';
import pecaFinalRepositories from '../repositories/pecaFinalRepositories.js';
import clienteRepositories from '../repositories/clienteRepositories.js';
import operacaoProcessoRepositories from '../repositories/operacaoProcessoRepositories.js';

const processoUsinagemController = {
    criar: async (req, res) => {
        try {
            const { idPeca, idPecaFinal, idCliente } = req.body;
            const [peca, pecaFinal, cliente] = await Promise.all([
                pecaBrutaRepositories.selecionarUm(idPeca),
                pecaFinalRepositories.selecionarUm(idPecaFinal),
                clienteRepositories.selecionarUm(idCliente)
            ]);
            if (peca.length === 0) return res.status(404).json({ message: 'Peça bruta não encontrada.' });
            if (pecaFinal.length === 0) return res.status(404).json({ message: 'Peça final não encontrada.' });
            if (cliente.length === 0) return res.status(404).json({ message: 'Cliente não encontrado.' });

            const processo = ProcessoUsinagem.criar({ idPeca, idPecaFinal, idCliente });
            const result = await processoUsinagemRepositories.criar(processo);
            return res.status(201).json({ message: 'Processo de usinagem criado com sucesso.', idProcesso: result.insertId });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível criar o processo de usinagem.', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idProcesso } = req.params;
            const atual = await processoUsinagemRepositories.selecionarUm(idProcesso);
            if (atual.length === 0) return res.status(404).json({ message: 'Processo de usinagem não encontrado.' });
            const dados = { ...atual[0], ...req.body, idProcesso };
            dados.idCliente = dados.idCliente ?? dados.idClientes;
            const [peca, pecaFinal, cliente] = await Promise.all([
                pecaBrutaRepositories.selecionarUm(dados.idPeca),
                pecaFinalRepositories.selecionarUm(dados.idPecaFinal),
                clienteRepositories.selecionarUm(dados.idCliente)
            ]);
            if (peca.length === 0) return res.status(404).json({ message: 'Peça bruta não encontrada.' });
            if (pecaFinal.length === 0) return res.status(404).json({ message: 'Peça final não encontrada.' });
            if (cliente.length === 0) return res.status(404).json({ message: 'Cliente não encontrado.' });
            const processo = ProcessoUsinagem.editar(dados);
            const result = await processoUsinagemRepositories.editar(processo);
            return res.status(200).json({ message: 'Processo de usinagem atualizado com sucesso.', result });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível atualizar o processo de usinagem.', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idProcesso } = req.params;
            const etapas = await operacaoProcessoRepositories.selecionarPorProcesso(idProcesso);
            if (etapas.length > 0) return res.status(409).json({ message: 'Exclua primeiro as operações vinculadas a este processo.' });
            const result = await processoUsinagemRepositories.deletar(idProcesso);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Processo de usinagem não encontrado.' });
            return res.status(200).json({ message: 'Processo de usinagem excluído com sucesso.', result });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao excluir processo de usinagem.', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await processoUsinagemRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao listar processos de usinagem.', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const result = await processoUsinagemRepositories.selecionarUm(req.params.idProcesso);
            if (result.length === 0) return res.status(404).json({ message: 'Processo de usinagem não encontrado.' });
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar processo de usinagem.', errorMessage: error.message });
        }
    }
};

export default processoUsinagemController;
