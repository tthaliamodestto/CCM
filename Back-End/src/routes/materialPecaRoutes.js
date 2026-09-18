import { Router } from 'express';
import materialPecaController from '../controllers/materialPecaController.js';

const materialPecaRoutes = Router();

materialPecaRoutes.get('/', materialPecaController.selecionar);
materialPecaRoutes.get('/:idMaterial', materialPecaController.selecionarUm);
materialPecaRoutes.post('/', materialPecaController.criar);
materialPecaRoutes.put('/:idMaterial', materialPecaController.editar);
materialPecaRoutes.delete('/:idMaterial', materialPecaController.deletar);

export default materialPecaRoutes;