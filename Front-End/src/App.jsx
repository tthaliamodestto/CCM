
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SolicitarAcesso from "./Pages/SolicitarAcesso";
import Aprovacoes from "./Pages/Aprovacoes";

import Orcamentos from "./Pages/Orcamentos";
import Pecas from "./Pages/Pecas";
import Materiais from "./Pages/Materiais";
import Maquinas from "./Pages/Maquinas";
import Configuracoes from "./Pages/Configuracoes";
import Operacoes from "./Pages/Operacoes";
import Perfil from "./Pages/perfil";

import { getSession } from "./services/authService";

import {
  FiMenu,
  FiHome,
  FiDollarSign,
  FiPackage,
  FiSettings,
  FiUser,
  FiCpu,
  FiTool,
  FiShield,
  FiLogOut,
} from "react-icons/fi";

import { FaCalculator } from "react-icons/fa";

import "./index.css";

// ========================================
// PERMISSÕES DE CADA TIPO DE USUÁRIO
// ========================================

const PERFIS = {
  Operador: {
    paginas: [
      "Home",
      "Calculadora",
      "Materiais",
      "Máquinas",
      "Operações",
      "Configurações",
      "Perfil",
    ],
  },

  Financeiro: {
    paginas: [
      "Home",
      "Calculadora",
      "Orçamento",
      "Materiais",
      "Máquinas",
      "Operações",
      "Configurações",
      "Perfil",
    ],
  },

  Administrador: {
    paginas: [
      "Home",
      "Calculadora",
      "Orçamento",
      "Materiais",
      "Máquinas",
      "Operações",
      "Configurações",
      "Perfil",
      "Aprovações",
    ],
  },
};

// ========================================
// CORES DOS FUNCIONÁRIOS
// ========================================

const CORES_FUNCIONARIOS = {
  "funcionario1@ccm.com": "#2563EB",
  "funcionario2@ccm.com": "#9333EA",
  "matheus.a.luiz@aluno.senai.br": "#AA8E52",
  "ma3109278@gmail.com": "#9333EA",
};

// ========================================
// SISTEMA INTERNO
// ========================================

function SistemaInterno() {
  const session = getSession();

  // Impede acesso sem sessão ou com função inválida
  if (!session || !PERFIS[session.role]) {
    return <Navigate to="/login" replace />;
  }

  const role = session.role;
  const usuario = session.email;

  const nomeInicial =
    session.nome ||
    (usuario.includes("@") ? usuario.split("@")[0] : usuario);

  // Estados compartilhados pelo sistema
  const [nome, setNome] = useState(nomeInicial);
  const [foto, setFoto] = useState(null);

  const [menuAberto, setMenuAberto] = useState(false);
  const [itemAtivo, setItemAtivo] = useState("Home");

  const corFuncionario =
    CORES_FUNCIONARIOS[usuario.toLowerCase()] || "#AA8E52";

  const paginasPermitidas = PERFIS[role].paginas;

  // ========================================
  // ITENS DO MENU
  // ========================================

  const itensMenu = [
    { nome: "Home", icone: FiHome },
    { nome: "Calculadora", icone: FaCalculator },
    { nome: "Orçamento", icone: FiDollarSign },
    { nome: "Materiais", icone: FiPackage },
    { nome: "Máquinas", icone: FiCpu },
    { nome: "Operações", icone: FiTool },
    { nome: "Configurações", icone: FiSettings },
    { nome: "Perfil", icone: FiUser },
    { nome: "Aprovações", icone: FiShield },
  ];

  const itensVisiveis = itensMenu.filter((item) =>
    paginasPermitidas.includes(item.nome)
  );

  // ========================================
  // NAVEGAÇÃO
  // ========================================

  function selecionarPagina(nomeItem) {
    if (paginasPermitidas.includes(nomeItem)) {
      setItemAtivo(nomeItem);
      setMenuAberto(false);
    }
  }

  // ========================================
  // SAIR DO SISTEMA
  // ========================================

  function sairDoSistema() {
    // Limpa os dados de sessão conhecidos
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("ccm_session");

    // Retorna para o login
    window.location.href = "/login";
  }

  // ========================================
  // CONTEÚDO DAS PÁGINAS
  // ========================================

  function renderConteudo() {
    switch (itemAtivo) {
      case "Home":
        return (
          <Home
            usuario={usuario}
            nome={nome}
            role={role}
          />
        );

      case "Calculadora":
        return <Pecas />;

      case "Orçamento":
        return <Orcamentos />;

      case "Materiais":
        return <Materiais />;

      case "Máquinas":
        return <Maquinas />;

      case "Operações":
        return <Operacoes />;

      case "Configurações":
        return <Configuracoes />;

      case "Perfil":
        return (
          <Perfil
            usuario={usuario}
            role={role}
            nome={nome}
            setNome={setNome}
            foto={foto}
            setFoto={setFoto}
            corFuncionario={corFuncionario}
            paginasPermitidas={paginasPermitidas}
          />
        );

      case "Aprovações":
        return role === "Administrador" ? (
          <Aprovacoes />
        ) : (
          <Home usuario={usuario} nome={nome} role={role} />
        );

      default:
        return <Home usuario={usuario} nome={nome} role={role} />;
    }
  }

  // ========================================
  // NAVEGAÇÃO PELO HEADER
  // ========================================

  function navegarPeloHeader(pagina) {
    const mapa = {
      pecas: "Calculadora",
      orcamentos: "Orçamento",
      maquinas: "Máquinas",
    };

    const destino = mapa[pagina];

    if (destino) {
      selecionarPagina(destino);
    }
  }

  const paginaHeader = {
    Calculadora: "pecas",
    Orçamento: "orcamentos",
    Máquinas: "maquinas",
  }[itemAtivo] || "";

  // ========================================
  // INTERFACE
  // ========================================

  return (
    <div className="app-layout">
      <aside
        className={`sidebar ${menuAberto ? "sidebar-open" : ""}`}
        onMouseEnter={() => setMenuAberto(true)}
        onMouseLeave={() => setMenuAberto(false)}
      >
        <div className="sidebar-top">
          <button
            className="sidebar-toggle"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Abrir ou fechar menu"
          >
            <FiMenu />
          </button>
        </div>

        {/* MENU PRINCIPAL */}
        <nav className="sidebar-menu">
          {itensVisiveis.map((item) => {
            const Icone = item.icone;

            return (
              <button
                key={item.nome}
                className={`menu-item ${
                  itemAtivo === item.nome ? "active" : ""
                }`}
                onClick={() => selecionarPagina(item.nome)}
              >
                <Icone className="menu-icon" />

                <span className="menu-text">
                  {item.nome}
                </span>
              </button>
            );
          })}
        </nav>

        {/* BOTÃO SAIR FIXADO NA PARTE INFERIOR */}
        <div className="sidebar-bottom">
          <button
            className="menu-item logout-button"
            onClick={sairDoSistema}
            title="Sair do sistema"
          >
            <FiLogOut className="menu-icon" />

            <span className="menu-text">
              Sair
            </span>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-content">
        <Header
          usuario={usuario}
          nome={nome}
          foto={foto}
          role={role}
          corFuncionario={corFuncionario}
          paginaAtiva={paginaHeader}
          setPaginaAtiva={navegarPeloHeader}
          paginasPermitidas={paginasPermitidas}
        />

        <div className="page-content">
          {renderConteudo()}
        </div>
      </main>
    </div>
  );
}

// ========================================
// ROTAS PRINCIPAIS
// ========================================

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial pública */}
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Solicitação de cadastro */}
        <Route
          path="/solicitar-acesso"
          element={<SolicitarAcesso />}
        />

        {/* Sistema interno */}
        <Route
          path="/sistema"
          element={<SistemaInterno />}
        />

        {/* Rota de segurança */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
