import { ParametroCorte } from "../models/parametroCorte.js";
import parametroCorteRepositories from "../repositories/parametroCorteRepositories.js";

const parametroCorteController = {
    criar: async (req, res) => {
        try {
            const { idMaterial, idOperacao, velocidadeCorte, avanco, profundidadeCorte } = req.body;
            const parametro = new ParametroCorte(null, idMaterial, idOperacao, velocidadeCorte, avanco, profundidadeCorte);
            const result = await parametroCorteRepositories.criar(parametro);

            res.status(201).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    editar: async (req, res) => {
        try {
            const id = req.params.idParametro;
            const { idMaterial, idOperacao, velocidadeCorte, avanco, profundidadeCorte } = req.body;
            const parametro = new ParametroCorte(id, idMaterial, idOperacao, velocidadeCorte, avanco, profundidadeCorte);
            const result = await parametroCorteRepositories.editar(parametro);

            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    deletar: async (req, res) => {
        try {
            const id = req.params.idParametro;
            const result = await parametroCorteRepositories.deletar(id);

            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    selecionar: async (req, res) => {
        try {
            const result = await parametroCorteRepositories.selecionar();

            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
}

export default parametroCorteController;