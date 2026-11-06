import { connection } from "../configs/Database.js";

const clienteRepositories = {
    criar: async (cliente) => {
        const sql = 'INSERT INTO Cliente (nome, email, senha, tipoUsuario) VALUES (?, ?, ?, ?)';
        const values = [cliente.nome, cliente.email, cliente.senha, cliente.tipoUsuario];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (cliente) => {
        const sql = 'UPDATE Cliente SET nome = ?, email = ?, tipoUsuario = ? WHERE idCliente = ?';
        const values = [cliente.nome, cliente.email, cliente.tipoUsuario, cliente.idCliente];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idCliente) => {
        const sql = 'DELETE FROM Cliente WHERE idCliente = ?';
        const [rows] = await connection.execute(sql, [idCliente]);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT idCliente, nome, email, tipoUsuario, dataCriacao FROM Cliente';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idCliente) => {
        const sql = 'SELECT idCliente, nome, email, tipoUsuario, dataCriacao FROM Cliente WHERE idCliente = ?';
        const [rows] = await connection.execute(sql, [idCliente]);
        return rows;
    },

    buscarPorEmail: async (email) => {
        const sql = 'SELECT * FROM Cliente WHERE email = ?';
        const [rows] = await connection.execute(sql, [email]);
        return rows;
    }
};

export default clienteRepositories;