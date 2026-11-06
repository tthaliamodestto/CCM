import { tipoUtilizacao } from "../enums/tipoUtilizacao.js";
import { Maquina } from "../models/maquina.js";
import maquinaRepositories from "../repositories/maquinaRepositories.js";

const maquinaController = {
    criar: async (req, res) => {
        try {
            const { nome, tipoUtilizacao: utilizacao, custoHora, potencialKw, bandeiraTarifaria } = req.body;
            const imagem = req.file ? `/uploads/images/${req.file.filename}` : null;

            // O model define os campos que não se aplicam como zero e a bandeira padrão como verde.
            const maquina = Maquina.criar({
                nome,
                tipoUtilizacao: utilizacao,
                custoHora: utilizacao === tipoUtilizacao.PROPRIA ? 0 : custoHora,
                potencialKw: utilizacao === tipoUtilizacao.TERCEIROS ? 0 : potencialKw,
                bandeiraTarifaria,
                imagem
            });

            const result = await maquinaRepositories.criar(maquina);
            return res.status(201).json({ message: "Máquina cadastrada com sucesso.", result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Não foi possível cadastrar a máquina.", errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idMaquina } = req.params;
            const { nome, tipoUtilizacao: utilizacao, custoHora, potencialKw, bandeiraTarifaria } = req.body;

            const maquinaAtual = await maquinaRepositories.selecionarUm(idMaquina);
            if (maquinaAtual.length === 0) {
                return res.status(404).json({ message: "Máquina não encontrada." });
            }

            const imagem = req.file
                ? `/uploads/images/${req.file.filename}`
                : maquinaAtual[0].imagem;

            const maquina = Maquina.editar({
                idMaquina,
                nome,
                tipoUtilizacao: utilizacao,
                custoHora: utilizacao === tipoUtilizacao.PROPRIA ? 0 : custoHora,
                potencialKw: utilizacao === tipoUtilizacao.TERCEIROS ? 0 : potencialKw,
                bandeiraTarifaria,
                imagem
            });

            const result = await maquinaRepositories.editar(maquina);
            return res.status(200).json({ message: "Máquina atualizada com sucesso.", result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Não foi possível atualizar a máquina.", errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idMaquina } = req.params;
            const maquina = await maquinaRepositories.selecionarUm(idMaquina);
            if (maquina.length === 0) {
                return res.status(404).json({ message: "Máquina não encontrada." });
            }

            const result = await maquinaRepositories.deletar(idMaquina);
            return res.status(200).json({ message: "Máquina deletada com sucesso.", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao deletar máquina.", errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await maquinaRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar máquinas.", errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const { idMaquina } = req.params;
            const result = await maquinaRepositories.selecionarUm(idMaquina);
            if (result.length === 0) {
                return res.status(404).json({ message: "Máquina não encontrada." });
            }
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar máquina.", errorMessage: error.message });
        }
    }
};

export default maquinaController;
