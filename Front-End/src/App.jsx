
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";

import Home from "./Pages/Home";
import Login from "./Pages/Login";

import Orcamentos from "./Pages/Orcamentos";
import Pecas from "./Pages/Pecas";
import Materiais from "./Pages/Materiais";
import Maquinas from "./Pages/Maquinas";
import Configuracoes from "./Pages/Configuracoes";
import Operacoes from "./Pages/Operacoes";

import {
  FiMenu,
  FiHome,
  FiDollarSign,
  FiPackage,
  FiSettings,
  FiUser,
  FiCpu,
  FiTool,
} from "react-icons/fi";

import { FaCalculator } from "react-icons/fa";

import "./index.css";

const PERFIS = {
  Operador: {
    cor: "#DC2626",
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
    cor: "#16A34A",
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
    cor: "#9333EA",
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
};

function SistemaInterno() {
  const location = useLocation();

  const role = PERFIS[location.state?.role]
    ? location.state.role
    : "Operador";

  const usuario = location.state?.usuario || "Usuário";

  const [menuAberto, setMenuAberto] = useState(false);
  const [itemAtivo, setItemAtivo] = useState("Calculadora");

  const paginasPermitidas = PERFIS[role].paginas;

  const itensMenu = [
    { nome: "Home", icone: FiHome },
    { nome: "Calculadora", icone: FaCalculator },
    { nome: "Orçamento", icone: FiDollarSign },
    { nome: "Materiais", icone: FiPackage },
    { nome: "Máquinas", icone: FiCpu },
    { nome: "Operações", icone: FiTool },
    { nome: "Configurações", icone: FiSettings },
    { nome: "Perfil", icone: FiUser },
  ];

  const itensVisiveis = itensMenu.filter((item) =>
    paginasPermitidas.includes(item.nome)
  );

  function selecionarPagina(nome) {
    if (paginasPermitidas.includes(nome)) {
      setItemAtivo(nome);
    }
  }

  function renderConteudo() {
    switch (itemAtivo) {
      case "Home":
        return <Home />;

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
          <div style={{ padding: "20px" }}>
            <h2>Perfil do usuário</h2>
            <p>Usuário: {usuario}</p>
            <p>Tipo de usuário: {role}</p>
          </div>
        );

      default:
        return <Pecas />;
    }
  }

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

  return (
    <div
      className="app-layout"
      style={{ "--cor-perfil": PERFIS[role].cor }}
    >
      <aside
        className={`sidebar ${
          menuAberto ? "sidebar-open" : ""
        }`}
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
                <Icone
                  className="menu-icon"
                  style={{
                    color:
                      itemAtivo === item.nome
                        ? PERFIS[role].cor
                        : undefined,
                  }}
                />

                <span className="menu-text">
                  {item.nome}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="main-content">
        <Header
          usuario={usuario}
          role={role}
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/sistema"
          element={<SistemaInterno />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
