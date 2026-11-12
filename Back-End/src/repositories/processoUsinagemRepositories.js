import { connection } from '../configs/Database.js';

const processoUsinagemRepositories = {
    criar: async (processo) => {
        const sql = 'INSERT INTO ProcessoUsinagem (idPeca, idPecaFinal, idClientes) VALUES (?, ?, ?)';
        const [rows] = await connection.execute(sql, [processo.idPeca, processo.idPecaFinal, processo.idCliente]);
        return rows;
    },

    editar: async (processo) => {
        const sql = 'UPDATE ProcessoUsinagem SET idPeca = ?, idPecaFinal = ?, idClientes = ? WHERE idProcesso = ?';
        const values = [processo.idPeca, processo.idPecaFinal, processo.idCliente, processo.idProcesso];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idProcesso) => {
        const [rows] = await connection.execute('DELETE FROM ProcessoUsinagem WHERE idProcesso = ?', [idProcesso]);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT p.*, p.idClientes AS idCliente FROM ProcessoUsinagem p ORDER BY p.idProcesso DESC';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idProcesso) => {
        const sql = 'SELECT p.*, p.idClientes AS idCliente FROM ProcessoUsinagem p WHERE p.idProcesso = ?';
        const [rows] = await connection.execute(sql, [idProcesso]);
        return rows;
    }
};

export default processoUsinagemRepositories;
