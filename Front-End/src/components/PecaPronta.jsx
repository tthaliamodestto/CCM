import React, { useState, useEffect } from 'react';
import './PecaPronta.css';

export default function PecaPronta() {
  const [savedPieces, setSavedPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  // Carrega as peças salvas da calculadora ao montar o componente
  useEffect(() => {
    const piecesFromStorage = JSON.parse(localStorage.getItem('ccm_saved_pieces')) || [
      // Exemplo estático caso o storage esteja vazio para teste visual
      { 
        id: '1', 
        nome: 'Eixo Principal CNC', 
        prioridade: 'Alta (4)', 
        material: 'Aço 1045 (Cilindro)', 
        maquina: 'Torno CNC 01', 
        volume: '145.2', 
        peso: '1.14', 
        tempo: '25', 
        custo: '89.50' 
      }
    ];
    setSavedPieces(piecesFromStorage);
  }, []);

  const handleSelectChange = (e) => {
    const pieceId = e.target.value;
    if (!pieceId) {
      setSelectedPiece(null);
      return;
    }
    const found = savedPieces.find(p => (p.id || p.nome) === pieceId);
    setSelectedPiece(found || null);

    if (found) {
      // Salva a peça ativa atual para uso posterior no relatório/dashboard se precisar
      localStorage.setItem('ccm_active_report_piece', JSON.stringify(found));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="approvals-page">
      <header className="approvals-header">
        <div>
          <span className="approvals-tag">CONSOLIDAÇÃO E RELATÓRIO</span>
          <h1>Peça Pronta para Impressão</h1>
          <p>Selecione uma peça já calculada na calculadora principal para gerar o relatório de custos.</p>
        </div>
      </header>

      <div className="approvals-content">
        <div className="approvals-toolbar">
          <div>
            <h2>Seleção de Peça</h2>
            <p>Escolha a peça cadastrada para carregar os dados de usinagem e custos.</p>
          </div>
          <select onChange={handleSelectChange} defaultValue="">
            <option value="" disabled>-- Selecionar Peça --</option>
            {savedPieces.map((piece, index) => (
              <option key={index} value={piece.id || piece.nome}>
                {piece.nome}
              </option>
            ))}
          </select>
        </div>

        {selectedPiece ? (
          <div className="piece-report-container">
            <div className="approval-card" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '20px' }}>
              <div className="approval-user">
                <div className="approval-avatar">⚙️</div>
                <div className="approval-user-info">
                  <h3>{selectedPiece.nome}</h3>
                  <span>Prioridade: {selectedPiece.prioridade}</span>
                </div>
              </div>
              <div className="approval-details" style={{ justifyContent: 'flex-end' }}>
                <div>
                  <span className="approval-label">Material</span>
                  <strong>{selectedPiece.material}</strong>
                </div>
                <div>
                  <span className="approval-label">Máquina / Operação</span>
                  <strong>{selectedPiece.maquina}</strong>
                </div>
              </div>
            </div>

            <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
              <div className="approval-card" style={{ display: 'block', padding: '16px' }}>
                <span className="approval-label">Volume Estimado</span>
                <strong style={{ fontSize: '18px', display: 'block', marginTop: '4px' }}>{selectedPiece.volume} cm³</strong>
              </div>
              <div className="approval-card" style={{ display: 'block', padding: '16px' }}>
                <span className="approval-label">Peso Total</span>
                <strong style={{ fontSize: '18px', display: 'block', marginTop: '4px' }}>{selectedPiece.peso} kg</strong>
              </div>
              <div className="approval-card" style={{ display: 'block', padding: '16px' }}>
                <span className="approval-label">Tempo de Usinagem</span>
                <strong style={{ fontSize: '18px', display: 'block', marginTop: '4px' }}>{selectedPiece.tempo} min</strong>
              </div>
              <div className="approval-card" style={{ display: 'block', padding: '16px', background: 'rgba(170, 142, 82, 0.08)', borderColor: 'rgba(170, 142, 82, 0.3)' }}>
                <span className="approval-label" style={{ color: '#aa8e52' }}>Custo Total Estimado</span>
                <strong style={{ fontSize: '20px', display: 'block', marginTop: '4px', color: '#aa8e52' }}>R$ {parseFloat(selectedPiece.custo || 0).toFixed(2)}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="approval-btn" style={{ background: '#22314d', color: '#fff' }} onClick={handlePrint}>
                🖨️ Imprimir Relatório / Enviar para Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="approvals-empty">
            <div className="approvals-empty-icon">📂</div>
            <h3>Nenhuma peça selecionada</h3>
            <p>Utilize o menu acima para escolher uma peça cadastrada na calculadora.</p>
          </div>
        )}
      </div>
    </div>
  );
}