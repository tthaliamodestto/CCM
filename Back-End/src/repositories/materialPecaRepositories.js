import { connection } from '../configs/Database.js';

const materialPecaRepositories = {
    criar: async (material) => {
        const sql = 'INSERT INTO MaterialPeca (nome, densidade, custoPerKg, imagem) VALUES (?, ?, ?, ?)';
        const [rows] = await connection.execute(sql, [material.nome, material.densidade, material.custoPerKg, material.imagem]);
        return rows;
    },

    editar: async (material) => {
        const sql = 'UPDATE MaterialPeca SET nome = ?, densidade = ?, custoPerKg = ?, imagem = ? WHERE idMaterial = ?';
        const [rows] = await connection.execute(sql, [material.nome, material.densidade, material.custoPerKg, material.imagem, material.idMaterial]);
        return rows;
    },

    deletar: async (idMaterial) => {
        const [rows] = await connection.execute('DELETE FROM MaterialPeca WHERE idMaterial = ?', [idMaterial]);
        return rows;
    },

    selecionar: async () => {
        const [rows] = await connection.execute('SELECT * FROM MaterialPeca ORDER BY idMaterial DESC');
        return rows;
    },

    selecionarUm: async (idMaterial) => {
        const [rows] = await connection.execute('SELECT * FROM MaterialPeca WHERE idMaterial = ?', [idMaterial]);
        return rows;
    }
};

export default materialPecaRepositories;
