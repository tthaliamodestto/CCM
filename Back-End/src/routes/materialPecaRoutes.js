import { Router } from 'express';
import materialPecaController from '../controllers/materialPecaController.js';
import uploadImagemMiddleware from '../middlewares/uploadImage.middleware.js';

const materialPecaRoutes = Router();

materialPecaRoutes.get('/', materialPecaController.selecionar);
materialPecaRoutes.get('/:idMaterial', materialPecaController.selecionarUm);
materialPecaRoutes.post('/', uploadImagemMiddleware, materialPecaController.criar);
materialPecaRoutes.put('/:idMaterial', materialPecaController.editar);
materialPecaRoutes.delete('/:idMaterial', materialPecaController.deletar);

export default materialPecaRoutes;