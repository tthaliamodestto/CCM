import React, { useEffect, useState } from "react";
import "../css/Operacoes.css"

export default function Operacoes() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [tempo, setTempo] = useState("");

  const [operacoes, setOperacoes] = useState([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const dados = localStorage.getItem("ccm_operacoes");

    if (dados) {
      try {
        setOperacoes(JSON.parse(dados));
      } catch {
        setOperacoes([]);
      }
    }
  }, []);

  const salvarOperacoes = (lista) => {
    setOperacoes(lista);
    localStorage.setItem("ccm_operacoes", JSON.stringify(lista));
  };

  const limparFormulario = () => {
    setNome("");
    setPreco("");
    setTempo("");
    setEditando(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nomeOperacao = nome.trim();
    const precoOperacao = Number(preco.replace(",", "."));
    const tempoOperacao = Number(tempo);

    if (!nomeOperacao || preco === "" || tempo === "") {
      alert("Preencha todos os campos.");
      return;
    }

    if (
      !Number.isFinite(precoOperacao) ||
      !Number.isFinite(tempoOperacao) ||
      precoOperacao < 0 ||
      tempoOperacao <= 0
    ) {
      alert("Informe um preço válido e um tempo maior que zero.");
      return;
    }

    if (editando !== null) {
      const listaAtualizada = operacoes.map((operacao) =>
        operacao.id === editando
          ? {
              ...operacao,
              nome: nomeOperacao,
              preco: precoOperacao,
              tempo: tempoOperacao,
            }
          : operacao
      );

      salvarOperacoes(listaAtualizada);
    } else {
      const novaOperacao = {
        id: Date.now(),
        nome: nomeOperacao,
        preco: precoOperacao,
        tempo: tempoOperacao,
      };

      salvarOperacoes([...operacoes, novaOperacao]);
    }

    limparFormulario();
  };

  const editarOperacao = (operacao) => {
    setNome(operacao.nome);
    setPreco(String(operacao.preco).replace(".", ","));
    setTempo(String(operacao.tempo));
    setEditando(operacao.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const excluirOperacao = (id) => {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta operação?"
    );

    if (!confirmar) return;

    const listaAtualizada = operacoes.filter(
      (operacao) => operacao.id !== id
    );

    salvarOperacoes(listaAtualizada);

    if (editando === id) {
      limparFormulario();
    }
  };

  const operacoesFiltradas = operacoes.filter((operacao) =>
    operacao.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const formatarPreco = (valor) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

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
              required
            />
          </div>

          <div className="operacoes-form-row">
            <div className="operacoes-form-group">
              <label htmlFor="precoOperacao">
                Preço da operação (R$)
              </label>

              <input
                id="precoOperacao"
                type="text"
                inputMode="decimal"
                placeholder="Ex.: 35,00"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>

            <div className="operacoes-form-group">
              <label htmlFor="tempoOperacao">
                Tempo estimado (minutos)
              </label>

              <input
                id="tempoOperacao"
                type="number"
                min="1"
                step="1"
                placeholder="Ex.: 15"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="operacoes-form-buttons">
            <button
              type="submit"
              className="operacoes-btn-cadastrar"
            >
              <span className="material-symbols-outlined">
                {editando !== null ? "save" : "add"}
              </span>

              {editando !== null
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

      {/* PLANILHA */}
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

        <div className="operacoes-table-wrapper">
          <table className="operacoes-table">
            <thead>
              <tr>
                <th className="operacoes-col-numero">#</th>
                <th>Operação</th>
                <th className="operacoes-col-preco">Preço (R$)</th>
                <th className="operacoes-col-tempo">Tempo (min)</th>
                <th className="operacoes-col-acoes">Ações</th>
              </tr>
            </thead>

            <tbody>
              {operacoesFiltradas.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="operacoes-empty"
                  >
                    {busca
                      ? "Nenhuma operação encontrada."
                      : "Nenhuma operação cadastrada ainda."}
                  </td>
                </tr>
              ) : (
                operacoesFiltradas.map((operacao, index) => (
                  <tr key={operacao.id}>
                    <td className="operacoes-col-numero">
                      {index + 1}
                    </td>

                    <td className="operacoes-nome-celula">
                      {operacao.nome}
                    </td>

                    <td className="operacoes-col-preco">
                      {formatarPreco(operacao.preco)}
                    </td>

                    <td className="operacoes-col-tempo">
                      {operacao.tempo}
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
                          onClick={() => excluirOperacao(operacao.id)}
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
