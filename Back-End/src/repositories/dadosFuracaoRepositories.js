import { connection } from '../configs/Database.js';

const dadosFuracaoRepositories = {
    criar: async (registro) => {
        const sql = 'INSERT INTO DadosFuracao (idOperacaoProcesso, diametroFuro, profundidadeFuro, quantidadeFuros) VALUES (?, ?, ?, ?)';
        const values = [registro.idOperacaoProcesso, registro.diametroFuro, registro.profundidadeFuro, registro.quantidadeFuros];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (registro) => {
        const sql = 'UPDATE DadosFuracao SET idOperacaoProcesso = ?, diametroFuro = ?, profundidadeFuro = ?, quantidadeFuros = ? WHERE idDadosFuracao = ?';
        const values = [registro.idOperacaoProcesso, registro.diametroFuro, registro.profundidadeFuro, registro.quantidadeFuros, registro.idDadosFuracao];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (id) => {
        const [rows] = await connection.execute('DELETE FROM DadosFuracao WHERE idDadosFuracao = ?', [id]);
        return rows;
    },

    selecionar: async () => {
        const [rows] = await connection.execute('SELECT * FROM DadosFuracao ORDER BY idDadosFuracao DESC');
        return rows;
    },

    selecionarUm: async (id) => {
        const [rows] = await connection.execute('SELECT * FROM DadosFuracao WHERE idDadosFuracao = ?', [id]);
        return rows;
    },

    selecionarPorOperacaoProcesso: async (idOperacaoProcesso) => {
        const [rows] = await connection.execute('SELECT * FROM DadosFuracao WHERE idOperacaoProcesso = ?', [idOperacaoProcesso]);
        return rows;
    }
};

export default dadosFuracaoRepositories;
