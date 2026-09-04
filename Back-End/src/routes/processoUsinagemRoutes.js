import { Router } from "express";
import processoUsinagemController from "../controllers/processoUsinagemController.js";

const processoUsinagemRoutes = Router();

processoUsinagemRoutes.post('/', processoUsinagemController.criar);
processoUsinagemRoutes.put('/:idProcesso', processoUsinagemController.editar);
processoUsinagemRoutes.delete('/:idProcesso', processoUsinagemController.deletar);
processoUsinagemRoutes.get('/', processoUsinagemController.selecionar);

export default processoUsinagemRoutes;