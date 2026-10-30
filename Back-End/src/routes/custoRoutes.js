import { Router } from "express";
import custoController from "../controllers/custoController.js";

const custoRoutes = Router();

// Rotas específicas primeiro, para não serem capturadas por /:idCusto
custoRoutes.post('/calcular/:idProcesso', custoController.calcular);
custoRoutes.get('/resumo/peca-final/:idPecaFinal', custoController.resumoPecaFinal);
custoRoutes.get('/', custoController.selecionar);
custoRoutes.get('/:idCusto', custoController.selecionarUm);
custoRoutes.delete('/:idCusto', custoController.deletar);

export default custoRoutes;