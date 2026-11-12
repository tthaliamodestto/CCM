import { connection } from '../configs/Database.js';

const operacaoRepositories = {
    criar: async (operacao) => {
        const sql = 'INSERT INTO operacao (nome, tipo, descricao) VALUES (?, ?, ?)';
        const [rows] = await connection.execute(sql, [operacao.nome, operacao.tipo, operacao.descricao ?? null]);
        return rows;
    },

    editar: async (operacao) => {
        const sql = 'UPDATE operacao SET nome = ?, tipo = ?, descricao = ? WHERE idOperacao = ?';
        const [rows] = await connection.execute(sql, [operacao.nome, operacao.tipo, operacao.descricao ?? null, operacao.idOperacao]);
        return rows;
    },

    deletar: async (idOperacao) => {
        const [rows] = await connection.execute('DELETE FROM operacao WHERE idOperacao = ?', [idOperacao]);
        return rows;
    },

    selecionar: async () => {
        const [rows] = await connection.execute('SELECT * FROM operacao ORDER BY idOperacao DESC');
        return rows;
    },

    selecionarUm: async (idOperacao) => {
        const [rows] = await connection.execute('SELECT * FROM operacao WHERE idOperacao = ?', [idOperacao]);
        return rows;
    }
};

export default operacaoRepositories;
