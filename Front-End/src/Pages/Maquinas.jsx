import { useState } from "react";
import Header from "../components/Header";
import { maquinaService } from "../services/maquinaService";

const LISTA_TIPOS = [
  "Torno CNC",
  "Centro de Usinagem CNC",
  "Torno Convencional",
  "Fresadora",
  "Furadeira",
  "Erosão à Fio",
  "Retífica",
];

const FORM_INICIAL = {
  nome: "",
  tipo: "Torno CNC",
  potenciaKw: "",
  custoHora: "",
};

export default function Maquinas() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((atual) => ({
      ...atual,
      [name]: value,
    }));
  };

  const limparFormulario = () => {
    setForm(FORM_INICIAL);
    setErro("");
  };

  const salvarMaquina = async () => {
    setErro("");

    if (!form.nome.trim()) {
      setErro("Informe o nome/modelo da máquina.");
      return;
    }

    if (!form.potenciaKw || Number(form.potenciaKw) <= 0) {
      setErro("Informe uma potência em kW maior que zero.");
      return;
    }

    // Payload montado com a chave exact do seu Controller: 'potencialKw'
    const payload = {
      nome: form.nome.trim(),
      tipo: form.tipo,
      potencialKw: Number(form.potenciaKw) || 0,
      custoHora: Number(form.custoHora) || 0,
    };

    try {
      setSalvando(true);
      await maquinaService.cadastrar(payload);
      alert("Máquina cadastrada com sucesso no banco de dados!");
      limparFormulario();
    } catch (error) {
      setErro(`Não foi possível cadastrar a máquina: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div>
      <Header
        titulo="Cadastro de Máquinas"
        subtitulo="Gerencie os equipamentos do parque fabril, tipo, potência e custos operacionais."
      />

      {erro && (
        <div
          style={{
            marginBottom: "15px",
            padding: "12px 15px",
            borderRadius: "8px",
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#be123c",
            fontSize: "0.85rem",
          }}
        >
          {erro}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <h2 className="section-title">DADOS DA MÁQUINA</h2>

          <div className="form-row">
            <div className="form-col" style={{ flex: 2 }}>
              <label className="form-label">Nome / Identificação</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="input-box"
                placeholder="Ex: Torno CNC ROMI Centur 30D"
              />
            </div>

            <div className="form-col" style={{ flex: 1.5 }}>
              <label className="form-label">Tipo de Máquina</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="input-box"
              >
                {LISTA_TIPOS.map((tipoItem) => (
                  <option key={tipoItem} value={tipoItem}>
                    {tipoItem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Potência</label>
              <div className="input-group">
                <input
                  name="potenciaKw"
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.potenciaKw}
                  onChange={handleChange}
                  className="input-box"
                  placeholder="Ex: 15.5"
                />
                <span className="unit">kW</span>
              </div>
            </div>

            <div className="form-col">
              <label className="form-label">Custo / Hora (R$)</label>
              <input
                name="custoHora"
                type="number"
                step="0.01"
                min="0"
                value={form.custoHora}
                onChange={handleChange}
                className="input-box"
                placeholder="Ex: 120.00"
              />
            </div>
          </div>

          <div className="btn-actions" style={{ marginTop: "20px" }}>
            <button onClick={limparFormulario} className="btn-limpar" type="button">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                refresh
              </span>
              Limpar
            </button>

            <button
              onClick={salvarMaquina}
              className="btn-add"
              type="button"
              disabled={salvando}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                {salvando ? "sync" : "add"}
              </span>
              {salvando ? "Salvando..." : "Cadastrar Máquina"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}