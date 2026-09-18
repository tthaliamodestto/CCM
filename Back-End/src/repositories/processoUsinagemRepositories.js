import { connection } from "../configs/Database.js";

const processoUsinagemRepositories = {
    criar: async (processo) => {
        const sql = `INSERT INTO processousinagem (idPecaFinal, idMaquina, idParametro, tipoOperacao, diametroFerramenta, rpm, velocidadeAvanco, comprimentoUsinado, numeroPasses, tempoUsinagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        const values = [processo.idPecaFinal, processo.idMaquina, processo.idParametro, processo.tipoOperacao, processo.diametroFerramenta, processo.rpm, processo.velocidadeAvanco, processo.comprimentoUsinado, processo.numeroPasses, processo.tempoUsinagem];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (processo) => {
        const sql = `UPDATE processousinagem SET idPecaFinal=?, idMaquina=?, idParametro=?, tipoOperacao=?, diametroFerramenta=?, rpm=?, velocidadeAvanco=?, comprimentoUsinado=?, numeroPasses=?, tempoUsinagem=? WHERE idProcesso = ?;`;
        const values = [processo.idPecaFinal, processo.idMaquina, processo.idParametro, processo.tipoOperacao, processo.diametroFerramenta, processo.rpm, processo.velocidadeAvanco, processo.comprimentoUsinado, processo.numeroPasses, processo.tempoUsinagem, processo.idProcesso];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idProcesso) => {
        const sql = 'DELETE FROM processousinagem WHERE idProcesso = ?;';
        const values = [idProcesso];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM processousinagem;';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    atualizarTempoUsinagem: async (idProcesso, tempoCalculado) => {
        const sql = 'UPDATE processousinagem SET tempoUsinagem = ? WHERE idProcesso = ?;';
        const values = [tempoCalculado, idProcesso];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default processoUsinagemRepositories;