import { connection } from "../configs/Database.js";

const parametroCorteRepositories = {
    criar: async (parametro) => {
        const sql = `INSERT INTO parametrocorte (idMaterial, idOperacao, velocidadeCorte, avanco, profundidadeCorte) VALUES (?, ?, ?, ?, ?);`;
        const values = [parametro.idMaterial, parametro.idOperacao, parametro.velocidadeCorte, parametro.avanco, parametro.profundidadeCorte];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    editar: async (parametro) => {
        const sql = `UPDATE parametrocorte SET idMaterial=?, idOperacao=?, velocidadeCorte=?, avanco=?, profundidadeCorte=? WHERE idParametro = ?;`;
        const values = [parametro.idMaterial, parametro.idOperacao, parametro.velocidadeCorte, parametro.avanco, parametro.profundidadeCorte, parametro.idParametro];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    deletar: async (idParametro) => {
        const sql = 'DELETE FROM parametrocorte WHERE idParametro = ?;';
        const values = [idParametro];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    selecionar: async () => {
        const sql = 'SELECT * FROM parametrocorte;';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idParametro) => {
        const sql = 'SELECT * FROM parametrocorte WHERE idParametro = ?;';
        const values = [idParametro];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default parametroCorteRepositories;