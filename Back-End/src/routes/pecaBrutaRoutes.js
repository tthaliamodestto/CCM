import {Router} from 'express';
import pecaBrutaController from '../controllers/pecaBrutaController.js';

const pecaBrutaRoutes = Router();

pecaBrutaRoutes.get('/', pecaBrutaController.selecionar);
pecaBrutaRoutes.get('/:idPeca', pecaBrutaController.selecionarUm);
pecaBrutaRoutes.post('/', pecaBrutaController.criar);
pecaBrutaRoutes.put('/:idPeca', pecaBrutaController.editar);
pecaBrutaRoutes.delete('/:idPeca', pecaBrutaController.deletar);

export default pecaBrutaRoutes;