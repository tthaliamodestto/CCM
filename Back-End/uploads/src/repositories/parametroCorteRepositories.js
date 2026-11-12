import { connection } from '../configs/Database.js';

const parametroCorteRepositories = {
    criar: async (parametro) => {
        const sql = 'INSERT INTO ParametroCorte (idMaterial, idOperacao, velocidadeCorte, avanco, tipoAvanco, profundidadeCorte) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [parametro.idMaterial, parametro.idOperacao, parametro.velocidadeCorte, parametro.avanco, parametro.tipoAvanco, parametro.profundidadeCorte];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (parametro) => {
        const sql = 'UPDATE ParametroCorte SET idMaterial = ?, idOperacao = ?, velocidadeCorte = ?, avanco = ?, tipoAvanco = ?, profundidadeCorte = ? WHERE idParametro = ?';
        const values = [parametro.idMaterial, parametro.idOperacao, parametro.velocidadeCorte, parametro.avanco, parametro.tipoAvanco, parametro.profundidadeCorte, parametro.idParametro];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idParametro) => {
        const [rows] = await connection.execute('DELETE FROM ParametroCorte WHERE idParametro = ?', [idParametro]);
        return rows;
    },

    selecionar: async () => {
        const [rows] = await connection.execute('SELECT * FROM ParametroCorte ORDER BY idParametro DESC');
        return rows;
    },

    selecionarUm: async (idParametro) => {
        const [rows] = await connection.execute('SELECT * FROM ParametroCorte WHERE idParametro = ?', [idParametro]);
        return rows;
    }
};

export default parametroCorteRepositories;
