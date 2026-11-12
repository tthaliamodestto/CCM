import { Router } from 'express';
import dadosFuracaoController from '../controllers/dadosFuracaoController.js';

const routes = Router();
routes.get('/', dadosFuracaoController.selecionar);
routes.get('/:idDadosFuracao', dadosFuracaoController.selecionarUm);
routes.post('/', dadosFuracaoController.criar);
routes.put('/:idDadosFuracao', dadosFuracaoController.editar);
routes.delete('/:idDadosFuracao', dadosFuracaoController.deletar);

export default routes;
