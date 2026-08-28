import { connection } from "../configs/Database.js";

const materialPecaRepositories = {
    criar: async (material) => {
        const sql = 'INSERT INTO MaterialPeca (nome, medidas, custoPerKg) VALUES (?, ?, ?)';
        const values = [material.nome, material.medidas, material.custoPerKg];
        const [result] = await connection.execute(sql, values);
        return result;
    },
    
    editar: async (material) => {
        const sql = 'UPDATE MaterialPeca SET nome = ?, medidas = ?, custoPerKg = ? WHERE idMaterial = ?';
        const values = [material.nome, material.medidas, material.custoPerKg, material.idMaterial];
        const [result] = await connection.execute(sql, values);
        return result;
    },
    
    deletar: async (id) => {
        const sql = 'DELETE FROM MaterialPeca WHERE idMaterial = ?';
        const [result] = await connection.execute(sql, [id]);
        return result;
    },
    
    selecionar: async () => {
        const sql = 'SELECT * FROM MaterialPeca';
        const [result] = await connection.execute(sql);
        return result;
    },
    selecionarUm: async (id) => {
        const sql = 'SELECT * FROM MaterialPeca WHERE idMaterial = ?';
        const [result] = await connection.execute(sql, [id]);
        return result;
    }
};

export default materialPecaRepositories;