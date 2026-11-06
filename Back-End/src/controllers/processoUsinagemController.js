import { ProcessoUsinagem } from "../models/processoUsinagem.js";
import processoUsinagemRepositories from "../repositories/processoUsinagemRepositories.js";
import parametroCorteRepositories from "../repositories/parametroCorteRepositories.js"; 
import { calcularTempoUsinagem } from "../utils/calculoTempoUsinagem.js";

const processoUsinagemController = {
    criar: async (req, res) => {
        try {
            // Adicionado idCliente na desestruturação
            const { idPeca, idPecaFinal, idCliente, idMaquina, idParametro, tipoOperacao, diametroFerramenta, comprimentoUsinado, numeroPasses } = req.body;

            const parametrosRows = await parametroCorteRepositories.selecionarUm(idParametro);
            if (parametrosRows.length === 0) {
                return res.status(404).json({ message: 'Parâmetro de corte não encontrado para o ID informado.' });
            }
            const parametro = parametrosRows[0];

            const { rpm, tempoMinutos } = calcularTempoUsinagem(
                parametro.velocidadeCorte,
                diametroFerramenta,
                comprimentoUsinado,
                parametro.avanco,
                numeroPasses || 1 
            );

            const velocidadeAvancoCalculada = parametro.avanco * rpm;

            // Passando idCliente para o construtor do model ProcessoUsinagem
            const processo = new ProcessoUsinagem(
                idPeca,
                idPecaFinal,
                idCliente, 
                idMaquina, 
                idParametro, 
                tipoOperacao, 
                diametroFerramenta, 
                rpm, 
                velocidadeAvancoCalculada, 
                comprimentoUsinado, 
                numeroPasses || 1, 
                tempoMinutos,
                null // id do processo para inserção
            );

            const result = await processoUsinagemRepositories.criar(processo);
            res.status(201).json({ result, rpmCalculado: rpm, tempoCalculado: tempoMinutos });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    
    editar: async (req, res) => {
        try {
            const id = req.params.idProcesso;
            // Adicionado idCliente na desestruturação
            const { idPeca, idPecaFinal, idCliente, idMaquina, idParametro, tipoOperacao, diametroFerramenta, comprimentoUsinado, numeroPasses } = req.body;

            const parametrosRows = await parametroCorteRepositories.selecionarUm(idParametro);
            if (parametrosRows.length === 0) {
                return res.status(404).json({ message: 'Parâmetro de corte não encontrado para o ID informado.' });
            }
            const parametro = parametrosRows[0];

            const { rpm, tempoMinutos } = calcularTempoUsinagem(
                parametro.velocidadeCorte,
                diametroFerramenta,
                comprimentoUsinado,
                parametro.avanco,
                numeroPasses || 1
            );

            const velocidadeAvancoCalculada = parametro.avanco * rpm;

            const processo = new ProcessoUsinagem(
                idPeca,
                idPecaFinal, 
                idCliente,
                idMaquina, 
                idParametro, 
                tipoOperacao, 
                diametroFerramenta, 
                rpm, 
                velocidadeAvancoCalculada, 
                comprimentoUsinado, 
                numeroPasses || 1, 
                tempoMinutos,
                id // id do processo para edição
            );

            const result = await processoUsinagemRepositories.editar(processo);
            res.status(200).json({ result, rpmCalculado: rpm, tempoCalculado: tempoMinutos });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    
    deletar: async (req, res) => {
        try {
            const id = req.params.idProcesso;
            const result = await processoUsinagemRepositories.deletar(id);
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    
    selecionar: async (req, res) => {
        try {
            const result = await processoUsinagemRepositories.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
}

export default processoUsinagemController;