import { Router } from 'express';
import custoController from '../controllers/custoController.js';

const custoRoutes = Router();
custoRoutes.post('/calcular/:idProcesso', custoController.calcular);
custoRoutes.get('/resumo/peca-final/:idPecaFinal', custoController.resumoPecaFinal);
custoRoutes.get('/', custoController.selecionar);
custoRoutes.get('/:idCusto', custoController.selecionarUm);
custoRoutes.post('/', custoController.criar);
custoRoutes.put('/:idCusto', custoController.editar);
custoRoutes.delete('/:idCusto', custoController.deletar);

export default custoRoutes;
