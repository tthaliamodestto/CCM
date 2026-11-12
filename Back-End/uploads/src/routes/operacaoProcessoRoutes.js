import { Router } from 'express';
import operacaoProcessoController from '../controllers/operacaoProcessoController.js';

const operacaoProcessoRoutes = Router();
operacaoProcessoRoutes.post('/:idOperacaoProcesso/calcular', operacaoProcessoController.calcular);
operacaoProcessoRoutes.get('/', operacaoProcessoController.selecionar);
operacaoProcessoRoutes.get('/:idOperacaoProcesso', operacaoProcessoController.selecionarUm);
operacaoProcessoRoutes.post('/', operacaoProcessoController.criar);
operacaoProcessoRoutes.put('/:idOperacaoProcesso', operacaoProcessoController.editar);
operacaoProcessoRoutes.delete('/:idOperacaoProcesso', operacaoProcessoController.deletar);

export default operacaoProcessoRoutes;
