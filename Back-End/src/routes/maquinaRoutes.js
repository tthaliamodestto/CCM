import { Router } from 'express';
import maquinaController from '../controllers/maquinaController.js';

const maquinaRoutes = Router();

maquinaRoutes.get('/', maquinaController.selecionar);
maquinaRoutes.get('/:idMaquina', maquinaController.selecionarUm);
maquinaRoutes.post('/', maquinaController.criar);
maquinaRoutes.put('/:idMaquina', maquinaController.editar);
maquinaRoutes.delete('/:idMaquina', maquinaController.deletar);

export default maquinaRoutes;