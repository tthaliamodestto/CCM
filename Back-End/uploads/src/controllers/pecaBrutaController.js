import { PecaBruta } from '../models/pecaBruta.js';
import pecaBrutaRepositories from '../repositories/pecaBrutaRepositories.js';
import materialPecaRepositories from '../repositories/materialPecaRepositories.js';
import clienteRepositories from '../repositories/clienteRepositories.js';
import { calcularVolumePeso } from '../utils/calculoVolumePeso.js';
import { calcularCustoMaterial } from '../utils/calculoCusto.js';

async function calcularDadosPeca(forma, dimensoes, material) {
    const calculos = calcularVolumePeso(forma, dimensoes, Number(material.densidade));
    const custoEstimado = calcularCustoMaterial(calculos.peso, Number(material.custoPerKg));
    return { volumeCm3: calculos.volume, pesoKg: calculos.peso, custoEstimadoReais: custoEstimado };
}

const pecaBrutaController = {
    criar: async (req, res) => {
        try {
            const { idMaterial, idCliente, nome, forma, comprimento, diametro, largura, altura } = req.body;
            const material = await materialPecaRepositories.selecionarUm(idMaterial);
            if (material.length === 0) return res.status(404).json({ message: 'Material não encontrado.' });
            const cliente = await clienteRepositories.selecionarUm(idCliente);
            if (cliente.length === 0) return res.status(404).json({ message: 'Cliente não encontrado.' });

            const peca = PecaBruta.criar({ idMaterial, idCliente, nome, forma, comprimento, diametro, largura, altura });
            const calculos = await calcularDadosPeca(peca.forma, peca, material[0]);
            const result = await pecaBrutaRepositories.criar(peca);
            return res.status(201).json({ message: 'Peça bruta criada com sucesso.', idPeca: result.insertId, calculos });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível criar a peça bruta.', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idPeca } = req.params;
            const atual = await pecaBrutaRepositories.selecionarUm(idPeca);
            if (atual.length === 0) return res.status(404).json({ message: 'Peça bruta não encontrada.' });
            const dados = { ...atual[0], ...req.body, idPeca };
            const material = await materialPecaRepositories.selecionarUm(dados.idMaterial);
            if (material.length === 0) return res.status(404).json({ message: 'Material não encontrado.' });
            const cliente = await clienteRepositories.selecionarUm(dados.idCliente ?? dados.idClientes);
            if (cliente.length === 0) return res.status(404).json({ message: 'Cliente não encontrado.' });

            const peca = PecaBruta.editar(dados);
            const calculos = await calcularDadosPeca(peca.forma, peca, material[0]);
            const result = await pecaBrutaRepositories.editar(peca);
            return res.status(200).json({ message: 'Peça bruta atualizada com sucesso.', result, calculos });
        } catch (error) {
            return res.status(400).json({ message: 'Não foi possível atualizar a peça bruta.', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const result = await pecaBrutaRepositories.deletar(req.params.idPeca);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Peça bruta não encontrada.' });
            return res.status(200).json({ message: 'Peça bruta deletada com sucesso.', result });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ message: 'Não é possível excluir a peça porque existem processos vinculados a ela.' });
            return res.status(500).json({ message: 'Erro ao deletar peça bruta.', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await pecaBrutaRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar peças brutas.', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const result = await pecaBrutaRepositories.selecionarUm(req.params.idPeca);
            if (result.length === 0) return res.status(404).json({ message: 'Peça bruta não encontrada.' });
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar peça bruta.', errorMessage: error.message });
        }
    }
};

export default pecaBrutaController;
