import { connection } from "../configs/Database.js";

const pecaFinalRepositories = {
    criar: async (pecaFinal) => {
        const sql = 'INSERT INTO PecaBruta (idPeca, nome, profundidadeFinal, diametroFinal, larguraFinal, alturaFinal) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [pecaFinal.idPeca, pecaFinal.nome, pecaFinal.profundidadeFinal, pecaFinal.diametroFinal, pecaFinal.larguraFinal, pecaFinal.alturaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    editar: async (pecaFinal) => {
        const sql = 'UPDATE PecaFinal SET idPeca = ?, nome = ?, profundidadeFinal = ?, diametroFinal = ?, larguraFinal = ?, alturaFinal = ? WHERE idPecaFinal = ?';
        const values = [pecaFinal.idPeca, pecaFinal.nome, pecaFinal.profundidadeFinal, pecaFinal.diametroFinal, pecaFinal.larguraFinal, pecaFinal.alturaFinal, pecaFinal.idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    deletar: async (idPecaFinal) => {
        const sql = 'DELETE FROM PecaBruta WHERE idPecaFinal = ?';
        const values = [idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    selecionar: async () => {
        const sql = 'SELECT * FROM PecaFinal';
        const [rows] = await connection.execute(sql);
        return rows;
    },
    selecionarUm: async (idPecaFinal) => {
        const sql = 'SELECT * FROM PecaFinal WHERE idPecaFinal = ?';
        const values = [idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    selecionarUm: async (idPecaFinal) => {
        const sql = 'SELECT * FROM pecafinal WHERE idPecaFinal = ?;';
        const values = [idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default pecaFinalRepositories;