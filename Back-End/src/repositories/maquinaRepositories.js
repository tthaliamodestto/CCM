import { connection } from "../configs/Database.js";

const maquinaRepositories = {
    criar: async (maquina) => {
        const sql = `INSERT INTO maquina (nome, tipoUltilizacao, custoHora, potencialKw, imagem) VALUES (?, ?, ?, ?, ?);`;
        const values = [maquina.nome, maquina.tipoUltilizacao, maquina.custoHora, maquina.potencialKw, maquina.imagem];
        const [result] = await connection.execute(sql, values);
        const sqlSelect = `SELECT idMaquina, nome, tipoUltilizacao, custoHora, potencialKw, imagem FROM maquina WHERE idMaquina = ?;`;
        const [maquinaInserida] = await connection.execute(sqlSelect, [result.insertId]);
        
        return maquinaInserida[0] || { insertId: result.insertId };
    },

    editar: async (maquina = {}) => {
        const sql = `UPDATE maquina SET nome = ?, tipoUltilizacao = ?, custoHora = ?, potencialKw = ? WHERE idMaquina = ?;`;
        const values = [maquina.nome, maquina.tipoUltilizacao, maquina.custoHora, maquina.potencialKw, maquina.imagem];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idMaquina) => {
        const sql = 'DELETE FROM maquina WHERE idMaquina = ?;';
        const values = [idMaquina ?? null];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT idMaquina, nome, tipoUltilizacao, custoHora, potencialKw, imagem FROM maquina;';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idMaquina) => {
        const sql = 'SELECT idMaquina, nome, tipoUltilizacao, custoHora, potencialKw, imagem FROM maquina WHERE idMaquina = ?;';
        const values = [idMaquina ?? null];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default maquinaRepositories;