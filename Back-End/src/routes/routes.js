import { Router } from "express";
const routes = Router();
import materialPecaRoutes from "./materialPecaRoutes.js";
import pecaBrutaRoutes from "./pecaBrutaRoutes.js";

routes.use('/peca-bruta', pecaBrutaRoutes);
routes.use('/materiais', materialPecaRoutes);

export default routes;