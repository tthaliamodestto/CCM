import React from 'react'

export default function Header({
  paginaAtiva,
  setPaginaAtiva,
  usuario = "Usuário",
  nome,
  foto,
  role = "Administrador",
  corFuncionario,
}) {
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

  const nomeExibicao = nome || usuario

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

      {/* ÁREA DE PERFIL COM DIMENSÕES BLOQUEADAS VIA INLINE STYLES */}
      <div
        className="profile-area"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginLeft: 'auto',
        }}
      >
        <div
          className="profile-icon"
          style={{
            width: '40px',
            height: '40px',
            minWidth: '40px',
            minHeight: '40px',
            maxWidth: '40px',
            maxHeight: '40px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: corFuncionario || 'var(--accent-color, #AA8E52)',
            color: '#ffffff',
            fontWeight: 'bold',
            flexShrink: 0,
          }}
        >
          {foto ? (
            <img
              src={foto}
              alt={nomeExibicao}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
                display: 'block',
              }}
            />
          ) : (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '24px', color: '#ffffff' }}
            >
              person
            </span>
          )}
        </div>

        <div className="profile-info">
          <strong title={nomeExibicao}>{nomeExibicao}</strong>
          <span className={`role-badge ${getRoleBadgeClass(role)}`}>
            {role}
          </span>
        </div>
      </div>
    </header>
  )
}