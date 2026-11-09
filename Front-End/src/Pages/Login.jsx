
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  login,
  getUsers,
  createInitialAdmin,
} from "../services/authService";

import "./Login.css";

const ADMIN_EMAIL = "ma3109278@gmail.com";

export default function Login() {
  const navigate = useNavigate();

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [modoAdmin, setModoAdmin] = useState(false);

  const [adminExiste, setAdminExiste] = useState(() =>
    getUsers().some((user) => user.role === "Administrador")
  );

  // ========================================
  // LOGIN NORMAL
  // ========================================

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    const form = event.currentTarget;

    const email = form.email.value;
    const password = form.password.value;

    try {
      setCarregando(true);

      await login({
        email,
        password,
      });

      navigate("/sistema", { replace: true });
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  // ========================================
  // CADASTRO DO PRIMEIRO ADMINISTRADOR
  // ========================================

  async function handleAdminSubmit(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    const form = event.currentTarget;

    const nome = form.nome.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);

      await createInitialAdmin({
        nome,
        email,
        password,
      });

      setAdminExiste(true);
      setModoAdmin(false);

      setSucesso(
        "Administrador cadastrado! Agora você já pode entrar com seu e-mail e senha."
      );
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  // ========================================
  // INTERFACE
  // ========================================

  return (
    <div className="login-page">
      <section className="login-visual">
        <div className="login-visual-overlay"></div>

        <div className="login-visual-content">
          <img
            src="/logos/logo-ccm.png"
            alt="CCM"
            className="login-logo-visual"
          />

          <div className="visual-text">
            <span>TECNOLOGIA • PRODUÇÃO • GESTÃO</span>

            <h2>
              Tecnologia que
              <br />
              move a indústria.
            </h2>

            <p>
              Precisão, eficiência e inovação para processos
              industriais mais inteligentes.
            </p>
          </div>
        </div>
      </section>

      <section className="login-form-area">
        <div className="login-form-container">
          <Link to="/" className="login-back">
            ← Voltar para o início
          </Link>

          <div className="login-header">
            <img
              src="/logos/Logo-CCM (2).png"
              alt="CCM"
              className="login-logo"
            />

            <h1>
              {modoAdmin
                ? "Configurar administrador"
                : "Bem-vindo ao CCM"}
            </h1>

            <p>
              {modoAdmin
                ? "Cadastre a conta inicial de administração."
                : "Acesse o sistema de orçamento metalúrgico."}
            </p>
          </div>

          {erro && (
            <div className="login-message login-error">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="login-message login-success">
              {sucesso}
            </div>
          )}

          {/* ================================= */}
          {/* FORMULÁRIO DE LOGIN */}
          {/* ================================= */}

          {!modoAdmin && (
            <>
              <form
                className="login-form"
                onSubmit={handleSubmit}
              >
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Digite seu e-mail"
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="password-label">
                    <label htmlFor="password">Senha</label>

                    <a href="#forgot">
                      Esqueceu sua senha?
                    </a>
                  </div>

                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="remember-area">
                  <label>
                    <input
                      type="checkbox"
                      name="remember"
                    />

                    <span>Lembrar de mim</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={carregando}
                >
                  {carregando ? "ENTRANDO..." : "ENTRAR"}
                </button>

                <div className="login-divider">
                  <span>ou continue com</span>
                </div>

                <button
                  type="button"
                  className="google-button"
                  onClick={() =>
                    alert(
                      "O login com Google ainda não está conectado."
                    )
                  }
                >
                  <svg
                    className="google-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 12.27c0-.79-.07-1.55-.23-2.27H12v4.3h5.22a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.93-4.2 2.93-7.39z"
                    />

                    <path
                      fill="#34A853"
                      d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.75 9.75 0 0 0 12 21.5z"
                    />

                    <path
                      fill="#FBBC05"
                      d="M6.54 13.61A5.86 5.86 0 0 1 6.23 12c0-.56.1-1.1.31-1.61V7.89H3.3A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.11l3.24-2.5z"
                    />

                    <path
                      fill="#EA4335"
                      d="M12 6.36c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.46 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.39l3.24 2.5C7.31 8.08 9.46 6.36 12 6.36z"
                    />
                  </svg>

                  <span>Entrar com Google</span>
                </button>
              </form>

              <div className="login-footer">
                <p>
                  Ainda não possui acesso?
                  {" "}
                  <Link to="/solicitar-acesso">
                    Solicite seu cadastro
                  </Link>
                </p>

                {!adminExiste && (
                  <p>
                    Primeiro acesso administrativo?
                    {" "}
                    <button
                      type="button"
                      className="admin-setup-link"
                      onClick={() => {
                        setErro("");
                        setSucesso("");
                        setModoAdmin(true);
                      }}
                    >
                      Configurar administrador
                    </button>
                  </p>
                )}
              </div>
            </>
          )}

          {/* ================================= */}
          {/* FORMULÁRIO DO PRIMEIRO ADMIN */}
          {/* ================================= */}

          {modoAdmin && !adminExiste && (
            <form
              className="login-form"
              onSubmit={handleAdminSubmit}
            >
              <div className="form-group">
                <label htmlFor="admin-nome">
                  Nome completo
                </label>

                <input
                  type="text"
                  id="admin-nome"
                  name="nome"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-email">
                  E-mail administrativo
                </label>

                <input
                  type="email"
                  id="admin-email"
                  name="email"
                  value={ADMIN_EMAIL}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-password">
                  Criar senha
                </label>

                <input
                  type="password"
                  id="admin-password"
                  name="password"
                  placeholder="Crie sua senha"
                  minLength="8"
                  autoComplete="new-password"
                  required
                />

                <small className="password-help">
                  Mínimo de 8 caracteres, com maiúscula,
                  minúscula, número e caractere especial.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="admin-confirm-password">
                  Confirmar senha
                </label>

                <input
                  type="password"
                  id="admin-confirm-password"
                  name="confirmPassword"
                  placeholder="Digite a senha novamente"
                  minLength="8"
                  autoComplete="new-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={carregando}
              >
                {carregando
                  ? "CADASTRANDO..."
                  : "CADASTRAR ADMINISTRADOR"}
              </button>

              <div className="login-footer">
                <button
                  type="button"
                  className="admin-setup-link"
                  onClick={() => {
                    setErro("");
                    setModoAdmin(false);
                  }}
                >
                  ← Voltar para o login
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
