import { Router } from 'express';
import processoUsinagemController from '../controllers/processoUsinagemController.js';

const processoUsinagemRoutes = Router();
processoUsinagemRoutes.get('/', processoUsinagemController.selecionar);
processoUsinagemRoutes.get('/:idProcesso', processoUsinagemController.selecionarUm);
processoUsinagemRoutes.post('/', processoUsinagemController.criar);
processoUsinagemRoutes.put('/:idProcesso', processoUsinagemController.editar);
processoUsinagemRoutes.delete('/:idProcesso', processoUsinagemController.deletar);

export default processoUsinagemRoutes;
