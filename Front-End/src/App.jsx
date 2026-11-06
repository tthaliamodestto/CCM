import { useState } from "react";
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
import Perfil from "./Pages/perfil";

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
    ],
  },
};

const CORES_FUNCIONARIOS = {
  "funcionario1@ccm.com": "#2563EB",
  "funcionario2@ccm.com": "#9333EA",
  "matheus.a.luiz@aluno.senai.br": "#AA8E52",
};

function SistemaInterno() {
  const location = useLocation();

  const role = PERFIS[location.state?.role]
    ? location.state.role
    : "Administrador";

  const usuario = location.state?.usuario || "modestonathalia52@gmail.com";

  // Gera um nome inicial a partir do e-mail caso não tenha sido enviado no Login
  const nomeInicial = location.state?.nome || 
    (usuario.includes("@") ? usuario.split("@")[0] : usuario);

  // ESTADOS DO USUÁRIO QUE SERÃO COMPARTILHADOS PELO SISTEMA
  const [nome, setNome] = useState(nomeInicial);
  const [foto, setFoto] = useState(null); // Armazena a foto em Base64

  const corFuncionario =
    CORES_FUNCIONARIOS[usuario.toLowerCase()] || "#AA8E52";

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

  function selecionarPagina(nomeItem) {
    if (paginasPermitidas.includes(nomeItem)) {
      setItemAtivo(nomeItem);
    }
  }

  function renderConteudo() {
    switch (itemAtivo) {
      case "Home":
        return <Home usuario={usuario} nome={nome} role={role} />;

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
    if (destino) selecionarPagina(destino);
  }

  const paginaHeader =
    {
      Calculadora: "pecas",
      Orçamento: "orcamentos",
      Máquinas: "maquinas",
    }[itemAtivo] || "";

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
                <span className="menu-text">{item.nome}</span>
              </button>
            );
          })}
        </nav>
      </aside>

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

        <div className="page-content">{renderConteudo()}</div>
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
        <Route path="/sistema" element={<SistemaInterno />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}