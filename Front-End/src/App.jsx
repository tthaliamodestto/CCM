import React, { useState } from 'react';

import Pecas from './Pages/Pecas';
import Materiais from './Pages/Materiais';
import Maquinas from './Pages/Maquinas';

import {
  FiMenu,
  FiHome,
  FiDollarSign,
  FiPackage,
  FiSettings,
  FiUser,
  FiCpu
} from 'react-icons/fi';

import { FaCalculator } from 'react-icons/fa';

import './index.css';

export default function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [itemAtivo, setItemAtivo] = useState('Calculadora');

  const itensMenu = [
    {
      nome: 'Home',
      icone: FiHome
    },
    {
      nome: 'Calculadora',
      icone: FaCalculator
    },
    {
      nome: 'Orçamento',
      icone: FiDollarSign
    },
    {
      nome: 'Materiais',
      icone: FiPackage
    },
    {
      nome: 'Máquinas',
      icone: FiCpu
    },
    {
      nome: 'Configurações',
      icone: FiSettings
    },
    {
      nome: 'Perfil',
      icone: FiUser
    }
  ];

  const handleMenuClick = (nome) => {
    setItemAtivo(nome);
  };

  const renderConteudo = () => {
    switch (itemAtivo) {
      case 'Calculadora':
        return <Pecas />;
      case 'Materiais':
        return <Materiais />;
      case 'Máquinas':
        return <Maquinas />;
      default:
        return (
          <div style={{ padding: '20px' }}>
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
        className={`sidebar ${menuAberto ? 'sidebar-open' : ''}`}
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

        {/* ITENS DO MENU */}
        <nav className="sidebar-menu">
          {itensMenu.map((item) => {
            const Icone = item.icone;

            return (
              <button
                key={item.nome}
                className={`menu-item ${
                  itemAtivo === item.nome ? 'active' : ''
                }`}
                onClick={() => handleMenuClick(item.nome)}
              >
                <Icone className="menu-icon" />

                <span className="menu-text">
                  {item.nome}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="main-content">
        <div className="page-content">
          {renderConteudo()}
        </div>
      </main>
    </div>
  );
}