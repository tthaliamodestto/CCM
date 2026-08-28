import { Router } from "express";
import parametroCorteController from "../controllers/parametroCorteController.js";

const parametroCorteRoutes = Router();

parametroCorteRoutes.post('/', parametroCorteController.criar);
parametroCorteRoutes.put('/:idParametro', parametroCorteController.editar);
parametroCorteRoutes.delete('/:idParametro', parametroCorteController.deletar);
parametroCorteRoutes.get('/', parametroCorteController.selecionar);

export default parametroCorteRoutes;