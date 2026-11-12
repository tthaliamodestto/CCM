import { Cliente } from '../models/cliente.js';
import clienteRepositories from '../repositories/clienteRepositories.js';

const clienteController = {
    criar: async (req, res) => {
        try {
            const { nome, email, senha, tipoUsuario = 'operador' } = req.body;
            const existe = await clienteRepositories.buscarPorEmail(email);
            if (existe.length > 0) return res.status(409).json({ message: 'E-mail já cadastrado.' });

            const cliente = Cliente.criar({ nome, email, senha, tipoUsuario });
            const result = await clienteRepositories.criar(cliente);
            return res.status(201).json({ message: 'Cliente cadastrado com sucesso.', idCliente: result.insertId });
        } catch (error) {
            return res.status(400).json({ message: 'Erro ao cadastrar cliente.', errorMessage: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, senha } = req.body;
            if (!email || !senha) return res.status(400).json({ message: 'Informe e-mail e senha.' });
            const usuarios = await clienteRepositories.buscarPorEmail(email);
            if (usuarios.length === 0 || usuarios[0].senha !== senha) {
                return res.status(401).json({ message: 'Usuário ou senha incorretos.' });
            }
            const usuario = usuarios[0];
            return res.status(200).json({
                message: 'Login realizado com sucesso.',
                cliente: { idCliente: usuario.idCliente, nome: usuario.nome, email: usuario.email, tipoUsuario: usuario.tipoUsuario }
            });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao realizar login.', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const atual = await clienteRepositories.selecionarUm(idCliente);
            if (atual.length === 0) return res.status(404).json({ message: 'Cliente não encontrado.' });

            const { nome, email, senha, tipoUsuario } = req.body;
            const emailFinal = email ?? atual[0].email;
            const emailExiste = await clienteRepositories.buscarPorEmail(emailFinal);
            if (emailExiste.some((item) => Number(item.idCliente) !== Number(idCliente))) {
                return res.status(409).json({ message: 'Este e-mail já está cadastrado para outro cliente.' });
            }

            const cliente = Cliente.editar({
                idCliente,
                nome: nome ?? atual[0].nome,
                email: emailFinal,
                senha: senha ?? null,
                tipoUsuario: tipoUsuario ?? atual[0].tipoUsuario
            });
            const result = await clienteRepositories.editar(cliente);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Cliente não encontrado.' });
            return res.status(200).json({ message: 'Cliente atualizado com sucesso.', result });
        } catch (error) {
            return res.status(400).json({ message: 'Erro ao editar cliente.', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const result = await clienteRepositories.deletar(req.params.idCliente);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Cliente não encontrado.' });
            return res.status(200).json({ message: 'Cliente deletado com sucesso.', result });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ message: 'Não é possível excluir o cliente porque existem registros vinculados a ele.' });
            return res.status(500).json({ message: 'Erro ao deletar cliente.', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await clienteRepositories.selecionar();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao listar clientes.', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const result = await clienteRepositories.selecionarUm(req.params.idCliente);
            if (result.length === 0) return res.status(404).json({ message: 'Cliente não encontrado.' });
            return res.status(200).json({ result: result[0] });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar cliente.', errorMessage: error.message });
        }
    }
};

export default clienteController;
