import React, { useState } from 'react';
import { materialService } from '../services/materialService';

export default function FormMaterial() {
  const [nome, setNome] = useState('');
  const [densidade, setDensidade] = useState('');
  const [custoPerKg, setCustoPerKg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await materialService.criar({ nome, densidade, custoPerKg });
      alert('Material cadastrado!');
      setNome('');
      setDensidade('');
      setCustoPerKg('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Cadastrar Material</h2>
      
      <div className="form-group">
        <label>Nome do Material:</label>
        <input 
          type="text" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Densidade (g/cm³):</label>
        <input 
          type="number" 
          step="0.01"
          value={densidade} 
          onChange={(e) => setDensidade(e.target.value)} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Custo por Kg (R$):</label>
        <input 
          type="number" 
          step="0.01"
          value={custoPerKg} 
          onChange={(e) => setCustoPerKg(e.target.value)} 
          required 
        />
      </div>

      <button type="submit">Salvar Material</button>
    </form>
  );
}