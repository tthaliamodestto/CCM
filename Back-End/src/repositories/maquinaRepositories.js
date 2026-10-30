import { connection } from "../configs/Database.js";

const maquinaRepositories = {
    criar: async (maquina) => {
        const sql = 'INSERT INTO Maquina (nome, tipoUtilizacao, custoHora, potencialKw, bandeiraTarifaria, imagem) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [maquina.nome, maquina.tipoUtilizacao, maquina.custoHora, maquina.potencialKw, maquina.bandeiraTarifaria ?? 'verde', maquina.imagem ?? null];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (maquina) => {
        const sql = 'UPDATE Maquina SET nome = ?, tipoUtilizacao = ?, custoHora = ?, potencialKw = ?, bandeiraTarifaria = ?, imagem = ? WHERE idMaquina = ?';
        const values = [maquina.nome, maquina.tipoUtilizacao, maquina.custoHora, maquina.potencialKw, maquina.bandeiraTarifaria ?? 'verde', maquina.imagem ?? null, maquina.idMaquina];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idMaquina) => {
        const sql = 'DELETE FROM Maquina WHERE idMaquina = ?';
        const values = [idMaquina];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM Maquina';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idMaquina) => {
        const sql = 'SELECT * FROM Maquina WHERE idMaquina = ?';
        const values = [idMaquina];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default maquinaRepositories;