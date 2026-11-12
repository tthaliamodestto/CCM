import { connection } from '../configs/Database.js';

const operacaoProcessoRepositories = {
    criar: async (operacaoProcesso) => {
        const sql = 'INSERT INTO OperacaoProcesso (idProcesso, idMaquina, idParametro, ordem, localOperacao, rpmCalculado, velocidadeAvancoCalculada, numeroPasses, tempoUsinagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [operacaoProcesso.idProcesso, operacaoProcesso.idMaquina, operacaoProcesso.idParametro, operacaoProcesso.ordem, operacaoProcesso.localOperacao ?? null, operacaoProcesso.rpmCalculado ?? null, operacaoProcesso.velocidadeAvancoCalculada ?? null, operacaoProcesso.numeroPasses ?? null, operacaoProcesso.tempoUsinagem ?? null];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (operacaoProcesso) => {
        const sql = 'UPDATE OperacaoProcesso SET idProcesso = ?, idMaquina = ?, idParametro = ?, ordem = ?, localOperacao = ?, rpmCalculado = ?, velocidadeAvancoCalculada = ?, numeroPasses = ?, tempoUsinagem = ? WHERE idOperacaoProcesso = ?';
        const values = [operacaoProcesso.idProcesso, operacaoProcesso.idMaquina, operacaoProcesso.idParametro, operacaoProcesso.ordem, operacaoProcesso.localOperacao ?? null, operacaoProcesso.rpmCalculado ?? null, operacaoProcesso.velocidadeAvancoCalculada ?? null, operacaoProcesso.numeroPasses ?? null, operacaoProcesso.tempoUsinagem ?? null, operacaoProcesso.idOperacaoProcesso];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    atualizarCalculos: async (idOperacaoProcesso, calculos) => {
        const sql = 'UPDATE OperacaoProcesso SET rpmCalculado = ?, velocidadeAvancoCalculada = ?, numeroPasses = ?, tempoUsinagem = ? WHERE idOperacaoProcesso = ?';
        const values = [calculos.rpmCalculado, calculos.velocidadeAvancoCalculada, calculos.numeroPasses, calculos.tempoUsinagem, idOperacaoProcesso];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idOperacaoProcesso) => {
        const [rows] = await connection.execute('DELETE FROM OperacaoProcesso WHERE idOperacaoProcesso = ?', [idOperacaoProcesso]);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT op.*, o.tipo AS tipoOperacao, o.nome AS nomeOperacao FROM OperacaoProcesso op JOIN ParametroCorte pc ON pc.idParametro = op.idParametro JOIN operacao o ON o.idOperacao = pc.idOperacao ORDER BY op.idProcesso, op.ordem';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idOperacaoProcesso) => {
        const sql = 'SELECT op.*, o.tipo AS tipoOperacao, o.nome AS nomeOperacao FROM OperacaoProcesso op JOIN ParametroCorte pc ON pc.idParametro = op.idParametro JOIN operacao o ON o.idOperacao = pc.idOperacao WHERE op.idOperacaoProcesso = ?';
        const [rows] = await connection.execute(sql, [idOperacaoProcesso]);
        return rows;
    },

    selecionarPorProcesso: async (idProcesso) => {
        const sql = 'SELECT * FROM OperacaoProcesso WHERE idProcesso = ? ORDER BY ordem';
        const [rows] = await connection.execute(sql, [idProcesso]);
        return rows;
    }
};

export default operacaoProcessoRepositories;
