import { Maquina } from "../models/maquina.js";
import maquinaRepositories from "../repositories/maquinaRepositories.js";

const maquinaController = {
  criar: async (req, res) => {
    try {
      const { nome, tipo, custoHora, potencialKw } = req.body;
      const imagem = req.file ? `/uploads/images/${req.file.filename}` : null;
      console.log("ARQUIVO RECEBIDO:", req.file);
      console.log("CAMINHO DA IMAGEM:", imagem);
      const maquina = Maquina.criar({ nome, tipo, custoHora, potencialKw, imagem });
      const result = await maquinaRepositories.criar(maquina);
      console.log("RESULTADO DO BANCO AO CRIAR:", result);
      res.status(201).json({ result });
    } catch (error) {
      console.log("ERRO AO CRIAR MÁQUINA:", error);
      res
        .status(500)
        .json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
    }
  },

  editar: async (req, res) => {
    try {
      const id = req.params.idMaquina;
      const { nome, tipo, custoHora, potencialKw } = req.body;
      const maquina = Maquina.editar({
        idMaquina: id,
        nome,
        tipo,
        custoHora,
        potencialKw,
      });
      const result = await maquinaRepositories.editar(maquina);
      res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
    }
  },

  deletar: async (req, res) => {
    try {
      const id = req.params.idMaquina;
      const result = await maquinaRepositories.deletar(id);
      res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
    }
  },

  selecionar: async (req, res) => {
    try {
      const result = await maquinaRepositories.selecionar();
      console.log("MÁQUINAS DO BANCO (selecionar):", result);
      res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
    }
  },

  selecionarUm: async (req, res) => {
    try {
      const id = req.params.idMaquina;
      const result = await maquinaRepositories.selecionarUm(id);
      if (result.length === 0)
        return res.status(404).json({ message: "Máquina não encontrada." });
      res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
    }
  },
};

export default maquinaController;
