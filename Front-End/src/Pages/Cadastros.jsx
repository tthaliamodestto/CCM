import React, { useState } from 'react';
import Header from '../components/Header';
import FormMaterial from '../components/FormMaterial';
import FormMaquina from '../components/FormMaquina';
import CardInfo from '../components/CardInfo';

export default function Cadastros() {
  const [campoNome, setCampoNome] = useState('');
  const [campoValor, setCampoValor] = useState('');

  return (
    <div>
      <Header
        titulo="Gestão de Materiais e Máquinas"
        subtitulo="Cadastre novos itens e visualize as entradas em tempo real."
      />

      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* 1. Formulários de Material e Máquina */}
        <section style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <FormMaterial />
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <FormMaquina />
          </div>
        </section>

        {/* 2. Dois campos de Input controlados com useState e onChange */}
        <section style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h2>Consulta e Visualização Dinâmica</h2>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Digite um nome..."
              value={campoNome}
              onChange={(e) => setCampoNome(e.target.value)}
              style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              placeholder="Digite um valor ou detalhe..."
              value={campoValor}
              onChange={(e) => setCampoValor(e.target.value)}
              style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {/* 3. Reutilização do componente CardInfo 3 vezes via Props */}
          <h3>Cartões Gerados</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            
            {/* Reutilização 1 */}
            <CardInfo 
              titulo={campoNome || 'Card 1 (Aguardando digitação)'} 
              valor={campoValor || 'Sem valor'} 
              detalhe="Entrada do usuário em tempo real" 
            />

            {/* Reutilização 2 */}
            <CardInfo 
              titulo={`Resumo: ${campoNome}`} 
              valor={campoValor} 
              detalhe="Confirmação dos dados informados" 
            />

            {/* Reutilização 3 */}
            <CardInfo 
              titulo="Visualizador Fixo" 
              valor={campoNome ? `Item: ${campoNome}` : 'Sem item'} 
              detalhe={campoValor ? `Parâmetro: ${campoValor}` : 'Sem parâmetro'} 
            />

          </div>
        </section>
      </main>
    </div>
  );
}