import { Router } from "express";
import orcamentoController from "../controllers/orcamentoController.js";

const orcamentoRoutes = Router();

orcamentoRoutes.post('/', orcamentoController.criar);
orcamentoRoutes.get('/', orcamentoController.listar);

export default orcamentoRoutes;