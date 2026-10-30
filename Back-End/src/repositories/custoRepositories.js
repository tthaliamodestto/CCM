import { connection } from "../configs/Database.js";

const custoRepositories = {
    criar: async (custo) => {
        const sql = `INSERT INTO Custo (idProcesso, custo_material, custo_maquina, custo_total) VALUES (?, ?, ?, ?);`;
        const values = [custo.idProcesso, custo.custoMaterial, custo.custoMaquina, custo.custoTotal];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (custo) => {
        const sql = `UPDATE Custo SET custo_material = ?, custo_maquina = ?, custo_total = ?, dataCalculo = NOW() WHERE idCusto = ?;`;
        const values = [custo.custoMaterial, custo.custoMaquina, custo.custoTotal, custo.idCusto];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idCusto) => {
        const sql = `DELETE FROM Custo WHERE idCusto = ?;`;
        const [rows] = await connection.execute(sql, [idCusto]);
        return rows;
    },

    // Tabela de custos: um registro por processo, já com peça, material e máquina
    selecionar: async () => {
        const sql = `
            SELECT c.idCusto, c.idProcesso, c.custo_material, c.custo_maquina, c.custo_total, c.dataCalculo,
                   pb.nome AS nomePeca, mat.nome AS nomeMaterial, m.nome AS nomeMaquina,
                   m.tipoUtilizacao, p.tempoUsinagem
            FROM Custo c
            JOIN processousinagem p ON p.idProcesso = c.idProcesso
            JOIN Maquina m ON m.idMaquina = p.idMaquina
            JOIN PecaFinal pf ON pf.idPecaFinal = p.idPecaFinal
            JOIN PecaBruta pb ON pb.idPeca = pf.idPeca
            JOIN MaterialPeca mat ON mat.idMaterial = pb.idMaterial
            ORDER BY c.idCusto DESC;`;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idCusto) => {
        const sql = `SELECT * FROM Custo WHERE idCusto = ?;`;
        const [rows] = await connection.execute(sql, [idCusto]);
        return rows;
    },

    selecionarPorProcesso: async (idProcesso) => {
        const sql = `SELECT * FROM Custo WHERE idProcesso = ?;`;
        const [rows] = await connection.execute(sql, [idProcesso]);
        return rows;
    },

    // Todos os custos de uma peça final (uma peça pode ter vários processos)
    selecionarPorPecaFinal: async (idPecaFinal) => {
        const sql = `
            SELECT c.idCusto, c.idProcesso, c.custo_material, c.custo_maquina, c.custo_total,
                   m.nome AS nomeMaquina, p.tempoUsinagem
            FROM Custo c
            JOIN processousinagem p ON p.idProcesso = c.idProcesso
            JOIN Maquina m ON m.idMaquina = p.idMaquina
            WHERE p.idPecaFinal = ?
            ORDER BY c.idProcesso;`;
        const [rows] = await connection.execute(sql, [idPecaFinal]);
        return rows;
    },

    // Reúne tudo o que é preciso para calcular o custo de um processo
    buscarDadosParaCalculo: async (idProcesso) => {
        const sql = `
            SELECT p.idProcesso, p.tempoUsinagem,
                   m.idMaquina, m.nome AS nomeMaquina, m.tipoUtilizacao, m.custoHora, m.potencialKw,
                   pb.idPeca, pb.nome AS nomePeca, pb.forma, pb.comprimento, pb.diametro, pb.largura, pb.altura,
                   mat.nome AS nomeMaterial, mat.densidade, mat.custoPerKg
            FROM processousinagem p
            JOIN Maquina m ON m.idMaquina = p.idMaquina
            JOIN PecaFinal pf ON pf.idPecaFinal = p.idPecaFinal
            JOIN PecaBruta pb ON pb.idPeca = pf.idPeca
            JOIN MaterialPeca mat ON mat.idMaterial = pb.idMaterial
            WHERE p.idProcesso = ?;`;
        const [rows] = await connection.execute(sql, [idProcesso]);
        return rows[0] || null;
    }
};

export default custoRepositories;