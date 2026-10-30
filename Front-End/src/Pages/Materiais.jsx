import { useState, useEffect } from "react";
import Header from "../components/Header";
import { materialService } from "../services/materialService";

export default function FormMaterial() {
  const [nome, setNome] = useState("");
  const [densidade, setDensidade] = useState("");
  const [custoPerKg, setCustoPerKg] = useState("");
  const [imagem, setImagem] = useState(null);
  const [materiais, setMateriais] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = async () => {
    try {
      const resposta = await materialService.selecionar();
      setMateriais(resposta?.result || resposta || []);
    } catch (error) {
      console.error("Erro ao carregar materiais:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const material = new FormData();
      material.append("nome", nome);
      material.append("densidade", densidade);
      material.append("custoPerKg", custoPerKg);

      if (imagem) {
        material.append("image", imagem);
      }

      await materialService.criar(material);
      alert("Material cadastrado com sucesso!");

      setNome("");
      setDensidade("");
      setCustoPerKg("");
      setImagem(null);

      carregarMateriais();
    } catch (error) {
      console.error("Erro ao cadastrar material:", error);
    }
  };

  const handleDelete = async (idMaterial) => {
    if (window.confirm("Tem certeza que deseja excluir este material?")) {
      try {
        await materialService.deletar(idMaterial);
        alert("Material excluído!");
        carregarMateriais();
      } catch (error) {
        console.error("Erro ao excluir material:", error);
      }
    }
  };

  // Filtro para a barra de busca
  const materiaisFiltrados = materiais.filter((item) =>
    String(item.nome || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="operacoes-page">
      

      {/* CARD DO FORMULÁRIO */}
      <div className="operacoes-form-card">
        <h2 className="operacoes-section-title">Cadastrar Material</h2>

        <form onSubmit={handleSubmit}>
          <div className="operacoes-form-row">
            <div className="operacoes-form-group">
              <label>Nome do Material</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Aço SAE 1045"
                required
                autoComplete="off"
              />
            </div>

            <div className="operacoes-form-group">
              <label>Densidade (g/cm³)</label>
              <input
                type="number"
                step="0.01"
                value={densidade}
                onChange={(e) => setDensidade(e.target.value)}
                placeholder="Ex: 7.85"
                required
              />
            </div>
          </div>

          <div className="operacoes-form-row">
            <div className="operacoes-form-group">
              <label>Custo por Kg (R$)</label>
              <input
                type="number"
                step="0.01"
                value={custoPerKg}
                onChange={(e) => setCustoPerKg(e.target.value)}
                placeholder="Ex: 12.50"
                required
              />
            </div>

            <div className="operacoes-form-group">
              <label>Imagem do Material</label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setImagem(e.target.files[0])}
                style={{ paddingTop: "8px" }}
              />
            </div>
          </div>

          <div className="operacoes-form-buttons">
            <button type="submit" className="operacoes-btn-cadastrar">
              <span className="material-symbols-outlined">add</span>
              Cadastrar Material
            </button>
          </div>
        </form>
      </div>

      {/* CARD DA TABELA */}
      <div className="operacoes-table-card">
        {/* CABEÇALHO DA TABELA E BUSCA */}
        <div className="operacoes-table-header">
          <div className="operacoes-table-heading">
            <div className="operacoes-table-icon">
              <span className="material-symbols-outlined">list_alt</span>
            </div>
            <div>
              <h2>Materiais Cadastrados</h2>
              <p>Gerencie os materiais já cadastrados no sistema.</p>
            </div>
          </div>

          <div className="operacoes-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Buscar material..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* ESTRUTURA DA TABELA */}
        <div className="operacoes-table-wrapper">
          <table className="operacoes-table">
            <thead>
              <tr>
                <th className="operacoes-col-numero">#</th>
                <th>Material</th>
                <th className="operacoes-col-preco">Densidade (g/cm³)</th>
                <th className="operacoes-col-tempo">Custo / kg (R$)</th>
                <th className="operacoes-col-acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              {materiaisFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="operacoes-empty">
                    Nenhum material encontrado.
                  </td>
                </tr>
              ) : (
                materiaisFiltrados.map((item, index) => {
                  const idAtual = item.idMaterial || item.id || index;
                  const imgUrl = item.imagem
                    ? item.imagem.startsWith("http")
                      ? item.imagem
                      : `http://localhost:8000${item.imagem}`
                    : null;

                  return (
                    <tr key={idAtual}>
                      <td className="operacoes-col-numero">{index + 1}</td>
                      <td className="operacoes-nome-celula">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={item.nome}
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "5px",
                                objectFit: "cover",
                                border: "1px solid #dce5ef",
                              }}
                            />
                          ) : (
                            <span
                              className="material-symbols-outlined"
                              style={{ color: "#8195b0" }}
                            >
                              inventory_2
                            </span>
                          )}
                          <span>{item.nome}</span>
                        </div>
                      </td>
                      <td className="operacoes-col-preco">
                        {item.densidade} g/cm³
                      </td>
                      <td className="operacoes-col-tempo">
                        R$ {Number(item.custoPerKg || 0).toFixed(2)}
                      </td>
                      <td className="operacoes-col-acoes">
                        <div className="operacoes-actions">
                          <button
                            type="button"
                            className="operacoes-btn-excluir"
                            onClick={() => handleDelete(idAtual)}
                            title="Excluir Material"
                          >
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* RODAPÉ COM CONTADOR */}
        <div className="operacoes-table-footer">
          <span>
            Mostrando {materiaisFiltrados.length} de {materiais.length} materiais
          </span>
        </div>
      </div>
    </div>
  );
}