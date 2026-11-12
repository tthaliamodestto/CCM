import { connection } from '../configs/Database.js';

const dadosTorneamentoRepositories = {
    criar: async (registro) => {
        const sql = 'INSERT INTO DadosTorneamento (idOperacaoProcesso, comprimentoTorneamento, diametroInicial, diametroFinal) VALUES (?, ?, ?, ?)';
        const values = [registro.idOperacaoProcesso, registro.comprimentoTorneamento, registro.diametroInicial, registro.diametroFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (registro) => {
        const sql = 'UPDATE DadosTorneamento SET idOperacaoProcesso = ?, comprimentoTorneamento = ?, diametroInicial = ?, diametroFinal = ? WHERE idDadosTorneamento = ?';
        const values = [registro.idOperacaoProcesso, registro.comprimentoTorneamento, registro.diametroInicial, registro.diametroFinal, registro.idDadosTorneamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (id) => {
        const [rows] = await connection.execute('DELETE FROM DadosTorneamento WHERE idDadosTorneamento = ?', [id]);
        return rows;
    },

    selecionar: async () => {
        const [rows] = await connection.execute('SELECT * FROM DadosTorneamento ORDER BY idDadosTorneamento DESC');
        return rows;
    },

    selecionarUm: async (id) => {
        const [rows] = await connection.execute('SELECT * FROM DadosTorneamento WHERE idDadosTorneamento = ?', [id]);
        return rows;
    },

    selecionarPorOperacaoProcesso: async (idOperacaoProcesso) => {
        const [rows] = await connection.execute('SELECT * FROM DadosTorneamento WHERE idOperacaoProcesso = ?', [idOperacaoProcesso]);
        return rows;
    }
};

export default dadosTorneamentoRepositories;
