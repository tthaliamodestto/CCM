import { connection } from '../configs/Database.js';

const dadosFaceamentoRepositories = {
    criar: async (registro) => {
        const sql = 'INSERT INTO DadosFaceamento (idOperacaoProcesso, diametroFaceamento, espessuraFaceada) VALUES (?, ?, ?)';
        const values = [registro.idOperacaoProcesso, registro.diametroFaceamento, registro.espessuraFaceada];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (registro) => {
        const sql = 'UPDATE DadosFaceamento SET idOperacaoProcesso = ?, diametroFaceamento = ?, espessuraFaceada = ? WHERE idDadosFaceamento = ?';
        const values = [registro.idOperacaoProcesso, registro.diametroFaceamento, registro.espessuraFaceada, registro.idDadosFaceamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (id) => {
        const [rows] = await connection.execute('DELETE FROM DadosFaceamento WHERE idDadosFaceamento = ?', [id]);
        return rows;
    },

    selecionar: async () => {
        const [rows] = await connection.execute('SELECT * FROM DadosFaceamento ORDER BY idDadosFaceamento DESC');
        return rows;
    },

    selecionarUm: async (id) => {
        const [rows] = await connection.execute('SELECT * FROM DadosFaceamento WHERE idDadosFaceamento = ?', [id]);
        return rows;
    },

    selecionarPorOperacaoProcesso: async (idOperacaoProcesso) => {
        const [rows] = await connection.execute('SELECT * FROM DadosFaceamento WHERE idOperacaoProcesso = ?', [idOperacaoProcesso]);
        return rows;
    }
};

export default dadosFaceamentoRepositories;
