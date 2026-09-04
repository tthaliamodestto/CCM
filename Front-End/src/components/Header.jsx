import React from 'react'

export default function Header({ titulo, subtitulo }) {
  return (
    <header className="page-header">

      {/* LOGO */}
      <div className="header-logo">
        <img
          src="/assets/Logo-CCM (2).png"
          alt="CCM Soluções Industriais"
        />
      </div>

      {/* MENU HORIZONTAL */}
      <nav className="header-nav">

        <span className="header-nav-item">
          <span className="material-symbols-outlined">
            info
          </span>
          Informações
        </span>

        <span className="header-nav-item">
          <span className="material-symbols-outlined">
            groups
          </span>
          Colaboradores
        </span>

        <span className="header-nav-item">
          <span className="material-symbols-outlined">
            attach_money
          </span>
          Custos
        </span>

        <span className="header-nav-item">
          <span className="material-symbols-outlined">
            precision_manufacturing
          </span>
          Máquinas
        </span>

      </nav>

      {/* PERFIL */}
      <div className="profile-area">

        <div className="profile-icon">
          <span className="material-symbols-outlined">
            person
          </span>
        </div>

        <div className="profile-info">
          <strong>Usuário</strong>
          <span>Administrador</span>
        </div>

      </div>

    </header>
  )
}