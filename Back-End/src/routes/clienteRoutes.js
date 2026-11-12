import { Router } from 'express';
import clienteController from '../controllers/clienteController.js';

const clienteRoutes = Router();
clienteRoutes.post('/login', clienteController.login);
clienteRoutes.get('/', clienteController.selecionar);
clienteRoutes.get('/:idCliente', clienteController.selecionarUm);
clienteRoutes.post('/', clienteController.criar);
clienteRoutes.put('/:idCliente', clienteController.editar);
clienteRoutes.delete('/:idCliente', clienteController.deletar);

export default clienteRoutes;
