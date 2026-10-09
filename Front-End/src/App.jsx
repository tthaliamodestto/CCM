import React, { useState } from 'react';
import { ThemeProvider } from '../src/context/ThemeContext';

import Pecas from "./Pages/Pecas";
import Materiais from "./Pages/Materiais";
import Maquinas from "./Pages/Maquinas";
import Configuracoes from "./pages/Configuracoes";

import {
  FiMenu,
  FiHome,
  FiDollarSign,
  FiPackage,
  FiSettings,
  FiUser,
  FiCpu,
} from "react-icons/fi";

import { FaCalculator } from "react-icons/fa";

import "./index.css";

export default function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [itemAtivo, setItemAtivo] = useState("Calculadora");

  const itensMenu = [
    {
      nome: "Home",
      icone: FiHome,
      desabilitado: true, // Em desenvolvimento
    },
    {
      nome: "Calculadora",
      icone: FaCalculator,
      desabilitado: false,
    },
    {
      nome: "Orçamento",
      icone: FiDollarSign,
      desabilitado: true, // Em desenvolvimento
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
      nome: "Configurações",
      icone: FiSettings,
      desabilitado: false,  
    },
    {
      nome: "Perfil",
      icone: FiUser,
      desabilitado: true, // Em desenvolvimento
    },
  ];

  const handleMenuClick = (item) => {
    if (item.desabilitado) return; // Garante que não altera a página se estiver desabilitado
    setItemAtivo(item.nome);
  };

  const renderConteudo = () => {
    // AQUI ESTÁ O SWITCH CASE:
    switch (itemAtivo) {
      case "Calculadora":
        return <Pecas />;
      case "Materiais":
        return <Materiais />;
      case "Máquinas":
        return <Maquinas />;
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
        <div className="page-content">{renderConteudo()}</div>
      </main>
    </div>
  );
}