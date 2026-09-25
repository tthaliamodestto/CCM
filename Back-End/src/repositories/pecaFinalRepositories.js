import { connection } from "../configs/Database.js";

const pecaFinalRepositories = {
    criar: async (pecaFinal) => {
        // Correção: a query original inseria na tabela "PecaBruta" por engano.
        const sql = 'INSERT INTO PecaFinal (idPeca, nome, profundidadeFinal, diametroFinal, larguraFinal, alturaFinal) VALUES (?, ?, ?, ?, ?, ?)';
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
        // Correção: a query original deletava na tabela "PecaBruta" por engano.
        const sql = 'DELETE FROM PecaFinal WHERE idPecaFinal = ?';
        const values = [idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        // A coluna "imagem" (BLOB) fica de fora da listagem geral de propósito:
        // ela pode ser pesada e não é necessária para exibir a lista de peças.
        const sql = 'SELECT idPecaFinal, idPeca, nome, profundidadeFinal, diametroFinal, larguraFinal, alturaFinal, (imagem IS NOT NULL) AS possuiImagem FROM PecaFinal';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idPecaFinal) => {
        const sql = 'SELECT idPecaFinal, idPeca, nome, profundidadeFinal, diametroFinal, larguraFinal, alturaFinal, (imagem IS NOT NULL) AS possuiImagem FROM PecaFinal WHERE idPecaFinal = ?';
        const values = [idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    // ---- Imagem (armazenada como BLOB na própria tabela PecaFinal) ----

    salvarImagem: async (idPecaFinal, bufferImagem, tipoImagem) => {
        const sql = 'UPDATE PecaFinal SET imagem = ?, imagemTipo = ? WHERE idPecaFinal = ?';
        const values = [bufferImagem, tipoImagem, idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    buscarImagem: async (idPecaFinal) => {
        const sql = 'SELECT imagem, imagemTipo FROM PecaFinal WHERE idPecaFinal = ?';
        const values = [idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows[0];
    },

    removerImagem: async (idPecaFinal) => {
        const sql = 'UPDATE PecaFinal SET imagem = NULL, imagemTipo = NULL WHERE idPecaFinal = ?';
        const values = [idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default pecaFinalRepositories;
