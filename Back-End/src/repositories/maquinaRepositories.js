import { connection } from "../configs/Database.js";

const maquinaRepositories = {
<<<<<<< HEAD
    criar: async (maquina = {}) => {
        const sql = `INSERT INTO maquina (nome, tipo, custoHora, potencialKw) VALUES (?, ?, ?, ?);`;
        
        // Lê com ou sem a letra 'L' (potencialKw ou potenciaKw) e garante que nenhum parâmetro seja undefined
        const values = [
            maquina.nome ?? maquina.nomeMaquina ?? null,
            maquina.tipo ?? "Torno CNC",
            maquina.custoHora ?? maquina.custo_hora ?? 0,
            maquina.potencialKw ?? maquina.potenciaKw ?? maquina.potencia_kw ?? 0
        ];

=======
    criar: async (maquina) => {
        const sql = `INSERT INTO maquina (nome, tipo, custoHora, potencialKw, imagem) VALUES (?, ?, ?, ?, ?);`;
        const values = [maquina.nome, maquina.tipo, maquina.custoHora, maquina.potencialKw, maquina.imagem];
>>>>>>> 2e3716a757bc3f0013ade2840625f3c83a1cef36
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (maquina = {}) => {
        const sql = `UPDATE maquina SET nome = ?, tipo = ?, custoHora = ?, potencialKw = ? WHERE idMaquina = ?;`;
        
        const values = [
            maquina.nome ?? maquina.nomeMaquina ?? null,
            maquina.tipo ?? "Torno CNC",
            maquina.custoHora ?? maquina.custo_hora ?? 0,
            maquina.potencialKw ?? maquina.potenciaKw ?? maquina.potencia_kw ?? 0,
            maquina.idMaquina ?? maquina.id ?? null
        ];

        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idMaquina) => {
        const sql = 'DELETE FROM maquina WHERE idMaquina = ?;';
        const values = [idMaquina ?? null];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM maquina;';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idMaquina) => {
        const sql = 'SELECT * FROM maquina WHERE idMaquina = ?;';
        const values = [idMaquina ?? null];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default maquinaRepositories;