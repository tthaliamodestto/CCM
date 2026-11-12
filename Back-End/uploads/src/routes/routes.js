import { Router } from 'express';
const routes = Router();

import clienteRoutes from './clienteRoutes.js';
import materialPecaRoutes from './materialPecaRoutes.js';
import maquinaRoutes from './maquinaRoutes.js';
import operacaoRoutes from './operacaoRoutes.js';
import parametroCorteRoutes from './parametroCorteRoutes.js';
import pecaBrutaRoutes from './pecaBrutaRoutes.js';
import pecaFinalRoutes from './pecaFinalRoutes.js';
import processoUsinagemRoutes from './processoUsinagemRoutes.js';
import operacaoProcessoRoutes from './operacaoProcessoRoutes.js';
import dadosTorneamentoRoutes from './dadosTorneamentoRoutes.js';
import dadosFaceamentoRoutes from './dadosFaceamentoRoutes.js';
import dadosFuracaoRoutes from './dadosFuracaoRoutes.js';
import dadosFresamentoRoutes from './dadosFresamentoRoutes.js';
import custoRoutes from './custoRoutes.js';

routes.use('/cliente', clienteRoutes);
routes.use('/material', materialPecaRoutes);
routes.use('/maquina', maquinaRoutes);
routes.use('/operacao', operacaoRoutes);
routes.use('/parametro-corte', parametroCorteRoutes);
routes.use('/peca-bruta', pecaBrutaRoutes);
routes.use('/peca-final', pecaFinalRoutes);
routes.use('/processo-usinagem', processoUsinagemRoutes);
routes.use('/operacao-processo', operacaoProcessoRoutes);
routes.use('/dados-torneamento', dadosTorneamentoRoutes);
routes.use('/dados-faceamento', dadosFaceamentoRoutes);
routes.use('/dados-furacao', dadosFuracaoRoutes);
routes.use('/dados-fresamento', dadosFresamentoRoutes);
routes.use('/custo', custoRoutes);

export default routes;
