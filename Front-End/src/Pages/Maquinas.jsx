import { useState, useEffect } from "react";
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

// Cada status/bandeira possui uma taxa adicional por kWh
const STATUS_OPCOES = [
  {
    cor: "#10b981",
    nome: "Normal",
    desc: "Operação dentro do padrão (sem adicional).",
    adicionalTarifa: 0.0,
  },
  {
    cor: "#f59e0b",
    nome: "Atenção",
    desc: "Bandeira Amarela (+R$ 0,02/kWh).",
    adicionalTarifa: 0.02,
  },
  {
    cor: "#f97316",
    nome: "Alerta",
    desc: "Bandeira Vermelha 1 (+R$ 0,05/kWh).",
    adicionalTarifa: 0.05,
  },
  {
    cor: "#ef4444",
    nome: "Crítico",
    desc: "Bandeira Vermelha 2 (+R$ 0,08/kWh).",
    adicionalTarifa: 0.08,
  },
  {
    cor: "#1e293b",
    nome: "Vida útil em risco",
    desc: "Sobretaxa de risco industrial (+R$ 0,15/kWh).",
    adicionalTarifa: 0.15,
  },
];

const FORM_INICIAL = {
  nome: "",
  tipo: "Torno CNC",
  potenciaKw: "",
  custoHora: "",
  tarifaCpfl: "0.72",
  tempoOperacao: "2",
  status: "Normal",
  imagem: "",
};

export default function Maquinas() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [maquinas, setMaquinas] = useState([]);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarMaquinas = async () => {
    try {
      const lista = await maquinaService.listar();
      if (Array.isArray(lista)) {
        setMaquinas(lista);
      }
    } catch (err) {
      console.error("Erro ao carregar máquinas:", err);
    }
  };

  useEffect(() => {
    carregarMaquinas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm((atual) => ({
        ...atual,
        imagem: file,
      }));
    }
  };

  // Altera o status da máquina no estado para forçar o recálculo imediato dos custos na tela
  const alterarStatus = (idMaquina, novoStatus) => {
    setMaquinas((prev) =>
      prev.map((m) => {
        const idItem = m.id || m.idMaquina;
        return idItem === idMaquina ? { ...m, status: novoStatus } : m;
      }),
    );
  };

  // Exclui a máquina
  const handleExcluir = async (idMaquina) => {
    if (window.confirm("Tem certeza que deseja excluir esta máquina?")) {
      try {
        if (maquinaService.deletar) {
          await maquinaService.deletar(idMaquina);
        }
        setMaquinas((prev) =>
          prev.filter((m) => (m.id || m.idMaquina) !== idMaquina),
        );
      } catch (err) {
        console.error("Erro ao excluir máquina:", err);
      }
    }
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

    try {
      setSalvando(true);
      const novaMaquinaCadastrada = await maquinaService.cadastrar(form);
      setMaquinas((prev) => [novaMaquinaCadastrada, ...prev]);
      limparFormulario();
    } catch (error) {
      setErro("Erro ao cadastrar máquina. Verifique os dados.");
      console.error(error);
    } finally {
      setSalvando(false);
    }
  };

  const maquinasFiltradas = maquinas.filter((item) => {
    const nomeItem = String(item.nome || item.nomeMaquina || "").toLowerCase();
    const tipoItem = String(item.tipo || "").toLowerCase();
    const termoBusca = busca.toLowerCase();
    return nomeItem.includes(termoBusca) || tipoItem.includes(termoBusca);
  });

  const formatarMoeda = (val) =>
    Number(val || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="maquinas-container">
      <Header
        titulo="Máquinas"
        subtitulo="Cadastre e gerencie as máquinas do seu processo de usinagem."
      />

      {erro && <div className="alerta-erro">{erro}</div>}

      {/* FORMULÁRIO DE CADASTRO */}
      <div className="card-form-container">
        <h2 className="section-title">DADOS DA MÁQUINA</h2>

        <div className="form-grid-2">
          <div className="form-group">
            <label>Nome / Identificação</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Torno CNC ROMI Centur 30D"
            />
          </div>

          <div className="form-group">
            <label>Tipo de Máquina</label>
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              {LISTA_TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Potência (kW)</label>
            <div className="input-with-badge">
              <input
                name="potenciaKw"
                type="number"
                step="0.1"
                value={form.potenciaKw}
                onChange={handleChange}
                placeholder="Ex: 15.5"
              />
              <span className="badge-unit">kW</span>
            </div>
          </div>

          <div className="form-group">
            <label>Custo / Hora (R$)</label>
            <input
              name="custoHora"
              type="number"
              step="0.01"
              value={form.custoHora}
              onChange={handleChange}
              placeholder="Ex: 120.00"
            />
          </div>

          <div className="form-group">
            <label>Tarifa Base CPFL (R$/kWh)</label>
            <input
              name="tarifaCpfl"
              type="number"
              step="0.01"
              value={form.tarifaCpfl}
              onChange={handleChange}
              placeholder="Ex: 0.72"
            />
          </div>

          <div className="form-group">
            <label>Tempo de Operação (horas)</label>
            <input
              name="tempoOperacao"
              type="number"
              step="0.5"
              value={form.tempoOperacao}
              onChange={handleChange}
              placeholder="Ex: 2"
            />
          </div>
        </div>

        <div className="form-group margin-top-sm">
          <label>Foto / Imagem da Máquina</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
        </div>

        <div className="btn-row">
          <button
            onClick={limparFormulario}
            className="btn-dourado"
            type="button"
          >
            <span className="material-symbols-outlined">refresh</span>
            Limpar
          </button>

          <button
            onClick={salvarMaquina}
            className="btn-dourado"
            type="button"
            disabled={salvando}
          >
            <span className="material-symbols-outlined">
              {salvando ? "sync" : "add"}
            </span>
            {salvando ? "Cadastrando..." : "Cadastrar Máquina"}
          </button>
        </div>
      </div>

      {/* CABEÇALHO DA LISTA DE CADASTRADAS */}
      <div className="list-header-bar">
        <div className="list-header-title">
          <div className="icon-list-box">
            <span className="material-symbols-outlined">list_alt</span>
          </div>
          <div>
            <h3>Máquinas Cadastradas</h3>
            <p>Visualize os dados e o custo operacional de cada máquina.</p>
          </div>
        </div>

        <div className="search-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Buscar máquina..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="button" className="btn-filter-icon">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      {/* LISTA DE CARDS CADASTRADOS */}
      <div className="cards-wrapper">
        {maquinasFiltradas.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "30px", color: "#64748b" }}
          >
            Nenhuma máquina cadastrada no momento. Preencha o formulário acima
            para adicionar.
          </div>
        ) : (
          maquinasFiltradas.map((m, idx) => {
            const idAtual = m.id || m.idMaquina || idx;

            // Leitura flexível dos campos (camelCase ou snake_case)
            const potencia = Number(
              m.potenciaKw ?? m.potencia_kw ?? m.potencialKw ?? 0,
            );
            const tempo = Number(m.tempoOperacao ?? m.tempo_operacao ?? 2);
            const tarifaBase = Number(m.tarifaCpfl ?? m.tarifa_cpfl ?? 0.72);
            const custoHora = Number(m.custoHora ?? m.custo_hora ?? 0);
            const nomeMaquina = m.nome || m.nomeMaquina || "Máquina";
            const tipoMaquina = m.tipo || "Torno CNC";
            const imagemMaquina = m.imagem;

            console.log("IMAGEM DA MÁQUINA:", m.imagem);
            console.log("MÁQUINA COMPLETA:", m);

            // Identifica o status atual e aplica o adicional de tarifa da bandeira
            const statusObj =
              STATUS_OPCOES.find((s) => s.nome === m.status) ||
              STATUS_OPCOES[0];
            const tarifaEfetiva = tarifaBase + (statusObj.adicionalTarifa || 0);

            // Cálculos dinâmicos
            const consumoKwh = potencia * tempo;
            const custoEnergetico = consumoKwh * tarifaEfetiva;
            const custoOperacional = custoHora * tempo;
            const custoTotal = custoEnergetico + custoOperacional;

            return (
              <div key={idAtual} className="maquina-card-item">
                {/* TOPO DO CARD */}
                <div className="card-top-bar">
                  <div className="card-top-info">
                    <div className="thumb-container">
                      {imagemMaquina ? (
  <img
    src={`http://localhost:8000${imagemMaquina}`}
    alt={nomeMaquina}
  />
) : (
  <span className="material-symbols-outlined thumb-icon">
    precision_manufacturing
  </span>
)}
                    </div>
                    <div>
                      <h3 className="card-machine-title">{nomeMaquina}</h3>
                      <div className="card-machine-tags">
                        <span>
                          <span className="material-symbols-outlined">
                            handyman
                          </span>{" "}
                          {tipoMaquina}
                        </span>
                        <span>
                          <span className="material-symbols-outlined">
                            bolt
                          </span>{" "}
                          {potencia.toLocaleString("pt-BR")} kW
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="card-top-right"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      className="status-badge-pill"
                      style={{
                        color: statusObj.cor,
                        backgroundColor: `${statusObj.cor}18`,
                      }}
                    >
                      <span className="material-symbols-outlined">flag</span>
                      {statusObj.nome}
                    </span>

                    {/* BOTÃO EXCLUIR MÁQUINA */}
                    <button
                      type="button"
                      onClick={() => handleExcluir(idAtual)}
                      style={{
                        background: "rgba(239, 68, 68, 0.12)",
                        color: "#ef4444",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title="Excluir máquina"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "18px" }}
                      >
                        delete
                      </span>
                    </button>
                  </div>
                </div>

                {/* CORPO EM 3 COLUNAS */}
                <div className="card-body-grid">
                  {/* COLUNA 1 - DADOS DA MÁQUINA */}
                  <div className="grid-col-box">
                    <h4 className="col-title">Dados da Máquina</h4>
                    <div className="info-row">
                      <span>
                        <span className="material-symbols-outlined">bolt</span>{" "}
                        Potência do motor
                      </span>
                      <strong>{potencia.toLocaleString("pt-BR")} kW</strong>
                    </div>
                    <div className="info-row">
                      <span>
                        <span className="material-symbols-outlined">
                          payments
                        </span>{" "}
                        Custo / Hora
                      </span>
                      <strong>{formatarMoeda(custoHora)}</strong>
                    </div>
                    <div className="info-row">
                      <span>
                        <span className="material-symbols-outlined">
                          electric_bolt
                        </span>{" "}
                        Tarifa + Bandeira
                      </span>
                      <strong>{formatarMoeda(tarifaEfetiva)} / kWh</strong>
                    </div>
                    <div className="info-row">
                      <span>
                        <span className="material-symbols-outlined">
                          schedule
                        </span>{" "}
                        Tempo de operação
                      </span>
                      <strong>{tempo} horas</strong>
                    </div>
                  </div>

                  {/* COLUNA 2 - CONSUMO E CUSTOS */}
                  <div className="grid-col-box">
                    <h4 className="col-title">Consumo e Custos</h4>
                    <div className="info-row">
                      <span>
                        <span className="material-symbols-outlined">
                          electric_meter
                        </span>{" "}
                        Consumo de energia
                      </span>
                      <strong>
                        {consumoKwh.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        kWh
                      </strong>
                    </div>
                    <div className="info-row">
                      <span>
                        <span className="material-symbols-outlined">
                          receipt_long
                        </span>{" "}
                        Custo energético
                      </span>
                      <strong>{formatarMoeda(custoEnergetico)}</strong>
                    </div>
                    <div className="info-row">
                      <span>
                        <span className="material-symbols-outlined">
                          layers
                        </span>{" "}
                        Custo operacional
                      </span>
                      <strong>{formatarMoeda(custoOperacional)}</strong>
                    </div>
                    <div className="total-highlight-box">
                      <span>
                        <span className="material-symbols-outlined">
                          attach_money
                        </span>{" "}
                        Custo total da usinagem
                      </span>
                      <strong className="total-value">
                        {formatarMoeda(custoTotal)}
                      </strong>
                    </div>
                  </div>

                  {/* COLUNA 3 - SELEÇÃO DE STATUS */}
                  <div className="grid-col-box">
                    <h4 className="col-title">Status da Máquina</h4>
                    <div className="status-options-list">
                      {STATUS_OPCOES.map((st) => {
                        const isSelected = m.status === st.nome;
                        return (
                          <button
                            key={st.nome}
                            type="button"
                            onClick={() => alterarStatus(idAtual, st.nome)}
                            className={`status-item-btn ${isSelected ? "selected" : ""}`}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ color: st.cor }}
                            >
                              flag
                            </span>
                            <div className="status-item-info">
                              <div className="status-item-name">{st.nome}</div>
                              <div className="status-item-desc">{st.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* LEGENDA NO RODAPÉ */}
      <div className="footer-legend-bar">
        <span className="legend-title">
          <span className="material-symbols-outlined">info</span> Legenda de
          status
        </span>
        <div className="legend-items">
          {STATUS_OPCOES.map((st) => (
            <div key={st.nome} className="legend-item">
              <span
                className="material-symbols-outlined"
                style={{ color: st.cor }}
              >
                flag
              </span>
              <span>{st.nome}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
