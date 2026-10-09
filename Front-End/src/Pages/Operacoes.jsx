import React, { useContext, useState, useEffect } from "react";
import Header from "../components/Header";
import { ThemeContext } from "../context/ThemeContext";

export default function Operacoes() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [tempo, setTempo] = useState("");
  const [operacoes, setOperacoes] = useState([]);

  useEffect(() => {
    const dados = localStorage.getItem("ccm_operacoes");

    if (dados) {
      setOperacoes(JSON.parse(dados));
    }
  }, []);

  const salvarOperacoes = (lista) => {
    setOperacoes(lista);
    localStorage.setItem("ccm_operacoes", JSON.stringify(lista));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const novaOperacao = {
      id: Date.now(),
      nome: nome.trim(),
      preco: Number(preco),
      tempo: Number(tempo),
    };

    if (!novaOperacao.nome || preco === "" || tempo === "") {
      alert("Preencha todos os campos.");
      return;
    }

    salvarOperacoes([...operacoes, novaOperacao]);

    setNome("");
    setPreco("");
    setTempo("");

    alert("Operação cadastrada com sucesso!");
  };

  const excluirOperacao = (id) => {
    const listaAtualizada = operacoes.filter(
      (operacao) => operacao.id !== id
    );

    salvarOperacoes(listaAtualizada);
  };

  return (
    <div className="operacoes-container">
      <h2>Cadastro de Operações</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Nome da operação</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Torneamento externo"
            required
          />
        </div>

        <div className="form-group">
          <label>Preço da operação (R$)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Ex.: 35,00"
            required
          />
        </div>

        <div className="form-group">
          <label>Tempo estimado (minutos)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
            placeholder="Ex.: 15"
            required
          />
        </div>

        <button type="submit">Cadastrar operação</button>
      </form>

      <div className="operacoes-lista">
        <h3>Operações cadastradas ({operacoes.length})</h3>

        {operacoes.map((operacao) => (
          <div className="material-item" key={operacao.id}>
            <div className="material-info">
              <strong>{operacao.nome}</strong>
              <span>
                Preço: R$ {operacao.preco.toFixed(2)}
              </span>
              <span>
                Tempo estimado: {operacao.tempo} minutos
              </span>
            </div>

            <button
              type="button"
              className="botao-excluir"
              onClick={() => excluirOperacao(operacao.id)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
