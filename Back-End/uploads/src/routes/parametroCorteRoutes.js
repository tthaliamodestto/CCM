import { Router } from 'express';
import parametroCorteController from '../controllers/parametroCorteController.js';

const parametroCorteRoutes = Router();
parametroCorteRoutes.get('/', parametroCorteController.selecionar);
parametroCorteRoutes.get('/:idParametro', parametroCorteController.selecionarUm);
parametroCorteRoutes.post('/', parametroCorteController.criar);
parametroCorteRoutes.put('/:idParametro', parametroCorteController.editar);
parametroCorteRoutes.delete('/:idParametro', parametroCorteController.deletar);

export default parametroCorteRoutes;
