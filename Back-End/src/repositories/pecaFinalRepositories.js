import { connection } from "../configs/Database.js";

const pecaFinalRepositories = {
    criar: async (pecaFinal) => {
        const sql = 'INSERT INTO PecaFinal (nome, forma, comprimentoFinal, diametroMaximoFinal, larguraFinal, alturaFinal, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [pecaFinal.nome, pecaFinal.forma, pecaFinal.comprimentoFinal, pecaFinal.diametroMaximoFinal ?? 0, pecaFinal.larguraFinal ?? 0, pecaFinal.alturaFinal ?? 0, pecaFinal.imagem ?? null];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (pecaFinal) => {
        const sql = 'UPDATE PecaFinal SET nome = ?, forma = ?, comprimentoFinal = ?, diametroMaximoFinal = ?, larguraFinal = ?, alturaFinal = ?, imagem = ? WHERE idPecaFinal = ?';
        const values = [pecaFinal.nome, pecaFinal.forma, pecaFinal.comprimentoFinal, pecaFinal.diametroMaximoFinal ?? 0, pecaFinal.larguraFinal ?? 0, pecaFinal.alturaFinal ?? 0, pecaFinal.imagem ?? null, pecaFinal.idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idPecaFinal) => {
        const sql = 'DELETE FROM PecaFinal WHERE idPecaFinal = ?';
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
    }
};

export default pecaFinalRepositories;
