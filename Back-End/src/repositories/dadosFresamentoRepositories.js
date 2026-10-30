import { connection } from "../configs/Database.js";

const dadosFresamentoRepositories = {
    criar: async (dadosFresamento) => {
        const sql = 'INSERT INTO DadosFresamento (idOperacaoProcesso, diametroFresa, numeroDentes, comprimentoPercurso, profundidadeTotal, quantidadePercursos) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [dadosFresamento.idOperacaoProcesso, dadosFresamento.diametroFresa, dadosFresamento.numeroDentes, dadosFresamento.comprimentoPercurso, dadosFresamento.profundidadeTotal, dadosFresamento.quantidadePercursos ?? 1];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (dadosFresamento) => {
        const sql = 'UPDATE DadosFresamento SET idOperacaoProcesso = ?, diametroFresa = ?, numeroDentes = ?, comprimentoPercurso = ?, profundidadeTotal = ?, quantidadePercursos = ? WHERE idDadosFresamento = ?';
        const values = [dadosFresamento.idOperacaoProcesso, dadosFresamento.diametroFresa, dadosFresamento.numeroDentes, dadosFresamento.comprimentoPercurso, dadosFresamento.profundidadeTotal, dadosFresamento.quantidadePercursos ?? 1, dadosFresamento.idDadosFresamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idDadosFresamento) => {
        const sql = 'DELETE FROM DadosFresamento WHERE idDadosFresamento = ?';
        const values = [idDadosFresamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM DadosFresamento';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idDadosFresamento) => {
        const sql = 'SELECT * FROM DadosFresamento WHERE idDadosFresamento = ?';
        const values = [idDadosFresamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default dadosFresamentoRepositories;