import { Router } from 'express';
import dadosFaceamentoController from '../controllers/dadosFaceamentoController.js';

const routes = Router();
routes.get('/', dadosFaceamentoController.selecionar);
routes.get('/:idDadosFaceamento', dadosFaceamentoController.selecionarUm);
routes.post('/', dadosFaceamentoController.criar);
routes.put('/:idDadosFaceamento', dadosFaceamentoController.editar);
routes.delete('/:idDadosFaceamento', dadosFaceamentoController.deletar);

export default routes;
