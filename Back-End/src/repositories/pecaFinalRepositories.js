import { connection } from '../configs/Database.js';

const pecaFinalRepositories = {
    criar: async (pecaFinal) => {
        const sql = 'INSERT INTO PecaFinal (idClientes, nome, forma, comprimentoFinal, diametroMaximoFinal, larguraFinal, alturaFinal, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [pecaFinal.idCliente, pecaFinal.nome, pecaFinal.forma, pecaFinal.comprimentoFinal, pecaFinal.diametroMaximoFinal, pecaFinal.larguraFinal, pecaFinal.alturaFinal, pecaFinal.imagem];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (pecaFinal) => {
        const sql = 'UPDATE PecaFinal SET idClientes = ?, nome = ?, forma = ?, comprimentoFinal = ?, diametroMaximoFinal = ?, larguraFinal = ?, alturaFinal = ?, imagem = ? WHERE idPecaFinal = ?';
        const values = [pecaFinal.idCliente, pecaFinal.nome, pecaFinal.forma, pecaFinal.comprimentoFinal, pecaFinal.diametroMaximoFinal, pecaFinal.larguraFinal, pecaFinal.alturaFinal, pecaFinal.imagem, pecaFinal.idPecaFinal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idPecaFinal) => {
        const [rows] = await connection.execute('DELETE FROM PecaFinal WHERE idPecaFinal = ?', [idPecaFinal]);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT pf.*, pf.idClientes AS idCliente FROM PecaFinal pf ORDER BY pf.idPecaFinal DESC';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idPecaFinal) => {
        const sql = 'SELECT pf.*, pf.idClientes AS idCliente FROM PecaFinal pf WHERE pf.idPecaFinal = ?';
        const [rows] = await connection.execute(sql, [idPecaFinal]);
        return rows;
    }
};

export default pecaFinalRepositories;
