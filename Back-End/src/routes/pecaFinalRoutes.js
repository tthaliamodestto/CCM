import {Router} from 'express';
import pecaFinalController from '../controllers/pecaFinalController.js';
import uploadImagemMiddleware from '../middlewares/uploadImage.middleware.js';

const pecaFinalRoutes = Router();

pecaFinalRoutes.get('/', pecaFinalController.selecionar);
pecaFinalRoutes.get('/:idPecaFinal', pecaFinalController.selecionarUm);
pecaFinalRoutes.post('/', pecaFinalController.criar);
pecaFinalRoutes.put('/:idPecaFinal', pecaFinalController.editar);
pecaFinalRoutes.delete('/:idPecaFinal', pecaFinalController.deletar);

pecaFinalRoutes.post('/:idPecaFinal/imagem', uploadImagemMiddleware, pecaFinalController.uploadImagem);
pecaFinalRoutes.get('/:idPecaFinal/imagem', pecaFinalController.buscarImagem);
pecaFinalRoutes.delete('/:idPecaFinal/imagem', pecaFinalController.deletarImagem);

export default pecaFinalRoutes;