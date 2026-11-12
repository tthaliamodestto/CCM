import { connection } from '../configs/Database.js';

const dadosFresamentoRepositories = {
    criar: async (registro) => {
        const sql = 'INSERT INTO DadosFresamento (idOperacaoProcesso, diametroFresa, numeroDentes, comprimentoPercurso, profundidadeTotal, quantidadePercursos) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [registro.idOperacaoProcesso, registro.diametroFresa, registro.numeroDentes, registro.comprimentoPercurso, registro.profundidadeTotal, registro.quantidadePercursos];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (registro) => {
        const sql = 'UPDATE DadosFresamento SET idOperacaoProcesso = ?, diametroFresa = ?, numeroDentes = ?, comprimentoPercurso = ?, profundidadeTotal = ?, quantidadePercursos = ? WHERE idDadosFresamento = ?';
        const values = [registro.idOperacaoProcesso, registro.diametroFresa, registro.numeroDentes, registro.comprimentoPercurso, registro.profundidadeTotal, registro.quantidadePercursos, registro.idDadosFresamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (id) => {
        const [rows] = await connection.execute('DELETE FROM DadosFresamento WHERE idDadosFresamento = ?', [id]);
        return rows;
    },

    selecionar: async () => {
        const [rows] = await connection.execute('SELECT * FROM DadosFresamento ORDER BY idDadosFresamento DESC');
        return rows;
    },

    selecionarUm: async (id) => {
        const [rows] = await connection.execute('SELECT * FROM DadosFresamento WHERE idDadosFresamento = ?', [id]);
        return rows;
    },

    selecionarPorOperacaoProcesso: async (idOperacaoProcesso) => {
        const [rows] = await connection.execute('SELECT * FROM DadosFresamento WHERE idOperacaoProcesso = ?', [idOperacaoProcesso]);
        return rows;
    }
};

export default dadosFresamentoRepositories;
