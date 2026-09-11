import React, { useState, useEffect } from 'react';
import { materialService } from '../services/materialService';

export default function FormMaterial() {
  const [nome, setNome] = useState('');
  const [densidade, setDensidade] = useState('');
  const [custoPerKg, setCustoPerKg] = useState('');
  const [materiais, setMateriais] = useState([]);

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = async () => {
    try {
      const resposta = await materialService.selecionar();
      setMateriais(resposta.result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await materialService.criar({
        nome,
        densidade,
        custoPerKg
      });

      alert('Material cadastrado!');

      setNome('');
      setDensidade('');
      setCustoPerKg('');

      carregarMateriais();

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (idMaterial) => {
    try {
      await materialService.deletar(idMaterial);

      alert('Material excluído!');

      carregarMateriais();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

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

        <button type="submit">
          Salvar Material
        </button>
      </form>


      <div className="materiais-lista">

        <h2>
          MATERIAIS CADASTRADOS ({materiais.length})
        </h2>

        {materiais.map((material) => (

          <div className="material-item" key={material.idMaterial}>

            <div className="material-info">

              <strong>{material.nome}</strong>

              <span>
                Densidade: {material.densidade} g/cm³
              </span>

              <span>
                R$ {Number(material.custoPerKg).toFixed(2)} / kg
              </span>

            </div>

            <button
              type="button"
              className="botao-excluir"
              onClick={() => handleDelete(material.idMaterial)}
            >
              Excluir
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}