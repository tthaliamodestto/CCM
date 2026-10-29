import React from 'react'

export default function Header({ paginaAtiva, setPaginaAtiva, usuario = "Usuário", role = "Administrador" }) {
  const getRoleBadgeClass = (userRole) => {
    switch (userRole?.toLowerCase()) {
      case 'administrador':
      case 'admin':
        return 'badge-admin'
      case 'operador':
        return 'badge-operador'
      case 'analista':
        return 'badge-analista'
      default:
        return 'badge-default'
    }
  }

  return (
    <header className="page-header">
      <div className="header-logo">
        <img
          src="/assets/logo-ccm.png"
          alt="CCM Soluções Industriais"
        />
      </div>

      <nav className="header-nav">
        <span
          className={`header-nav-item ${paginaAtiva === 'pecas' ? 'active' : ''}`}
          onClick={() => setPaginaAtiva('pecas')}
          style={{ cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined">precision_manufacturing</span>
          Peças / Kanban
        </span>

        <span
          className={`header-nav-item ${paginaAtiva === 'orcamentos' ? 'active' : ''}`}
          onClick={() => setPaginaAtiva('orcamentos')}
          style={{ cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined">attach_money</span>
          Custos / Orçamentos
        </span>

        <span
          className={`header-nav-item ${paginaAtiva === 'maquinas' ? 'active' : ''}`}
          onClick={() => setPaginaAtiva('maquinas')}
          style={{ cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined">settings</span>
          Máquinas
        </span>
      </nav>

      <div className="profile-area">
        <div className="profile-icon">
          <span className="material-symbols-outlined">person</span>
        </div>
        <div className="profile-info">
          <strong>{usuario}</strong>
          <span className={`role-badge ${getRoleBadgeClass(role)}`}>
            {role}
          </span>
        </div>
      </div>
    </header>
  )
}