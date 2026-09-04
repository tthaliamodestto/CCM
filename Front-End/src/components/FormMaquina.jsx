import React, { useState } from 'react';
import { maquinaService } from '../services/maquinaService';

export default function FormMaquina() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [custoHora, setCustoHora] = useState('');
  const [potencialKw, setPotencialKw] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await maquinaService.criar({ nome, tipo, custoHora, potencialKw });
      alert('Máquina cadastrada!');
      setNome('');
      setTipo('');
      setCustoHora('');
      setPotencialKw('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Cadastrar Máquina</h2>

      <div className="form-group">
        <label>Nome da Máquina:</label>
        <input 
          type="text" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Tipo:</label>
        <input 
          type="text" 
          value={tipo} 
          onChange={(e) => setTipo(e.target.value)} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Custo por Hora (R$):</label>
        <input 
          type="number" 
          step="0.01"
          value={custoHora} 
          onChange={(e) => setCustoHora(e.target.value)} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Potência (kW):</label>
        <input 
          type="number" 
          step="0.1"
          value={potencialKw} 
          onChange={(e) => setPotencialKw(e.target.value)} 
          required 
        />
      </div>

      <button type="submit">Salvar Máquina</button>
    </form>
  );
}