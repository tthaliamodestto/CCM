import { Router } from 'express';
import operacaoController from '../controllers/operacaoController.js';

const operacaoRoutes = Router();

operacaoRoutes.get('/', operacaoController.selecionar);
operacaoRoutes.get('/:idOperacao', operacaoController.selecionarUm);
operacaoRoutes.post('/', operacaoController.criar);
operacaoRoutes.put('/:idOperacao', operacaoController.editar);
operacaoRoutes.delete('/:idOperacao', operacaoController.deletar);

export default operacaoRoutes;