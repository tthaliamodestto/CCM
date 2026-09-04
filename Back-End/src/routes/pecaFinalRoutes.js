import {Router} from 'express';
import pecaFinalController from '../controllers/pecaFinalController.js';

const pecaFinalRoutes = Router();

pecaFinalRoutes.get('/', pecaFinalController.selecionar);
pecaFinalRoutes.get('/:idPecaFinal', pecaFinalController.selecionarUm);
pecaFinalRoutes.post('/', pecaFinalController.criar);
pecaFinalRoutes.put('/:idPecaFinal', pecaFinalController.editar);
pecaFinalRoutes.delete('/:idPecaFinal', pecaFinalController.deletar);

export default pecaFinalRoutes;