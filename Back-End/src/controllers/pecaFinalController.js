import { PecaFinal } from "../models/pecaFinal.js";
import pecaFinalRepositories from "../repositories/pecaFinalRepositories.js";

const pecaFinalController = {
    criar: async (req, res) => {
        try {
            const { idPeca, nome, profundidadeFinal, alturaFinal, diametroFinal, larguraFinal } = req.body;
            const imagem = `/uploads/images/${req.file.filename}`
            const peca = PecaFinal.criar({ idPeca, nome, profundidadeFinal, alturaFinal, diametroFinal, larguraFinal, imagem });
            const result = await pecaFinalRepositories.criar(peca);

            res.status(201).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const id = req.params.idPecaFinal;
            const { idPeca, nome, profundidadeFinal, alturaFinal, diametroFinal, larguraFinal } = req.body;
            const peca = PecaFinal.editar({ idPecaFinal: id, idPeca, nome, profundidadeFinal, alturaFinal, diametroFinal, larguraFinal });
            const result = await pecaFinalRepositories.editar(peca);

            res.status(200).json({  result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = req.params.idPecaFinal;
            const result = await pecaFinalRepositories.deletar(id);

            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await pecaFinalRepositories.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const id = req.params.idPecaFinal;
            const result = await pecaFinalRepositories.selecionarUm(id);
            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    // A validação de tipo/tamanho do arquivo já é feita pela uploadImagemMiddleware
    // (multer), então aqui só cuidamos de checar se a peça existe e persistir o BLOB.
    uploadImagem: async (req, res) => {
        try {
            const id = req.params.idPecaFinal;

            if (!req.file) {
                return res.status(400).json({ message: 'Nenhuma imagem foi enviada. Envie o arquivo no campo "imagem".' });
            }

            const pecaExistente = await pecaFinalRepositories.selecionarUm(id);
            if (!pecaExistente || pecaExistente.length === 0) {
                return res.status(404).json({ message: 'Peça final não encontrada.' });
            }

            await pecaFinalRepositories.salvarImagem(id, req.file.buffer, req.file.mimetype);

            res.status(200).json({ message: 'Imagem salva com sucesso.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    buscarImagem: async (req, res) => {
        try {
            const id = req.params.idPecaFinal;
            const registro = await pecaFinalRepositories.buscarImagem(id);

            if (!registro || !registro.imagem) {
                return res.status(404).json({ message: 'Esta peça final não possui imagem cadastrada.' });
            }

            res.status(200);
            res.set('Content-Type', registro.imagemTipo || 'application/octet-stream');
            res.send(registro.imagem);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    deletarImagem: async (req, res) => {
        try {
            const id = req.params.idPecaFinal;
            await pecaFinalRepositories.removerImagem(id);

            res.status(200).json({ message: 'Imagem removida com sucesso.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
};

export default pecaFinalController;