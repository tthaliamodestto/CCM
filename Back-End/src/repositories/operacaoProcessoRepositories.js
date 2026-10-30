import { connection } from "../configs/Database.js";

const operacaoProcessoRepositories = {
    criar: async (operacaoProcesso) => {
        const sql = 'INSERT INTO OperacaoProcesso (idProcesso, idMaquina, idParametro, ordem, localOperacao, rpmCalculado, velocidadeAvancoCalculada, numeroPasses, tempoUsinagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            operacaoProcesso.idProcesso,
            operacaoProcesso.idMaquina,
            operacaoProcesso.idParametro,
            operacaoProcesso.ordem,
            operacaoProcesso.localOperacao ?? null,
            operacaoProcesso.rpmCalculado ?? null,
            operacaoProcesso.velocidadeAvancoCalculada ?? null,
            operacaoProcesso.numeroPasses ?? null,
            operacaoProcesso.tempoUsinagem ?? null
        ];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (operacaoProcesso) => {
        const sql = 'UPDATE OperacaoProcesso SET idProcesso = ?, idMaquina = ?, idParametro = ?, ordem = ?, localOperacao = ?, rpmCalculado = ?, velocidadeAvancoCalculada = ?, numeroPasses = ?, tempoUsinagem = ? WHERE idOperacaoProcesso = ?';
        const values = [
            operacaoProcesso.idProcesso,
            operacaoProcesso.idMaquina,
            operacaoProcesso.idParametro,
            operacaoProcesso.ordem,
            operacaoProcesso.localOperacao ?? null,
            operacaoProcesso.rpmCalculado ?? null,
            operacaoProcesso.velocidadeAvancoCalculada ?? null,
            operacaoProcesso.numeroPasses ?? null,
            operacaoProcesso.tempoUsinagem ?? null,
            operacaoProcesso.idOperacaoProcesso
        ];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idOperacaoProcesso) => {
        const sql = 'DELETE FROM OperacaoProcesso WHERE idOperacaoProcesso = ?';
        const values = [idOperacaoProcesso];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM OperacaoProcesso';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idOperacaoProcesso) => {
        const sql = 'SELECT * FROM OperacaoProcesso WHERE idOperacaoProcesso = ?';
        const values = [idOperacaoProcesso];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default operacaoProcessoRepositories;
