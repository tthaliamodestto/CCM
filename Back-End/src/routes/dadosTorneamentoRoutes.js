import { Router } from 'express';
import dadosTorneamentoController from '../controllers/dadosTorneamentoController.js';

const routes = Router();
routes.get('/', dadosTorneamentoController.selecionar);
routes.get('/:idDadosTorneamento', dadosTorneamentoController.selecionarUm);
routes.post('/', dadosTorneamentoController.criar);
routes.put('/:idDadosTorneamento', dadosTorneamentoController.editar);
routes.delete('/:idDadosTorneamento', dadosTorneamentoController.deletar);

export default routes;
