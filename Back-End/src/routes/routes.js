import { Router } from "express";
const routes = Router();

import parametroCorteRoutes from "./parametroCorteRoutes.js";
import processoUsinagemRoutes from "./processoUsinagemRoutes.js";
import materialPecaRoutes from "./materialPecaRoutes.js";
import pecaBrutaRoutes from "./pecaBrutaRoutes.js";
import pecaFinalRoutes from "./pecaFinalRoutes.js";
import maquinaRoutes from "./maquinaRoutes.js";
import operacaoRoutes from "./operacaoRoutes.js";
import custoRoutes from "./custoRoutes.js";

routes.use('/material', materialPecaRoutes)
routes.use('/peca-bruta', pecaBrutaRoutes)
routes.use('/parametro-corte', parametroCorteRoutes);
routes.use('/processo-usinagem', processoUsinagemRoutes);
routes.use('/peca-final', pecaFinalRoutes);
routes.use('/maquina', maquinaRoutes);
routes.use('/operacao', operacaoRoutes);
routes.use('/custo', custoRoutes);

export default routes;