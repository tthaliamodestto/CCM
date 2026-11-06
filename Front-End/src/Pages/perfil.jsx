import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiShield,
  FiLock,
  FiPhone,
  FiCheckCircle,
  FiCamera,
  FiSave,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import "./Perfil.css";

export default function Perfil({
  usuario,
  role,
  nome,
  setNome,
  foto,
  setFoto,
  corFuncionario,
  paginasPermitidas = [],
}) {
  const navigate = useNavigate();

  const [tempNome, setTempNome] = useState(nome);
  const [telefone, setTelefone] = useState("");

  // Estados da foto e pré-visualização
  const [fotoPreview, setFotoPreview] = useState(foto);
  const [fotoAlterada, setFotoAlterada] = useState(false);

  // Estados de alteração de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  useEffect(() => {
    setFotoPreview(foto);
  }, [foto]);

  const handleSelecionarFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("A foto deve ter no máximo 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
        setFotoAlterada(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvarFoto = () => {
    setFoto(fotoPreview);
    setFotoAlterada(false);
    setMensagemSucesso("Foto de perfil salva com sucesso!");
    setTimeout(() => setMensagemSucesso(""), 3000);
  };

  const handleCancelarFoto = () => {
    setFotoPreview(foto);
    setFotoAlterada(false);
  };

  const handleSalvarDados = (e) => {
    e.preventDefault();
    setNome(tempNome);
    setMensagemSucesso("Nome atualizado com sucesso!");
    setTimeout(() => setMensagemSucesso(""), 3000);
  };

  const handleSalvarSenha = (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    setMensagemSucesso("Senha alterada com sucesso!");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setTimeout(() => setMensagemSucesso(""), 3000);
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair do sistema?")) {
      navigate("/");
    }
  };

  const inicial = tempNome
    ? tempNome.charAt(0).toUpperCase()
    : usuario.charAt(0).toUpperCase();

  return (
    <div className="perfil-container">
      {mensagemSucesso && (
        <div className="alert-success">
          <FiCheckCircle /> {mensagemSucesso}
        </div>
      )}

      {/* HEADER CARD DO PERFIL COM BOTÃO DE SAIR */}
      <div
        className="perfil-header-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* ESTRUTURA BLINDADA DO AVATAR (130px) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                position: "relative",
                width: "130px",
                height: "130px",
                minWidth: "130px",
                minHeight: "130px",
              }}
            >
              {/* CÍRCULO QUE CORTA A IMAGEM */}
              <div
                style={{
                  width: "130px",
                  height: "130px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid var(--accent-color, #AA8E52)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  backgroundColor: corFuncionario || "var(--accent-color, #AA8E52)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {fotoPreview ? (
                  <img
                    src={fotoPreview}
                    alt="Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "3rem", fontWeight: "bold", color: "#ffffff" }}>
                    {inicial}
                  </span>
                )}
              </div>

              {/* ÍCONE DE CÂMERA SOBREPOSTO NO CANTO INFERIOR DIREITO */}
              <label
                title="Alterar Foto"
                style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-color, #22314d)",
                  color: "#ffffff",
                  border: "3px solid #ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
                  zIndex: 10,
                }}
              >
                <FiCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelecionarFoto}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {/* BOTÕES SALVAR/CANCELAR EM FORMATO DE PÍLULA */}
            {fotoAlterada && (
              <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={handleSalvarFoto}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#ffffff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    boxShadow: "0 2px 6px rgba(22, 163, 74, 0.3)",
                  }}
                >
                  <FiCheckCircle /> Salvar
                </button>
                <button
                  type="button"
                  onClick={handleCancelarFoto}
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    border: "1px solid #cbd5e1",
                    padding: "6px 10px",
                    borderRadius: "20px",
                    fontSize: "0.78rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FiX /> Cancelar
                </button>
              </div>
            )}
          </div>

          {/* DADOS DO USUÁRIO NO BANNER */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700" }}>
                {nome || "Usuário"}
              </h2>
              <span className={`badge-role badge-${role.toLowerCase()}`}>
                {role}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                color: "var(--text-gray, #64748b)",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FiMail /> {usuario}
            </p>
          </div>
        </div>

        {/* BOTÃO DE SAIR */}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            backgroundColor: "#ef4444",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "0.88rem",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)",
            transition: "background-color 0.2s ease",
          }}
        >
          <FiLogOut /> Sair da Conta
        </button>
      </div>

      {/* SEÇÃO DE FORMULÁRIOS */}
      <div className="perfil-grid">
        {/* DADOS PESSOAIS */}
        <div className="perfil-card">
          <div className="card-header">
            <FiUser className="card-icon" />
            <h3>Informações Pessoais</h3>
          </div>

          <form onSubmit={handleSalvarDados} className="perfil-form">
            <div className="form-group">
              <label>Nome Completo do Usuário</label>
              <input
                type="text"
                value={tempNome}
                onChange={(e) => setTempNome(e.target.value)}
                placeholder="Digite seu nome"
                required
              />
            </div>

            <div className="form-group">
              <label>E-mail Cadastrado</label>
              <input type="email" value={usuario} disabled className="input-disabled" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Telefone / WhatsApp</label>
                <div className="input-with-icon">
                  <FiPhone className="input-icon" />
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nível de Acesso</label>
                <input type="text" value={role} disabled className="input-disabled" />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <FiSave /> Salvar Alterações de Nome
            </button>
          </form>
        </div>

        {/* ALTERAÇÃO DE SENHA */}
        <div className="perfil-card">
          <div className="card-header">
            <FiLock className="card-icon" />
            <h3>Segurança & Senha</h3>
          </div>

          <form onSubmit={handleSalvarSenha} className="perfil-form">
            <div className="form-group">
              <label>Senha Atual</label>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label>Nova Senha</label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Nova senha"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirmar Nova Senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a nova senha"
                required
              />
            </div>

            <button type="submit" className="btn-secondary">
              Atualizar Senha
            </button>
          </form>
        </div>

        {/* PERMISSÕES */}
        <div className="perfil-card perfil-card-full">
          <div className="card-header">
            <FiShield className="card-icon" />
            <h3>Permissões de Acesso ({role})</h3>
          </div>

          <div className="permissions-grid">
            {paginasPermitidas.map((pagina) => (
              <div key={pagina} className="permission-item">
                <FiCheckCircle className="check-icon" />
                <span>{pagina}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}