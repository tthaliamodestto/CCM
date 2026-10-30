import { connection } from "../configs/Database.js";

const processoUsinagemRepositories = {
    criar: async (processoUsinagem) => {
        const sql = 'INSERT INTO processousinagem (idPeca, idPecaFinal) VALUES (?, ?)';
        const values = [processoUsinagem.idPeca, processoUsinagem.idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (processoUsinagem) => {
        const sql = 'UPDATE processousinagem SET idPeca = ?, idPecaFinal = ? WHERE idProcesso = ?';
        const values = [processoUsinagem.idPeca, processoUsinagem.idPecaFinal, processoUsinagem.idProcesso];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idProcesso) => {
        const sql = 'DELETE FROM processousinagem WHERE idProcesso = ?';
        const values = [idProcesso];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM processousinagem';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idProcesso) => {
        const sql = 'SELECT * FROM processousinagem WHERE idProcesso = ?';
        const values = [idProcesso];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default processoUsinagemRepositories;