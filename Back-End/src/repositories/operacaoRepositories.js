import { connection } from "../configs/Database.js";

const operacaoRepositories = {
    criar: async (operacao) => {
        const sql = `INSERT INTO operacao (nome, tipo) VALUES (?, ?);`;
        const values = [operacao.nome, operacao.tipo];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (operacao) => {
        const sql = `UPDATE operacao SET nome = ?, tipo = ? WHERE idOperacao = ?;`;
        const values = [operacao.nome, operacao.tipo, operacao.idOperacao];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idOperacao) => {
        const sql = 'DELETE FROM operacao WHERE idOperacao = ?;';
        const values = idOperacao
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM operacao;';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idOperacao) => {
        const sql = 'SELECT * FROM operacao WHERE idOperacao = ?;';
        const values = idOperacao
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default operacaoRepositories;