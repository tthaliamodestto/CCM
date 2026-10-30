import { connection } from "../configs/Database.js";

const dadosFaceamentoRepositories = {
    criar: async (dadosFaceamento) => {
        const sql = 'INSERT INTO DadosFaceamento (idOperacaoProcesso, diametroFaceamento, espessuraFaceada) VALUES (?, ?, ?)';
        const values = [dadosFaceamento.idOperacaoProcesso,dadosFaceamento.diametroFaceamento,dadosFaceamento.espessuraFaceada];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (dadosFaceamento) => {
        const sql = 'UPDATE DadosFaceamento SET idOperacaoProcesso = ?, diametroFaceamento = ?, espessuraFaceada = ? WHERE idDadosFaceamento = ?';
        const values = [dadosFaceamento.idOperacaoProcesso,dadosFaceamento.diametroFaceamento,dadosFaceamento.espessuraFaceada,dadosFaceamento.idDadosFaceamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idDadosFaceamento) => {
        const sql = 'DELETE FROM DadosFaceamento WHERE idDadosFaceamento = ?';
        const values = [idDadosFaceamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM DadosFaceamento';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idDadosFaceamento) => {
        const sql = 'SELECT * FROM DadosFaceamento WHERE idDadosFaceamento = ?';
        const values = [idDadosFaceamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default dadosFaceamentoRepositories;