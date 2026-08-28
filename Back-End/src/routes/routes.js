import { Router } from "express";
const routes = Router();

import materialPecaRoutes from "./materialPecaRoutes.js";
import pecaBrutaRoutes from "./pecaBrutaRoutes.js";
import parametroCorteRoutes from "./parametroCorteRoutes.js";
import maquinaRoutes from "./maquinaRoutes.js";

routes.use('/peca-bruta', pecaBrutaRoutes);
routes.use('/materiais', materialPecaRoutes);
routes.use('/parametro-corte', parametroCorteRoutes);
routes.use('/maquina', maquinaRoutes);

export default routes;