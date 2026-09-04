import { connection } from "../configs/Database.js";

const maquinaRepositories = {
    criar: async (maquina) => {
        const sql = `INSERT INTO maquina (nome, tipo, custoHora, potencialKw) VALUES (?, ?, ?, ?);`;
        const values = [maquina.nome, maquina.tipo, maquina.custoHora, maquina.potencialKw];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (maquina) => {
        const sql = `UPDATE maquina SET nome = ?, tipo = ?, custoHora = ?, potencialKw = ? WHERE idMaquina = ?;`;
        const values = [maquina.nome, maquina.tipo, maquina.custoHora, maquina.potencialKw, maquina.idMaquina];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idMaquina) => {
        const sql = 'DELETE FROM maquina WHERE idMaquina = ?;';
        const values = idMaquina
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM maquina;';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idMaquina) => {
        const sql = 'SELECT * FROM maquina WHERE idMaquina = ?;';
        const values = idMaquina
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default maquinaRepositories;