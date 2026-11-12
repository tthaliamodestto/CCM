
import React, { useEffect, useState } from "react";
import "../css/Orcamentos.css";

const dadosBase = [
  { id: 1, nome: "Torneamento", preco: 120, tempo: 35 },
  { id: 2, nome: "Fresamento", preco: 170, tempo: 45 },
  { id: 3, nome: "Furação", preco: 95, tempo: 25 },
  { id: 4, nome: "Rebimento", preco: 140, tempo: 40 },
];

const moeda = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function Orcamentos() {
  const [abaAtiva, setAbaAtiva] = useState("dashboard");
  const [abaRelatorio, setAbaRelatorio] = useState("visualizar");
  const [operacoes, setOperacoes] = useState(dadosBase);
  const [modalDetalhes, setModalDetalhes] = useState(null);

  const [dadosRelatorio, setDadosRelatorio] = useState({
    titulo: "Relatório Executivo de Orçamento",
    cliente: "",
    projeto: "Orçamento Metalúrgico",
    responsavel: "",
    descricao:
      "Documento elaborado para apresentação dos custos e das operações previstas no processo de fabricação.",
    observacoes: "",
  });

  useEffect(() => {
    try {
      const dadosSalvos = localStorage.getItem("ccm_operacoes");

      if (dadosSalvos) {
        const lista = JSON.parse(dadosSalvos);

        if (Array.isArray(lista) && lista.length > 0) {
          setOperacoes(lista);
          return;
        }
      }
    } catch (error) {
      console.error("Erro ao carregar operações:", error);
    }

    setOperacoes(dadosBase);
  }, []);

  // =========================================
  // CÁLCULOS DO DASHBOARD
  // =========================================

  const totalOperacoes = operacoes.length;

  const tempoTotalMinutos = operacoes.reduce(
    (acc, operacao) => acc + Number(operacao.tempo || 0),
    0
  );

  const custoTotal = operacoes.reduce(
    (acc, operacao) => acc + Number(operacao.preco || 0),
    0
  );

  const valorEstimado = custoTotal * 1.55;

  const margem = valorEstimado
    ? ((valorEstimado - custoTotal) / valorEstimado) * 100
    : 0;

  const lucro = valorEstimado - custoTotal;

  const operacoesOrdenadas = [...operacoes].sort(
    (a, b) => Number(b.preco || 0) - Number(a.preco || 0)
  );

  const topOperacoes = operacoesOrdenadas.slice(0, 5);

  const distribuicao = Object.values(
    operacoes.reduce((acc, operacao) => {
      const nome = operacao.nome || "Outros";

      acc[nome] = acc[nome] || {
        nome,
        valor: 0,
        qtde: 0,
      };

      acc[nome].valor += Number(operacao.preco || 0);
      acc[nome].qtde += 1;

      return acc;
    }, {})
  ).sort((a, b) => b.valor - a.valor);

  const maxDistribuicao = Math.max(
    ...distribuicao.map((item) => item.valor),
    1
  );

  const mediaTempo = totalOperacoes
    ? tempoTotalMinutos / totalOperacoes
    : 0;

  const percentualOEE = Math.min(
    100,
    Math.max(0, 84 + totalOperacoes * 1.5)
  );

  // =========================================
  // DADOS DO GRÁFICO
  // =========================================

  const seriesDados = [
    { mes: "Jan", valor: 120 },
    { mes: "Fev", valor: 150 },
    { mes: "Mar", valor: 140 },
    { mes: "Abr", valor: 210 },
    { mes: "Mai", valor: 195 },
    { mes: "Jun", valor: 260 },
    { mes: "Jul", valor: 245 },
    { mes: "Ago", valor: 310 },
  ];

  const maxSerie = Math.max(
    ...seriesDados.map((item) => item.valor),
    1
  );

  const chartWidth = 800;
  const chartHeight = 260;
  const chartPadding = 32;

  const points = seriesDados.map((item, index) => {
    const x =
      chartPadding +
      (index * (chartWidth - chartPadding * 2)) /
        (seriesDados.length - 1);

    const y =
      chartHeight -
      chartPadding -
      (item.valor / maxSerie) *
        (chartHeight - chartPadding * 2.2);

    return { ...item, x, y };
  });

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${
        chartHeight - chartPadding
      } L ${points[0].x} ${chartHeight - chartPadding} Z`
    : "";

  const valorLinhaAtual = points[points.length - 1]?.valor || 0;

  // =========================================
  // RELATÓRIO
  // =========================================

  const atualizarRelatorio = (campo, valor) => {
    setDadosRelatorio((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const handleGerarRelatorio = () => {
    setAbaAtiva("relatorios");
    setAbaRelatorio("visualizar");
  };

  const handleImprimir = () => {
    setAbaRelatorio("visualizar");

    setTimeout(() => {
      window.print();
    }, 200);
  };

  const dataAtual = new Date().toLocaleDateString("pt-BR");

  // =========================================
  // MODAL DE DETALHES
  // =========================================

  const abrirDetalhes = (dados) => {
    setModalDetalhes(dados);
  };

  return (
    <div className="orcamentos-dashboard-page">

      {/* =====================================
          CABEÇALHO E NAVEGAÇÃO
      ====================================== */}

      <div className="orcamentos-header">
        <div className="orcamentos-tabs">
          <button
            type="button"
            className={
              abaAtiva === "dashboard"
                ? "tab-button active"
                : "tab-button"
            }
            onClick={() => setAbaAtiva("dashboard")}
          >
            Dashboard
          </button>

          <button
            type="button"
            className={
              abaAtiva === "relatorios"
                ? "tab-button active"
                : "tab-button"
            }
            onClick={() => setAbaAtiva("relatorios")}
          >
            Relatórios
          </button>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={handleGerarRelatorio}
        >
          <span className="material-symbols-outlined">
            description
          </span>
          Gerar relatório
        </button>
      </div>

      {/* =====================================
          DASHBOARD
      ====================================== */}

      {abaAtiva === "dashboard" && (
        <>
          <section className="hero-dashboard-panel">
            <div className="hero-dashboard-copy">
              <div className="eyebrow">
                PERFORMANCE GERAL
              </div>

              <h2>Dashboard de orçamento e produção</h2>

              <p>
                Acompanhe a evolução dos custos, o desempenho das
                operações e a margem estimada em um único painel
                integrado CCM.
              </p>
            </div>

            <div className="hero-score-box">
              <span>Margem atual</span>
              <strong>{margem.toFixed(1)}%</strong>
              <small>Margem estimada de operação</small>
            </div>
          </section>

          {/* GRÁFICO PRINCIPAL */}

          <section className="integrated-panel">
            <div className="main-line-chart">
              <div className="panel-header">
                <div>
                  <h3>Evolução do orçamento</h3>
                  <span>Últimos 8 meses</span>
                </div>

                <div className="chart-mini-kpis">
                  <span>
                    <b>
                      R$ {valorLinhaAtual.toLocaleString("pt-BR")}
                    </b>
                  </span>

                  <span className="positive-trend">
                    +12,4%
                  </span>
                </div>
              </div>

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="line-chart-svg"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="laserGlowLine"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--accent-color)"
                      stopOpacity="0.4"
                    />

                    <stop
                      offset="50%"
                      stopColor="#ffffff"
                      stopOpacity="1"
                    />

                    <stop
                      offset="100%"
                      stopColor="var(--accent-color)"
                      stopOpacity="0.4"
                    />

                    <animate
                      attributeName="x1"
                      from="-100%"
                      to="100%"
                      dur="3s"
                      repeatCount="indefinite"
                    />

                    <animate
                      attributeName="x2"
                      from="0%"
                      to="200%"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </linearGradient>

                  <linearGradient
                    id="lineAreaGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--accent-color)"
                      stopOpacity="0.35"
                    />

                    <stop
                      offset="100%"
                      stopColor="var(--accent-color)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3].map((line) => {
                  const y =
                    chartPadding +
                    (line * (chartHeight - chartPadding * 2)) / 3;

                  return (
                    <line
                      key={line}
                      x1={chartPadding}
                      y1={y}
                      x2={chartWidth - chartPadding}
                      y2={y}
                      className="grid-line"
                    />
                  );
                })}

                <path
                  d={areaPath}
                  fill="url(#lineAreaGradient)"
                />

                <path
                  d={linePath}
                  className="chart-line"
                  stroke="url(#laserGlowLine)"
                />

                {points.map((point) => (
                  <g key={point.mes}>
                    <text
                      x={point.x}
                      y={point.y - 12}
                      textAnchor="middle"
                      className="chart-value-text"
                    >
                      R$ {point.valor}
                    </text>

                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      className="chart-point"
                    />

                    <text
                      x={point.x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className="chart-label"
                    >
                      {point.mes}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* INDICADORES LATERAIS */}

            <div className="side-summary-stack">
              <article
                className="mini-stat-card accent"
                onClick={() =>
                  abrirDetalhes({
                    titulo: "Lucro estimado",
                    valor: moeda(lucro),
                    descricao:
                      "Projeção calculada com base no valor estimado de venda e no custo das operações.",
                    itens: [
                      {
                        rotulo: "Valor de venda previsto",
                        val: moeda(valorEstimado),
                      },
                      {
                        rotulo: "Custo de produção",
                        val: moeda(custoTotal),
                      },
                      {
                        rotulo: "Margem",
                        val: `${margem.toFixed(1)}%`,
                      },
                    ],
                  })
                }
              >
                <span>
                  Lucro estimado
                  <span className="material-symbols-outlined">
                    touch_app
                  </span>
                </span>

                <strong>{moeda(lucro)}</strong>
                <small>{margem.toFixed(1)}% de margem</small>
              </article>

              <article
                className="mini-stat-card"
                onClick={() =>
                  abrirDetalhes({
                    titulo: "Custo total de operações",
                    valor: moeda(custoTotal),
                    descricao:
                      "Soma dos custos registrados nas operações cadastradas.",
                    itens: [
                      {
                        rotulo: "Operações cadastradas",
                        val: `${operacoes.length}`,
                      },
                      {
                        rotulo: "Custo médio por operação",
                        val: moeda(
                          totalOperacoes
                            ? custoTotal / totalOperacoes
                            : 0
                        ),
                      },
                    ],
                  })
                }
              >
                <span>
                  Custo total
                  <span className="material-symbols-outlined">
                    touch_app
                  </span>
                </span>

                <strong>{moeda(custoTotal)}</strong>
                <small>{operacoes.length} operações cadastradas</small>
              </article>

              <article
                className="mini-stat-card"
                onClick={() =>
                  abrirDetalhes({
                    titulo: "Tempo total registrado",
                    valor: `${tempoTotalMinutos} minutos`,
                    descricao:
                      "Tempo acumulado das operações cadastradas.",
                    itens: [
                      {
                        rotulo: "Horas acumuladas",
                        val: `${(tempoTotalMinutos / 60).toFixed(1)} horas`,
                      },
                      {
                        rotulo: "Média por operação",
                        val: `${mediaTempo.toFixed(0)} min`,
                      },
                    ],
                  })
                }
              >
                <span>
                  Tempo total
                  <span className="material-symbols-outlined">
                    touch_app
                  </span>
                </span>

                <strong>{tempoTotalMinutos} min</strong>
                <small>
                  {mediaTempo.toFixed(0)} min em média por operação
                </small>
              </article>
            </div>
          </section>

          {/* PAINÉIS INFERIORES */}

          <section className="bottom-integrated-grid">
            <article className="panel lower-panel">
              <div className="panel-header">
                <h3>Resumo financeiro</h3>
                <span>Operações</span>
              </div>

              <div className="distribution-list">
                {distribuicao.slice(0, 4).map((item) => (
                  <div
                    key={item.nome}
                    className="distribution-row"
                  >
                    <div className="label-with-dot">
                      <span className="dot" />
                      <span>{item.nome}</span>
                    </div>

                    <div className="distribution-meta">
                      <strong>
                        {(
                          (item.valor / maxDistribuicao) *
                          100
                        ).toFixed(0)}
                        %
                      </strong>

                      <small>{moeda(item.valor)}</small>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel lower-panel">
              <div className="panel-header">
                <h3>Eficiência</h3>
                <span>OEE</span>
              </div>

              <div className="gauge-wrap">
                <div
                  className="gauge-ring"
                  style={{
                    background: `conic-gradient(var(--accent-color) ${
                      percentualOEE * 3.6
                    }deg, var(--border-color) 0deg)`,
                  }}
                >
                  <div className="gauge-center">
                    <strong>{percentualOEE.toFixed(0)}</strong>
                    <small>%</small>
                  </div>
                </div>
              </div>
            </article>

            <article className="panel lower-panel">
              <div className="panel-header">
                <h3>Top operações</h3>
                <span>Custos</span>
              </div>

              <div className="distribution-list">
                {topOperacoes.map((operacao) => (
                  <div
                    key={operacao.id || operacao.nome}
                    className="top-row"
                  >
                    <span>{operacao.nome}</span>
                    <strong>{moeda(operacao.preco)}</strong>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      )}

      {/* =====================================
          RELATÓRIOS
      ====================================== */}

      {abaAtiva === "relatorios" && (
        <section className="report-workspace">

          <div className="report-toolbar no-print">
            <div>
              <span className="report-eyebrow">
                DOCUMENTAÇÃO CCM
              </span>

              <h2>Relatório de orçamento</h2>

              <p>
                Visualize e personalize o documento antes de exportar.
              </p>
            </div>

            <div className="report-toolbar-actions">
              <button
                type="button"
                className={
                  abaRelatorio === "visualizar"
                    ? "report-tab active"
                    : "report-tab"
                }
                onClick={() => setAbaRelatorio("visualizar")}
              >
                Visualizar
              </button>

              <button
                type="button"
                className={
                  abaRelatorio === "editar"
                    ? "report-tab active"
                    : "report-tab"
                }
                onClick={() => setAbaRelatorio("editar")}
              >
                Editar relatório
              </button>

              <button
                type="button"
                className="report-export-btn"
                onClick={handleImprimir}
              >
                <span className="material-symbols-outlined">
                  picture_as_pdf
                </span>
                Exportar PDF
              </button>
            </div>
          </div>

          {/* EDITOR */}

          {abaRelatorio === "editar" && (
            <div className="report-editor no-print">
              <div className="report-editor-heading">
                <span className="report-eyebrow">
                  PERSONALIZAÇÃO
                </span>

                <h3>Informações do documento</h3>

                <p>
                  Preencha as informações que aparecerão no relatório.
                </p>
              </div>

              <div className="report-editor-grid">
                <div className="report-edit-field">
                  <label>Título do relatório</label>

                  <input
                    value={dadosRelatorio.titulo}
                    onChange={(e) =>
                      atualizarRelatorio("titulo", e.target.value)
                    }
                    placeholder="Título do relatório"
                  />
                </div>

                <div className="report-edit-field">
                  <label>Cliente / Empresa</label>

                  <input
                    value={dadosRelatorio.cliente}
                    onChange={(e) =>
                      atualizarRelatorio("cliente", e.target.value)
                    }
                    placeholder="Nome do cliente ou empresa"
                  />
                </div>

                <div className="report-edit-field">
                  <label>Projeto</label>

                  <input
                    value={dadosRelatorio.projeto}
                    onChange={(e) =>
                      atualizarRelatorio("projeto", e.target.value)
                    }
                  />
                </div>

                <div className="report-edit-field">
                  <label>Responsável</label>

                  <input
                    value={dadosRelatorio.responsavel}
                    onChange={(e) =>
                      atualizarRelatorio("responsavel", e.target.value)
                    }
                    placeholder="Responsável pelo orçamento"
                  />
                </div>

                <div className="report-edit-field full">
                  <label>Descrição</label>

                  <textarea
                    rows="4"
                    value={dadosRelatorio.descricao}
                    onChange={(e) =>
                      atualizarRelatorio("descricao", e.target.value)
                    }
                  />
                </div>

                <div className="report-edit-field full">
                  <label>Observações adicionais</label>

                  <textarea
                    rows="4"
                    value={dadosRelatorio.observacoes}
                    onChange={(e) =>
                      atualizarRelatorio("observacoes", e.target.value)
                    }
                    placeholder="Adicione condições, prazos ou observações..."
                  />
                </div>
              </div>

              <button
                type="button"
                className="report-save-btn"
                onClick={() => setAbaRelatorio("visualizar")}
              >
                Visualizar alterações
              </button>
            </div>
          )}

          {/* VISUALIZAÇÃO DO DOCUMENTO */}

          {abaRelatorio === "visualizar" && (
            <div className="report-pages">

              {/* CAPA */}

              <article className="report-page report-cover">
                <div className="cover-top">
                  <span>CCM INDUSTRIAL</span>
                  <span>DOCUMENTO TÉCNICO</span>
                </div>

                <div className="cover-main">
                  <img
                    src="/logos/Logo-CCM (2).png"
                    alt="Logo CCM"
                    className="cover-logo"
                  />

                  <div className="cover-divider" />

                  <span className="cover-label">
                    DOCUMENTO EXECUTIVO
                  </span>

                  <h1>{dadosRelatorio.titulo}</h1>

                  <p>{dadosRelatorio.projeto}</p>

                  <div className="cover-info">
                    {dadosRelatorio.cliente && (
                      <div>
                        <span>CLIENTE</span>
                        <strong>{dadosRelatorio.cliente}</strong>
                      </div>
                    )}

                    {dadosRelatorio.responsavel && (
                      <div>
                        <span>RESPONSÁVEL</span>
                        <strong>{dadosRelatorio.responsavel}</strong>
                      </div>
                    )}

                    <div>
                      <span>DATA DE EMISSÃO</span>
                      <strong>{dataAtual}</strong>
                    </div>
                  </div>
                </div>

                <div className="cover-bottom">
                  <span>SISTEMA DE ORÇAMENTO METALÚRGICO</span>
                  <span>CCM © {new Date().getFullYear()}</span>
                </div>
              </article>

              {/* PÁGINA DO RELATÓRIO */}

              <article className="report-page report-document">
                <header className="document-header">
                  <div>
                    <img
                      src="/logos/Logo-CCM (2).png"
                      alt="CCM"
                    />

                    <span>CCM INDUSTRIAL</span>
                  </div>

                  <span>RELATÓRIO DE ORÇAMENTO</span>
                </header>

                <div className="document-title">
                  <span className="report-eyebrow">
                    ANÁLISE FINANCEIRA E OPERACIONAL
                  </span>

                  <h1>{dadosRelatorio.titulo}</h1>

                  <p>{dadosRelatorio.descricao}</p>
                </div>

                <section className="document-metadata">
                  <div>
                    <span>CLIENTE</span>
                    <strong>
                      {dadosRelatorio.cliente || "Não informado"}
                    </strong>
                  </div>

                  <div>
                    <span>PROJETO</span>
                    <strong>
                      {dadosRelatorio.projeto || "Não informado"}
                    </strong>
                  </div>

                  <div>
                    <span>RESPONSÁVEL</span>
                    <strong>
                      {dadosRelatorio.responsavel || "Não informado"}
                    </strong>
                  </div>

                  <div>
                    <span>EMISSÃO</span>
                    <strong>{dataAtual}</strong>
                  </div>
                </section>

                <section className="document-section">
                  <h2>01. Resumo executivo</h2>

                  <div className="document-kpis">
                    <div>
                      <span>Operações cadastradas</span>
                      <strong>{totalOperacoes}</strong>
                    </div>

                    <div>
                      <span>Tempo total estimado</span>
                      <strong>{tempoTotalMinutos} min</strong>
                    </div>

                    <div>
                      <span>Custo de operações</span>
                      <strong>{moeda(custoTotal)}</strong>
                    </div>

                    <div>
                      <span>Valor estimado de venda</span>
                      <strong>{moeda(valorEstimado)}</strong>
                    </div>
                  </div>
                </section>

                <section className="document-section">
                  <h2>02. Indicadores financeiros</h2>

                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Indicador</th>
                        <th>Resultado</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>Custo total das operações</td>
                        <td>{moeda(custoTotal)}</td>
                      </tr>

                      <tr>
                        <td>Valor estimado de venda</td>
                        <td>{moeda(valorEstimado)}</td>
                      </tr>

                      <tr>
                        <td>Margem de lucro</td>
                        <td>{margem.toFixed(1)}%</td>
                      </tr>

                      <tr className="report-table-highlight">
                        <td>Lucro previsto</td>
                        <td>{moeda(lucro)}</td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                <section className="document-section">
                  <h2>03. Detalhamento das operações</h2>

                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Operação</th>
                        <th>Tempo</th>
                        <th>Custo</th>
                      </tr>
                    </thead>

                    <tbody>
                      {operacoes.map((op, index) => (
                        <tr key={op.id || `${op.nome}-${index}`}>
                          <td>{op.nome}</td>
                          <td>{Number(op.tempo || 0)} min</td>
                          <td>{moeda(op.preco)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                {dadosRelatorio.observacoes && (
                  <section className="document-section">
                    <h2>04. Observações</h2>

                    <p className="document-observations">
                      {dadosRelatorio.observacoes}
                    </p>
                  </section>
                )}

                <footer className="document-footer">
                  <span>
                    CCM INDUSTRIAL — Sistema de Orçamento Metalúrgico
                  </span>

                  <span>Documento gerado pelo sistema CCM</span>
                </footer>
              </article>
            </div>
          )}
        </section>
      )}

      {/* =====================================
          MODAL DE DETALHES
      ====================================== */}

      {modalDetalhes && (
        <div
          className="modal-overlay"
          onClick={() => setModalDetalhes(null)}
        >
          <div
            className="modal-content-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{modalDetalhes.titulo}</h3>

              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setModalDetalhes(null)}
              >
                &times;
              </button>
            </div>

            <div className="modal-main-value">
              {modalDetalhes.valor}
            </div>

            <p className="modal-description">
              {modalDetalhes.descricao}
            </p>

            <div className="modal-details-list">
              {modalDetalhes.itens.map((item, index) => (
                <div key={index}>
                  <span>{item.rotulo}</span>
                  <strong>{item.val}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
