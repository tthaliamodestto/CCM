import { Router } from 'express';
import dadosFresamentoController from '../controllers/dadosFresamentoController.js';

const routes = Router();
routes.get('/', dadosFresamentoController.selecionar);
routes.get('/:idDadosFresamento', dadosFresamentoController.selecionarUm);
routes.post('/', dadosFresamentoController.criar);
routes.put('/:idDadosFresamento', dadosFresamentoController.editar);
routes.delete('/:idDadosFresamento', dadosFresamentoController.deletar);

export default routes;
