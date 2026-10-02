import React, { useContext } from 'react';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';

export default function Configuracoes() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div>
      <Header
        titulo="Configurações"
        subtitulo="Gerencie as preferências visuais e do sistema."
      />

      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <section
          style={{
            background: theme === 'dark' ? '#1e293b' : '#f8fafc',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b',
            padding: '20px',
            borderRadius: '8px',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
          }}
        >
          <h2>Aparência do Sistema</h2>
          <p style={{ margin: '10px 0 20px 0', opacity: 0.8 }}>
            Alterne entre o tema claro e escuro para ajustar a interface conforme sua preferência.
          </p>

          <button
            onClick={toggleTheme}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '6px',
              border: 'none',
              background: theme === 'dark' ? '#38bdf8' : '#0284c7',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            {theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
          </button>
        </section>
      </main>
    </div>
  );
}