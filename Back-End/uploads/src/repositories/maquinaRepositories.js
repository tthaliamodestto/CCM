import { connection } from '../configs/Database.js';

const maquinaRepositories = {
    criar: async (maquina) => {
        const sql = 'INSERT INTO Maquina (nome, tipoUtilizacao, custoHora, potencialKw, imagem) VALUES (?, ?, ?, ?, ?)';
        const [rows] = await connection.execute(sql, [maquina.nome, maquina.tipoUtilizacao, maquina.custoHora, maquina.potencialKw, maquina.imagem]);
        return rows;
    },

    editar: async (maquina) => {
        const sql = 'UPDATE Maquina SET nome = ?, tipoUtilizacao = ?, custoHora = ?, potencialKw = ?, imagem = ? WHERE idMaquina = ?';
        const [rows] = await connection.execute(sql, [maquina.nome, maquina.tipoUtilizacao, maquina.custoHora, maquina.potencialKw, maquina.imagem, maquina.idMaquina]);
        return rows;
    },

    deletar: async (idMaquina) => {
        const [rows] = await connection.execute('DELETE FROM Maquina WHERE idMaquina = ?', [idMaquina]);
        return rows;
    },

    selecionar: async () => {
        const [rows] = await connection.execute('SELECT * FROM Maquina ORDER BY idMaquina DESC');
        return rows;
    },

    selecionarUm: async (idMaquina) => {
        const [rows] = await connection.execute('SELECT * FROM Maquina WHERE idMaquina = ?', [idMaquina]);
        return rows;
    }
};

export default maquinaRepositories;
