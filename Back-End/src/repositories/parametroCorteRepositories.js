import { connection } from "../configs/Database.js";

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
        const sql = 'DELETE FROM ParametroCorte WHERE idParametro = ?';
        const values = [idParametro];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM ParametroCorte';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idParametro) => {
        const sql = 'SELECT * FROM ParametroCorte WHERE idParametro = ?';
        const values = [idParametro];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default parametroCorteRepositories;
