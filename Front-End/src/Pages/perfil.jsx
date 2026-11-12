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
  FiBriefcase,
  FiMapPin,
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
  const [cargo, setCargo] = useState("Especialista CNC");
  const [departamento, setDepartamento] = useState("Produção e Usinagem");

  const [fotoPreview, setFotoPreview] = useState(foto);
  const [fotoAlterada, setFotoAlterada] = useState(false);

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
    setMensagemSucesso("Informações pessoais atualizadas com sucesso!");
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
          <FiCheckCircle className="alert-icon-svg" /> <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* HEADER CARD DO PERFIL */}
      <div className="perfil-header-card">
        <div className="perfil-header-left">
          <div className="avatar-section-wrapper">
            <div className="avatar-wrapper">
              <div
                className="avatar-circle"
                style={{
                  backgroundColor: corFuncionario || "var(--accent-color, #AA8E52)",
                }}
              >
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Avatar" className="avatar-image-large" />
                ) : (
                  <span>{inicial}</span>
                )}
              </div>

              <label title="Alterar Foto" className="btn-avatar-pick">
                <FiCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelecionarFoto}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {fotoAlterada && (
              <div className="photo-actions-bar">
                <button type="button" onClick={handleSalvarFoto} className="btn-save-photo">
                  <FiCheckCircle /> Salvar
                </button>
                <button type="button" onClick={handleCancelarFoto} className="btn-cancel-photo">
                  <FiX /> Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="perfil-header-info">
            <div className="perfil-title-badge">
              <h2>{nome || "Usuário"}</h2>
              <span className={`badge-role badge-${role.toLowerCase()}`}>
                {role}
              </span>
            </div>
            <p className="perfil-email">
              <FiMail className="inline-icon" /> {usuario}
            </p>
          </div>
        </div>

        <button type="button" onClick={handleLogout} className="btn-logout">
          <FiLogOut /> Sair da Conta
        </button>
      </div>

      {/* SEÇÃO DE FORMULÁRIOS LARGOS */}
      <div className="perfil-grid">
        {/* DADOS PESSOAIS */}
        <div className="perfil-card">
          <div className="card-header">
            <FiUser className="card-icon" />
            <h3>Informações Pessoais</h3>
          </div>

          <form onSubmit={handleSalvarDados} className="perfil-form">
            <div className="form-group">
              <label>Nome Completo</label>
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

            <div className="form-group">
              <label>Cargo / Função</label>
              <div className="input-with-icon">
                <FiBriefcase className="input-icon" />
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ex: Operador CNC"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Departamento</label>
              <div className="input-with-icon">
                <FiMapPin className="input-icon" />
                <input
                  type="text"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  placeholder="Ex: Fabricação"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <FiSave /> Salvar Informações Pessoais
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
                placeholder="Repita a senha"
                required
              />
            </div>

            <button type="submit" className="btn-secondary" style={{ marginTop: "34px" }}>
              Atualizar Senha de Acesso
            </button>
          </form>
        </div>

        {/* PERMISSÕES */}
        <div className="perfil-card perfil-card-full">
          <div className="card-header">
            <FiShield className="card-icon" />
            <h3>Permissões de Acesso do Perfil ({role})</h3>
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