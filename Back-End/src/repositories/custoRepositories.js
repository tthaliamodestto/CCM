import { connection } from '../configs/Database.js';

const custoRepositories = {
    criar: async (custo) => {
        const sql = 'INSERT INTO Custo (idProcesso, custoMaterial, custoMaquina, tarifaEnergiaAplicada) VALUES (?, ?, ?, ?)';
        const values = [custo.idProcesso, custo.custoMaterial, custo.custoMaquina, custo.tarifaEnergiaAplicada];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (custo) => {
        const sql = 'UPDATE Custo SET idProcesso = ?, custoMaterial = ?, custoMaquina = ?, tarifaEnergiaAplicada = ? WHERE idCusto = ?';
        const values = [custo.idProcesso, custo.custoMaterial, custo.custoMaquina, custo.tarifaEnergiaAplicada, custo.idCusto];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (idCusto) => {
        const [rows] = await connection.execute('DELETE FROM Custo WHERE idCusto = ?', [idCusto]);
        return rows;
    },

    selecionar: async () => {
        const sql = `
            SELECT c.*, (c.custoMaterial + c.custoMaquina) AS custoTotal,
                   p.idPeca, p.idPecaFinal, pb.nome AS nomePeca, pb.forma,
                   mat.nome AS nomeMaterial
            FROM Custo c
            JOIN ProcessoUsinagem p ON p.idProcesso = c.idProcesso
            JOIN PecaBruta pb ON pb.idPeca = p.idPeca
            JOIN MaterialPeca mat ON mat.idMaterial = pb.idMaterial
            ORDER BY c.idCusto DESC`;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarUm: async (idCusto) => {
        const sql = 'SELECT c.*, (c.custoMaterial + c.custoMaquina) AS custoTotal FROM Custo c WHERE c.idCusto = ?';
        const [rows] = await connection.execute(sql, [idCusto]);
        return rows;
    },

    selecionarPorProcesso: async (idProcesso) => {
        const [rows] = await connection.execute('SELECT * FROM Custo WHERE idProcesso = ?', [idProcesso]);
        return rows;
    },

    selecionarPorPecaFinal: async (idPecaFinal) => {
        const sql = `
            SELECT c.*, (c.custoMaterial + c.custoMaquina) AS custoTotal,
                   COALESCE((SELECT SUM(op.tempoUsinagem) FROM OperacaoProcesso op WHERE op.idProcesso = p.idProcesso), 0) AS tempoUsinagem
            FROM Custo c
            JOIN ProcessoUsinagem p ON p.idProcesso = c.idProcesso
            WHERE p.idPecaFinal = ?
            ORDER BY p.idProcesso`;
        const [rows] = await connection.execute(sql, [idPecaFinal]);
        return rows;
    },

    buscarDadosParaCalculo: async (idProcesso) => {
        const sql = `
            SELECT p.idProcesso, pb.idPeca, pb.nome AS nomePeca, pb.forma,
                   pb.comprimento, pb.diametro, pb.largura, pb.altura,
                   mat.nome AS nomeMaterial, mat.densidade, mat.custoPerKg
            FROM ProcessoUsinagem p
            JOIN PecaBruta pb ON pb.idPeca = p.idPeca
            JOIN MaterialPeca mat ON mat.idMaterial = pb.idMaterial
            WHERE p.idProcesso = ?`;
        const [rows] = await connection.execute(sql, [idProcesso]);
        return rows[0] || null;
    },

    buscarOperacoesParaCalculo: async (idProcesso) => {
        const sql = `
            SELECT op.idOperacaoProcesso, op.tempoUsinagem,
                   m.nome AS nomeMaquina, m.tipoUtilizacao, m.custoHora, m.potencialKw
            FROM OperacaoProcesso op
            JOIN Maquina m ON m.idMaquina = op.idMaquina
            WHERE op.idProcesso = ?
            ORDER BY op.ordem`;
        const [rows] = await connection.execute(sql, [idProcesso]);
        return rows;
    }
};

export default custoRepositories;
