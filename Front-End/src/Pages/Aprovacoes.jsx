
import { useEffect, useState } from "react";
import {
  getRequests,
  approveRequest,
  rejectRequest,
} from "../services/authService";
import "./Aprovacoes.css";

export default function Aprovacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [filtro, setFiltro] = useState("Pendente");
  const [mensagem, setMensagem] = useState("");

  function carregarSolicitacoes() {
    setSolicitacoes(getRequests());
  }

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  function handleApprove(id) {
    try {
      approveRequest(id);
      setMensagem("Solicitação aprovada com sucesso!");
      carregarSolicitacoes();
    } catch (error) {
      setMensagem(error.message);
    }
  }

  function handleReject(id) {
    try {
      rejectRequest(id);
      setMensagem("Solicitação recusada.");
      carregarSolicitacoes();
    } catch (error) {
      setMensagem(error.message);
    }
  }

  const solicitacoesFiltradas = solicitacoes.filter(
    (item) => item.status === filtro
  );

  const pendentes = solicitacoes.filter(
    (item) => item.status === "Pendente"
  ).length;

  return (
    <main className="approvals-page">
      <header className="approvals-header">
        <div>
          <span className="approvals-tag">
            ADMINISTRAÇÃO DO SISTEMA
          </span>

          <h1>Aprovação de acessos</h1>

          <p>
            Gerencie as solicitações de cadastro dos
            usuários do sistema CCM.
          </p>
        </div>

        <div className="approvals-counter">
          <span>Solicitações pendentes</span>
          <strong>{pendentes}</strong>
        </div>
      </header>

      <section className="approvals-content">
        <div className="approvals-toolbar">
          <div>
            <h2>Solicitações recebidas</h2>
            <p>Analise os pedidos de acesso ao sistema.</p>
          </div>

          <select
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
          >
            <option value="Pendente">Pendentes</option>
            <option value="Aprovada">Aprovadas</option>
            <option value="Recusada">Recusadas</option>
          </select>
        </div>

        {mensagem && (
          <div className="approvals-message">
            {mensagem}
            <button onClick={() => setMensagem("")}>
              ×
            </button>
          </div>
        )}

        {solicitacoesFiltradas.length === 0 ? (
          <div className="approvals-empty">
            <div className="approvals-empty-icon">
              <span>✓</span>
            </div>

            <h3>Nenhuma solicitação encontrada</h3>

            <p>
              Não existem solicitações com o status selecionado.
            </p>
          </div>
        ) : (
          <div className="approvals-list">
            {solicitacoesFiltradas.map((item) => (
              <article
                className="approval-card"
                key={item.id}
              >
                <div className="approval-user">
                  <div className="approval-avatar">
                    {item.nome.charAt(0).toUpperCase()}
                  </div>

                  <div className="approval-user-info">
                    <h3>{item.nome}</h3>
                    <span>{item.email}</span>
                  </div>
                </div>

                <div className="approval-details">
                  <div>
                    <span className="approval-label">
                      Função solicitada
                    </span>

                    <strong>{item.role}</strong>
                  </div>

                  <div>
                    <span className="approval-label">
                      Data da solicitação
                    </span>

                    <strong>
                      {new Date(item.criadoEm).toLocaleDateString(
                        "pt-BR"
                      )}
                    </strong>
                  </div>
                </div>

                <div className="approval-actions">
                  {item.status === "Pendente" ? (
                    <>
                      <button
                        className="approval-btn approve"
                        onClick={() => handleApprove(item.id)}
                      >
                        Aprovar
                      </button>

                      <button
                        className="approval-btn reject"
                        onClick={() => handleReject(item.id)}
                      >
                        Recusar
                      </button>
                    </>
                  ) : (
                    <span
                      className={`approval-status ${
                        item.status === "Aprovada"
                          ? "approved"
                          : "rejected"
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
