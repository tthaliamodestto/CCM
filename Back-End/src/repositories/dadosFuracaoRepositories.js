import { connection } from "../configs/Database.js";

const dadosFuracaoRepositories = {
    criar: async (dadosFuracao) => {
        const sql = 'INSERT INTO DadosFuracao (idOperacaoProcesso, diametroFuro, profundidadeFuro, quantidadeFuros) VALUES (?, ?, ?, ?)';
        const values = [dadosFuracao.idOperacaoProcesso, dadosFuracao.diametroFuro, dadosFuracao.profundidadeFuro, dadosFuracao.quantidadeFuros ?? 1];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (dadosFuracao) => {
        const sql = 'UPDATE DadosFuracao SET idOperacaoProcesso = ?, diametroFuro = ?, profundidadeFuro = ?, quantidadeFuros = ? WHERE idDadosFuracao = ?';
        const values = [dadosFuracao.idOperacaoProcesso, dadosFuracao.diametroFuro, dadosFuracao.profundidadeFuro, dadosFuracao.quantidadeFuros ?? 1, dadosFuracao.idDadosFuracao];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idDadosFuracao) => {
        const sql = 'DELETE FROM DadosFuracao WHERE idDadosFuracao = ?';
        const values = [idDadosFuracao];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM DadosFuracao';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idDadosFuracao) => {
        const sql = 'SELECT * FROM DadosFuracao WHERE idDadosFuracao = ?';
        const values = [idDadosFuracao];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default dadosFuracaoRepositories;