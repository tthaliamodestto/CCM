import { useState, useEffect } from "react";
import { maquinaService } from "../services/maquinaService";
import "../css/Maquinas.css"; // Certifique-se de que o nome do arquivo seja Maquina.css ou Maquinas.css

const LISTA_TIPOS = [
  "Torno CNC",
  "Centro de Usinagem CNC",
  "Torno Convencional",
  "Fresadora",
  "Furadeira",
  "Erosão à Fio",
  "Retífica",
];

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
  imagem: null,
};

export default function Maquinas() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [maquinas, setMaquinas] = useState([]);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarMaquinas = async () => {
    try {
      if (!maquinaService?.listar) return;
      const lista = await maquinaService.listar();
      if (Array.isArray(lista)) {
        setMaquinas(lista);
      } else if (lista?.result && Array.isArray(lista.result)) {
        setMaquinas(lista.result);
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
    const file = e.target.files?.[0];
    if (file) {
      setForm((atual) => ({ ...atual, imagem: file }));
    }
  };

  const alterarStatus = (idMaquina, novoStatus) => {
    setMaquinas((prev) =>
      prev.map((m) => {
        const idItem = m.id || m.idMaquina;
        return idItem === idMaquina ? { ...m, status: novoStatus } : m;
      })
    );
  };

  const handleExcluir = async (idMaquina) => {
    if (window.confirm("Tem certeza que deseja excluir esta máquina?")) {
      try {
        if (maquinaService?.deletar) {
          await maquinaService.deletar(idMaquina);
        }
        setMaquinas((prev) =>
          prev.filter((m) => (m.id || m.idMaquina) !== idMaquina)
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

      let dadosParaEnviar;
      if (form.imagem && form.imagem instanceof File) {
        const formData = new FormData();
        formData.append("nome", form.nome);
        formData.append("tipo", form.tipo);
        formData.append("potenciaKw", form.potenciaKw);
        formData.append("custoHora", form.custoHora);
        formData.append("tarifaCpfl", form.tarifaCpfl);
        formData.append("tempoOperacao", form.tempoOperacao);
        formData.append("status", form.status);
        formData.append("image", form.imagem);
        dadosParaEnviar = formData;
      } else {
        dadosParaEnviar = form;
      }

      if (maquinaService?.cadastrar) {
        await maquinaService.cadastrar(dadosParaEnviar);
      }

      limparFormulario();
      carregarMaquinas();
    } catch (error) {
      setErro("Erro ao cadastrar máquina. Verifique os dados.");
      console.error(error);
    } finally {
      setSalvando(false);
    }
  };

  const maquinasFiltradas = (maquinas || []).filter((item) => {
    const nomeItem = String(item?.nome || item?.nomeMaquina || "").toLowerCase();
    const tipoItem = String(item?.tipo || "").toLowerCase();
    const termoBusca = busca.toLowerCase();
    return nomeItem.includes(termoBusca) || tipoItem.includes(termoBusca);
  });

  const formatarMoeda = (val) =>
    Number(val || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatarUrlImagem = (img) => {
    if (!img || typeof img !== "string") return null;
    if (
      img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("data:") ||
      img.startsWith("blob:")
    ) {
      return img;
    }
    const caminhoFormatado = img.startsWith("/") ? img : `/${img}`;
    return `http://localhost:8000${caminhoFormatado}`;
  };

  return (
    <div className="operacoes-page">
     

      {/* FORMULÁRIO DE CADASTRO */}
      <div className="operacoes-form-card">
        <h2 className="operacoes-section-title">Cadastrar Nova Máquina</h2>

        <div className="operacoes-form-row">
          <div className="operacoes-form-group">
            <label>Nome / Identificação</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Torno CNC ROMI Centur 30D"
              autoComplete="off"
            />
          </div>

          <div className="operacoes-form-group">
            <label>Tipo de Máquina</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="operacoes-select"
            >
              {LISTA_TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="operacoes-form-row">
          <div className="operacoes-form-group">
            <label>Potência (kW)</label>
            <input
              name="potenciaKw"
              type="number"
              step="0.1"
              value={form.potenciaKw}
              onChange={handleChange}
              placeholder="Ex: 15.5"
            />
          </div>

          <div className="operacoes-form-group">
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
        </div>

        <div className="operacoes-form-row">
          <div className="operacoes-form-group">
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

          <div className="operacoes-form-group">
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

        <div className="operacoes-form-group">
          <label>Foto / Imagem da Máquina</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ paddingTop: "8px" }}
          />
        </div>

        <div className="operacoes-form-buttons">
          <button
            onClick={limparFormulario}
            className="operacoes-btn-cancelar"
            type="button"
          >
            Limpar
          </button>

          <button
            onClick={salvarMaquina}
            className="operacoes-btn-cadastrar"
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

      {/* CABEÇALHO DA LISTAGEM DE MÁQUINAS */}
      <div className="operacoes-table-header" style={{ marginTop: "32px" }}>
        <div className="operacoes-table-heading">
          <div className="operacoes-table-icon">
            <span className="material-symbols-outlined">list_alt</span>
          </div>
          <div>
            <h2>Máquinas Cadastradas</h2>
            <p>Gerencie os custos e os status das máquinas cadastradas.</p>
          </div>
        </div>

        <div className="operacoes-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Buscar máquina..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* LISTA DE CARDS DE MÁQUINA */}
      <div className="maquinas-cards-wrapper">
        {maquinasFiltradas.length === 0 ? (
          <div className="operacoes-form-card" style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#657d9d", margin: 0 }}>
              Nenhuma máquina cadastrada até o momento.
            </p>
          </div>
        ) : (
          maquinasFiltradas.map((m, idx) => {
            const idAtual = m?.id || m?.idMaquina || idx;

            const potencia = Number(m?.potenciaKw ?? m?.potencia_kw ?? m?.potencialKw ?? 0);
            const tempo = Number(m?.tempoOperacao ?? m?.tempo_operacao ?? 2);
            const tarifaBase = Number(m?.tarifaCpfl ?? m?.tarifa_cpfl ?? 0.72);
            const custoHora = Number(m?.custoHora ?? m?.custo_hora ?? 0);
            const nomeMaquina = m?.nome || m?.nomeMaquina || "Máquina";
            const tipoMaquina = m?.tipo || "Torno CNC";
            const imagemUrl = formatarUrlImagem(m?.imagem);

            const statusObj =
              STATUS_OPCOES.find((s) => s.nome === m?.status) || STATUS_OPCOES[0];
            const tarifaEfetiva = tarifaBase + (statusObj.adicionalTarifa || 0);

            const consumoKwh = potencia * tempo;
            const custoEnergetico = consumoKwh * tarifaEfetiva;
            const custoOperacional = custoHora * tempo;
            const custoTotal = custoEnergetico + custoOperacional;

            return (
              <div key={idAtual} className="operacoes-table-card maquina-item-card">
                {/* TOPO DO CARD DA MÁQUINA */}
                <div className="maquina-card-header">
                  <div className="maquina-header-title">
                    <div className="maquina-header-icon-box">
                      {imagemUrl ? (
                        <img
                          src={imagemUrl}
                          alt={nomeMaquina}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="material-symbols-outlined">precision_manufacturing</span>
                      )}
                    </div>
                    <div>
                      <h3 className="maquina-nome-titulo">{nomeMaquina}</h3>
                      <div className="maquina-subtags">
                        <span>
                          <span className="material-symbols-outlined">handyman</span>
                          {tipoMaquina}
                        </span>
                        <span>
                          <span className="material-symbols-outlined">bolt</span>
                          {potencia.toLocaleString("pt-BR")} kW
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="maquina-header-right">
                    <span
                      className="maquina-status-badge"
                      style={{
                        color: statusObj.cor,
                        backgroundColor: `${statusObj.cor}18`,
                        borderColor: `${statusObj.cor}40`,
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        flag
                      </span>
                      {statusObj.nome}
                    </span>

                    <button
                      type="button"
                      className="operacoes-btn-excluir"
                      onClick={() => handleExcluir(idAtual)}
                      title="Excluir máquina"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>

                {/* GRID DE 4 SUB-CARDS INTERNOS */}
                <div className="maquina-subgrid-4">
                  {/* SUB-CARD 1: FOTO DA MÁQUINA */}
                  <div className="maquina-subcard-panel">
                    <div className="maquina-subcard-img-box">
                      {imagemUrl ? (
                        <img
                          src={imagemUrl}
                          alt={nomeMaquina}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="maquina-img-empty">
                          <span className="material-symbols-outlined">precision_manufacturing</span>
                          <span>Sem Imagem</span>
                        </div>
                      )}
                    </div>
                    <div className="maquina-subcard-img-info">
                      <strong>{nomeMaquina}</strong>
                      <p>{tipoMaquina} • {potencia} kW</p>
                    </div>
                  </div>

                  {/* SUB-CARD 2: DADOS DA MÁQUINA */}
                  <div className="maquina-subcard-panel">
                    <h4 className="maquina-subcard-title">Dados da Máquina</h4>
                    <div className="maquina-info-line">
                      <span>
                        <span className="material-symbols-outlined">bolt</span>
                        Potência do motor
                      </span>
                      <strong>{potencia.toLocaleString("pt-BR")} kW</strong>
                    </div>
                    <div className="maquina-info-line">
                      <span>
                        <span className="material-symbols-outlined">payments</span>
                        Custo / Hora
                      </span>
                      <strong>{formatarMoeda(custoHora)}</strong>
                    </div>
                    <div className="maquina-info-line">
                      <span>
                        <span className="material-symbols-outlined">electric_bolt</span>
                        Tarifa + Bandeira
                      </span>
                      <strong>{formatarMoeda(tarifaEfetiva)} / kWh</strong>
                    </div>
                    <div className="maquina-info-line">
                      <span>
                        <span className="material-symbols-outlined">schedule</span>
                        Tempo de operação
                      </span>
                      <strong>{tempo} horas</strong>
                    </div>
                  </div>

                  {/* SUB-CARD 3: CONSUMO E CUSTOS */}
                  <div className="maquina-subcard-panel">
                    <h4 className="maquina-subcard-title">Consumo e Custos</h4>
                    <div className="maquina-info-line">
                      <span>
                        <span className="material-symbols-outlined">electric_meter</span>
                        Consumo de energia
                      </span>
                      <strong>
                        {consumoKwh.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        kWh
                      </strong>
                    </div>
                    <div className="maquina-info-line">
                      <span>
                        <span className="material-symbols-outlined">receipt_long</span>
                        Custo energético
                      </span>
                      <strong>{formatarMoeda(custoEnergetico)}</strong>
                    </div>
                    <div className="maquina-info-line">
                      <span>
                        <span className="material-symbols-outlined">layers</span>
                        Custo operacional
                      </span>
                      <strong>{formatarMoeda(custoOperacional)}</strong>
                    </div>

                    <div className="maquina-total-highlight">
                      <span>
                        <span className="material-symbols-outlined">attach_money</span>
                        Custo total da usinagem
                      </span>
                      <strong className="maquina-valor-dourado">
                        {formatarMoeda(custoTotal)}
                      </strong>
                    </div>
                  </div>

                  {/* SUB-CARD 4: STATUS / BANDEIRA */}
                  <div className="maquina-subcard-panel">
                    <h4 className="maquina-subcard-title">Status / Bandeira</h4>
                    <div className="maquina-flags-list">
                      {STATUS_OPCOES.map((st) => {
                        const isSelected = (m?.status || "Normal") === st.nome;
                        return (
                          <button
                            key={st.nome}
                            type="button"
                            onClick={() => alterarStatus(idAtual, st.nome)}
                            className={`flag-option-btn ${isSelected ? "selected" : ""}`}
                            style={{
                              backgroundColor: isSelected ? `${st.cor}18` : "#ffffff",
                              borderColor: isSelected ? st.cor : "#d4dfed",
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{
                                color: st.cor,
                                fontVariationSettings: "'FILL' 1",
                              }}
                            >
                              flag
                            </span>
                            <div className="flag-btn-text">
                              <span
                                className="flag-btn-name"
                                style={{ color: isSelected ? st.cor : "#17375d" }}
                              >
                                {st.nome}
                              </span>
                              <span className="flag-btn-desc">{st.desc}</span>
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
    </div>
  );
}