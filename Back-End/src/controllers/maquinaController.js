import { tipoUtilizacao } from "../enums/tipoUtilizacao.js";
import { Maquina } from "../models/maquina.js";
import maquinaRepositories from "../repositories/maquinaRepositories.js";

const maquinaController = {
  criar: async (req, res) => {
    try {
      const { nome, tipo, tipoUtilizacao: utilizacao, custoHora, potencialKw } = req.body;
      const imagem = req.file ? `/uploads/images/${req.file.filename}` : null;
      // Máquina própria não precisa de custo por hora
      const custo = utilizacao === tipoUtilizacao.PROPRIA ? null : custoHora;
      const maquina = Maquina.criar({ nome, tipo, tipoUtilizacao: utilizacao, custoHora: custo, potencialKw, imagem });
      const result = await maquinaRepositories.criar(maquina);

      res.status(201).json({
        message: "Máquina cadastrada com sucesso.",
        result
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Erro ao cadastrar máquina.",
        errorMessage: error.message
      });
    }
  },

  editar: async (req, res) => {
    try {
      const { idMaquina } = req.params;
      const {nome, tipo, tipoUtilizacao: utilizacao, custoHora, potencialKw, imagem: imagemAtual} = req.body;
      const custo = utilizacao === tipoUtilizacao.PROPRIA ? null : custoHora;
      const maquina = Maquina.editar({idMaquina, nome, tipo, tipoUtilizacao: utilizacao, custoHora: custo, potencialKw});
      const result = await maquinaRepositories.editar(maquina);

      res.status(200).json({
        message: "Máquina atualizada com sucesso.",
        result
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Erro ao editar máquina.",
        errorMessage: error.message
      });
    }
  },

  deletar: async (req, res) => {
    try {
      const { idMaquina } = req.params;
      const result = await maquinaRepositories.deletar(idMaquina);

      res.status(200).json({
        message: "Máquina deletada com sucesso.",
        result
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Erro ao deletar máquina.",
        errorMessage: error.message
      });
    }
  },

  selecionar: async (req, res) => {
    try {
      const result = await maquinaRepositories.selecionar();

      res.status(200).json({ result });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Erro ao selecionar máquinas.",
        errorMessage: error.message
      });
    }
  },

  selecionarUm: async (req, res) => {
    try {
      const { idMaquina } = req.params;
      const result = await maquinaRepositories.selecionarUm(idMaquina);
      
      if (!result || result.length === 0) {
        return res.status(404).json({
          message: "Máquina não encontrada."
        });
      }

      res.status(200).json({
        result: result[0]
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Erro ao buscar máquina.",
        errorMessage: error.message
      });
    }
  }
};

export default maquinaController;
