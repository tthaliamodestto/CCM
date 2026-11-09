
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestAccess } from "../services/authService";
import "./SolicitarAcesso.css";

export default function SolicitarAcesso() {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    const form = event.currentTarget;

    const nome = form.nome.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const role = form.role.value;

    if (password !== confirmPassword) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);

      await requestAccess({
        nome,
        email,
        password,
        role,
      });

      setSucesso(
        "Sua solicitação foi enviada! Aguarde a aprovação do administrador."
      );

      form.reset();
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="request-page">
      <section className="request-card">
        <Link to="/login" className="request-back">
          ← Voltar para o login
        </Link>

        <div className="request-header">
          <img
            src="/logos/Logo-CCM (2).png"
            alt="CCM"
            className="request-logo"
          />

          <span className="request-tag">
            ACESSO AO SISTEMA
          </span>

          <h1>Solicitar cadastro</h1>

          <p>
            Preencha seus dados para solicitar acesso
            ao Sistema de Orçamento Metalúrgico.
          </p>
        </div>

        <form
          className="request-form"
          onSubmit={handleSubmit}
        >
          <div className="request-field">
            <label htmlFor="nome">Nome completo</label>

            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Digite seu nome completo"
              required
            />
          </div>

          <div className="request-field">
            <label htmlFor="email">E-mail</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div className="request-field">
            <label htmlFor="role">Função desejada</label>

            <select
              id="role"
              name="role"
              defaultValue="Operador"
              required
            >
              <option value="Operador">Operador</option>
              <option value="Financeiro">Financeiro</option>
            </select>
          </div>

          <div className="request-field">
            <label htmlFor="password">Criar senha</label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Crie uma senha"
              minLength="8"
              required
            />

            <small>
              Mínimo de 8 caracteres, com maiúscula,
              minúscula, número e caractere especial.
            </small>
          </div>

          <div className="request-field">
            <label htmlFor="confirmPassword">
              Confirmar senha
            </label>

            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Digite a senha novamente"
              minLength="8"
              required
            />
          </div>

          {erro && (
            <div className="request-message error">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="request-message success">
              {sucesso}
            </div>
          )}

          <button
            type="submit"
            className="request-submit"
            disabled={carregando}
          >
            {carregando
              ? "ENVIANDO..."
              : "SOLICITAR ACESSO"}
          </button>
        </form>

        <footer className="request-footer">
          <span>
            A liberação do acesso depende da aprovação
            do administrador.
          </span>
        </footer>
      </section>
    </main>
  );
}
