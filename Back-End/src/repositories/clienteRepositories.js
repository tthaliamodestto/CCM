import { connection } from '../configs/Database.js';

const clienteRepositories = {
    criar: async (cliente) => {
        const sql = 'INSERT INTO Clientes (nome, email, senha, tipoUsuario) VALUES (?, ?, ?, ?)';
        const [rows] = await connection.execute(sql, [cliente.nome, cliente.email, cliente.senha, cliente.tipoUsuario]);
        return rows;
    },

    editar: async (cliente) => {
        const sql = 'UPDATE Clientes SET nome = ?, email = ?, senha = COALESCE(?, senha), tipoUsuario = ? WHERE idClientes = ?';
        const [rows] = await connection.execute(sql, [cliente.nome, cliente.email, cliente.senha, cliente.tipoUsuario, cliente.idCliente]);
        return rows;
    },

    deletar: async (idCliente) => {
        const [rows] = await connection.execute('DELETE FROM Clientes WHERE idClientes = ?', [idCliente]);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT idClientes AS idCliente, nome, email, tipoUsuario, dataCriacao FROM Clientes ORDER BY idClientes DESC';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idCliente) => {
        const sql = 'SELECT idClientes AS idCliente, nome, email, tipoUsuario, dataCriacao FROM Clientes WHERE idClientes = ?';
        const [rows] = await connection.execute(sql, [idCliente]);
        return rows;
    },

    buscarPorEmail: async (email) => {
        const sql = 'SELECT idClientes AS idCliente, nome, email, senha, tipoUsuario, dataCriacao FROM Clientes WHERE email = ?';
        const [rows] = await connection.execute(sql, [email]);
        return rows;
    }
};

export default clienteRepositories;
