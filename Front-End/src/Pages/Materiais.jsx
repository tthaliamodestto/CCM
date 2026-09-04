import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { materialService } from '../services/materialService.js';

export default function Materiais() {
  const [nome, setNome] = useState('');
  const [densidade, setDensidade] = useState('');
  const [custo, setCusto] = useState('');

  // Busca os materiais salvos no localStorage ao carregar a página
  const [listaMateriais, setListaMateriais] = useState(() => {
    const salvos = localStorage.getItem('materiais');
    return salvos ? JSON.parse(salvos) : [];
  });

  // Salva no localStorage sempre que a lista for alterada
  useEffect(() => {
    localStorage.setItem('materiais', JSON.stringify(listaMateriais));
  }, [listaMateriais]);

const handleCadastrar = async (e) => {
  e.preventDefault();

  if (!nome || !densidade || !custo) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  try {
    const dados = {
      nome: nome.trim(),
      densidade: parseFloat(densidade),
      custoPerKg: parseFloat(custo),
    };

    console.log(' Enviando material:', dados);

    const resposta = await materialService.criar(dados);

    console.log(' Resposta do servidor:', resposta);

    const novoMaterial = {
      id: Date.now(),
      nome: nome.trim(),
      densidade: parseFloat(densidade),
      custo: parseFloat(custo),
    };

    setListaMateriais((listaAtual) => [
      ...listaAtual,
      novoMaterial
    ]);

    setNome('');
    setDensidade('');
    setCusto('');

    alert('Material cadastrado com sucesso!');

  } catch (error) {
    console.error(' Erro ao cadastrar material:', error);

    alert(error.message || 'Erro ao cadastrar material.');
  }
};

  return (
    <div className="page-content">
      <Header
        titulo="Cadastro de Materiais"
        subtitulo="Gerencie os custos, densidades e especificações dos materiais de usinagem."
      />

      {/* FORMULÁRIO DE CADASTRO */}
      <div className="card">
        <div className="card-body">
          <h3 className="section-title">CADASTRAR NOVO MATERIAL</h3>

          <form onSubmit={handleCadastrar}>
            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Nome do Material</label>
                <input
                  type="text"
                  className="input-box"
                  placeholder="Ex: Aço 1045"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="form-col">
                <label className="form-label">Densidade (g/cm³)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-box"
                  placeholder="Ex: 7.85"
                  value={densidade}
                  onChange={(e) => setDensidade(e.target.value)}
                />
              </div>

              <div className="form-col">
                <label className="form-label">Custo por kg (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-box"
                  placeholder="Ex: 15.50"
                  value={custo}
                  onChange={(e) => setCusto(e.target.value)}
                />
              </div>
            </div>

            <div className="btn-actions" style={{ marginTop: '15px' }}>
              <button type="submit" className="btn-add">
                Cadastrar Material
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* LISTA DE MATERIAIS CADASTRADOS */}
      <div className="card">
        <div className="card-body">
          <h3 className="section-title">MATERIAIS CADASTRADOS ({listaMateriais.length})</h3>

          {listaMateriais.length === 0 ? (
            <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem' }}>
              Nenhum material cadastrado ainda.
            </p>
          ) : (
            <div className="results-grid">
              {listaMateriais.map((item) => (
                <div key={item.id} className="res-box">
                  <div className="res-icon">
                    <span className="material-symbols-outlined">inventory_2</span>
                  </div>
                  <div>
                    <div className="res-val">{item.nome}</div>
                    <div className="res-label">Densidade: {item.densidade} g/cm³</div>
                    <div className="res-label" style={{ fontWeight: 600, marginTop: '2px' }}>
                      R$ {item.custo.toFixed(2)} / kg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}