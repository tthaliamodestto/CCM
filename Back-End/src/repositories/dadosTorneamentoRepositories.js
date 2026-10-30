import { connection } from "../configs/Database.js";

const dadosTorneamentoRepositories = {
    criar: async (dadosTorneamento) => {
        const sql = 'INSERT INTO DadosTorneamento (idOperacaoProcesso, comprimentoTorneamento, diametroInicial, diametroFinal) VALUES (?, ?, ?, ?)';
        const values = [dadosTorneamento.idOperacaoProcesso, dadosTorneamento.comprimentoTorneamento, dadosTorneamento.diametroInicial, dadosTorneamento.diametroFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (dadosTorneamento) => {
        const sql = 'UPDATE DadosTorneamento SET idOperacaoProcesso = ?, comprimentoTorneamento = ?, diametroInicial = ?, diametroFinal = ? WHERE idDadosTorneamento = ?';
        const values = [dadosTorneamento.idOperacaoProcesso, dadosTorneamento.comprimentoTorneamento, dadosTorneamento.diametroInicial, dadosTorneamento.diametroFinal, dadosTorneamento.idDadosTorneamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idDadosTorneamento) => {
        const sql = 'DELETE FROM DadosTorneamento WHERE idDadosTorneamento = ?';
        const values = [idDadosTorneamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM DadosTorneamento';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idDadosTorneamento) => {
        const sql = 'SELECT * FROM DadosTorneamento WHERE idDadosTorneamento = ?';
        const values = [idDadosTorneamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default dadosTorneamentoRepositories;