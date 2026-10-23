import React, { useState } from 'react';
import { ThemeProvider } from '../src/context/ThemeContext';

import Orcamentos from './Pages/Orcamentos';
import Header from "./components/Header";
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

export default function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [itemAtivo, setItemAtivo] = useState("Calculadora");

  // Estado para armazenar o perfil/função do usuário
  // Opções: 'Administrador', 'Operador', 'Analista'
  const [usuarioRole, setUsuarioRole] = useState('Administrador');

  const itensMenu = [
    {
      nome: "Home",
      icone: FiHome,
      desabilitado: true,
    },
    {
      nome: "Calculadora",
      icone: FaCalculator,
      desabilitado: false,
    },
    {
      nome: "Orçamento",
      icone: FiDollarSign,
      desabilitado: false,
    },
    {
      nome: "Materiais",
      icone: FiPackage,
      desabilitado: false,
    },
    {
      nome: "Máquinas",
      icone: FiCpu,
      desabilitado: false,
    },
    {
      nome: "Operações",
      icone: FiTool,
      desabilitado: false,
    },
    {
      nome: "Configurações",
      icone: FiSettings,
      desabilitado: false,
    },
    {
      nome: "Perfil",
      icone: FiUser,
      desabilitado: true,
    },
  ];

  const handleMenuClick = (item) => {
    if (item.desabilitado) return;
    setItemAtivo(item.nome);
  };

  const renderConteudo = () => {
    switch (itemAtivo) {
      case "Calculadora":
        return <Pecas />;

      case "Orçamento": // <--- ADICIONADO AQUI!
        return <Orcamentos />;

      case "Materiais":
        return <Materiais />;

      case "Máquinas":
        return <Maquinas />;

      case "Operações":
        return <Operacoes />;

      case "Configurações":
        return <Configuracoes />;

      default:
        return (
          <div style={{ padding: "20px" }}>
            <h2>{itemAtivo}</h2>
            <p>Página em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <div className="app-layout">

      {/* MENU LATERAL */}
      <aside
        className={`sidebar ${menuAberto ? "sidebar-open" : ""}`}
        onMouseEnter={() => setMenuAberto(true)}
        onMouseLeave={() => setMenuAberto(false)}
      >
        {/* BOTÃO DO MENU */}
        <div className="sidebar-top">
          <button
            className="sidebar-toggle"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            <FiMenu />
          </button>
        </div>

        <nav className="sidebar-menu">
          {itensMenu.map((item) => {
            const Icone = item.icone;

            return (
              <button
                key={item.nome}
                disabled={item.desabilitado}
                className={`menu-item ${
                  itemAtivo === item.nome ? "active" : ""
                } ${item.desabilitado ? "disabled" : ""}`}
                onClick={() => handleMenuClick(item)}
              >
                <Icone className="menu-icon" />
                <span className="menu-text">{item.nome}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="main-content">
        
        {/* HEADER DE PONTA A PONTA NO TOPO DA TELA */}
        <Header usuario="Usuário" role={usuarioRole} />

        {/* CONTEÚDO DA PÁGINA ABAIXO DO HEADER */}
        <div className="page-content">
          {renderConteudo()}
        </div>

      </main>

    </div>
  );
}