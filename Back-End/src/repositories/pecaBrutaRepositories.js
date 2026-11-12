import { connection } from '../configs/Database.js';

const pecaBrutaRepositories = {
    criar: async (peca) => {
        const sql = 'INSERT INTO PecaBruta (idMaterial, idClientes, nome, forma, comprimento, diametro, largura, altura) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [peca.idMaterial, peca.idCliente, peca.nome, peca.forma, peca.comprimento, peca.diametro, peca.largura, peca.altura];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (peca) => {
        const sql = 'UPDATE PecaBruta SET idMaterial = ?, idClientes = ?, nome = ?, forma = ?, comprimento = ?, diametro = ?, largura = ?, altura = ? WHERE idPeca = ?';
        const values = [peca.idMaterial, peca.idCliente, peca.nome, peca.forma, peca.comprimento, peca.diametro, peca.largura, peca.altura, peca.idPeca];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idPeca) => {
        const [rows] = await connection.execute('DELETE FROM PecaBruta WHERE idPeca = ?', [idPeca]);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT pb.*, pb.idClientes AS idCliente, m.nome AS nomeMaterial FROM PecaBruta pb JOIN MaterialPeca m ON m.idMaterial = pb.idMaterial ORDER BY pb.idPeca DESC';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idPeca) => {
        const sql = 'SELECT pb.*, pb.idClientes AS idCliente, m.nome AS nomeMaterial FROM PecaBruta pb JOIN MaterialPeca m ON m.idMaterial = pb.idMaterial WHERE pb.idPeca = ?';
        const [rows] = await connection.execute(sql, [idPeca]);
        return rows;
    }
};

export default pecaBrutaRepositories;
