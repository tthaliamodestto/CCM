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

const BANDEIRAS_TARIFARIAS = [
  {
    valor: "verde",
    cor: "#10b981",
    nome: "Verde",
    descricao: "Sem adicional tarifário.",
    adicional: 0,
  },
  {
    valor: "amarela",
    cor: "#f59e0b",
    nome: "Amarela",
    descricao: "Adicional de R$ 0,02/kWh.",
    adicional: 0.02,
  },
  {
    valor: "laranja",
    cor: "#f97316",
    nome: "Laranja",
    descricao: "Adicional de R$ 0,05/kWh.",
    adicional: 0.05,
  },
  {
    valor: "vermelha",
    cor: "#ef4444",
    nome: "Vermelha",
    descricao: "Adicional de R$ 0,08/kWh.",
    adicional: 0.08,
  },
  {
    valor: "preta",
    cor: "#1e293b",
    nome: "Preta",
    descricao: "Adicional de R$ 0,15/kWh.",
    adicional: 0.15,
  },
];

const FORM_INICIAL = {
  nome: "",
  tipo: "Torno CNC",
  tipoUtilizacao: "propria",
  potencialKw: "",
  custoHora: "",
  imagem: null,
};

export default function Maquinas() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [maquinas, setMaquinas] = useState([]);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [bandeiras, setBandeiras] = useState({});

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

    setForm((atual) => {
      if (name === "tipoUtilizacao") {
        return {
          ...atual,
          tipoUtilizacao: value,
          potencialKw: "",
          custoHora: "",
        };
      }

      return { ...atual, [name]: value };
    });
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

  const alterarBandeira = (idMaquina, novaBandeira) => {
    setBandeiras((atual) => ({
      ...atual,
      [idMaquina]: novaBandeira
    }));
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

    if (
      form.tipoUtilizacao === "propria" &&
      (!form.potencialKw || Number(form.potencialKw) <= 0)
    ) {
      setErro("Informe um consumo em kW maior que zero.");
      return;
    }

    if (
      form.tipoUtilizacao === "terceiros" &&
      (!form.custoHora || Number(form.custoHora) <= 0)
    ) {
      setErro("Informe um custo por hora maior que zero.");
      return;
    }

    try {
      setSalvando(true);

      const dadosParaEnviar = {
        nome: form.nome,
        tipoUtilizacao: form.tipoUtilizacao,
        potencialKw: form.tipoUtilizacao === "propria" ? form.potencialKw : null,
        custoHora: form.tipoUtilizacao === "terceiros" ? form.custoHora : null,
        imagem: form.imagem
      };

      await maquinaService.cadastrar(dadosParaEnviar);

      limparFormulario();
      await carregarMaquinas();

    } catch (error) {
      setErro(error.message || "Erro ao cadastrar máquina.");

      console.error("Erro ao cadastrar máquina:", error);
    } finally {
      setSalvando(false);
    }
  };

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

  const maquinasFiltradas = maquinas.filter((m) => {
    const nome = String(m.nome || "").toLowerCase();
    return nome.includes(busca.toLowerCase());
  });

  return (
    <div className="operacoes-page">


      {/* FORMULÁRIO DE CADASTRO */}

      {/* FORMULÁRIO DE CADASTRO */}
      <div className="operacoes-form-card">
        <div className="operacoes-form-row">

          {/* Nome da máquina */}
          <div className="operacoes-form-group">
            <label>Nome / Modelo da Máquina</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Torno CNC Romi"
            />
          </div>

          {/* Tipo de utilização */}
          <div className="operacoes-form-group">
            <label>Tipo de Utilização</label>
            <select
              name="tipoUtilizacao"
              value={form.tipoUtilizacao}
              onChange={handleChange}
              className="operacoes-select"
            >
              <option value="propria">Própria</option>
              <option value="terceiros">Terceiros</option>
            </select>
          </div>

          {/* Campo condicional */}
          {form.tipoUtilizacao === "propria" ? (
            <div className="operacoes-form-group">
              <label>Consumo / Potência (kW)</label>
              <input
                name="potencialKw"
                type="number"
                min="0.01"
                step="0.01"
                value={form.potencialKw}
                onChange={handleChange}
                placeholder="Ex: 15.5"
              />
            </div>
          ) : (
            <div className="operacoes-form-group">
              <label>Custo por Hora (R$)</label>
              <input
                name="custoHora"
                type="number"
                min="0.01"
                step="0.01"
                value={form.custoHora}
                onChange={handleChange}
                placeholder="Ex: 120.00"
              />
            </div>
          )}

          {/* Imagem */}
          <div className="operacoes-form-group">
            <label>Imagem da Máquina (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

        </div>

        {/* Mensagem de erro */}
        {erro && (
          <div className="alerta-erro">
            {erro}
          </div>
        )}

        {/* Botões */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            type="button"
            className="maquina-btn-cadastrar"
            onClick={salvarMaquina}
            disabled={salvando}
          >
            {salvando ? "Cadastrando..." : "Cadastrar Máquina"}
          </button>

          <button
            type="button"
            className="maquina-btn-cadastrar"
            onClick={limparFormulario}
            style={{
              background: "#657d9d"
            }}
          >
            Limpar
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
            const idAtual = m.idMaquina || idx;
            const bandeiraAtual = bandeiras[idAtual] || "verde";

            const bandeiraSelecionada = BANDEIRAS_TARIFARIAS.find(
              (b) => b.valor === bandeiraAtual
            );
            const nomeMaquina = m.nome || "Máquina";
            const imagemUrl = formatarUrlImagem(m.imagem);

            return (
              <div key={idAtual} className="operacoes-table-card maquina-item-card">

                <div className="maquina-card-header">
                  <div className="maquina-header-right">
                    <span
                      className="maquina-status-badge"
                      style={{
                        color: bandeiraSelecionada.cor,
                        backgroundColor: `${bandeiraSelecionada.cor}18`,
                        borderColor: `${bandeiraSelecionada.cor}40`
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        flag
                      </span>

                      Bandeira {bandeiraSelecionada.nome}
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

                <div className="maquina-subgrid-4">

                  {/* Imagem e nome */}
                  <div className="maquina-subcard-panel">
                    <div className="maquina-subcard-img-box">
                      <div className="maquina-subcard-panel">
                        <div className="maquina-subcard-img-box">
                          {imagemUrl ? (
                            <img
                              src={imagemUrl}
                              alt={nomeMaquina}
                              onError={(e) => {
                                console.error("Erro ao carregar imagem:", imagemUrl);
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="maquina-img-empty">
                              <span className="material-symbols-outlined">
                                precision_manufacturing
                              </span>
                              <span>Sem Imagem</span>
                            </div>
                          )}
                        </div>

                        <div className="maquina-subcard-img-info">
                          <strong>{nomeMaquina}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="maquina-subcard-img-info">
                      <strong>{nomeMaquina}</strong>
                    </div>

                    <h4 className="maquina-subcard-title">Dados da Máquina</h4>

                    <div className="maquina-info-line">
                      <span>Tipo de utilização</span>
                      <strong>
                        {m.tipoUtilizacao === "propria" ? "Própria" : "Terceiros"}
                      </strong>
                    </div>

                    {m.tipoUtilizacao === "propria" ? (
                      <div className="maquina-info-line">
                        <span>Consumo / Potência</span>
                        <strong>{m.potencialKw} kW</strong>
                      </div>
                    ) : (
                      <div className="maquina-info-line">
                        <span>Custo por hora</span>
                        <strong>{formatarMoeda(m.custoHora)}</strong>
                      </div>
                    )}

                  </div>

                  
                  {/* Bandeiras tarifárias */}
                  <div className="maquina-subcard-panel">
                    <h4 className="maquina-subcard-title">Bandeiras Tarifárias</h4>

                    <div className="maquina-flags-list">
                      {BANDEIRAS_TARIFARIAS.map((bandeira) => {
                        const selecionada = bandeiraAtual === bandeira.valor;

                        return (
                          <button
                            key={bandeira.valor}
                            type="button"
                            onClick={() => alterarBandeira(idAtual, bandeira.valor)}
                            className={`flag-option-btn ${selecionada ? "selected" : ""}`}
                            style={{
                              backgroundColor: selecionada
                                ? `${bandeira.cor}18`
                                : "#ffffff",
                              borderColor: selecionada
                                ? bandeira.cor
                                : "#d4dfed",
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{
                                color: bandeira.cor,
                                fontVariationSettings: "'FILL' 1",
                              }}
                            >
                              flag
                            </span>

                            <div className="flag-btn-text">
                              <span
                                className="flag-btn-name"
                                style={{
                                  color: selecionada ? bandeira.cor : "#17375d",
                                }}
                              >
                                {bandeira.nome}
                              </span>

                              <span className="flag-btn-desc">
                                {bandeira.descricao}
                              </span>
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