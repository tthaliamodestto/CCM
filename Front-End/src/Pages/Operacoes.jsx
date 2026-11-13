
import React, { useEffect, useState } from "react";
import "../css/Operacoes.css";
import operacaoService from "../services/operacaoService";

export default function Operacoes() {
    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("");
    const [descricao, setDescricao] = useState("");

    const [operacoes, setOperacoes] = useState([]);
    const [busca, setBusca] = useState("");
    const [editando, setEditando] = useState(null);

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    // Buscar operações no banco ao abrir a página
    useEffect(() => {
        carregarOperacoes();
    }, []);

    const carregarOperacoes = async () => {
        try {
            setCarregando(true);
            setErro("");

            const dados = await operacaoService.selecionar();
            setOperacoes(dados);
        } catch (error) {
            setErro(error.message || "Erro ao carregar operações.");
        } finally {
            setCarregando(false);
        }
    };

    const limparFormulario = () => {
        setNome("");
        setTipo("");
        setDescricao("");
        setEditando(null);
        setErro("");
    };

    // Cadastrar ou editar operação
    const handleSubmit = async (e) => {
        e.preventDefault();

        const dados = {
            nome: nome.trim(),
            tipo,
            descricao: descricao.trim() || null
        };

        if (!dados.nome || !dados.tipo) {
            setErro("Preencha o nome e o tipo da operação.");
            return;
        }

        try {
            setErro("");
            setCarregando(true);

            if (editando !== null) {
                await operacaoService.editar(editando, dados);
            } else {
                await operacaoService.cadastrar(dados);
            }

            await carregarOperacoes();
            limparFormulario();

        } catch (error) {
            setErro(error.message || "Não foi possível salvar a operação.");
        } finally {
            setCarregando(false);
        }
    };

    // Preencher formulário para edição
    const editarOperacao = (operacao) => {
        setNome(operacao.nome);
        setTipo(operacao.tipo);
        setDescricao(operacao.descricao || "");
        setEditando(operacao.idOperacao);
        setErro("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Excluir operação
    const excluirOperacao = async (idOperacao) => {
        const confirmar = window.confirm(
            "Deseja realmente excluir esta operação?"
        );

        if (!confirmar) return;

        try {
            setErro("");
            setCarregando(true);

            await operacaoService.deletar(idOperacao);

            await carregarOperacoes();

            if (editando === idOperacao) {
                limparFormulario();
            }

        } catch (error) {
            setErro(error.message || "Não foi possível excluir a operação.");
        } finally {
            setCarregando(false);
        }
    };

    // Filtrar operações pela busca
    const operacoesFiltradas = operacoes.filter((operacao) =>
        operacao.nome.toLowerCase().includes(busca.toLowerCase())
    );

    // Formatar o tipo para exibição
    const formatarTipo = (valor) => {
        const tipos = {
            torneamento: "Torneamento",
            faceamento: "Faceamento",
            furacao: "Furação",
            fresamento: "Fresamento"
        };

        return tipos[valor] || valor;
    };

    return (
        <div className="operacoes-page">

            {/* FORMULÁRIO */}
            <section className="operacoes-form-card">
                <h2 className="operacoes-section-title">
                    {editando !== null ? "Editar operação" : "Nova operação"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="operacoes-form-group">
                        <label htmlFor="nomeOperacao">
                            Nome da operação
                        </label>

                        <input
                            id="nomeOperacao"
                            type="text"
                            placeholder="Ex.: Torneamento Externo"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="operacoes-form-group">
                        <label htmlFor="tipoOperacao">
                            Tipo de operação
                        </label>

                        <select
                            id="tipoOperacao"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            required
                        >
                            <option value="">Selecione o tipo</option>
                            <option value="torneamento">Torneamento</option>
                            <option value="faceamento">Faceamento</option>
                            <option value="furacao">Furação</option>
                            <option value="fresamento">Fresamento</option>
                        </select>
                    </div>

                    <div className="operacoes-form-group">
                        <label htmlFor="descricaoOperacao">
                            Descrição
                        </label>

                        <textarea
                            id="descricaoOperacao"
                            placeholder="Descreva a operação (opcional)"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            maxLength={150}
                        />
                    </div>

                    {erro && (
                        <p className="operacoes-erro">
                            {erro}
                        </p>
                    )}

                    <div className="operacoes-form-buttons">
                        <button
                            type="submit"
                            className="operacoes-btn-cadastrar"
                            disabled={carregando}
                        >
                            <span className="material-symbols-outlined">
                                {editando !== null ? "save" : "add"}
                            </span>

                            {carregando
                                ? "Aguarde..."
                                : editando !== null
                                    ? "Salvar alterações"
                                    : "Cadastrar operação"}
                        </button>

                        {editando !== null && (
                            <button
                                type="button"
                                className="operacoes-btn-cancelar"
                                onClick={limparFormulario}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {/* TABELA */}
            <section className="operacoes-table-card">
                <div className="operacoes-table-header">
                    <div className="operacoes-table-heading">
                        <div className="operacoes-table-icon">
                            <span className="material-symbols-outlined">
                                table_rows
                            </span>
                        </div>

                        <div>
                            <h2>Operações cadastradas</h2>
                            <p>
                                Gerencie as operações já cadastradas no sistema.
                            </p>
                        </div>
                    </div>

                    <div className="operacoes-search">
                        <span className="material-symbols-outlined">
                            search
                        </span>

                        <input
                            type="text"
                            placeholder="Buscar operação..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                </div>

                {erro && (
                    <p className="operacoes-erro">
                        {erro}
                    </p>
                )}

                <div className="operacoes-table-wrapper">
                    <table className="operacoes-table">
                        <thead>
                            <tr>
                                <th className="operacoes-col-numero">#</th>
                                <th>Operação</th>
                                <th>Tipo</th>
                                <th>Descrição</th>
                                <th className="operacoes-col-acoes">Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {carregando ? (
                                <tr>
                                    <td colSpan="5" className="operacoes-empty">
                                        Carregando operações...
                                    </td>
                                </tr>
                            ) : operacoesFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="operacoes-empty">
                                        {busca
                                            ? "Nenhuma operação encontrada."
                                            : "Nenhuma operação cadastrada ainda."}
                                    </td>
                                </tr>
                            ) : (
                                operacoesFiltradas.map((operacao, index) => (
                                    <tr key={operacao.idOperacao}>
                                        <td className="operacoes-col-numero">
                                            {index + 1}
                                        </td>

                                        <td className="operacoes-nome-celula">
                                            {operacao.nome}
                                        </td>

                                        <td>
                                            {formatarTipo(operacao.tipo)}
                                        </td>

                                        <td>
                                            {operacao.descricao || "—"}
                                        </td>

                                        <td className="operacoes-col-acoes">
                                            <div className="operacoes-actions">
                                                <button
                                                    type="button"
                                                    className="operacoes-btn-editar"
                                                    title="Editar operação"
                                                    aria-label={`Editar ${operacao.nome}`}
                                                    onClick={() => editarOperacao(operacao)}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        edit
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="operacoes-btn-excluir"
                                                    title="Excluir operação"
                                                    aria-label={`Excluir ${operacao.nome}`}
                                                    onClick={() => excluirOperacao(operacao.idOperacao)}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="operacoes-table-footer">
                    <span>
                        Mostrando {operacoesFiltradas.length} de{" "}
                        {operacoes.length} operações
                    </span>
                </div>
            </section>
        </div>
    );
}
