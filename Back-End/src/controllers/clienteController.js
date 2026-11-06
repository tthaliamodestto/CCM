import { Cliente } from "../models/cliente.js";
import clienteRepositories from "../repositories/clienteRepositories.js";

const clienteController = {
    criar: async (req, res) => {
        try {
            const { nome, email, senha, tipoUsuario } = req.body;

            const existe = await clienteRepositories.buscarPorEmail(email);
            if (existe.length > 0) {
                return res.status(400).json({ message: "E-mail já cadastrado." });
            }

            const cliente = Cliente.criar({ nome, email, senha, tipoUsuario });
            const result = await clienteRepositories.criar(cliente);

            res.status(201).json({ message: 'Cliente cadastrado com sucesso', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao cadastrar cliente', errorMessage: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, senha } = req.body;

            const usuarios = await clienteRepositories.buscarPorEmail(email);
            if (usuarios.length === 0) {
                return res.status(404).json({ message: "Usuário ou senha incorretos." });
            }

            const usuario = usuarios[0];

            if (usuario.senha !== senha) {
                return res.status(401).json({ message: "Usuário ou senha incorretos." });
            }

            // Retorna os dados do cliente e o idCliente para salvar no front-end
            res.status(200).json({
                message: "Login realizado com sucesso",
                cliente: {
                    idCliente: usuario.idCliente,
                    nome: usuario.nome,
                    email: usuario.email,
                    tipoUsuario: usuario.tipoUsuario
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao realizar login', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { nome, email, tipoUsuario } = req.body;

            const cliente = Cliente.editar({ idCliente, nome, email, senha: 'dummy_password', tipoUsuario });
            const result = await clienteRepositories.editar(cliente);

            res.status(200).json({ message: 'Cliente atualizado com sucesso', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao editar cliente', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const result = await clienteRepositories.deletar(idCliente);

            res.status(200).json({ message: 'Cliente deletado com sucesso', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao deletar cliente', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await clienteRepositories.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao selecionar clientes', errorMessage: error.message });
        }
    },

    selecionarUm: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const result = await clienteRepositories.selecionarUm(idCliente);

            if (result.length === 0) {
                return res.status(404).json({ message: "Cliente não encontrado." });
            }

            res.status(200).json({ result: result[0] });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar cliente', errorMessage: error.message });
        }
    }
};

export default clienteController;

