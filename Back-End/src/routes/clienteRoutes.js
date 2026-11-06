import { Router } from 'express';
import clienteController from '../controllers/clienteController.js';

const clienteRoutes = Router();

clienteRoutes.get('/', clienteController.selecionar);
clienteRoutes.get('/:idCliente', clienteController.selecionarUm);
clienteRoutes.post('/', clienteController.criar);
clienteRoutes.post('/login', clienteController.login);
clienteRoutes.put('/:idCliente', clienteController.editar);
clienteRoutes.delete('/:idCliente', clienteController.deletar);

export default clienteRoutes;