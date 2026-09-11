import { ProcessoUsinagem } from "../models/processoUsinagem.js";
import processoUsinagemRepositories from "../repositories/processoUsinagemRepositories.js";
import parametroCorteRepositories from "../repositories/parametroCorteRepositories.js"; 
import { calcularTempoUsinagem } from "../utils/calculoTempoUsinagem.js";

const processoUsinagemController = {
    criar: async (req, res) => {
        try {
            const { idPecaFinal, idMaquina, idParametro, tipoOperacao, diametroFerramenta, comprimentoUsinado, numeroPasses } = req.body;

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
                idPecaFinal, 
                idMaquina, 
                idParametro, 
                tipoOperacao, 
                diametroFerramenta, 
                rpm, 
                velocidadeAvancoCalculada, 
                comprimentoUsinado, 
                numeroPasses || 1, 
                tempoMinutos,
                null
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
            const { idPecaFinal, idMaquina, idParametro, tipoOperacao, diametroFerramenta, comprimentoUsinado, numeroPasses } = req.body;

            // 1. Buscar os parâmetros de corte atualizados
            const parametrosRows = await parametroCorteRepositories.selecionarUm(idParametro);
            if (parametrosRows.length === 0) {
                return res.status(404).json({ message: 'Parâmetro de corte não encontrado para o ID informado.' });
            }
            const parametro = parametrosRows[0];

            // 2. Refazer os cálculos caso o usuário tenha mudado a ferramenta ou o comprimento
            const { rpm, tempoMinutos } = calcularTempoUsinagem(
                parametro.velocidadeCorte,
                diametroFerramenta,
                comprimentoUsinado,
                parametro.avanco,
                numeroPasses || 1
            );

            const velocidadeAvancoCalculada = parametro.avanco * rpm;

            // 3. Atualizar o Model
            const processo = new ProcessoUsinagem(
                idPecaFinal, 
                idMaquina, 
                idParametro, 
                tipoOperacao, 
                diametroFerramenta, 
                rpm, 
                velocidadeAvancoCalculada, 
                comprimentoUsinado, 
                numeroPasses || 1, 
                tempoMinutos,
                id
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