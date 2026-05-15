import { connection } from "../configs/Database.js";

const orcamentoRepository = {
    criar: async (orcamento) => {
        const sql = 'INSERT INTO orcamentos (material, peso, tempo, total) VALUES (?,?,?,?);';
        const values = [orcamento.material, orcamento.peso, orcamento.tempo, orcamento.total];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionarTodos: async () => {
        const sql = 'SELECT * FROM orcamentos ORDER BY id DESC;';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    deletar: async (id) => {
        const sql = 'DELETE FROM orcamentos WHERE id = ?;';
        const [rows] = await connection.execute(sql, [id]);
        return rows;
    }
};

export default orcamentoRepository;