import { useEffect, useState } from "react";
import {
  getUsers,
  getRequests,
  approveRequest,
  rejectRequest,
} from "../services/authService";

import "./Aprovacoes.css";

const ADMIN_EMAIL = "ma3109278@gmail.com";

const PAGINAS_DISPONIVEIS = [
  "Home",
  "Calculadora",
  "Orçamento",
  "Materiais",
  "Máquinas",
  "Operações",
  "Configurações",
  "Perfil",
];

const PERMISSOES_PADRAO = {
  Operador: [
    "Home",
    "Calculadora",
    "Materiais",
    "Máquinas",
    "Operações",
    "Configurações",
    "Perfil",
  ],
  Financeiro: PAGINAS_DISPONIVEIS,
  Administrador: PAGINAS_DISPONIVEIS,
};

function formatarData(data) {
  if (!data) return "—";

  return new Date(data).toLocaleDateString("pt-BR");
}

export default function Aprovacoes() {
  const [usuarios, setUsuarios] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [filtro, setFiltro] = useState("Pendente");

  const [editando, setEditando] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function carregarDados() {
    setUsuarios(getUsers());
    setSolicitacoes(getRequests());
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function mostrarMensagem(texto) {
    setMensagem(texto);
    setErro("");

    window.setTimeout(() => {
      setMensagem("");
    }, 3500);
  }

  function mostrarErro(texto) {
    setErro(texto);
    setMensagem("");
  }

  function handleAprovar(id) {
    try {
      approveRequest(id);
      carregarDados();
      mostrarMensagem("Solicitação aprovada com sucesso.");
    } catch (error) {
      mostrarErro(error.message);
    }
  }

  function handleRecusar(id) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja recusar esta solicitação?"
    );

    if (!confirmar) return;

    try {
      rejectRequest(id);
      carregarDados();
      mostrarMensagem("Solicitação recusada.");
    } catch (error) {
      mostrarErro(error.message);
    }
  }

  function abrirEdicao(usuario) {
    setEditando({
      ...usuario,
      paginasPermitidas: Array.isArray(usuario.paginasPermitidas)
        ? [...usuario.paginasPermitidas]
        : [...(PERMISSOES_PADRAO[usuario.role] || [])],
    });

    setErro("");
    setMensagem("");
  }

  function alterarCampo(campo, valor) {
    setEditando((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function alterarPermissao(pagina, marcada) {
    setEditando((atual) => {
      const permissoesAtuais = atual.paginasPermitidas || [];

      const novasPermissoes = marcada
        ? [...permissoesAtuais, pagina]
        : permissoesAtuais.filter((item) => item !== pagina);

      return {
        ...atual,
        paginasPermitidas: novasPermissoes,
      };
    });
  }

  function salvarEdicao(event) {
    event.preventDefault();

    if (!editando) return;

    const nome = editando.nome.trim();
    const email = editando.email.trim().toLowerCase();

    if (!nome || !email) {
      mostrarErro("Preencha o nome e o e-mail do usuário.");
      return;
    }

    const emailJaExiste = usuarios.some(
      (usuario) =>
        usuario.id !== editando.id &&
        usuario.email.toLowerCase() === email
    );

    if (emailJaExiste) {
      mostrarErro("Este e-mail já está sendo utilizado por outro usuário.");
      return;
    }

    if (editando.paginasPermitidas.length === 0) {
      mostrarErro("Selecione pelo menos uma permissão de página.");
      return;
    }

    try {
      const usuariosAtualizados = usuarios.map((usuario) =>
        usuario.id === editando.id
          ? {
              ...usuario,
              nome,
              email,
              role: editando.role,
              paginasPermitidas: editando.paginasPermitidas,
            }
          : usuario
      );

      localStorage.setItem(
        "ccm_users",
        JSON.stringify(usuariosAtualizados)
      );

      setUsuarios(usuariosAtualizados);
      setEditando(null);
      mostrarMensagem("Dados e permissões atualizados com sucesso.");
    } catch {
      mostrarErro("Não foi possível salvar as alterações.");
    }
  }

  function alterarStatus(usuario) {
    if (usuario.email.toLowerCase() === ADMIN_EMAIL) {
      mostrarErro("A conta principal de administrador não pode ser desativada.");
      return;
    }

    const novoStatus =
      usuario.status === "ativo" ? "inativo" : "ativo";

    const confirmar = window.confirm(
      `Deseja ${novoStatus === "ativo" ? "ativar" : "desativar"} o acesso de ${usuario.nome}?`
    );

    if (!confirmar) return;

    const usuariosAtualizados = usuarios.map((item) =>
      item.id === usuario.id
        ? { ...item, status: novoStatus }
        : item
    );

    localStorage.setItem(
      "ccm_users",
      JSON.stringify(usuariosAtualizados)
    );

    setUsuarios(usuariosAtualizados);

    mostrarMensagem(
      novoStatus === "ativo"
        ? "Usuário ativado com sucesso."
        : "Usuário desativado com sucesso."
    );
  }

  function removerUsuario(usuario) {
    if (usuario.email.toLowerCase() === ADMIN_EMAIL) {
      mostrarErro("A conta principal de administrador não pode ser removida.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja realmente remover o usuário ${usuario.nome}? Essa ação não poderá ser desfeita.`
    );

    if (!confirmar) return;

    const usuariosAtualizados = usuarios.filter(
      (item) => item.id !== usuario.id
    );

    localStorage.setItem(
      "ccm_users",
      JSON.stringify(usuariosAtualizados)
    );

    setUsuarios(usuariosAtualizados);
    mostrarMensagem("Usuário removido com sucesso.");
  }

  const solicitacoesFiltradas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === filtro
  );

  const usuariosFiltrados = usuarios.filter(
    (usuario) => filtro === "Usuários" ||
      (filtro === "Usuários ativos" && usuario.status === "ativo") ||
      (filtro === "Usuários inativos" && usuario.status !== "ativo")
  );

  const totalPendentes = solicitacoes.filter(
    (item) => item.status === "Pendente"
  ).length;

  return (
    <main className="approvals-page">
      <header className="approvals-header">
        <div>
          <span className="approvals-tag">
            Administração do sistema
          </span>

          <h1>Gerenciamento de acessos</h1>

          <p>
            Gerencie solicitações, usuários, funções e permissões do CCM.
          </p>
        </div>

        <div className="approvals-counter">
          <span>Solicitações pendentes</span>
          <strong>{totalPendentes}</strong>
        </div>
      </header>

      <section className="approvals-content">
        <div className="approvals-toolbar">
          <div>
            <h2>Usuários e solicitações</h2>
            <p>
              Aprove cadastros ou gerencie os acessos já liberados.
            </p>
          </div>

          <select
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
          >
            <option value="Pendente">Solicitações pendentes</option>
            <option value="Aprovada">Solicitações aprovadas</option>
            <option value="Recusada">Solicitações recusadas</option>
            <option value="Usuários">Todos os usuários</option>
            <option value="Usuários ativos">Usuários ativos</option>
            <option value="Usuários inativos">Usuários inativos</option>
          </select>
        </div>

        {mensagem && (
          <div className="approvals-message">
            {mensagem}
            <button onClick={() => setMensagem("")}>×</button>
          </div>
        )}

        {erro && (
          <div className="approvals-message error">
            {erro}
            <button onClick={() => setErro("")}>×</button>
          </div>
        )}

        <div className="approvals-list">
          {filtro.startsWith("Usuários") ? (
            usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((usuario) => (
                <article className="approval-card" key={usuario.id}>
                  <div className="approval-user">
                    <div className="approval-avatar">
                      {usuario.nome?.charAt(0).toUpperCase()}
                    </div>

                    <div className="approval-user-info">
                      <h3>{usuario.nome}</h3>
                      <span>{usuario.email}</span>
                    </div>
                  </div>

                  <div className="approval-details">
                    <div>
                      <span className="approval-label">Função</span>
                      <strong>{usuario.role}</strong>
                    </div>

                    <div>
                      <span className="approval-label">Status</span>
                      <strong>
                        {usuario.status === "ativo" ? "Ativo" : "Inativo"}
                      </strong>
                    </div>
                  </div>

                  <div className="approval-actions">
                    <button
                      className="approval-btn edit"
                      onClick={() => abrirEdicao(usuario)}
                    >
                      Editar
                    </button>

                    {usuario.email.toLowerCase() !== ADMIN_EMAIL && (
                      <>
                        <button
                          className="approval-btn deactivate"
                          onClick={() => alterarStatus(usuario)}
                        >
                          {usuario.status === "ativo" ? "Desativar" : "Ativar"}
                        </button>

                        <button
                          className="approval-btn reject"
                          onClick={() => removerUsuario(usuario)}
                        >
                          Remover
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="approvals-empty">
                <h3>Nenhum usuário encontrado</h3>
                <p>Não existem usuários nesta categoria.</p>
              </div>
            )
          ) : solicitacoesFiltradas.length > 0 ? (
            solicitacoesFiltradas.map((solicitacao) => (
              <article className="approval-card" key={solicitacao.id}>
                <div className="approval-user">
                  <div className="approval-avatar">
                    {solicitacao.nome?.charAt(0).toUpperCase()}
                  </div>

                  <div className="approval-user-info">
                    <h3>{solicitacao.nome}</h3>
                    <span>{solicitacao.email}</span>
                  </div>
                </div>

                <div className="approval-details">
                  <div>
                    <span className="approval-label">Função solicitada</span>
                    <strong>{solicitacao.role}</strong>
                  </div>

                  <div>
                    <span className="approval-label">Data da solicitação</span>
                    <strong>{formatarData(solicitacao.criadoEm)}</strong>
                  </div>
                </div>

                <div className="approval-actions">
                  {solicitacao.status === "Pendente" ? (
                    <>
                      <button
                        className="approval-btn approve"
                        onClick={() => handleAprovar(solicitacao.id)}
                      >
                        Aprovar
                      </button>

                      <button
                        className="approval-btn reject"
                        onClick={() => handleRecusar(solicitacao.id)}
                      >
                        Recusar
                      </button>
                    </>
                  ) : (
                    <span
                      className={`approval-status ${
                        solicitacao.status === "Aprovada"
                          ? "approved"
                          : "rejected"
                      }`}
                    >
                      {solicitacao.status}
                    </span>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="approvals-empty">
              <h3>Nenhuma solicitação encontrada</h3>
              <p>Não há solicitações nesta categoria no momento.</p>
            </div>
          )}
        </div>
      </section>

      {editando && (
        <div
          className="edit-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditando(null);
            }
          }}
        >
          <section className="edit-modal">
            <header className="edit-modal-header">
              <div>
                <span className="approvals-tag">
                  Gerenciamento de usuário
                </span>

                <h2>Editar usuário</h2>

                <p>
                  Altere os dados, a função e as permissões de acesso.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setEditando(null)}
                aria-label="Fechar"
              >
                ×
              </button>
            </header>

            <form onSubmit={salvarEdicao}>
              <div className="edit-form-grid">
                <div className="edit-field">
                  <label htmlFor="edit-nome">Nome completo</label>
                  <input
                    id="edit-nome"
                    type="text"
                    value={editando.nome}
                    onChange={(event) =>
                      alterarCampo("nome", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="edit-field">
                  <label htmlFor="edit-email">E-mail</label>
                  <input
                    id="edit-email"
                    type="email"
                    value={editando.email}
                    onChange={(event) =>
                      alterarCampo("email", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="edit-field">
                  <label htmlFor="edit-role">Função</label>
                  <select
                    id="edit-role"
                    value={editando.role}
                    onChange={(event) =>
                      alterarCampo("role", event.target.value)
                    }
                    disabled={
                      editando.email.toLowerCase() === ADMIN_EMAIL
                    }
                  >
                    <option value="Operador">Operador</option>
                    <option value="Financeiro">Financeiro</option>
                    {editando.email.toLowerCase() === ADMIN_EMAIL && (
                      <option value="Administrador">Administrador</option>
                    )}
                  </select>
                </div>
              </div>

              <section className="permissions-section">
                <h3>Permissões de páginas</h3>
                <p>
                  Selecione quais áreas este usuário poderá acessar.
                </p>

                <div className="permissions-grid">
                  {PAGINAS_DISPONIVEIS.map((pagina) => (
                    <label className="permission-item" key={pagina}>
                      <input
                        type="checkbox"
                        checked={editando.paginasPermitidas.includes(pagina)}
                        onChange={(event) =>
                          alterarPermissao(pagina, event.target.checked)
                        }
                        disabled={
                          editando.email.toLowerCase() === ADMIN_EMAIL
                        }
                      />

                      <span>{pagina}</span>
                    </label>
                  ))}
                </div>
              </section>

              <div className="edit-modal-actions">
                <button
                  type="button"
                  className="approval-btn cancel"
                  onClick={() => setEditando(null)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="approval-btn save"
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}