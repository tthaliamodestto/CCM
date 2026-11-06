import { connection } from "../configs/Database.js";

const pecaBrutaRepositories = {
    criar: async (peca) => {
        const sql = 'INSERT INTO PecaBruta (idMaterial, idCliente, nome, forma, comprimento, diametro, largura, altura) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [peca.idMaterial, peca.idCliente, peca.nome, peca.forma, peca.comprimento, peca.diametro ?? 0, peca.largura ?? 0, peca.altura ?? 0];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    editar: async (peca) => {
        const sql = 'UPDATE PecaBruta SET idMaterial = ?, idCliente = ?, nome = ?, forma = ?, comprimento = ?, diametro = ?, largura = ?, altura = ? WHERE idPeca = ?';
        const values = [peca.idMaterial, peca.idCliente, peca.nome, peca.forma, peca.comprimento, peca.diametro ?? 0, peca.largura ?? 0, peca.altura ?? 0, peca.idPeca];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    deletar: async (idPeca) => {
        const sql = 'DELETE FROM PecaBruta WHERE idPeca = ?';
        const values = [idPeca];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    selecionar: async () => {
        const sql = 'SELECT * FROM PecaBruta';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idPeca) => {
        const sql = 'SELECT * FROM PecaBruta WHERE idPeca = ?';
        const values = [idPeca];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default pecaBrutaRepositories;