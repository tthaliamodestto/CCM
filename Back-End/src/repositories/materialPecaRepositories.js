import { connection } from "../configs/Database.js";

const materialPecaRepositories = {
    criar: async (material) => {
        const sql = 'INSERT INTO MaterialPeca (nome, densidade, custoPerKg, imagem) VALUES (?, ?, ?, ?)';
        const values = [material.nome, material.densidade, material.custoPerKg, material.imagem];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    editar: async (material) => {
        const sql = 'UPDATE MaterialPeca SET nome = ?, densidade = ?, custoPerKg = ? WHERE idMaterial = ?';
        const values = [material.nome, material.densidade, material.custoPerKg, material.idMaterial];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    deletar: async (idMaterial) => {
        const sql = 'DELETE FROM MaterialPeca WHERE idMaterial = ?';
        const values = [idMaterial];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    
    selecionar: async () => {
        const sql = 'SELECT * FROM MaterialPeca';
        const [rows] = await connection.execute(sql);
        return rows;
    },
    
    selecionarUm: async (idMaterial) => {
        const sql = 'SELECT * FROM MaterialPeca WHERE idMaterial = ?';
        const values = [idMaterial];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default materialPecaRepositories;