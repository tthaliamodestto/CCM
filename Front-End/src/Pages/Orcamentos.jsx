import React, { useEffect, useState } from "react";
import "../css/Orcamentos.css";

const dadosBase = [
  { id: 1, nome: "Torneamento", preco: 120, tempo: 35 },
  { id: 2, nome: "Fresamento", preco: 170, tempo: 45 },
  { id: 3, nome: "Furação", preco: 95, tempo: 25 },
  { id: 4, nome: "Rebimento", preco: 140, tempo: 40 },
];

export default function Orcamentos() {
  const [abaAtiva, setAbaAtiva] = useState("dashboard");
  const [operacoes, setOperacoes] = useState(dadosBase);
  const [modalDetalhes, setModalDetalhes] = useState(null); // Estado para abrir o modal de cada card ao clicar

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
    } catch {
      // mantém dados base
    }
    setOperacoes(dadosBase);
  }, []);

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
  const margem = custoTotal ? ((valorEstimado - custoTotal) / valorEstimado) * 100 : 0;
  const lucro = valorEstimado - custoTotal;

  const operacoesOrdenadas = [...operacoes].sort(
    (a, b) => Number(b.preco || 0) - Number(a.preco || 0)
  );

  const topOperacoes = operacoesOrdenadas.slice(0, 5);

  const distribuicao = Object.values(
    operacoes.reduce((acc, operacao) => {
      const nome = operacao.nome || "Outros";
      acc[nome] = acc[nome] || { nome, valor: 0, qtde: 0 };
      acc[nome].valor += Number(operacao.preco || 0);
      acc[nome].qtde += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.valor - a.valor);

  const maxDistribuicao = Math.max(...distribuicao.map((item) => item.valor), 1);
  const mediaTempo = totalOperacoes ? tempoTotalMinutos / totalOperacoes : 0;
  const percentualOEE = Math.min(100, Math.max(0, 84 + totalOperacoes * 1.5));

  const gerarTextoRelatorio = () => {
    const agora = new Date();
    const linhas = [
      "==================================================",
      " RELATÓRIO EXECUTIVO DE ORÇAMENTO - CCM INDUSTRIAL",
      "==================================================",
      `Data de Emissão: ${agora.toLocaleDateString("pt-BR")}`,
      `Horário: ${agora.toLocaleTimeString("pt-BR")}`,
      "--------------------------------------------------",
      "RESUMO GERAL:",
      ` • Operações Cadastradas: ${totalOperacoes}`,
      ` • Tempo Total Estimado: ${tempoTotalMinutos} min (${(tempoTotalMinutos / 60).toFixed(1)} hrs)`,
      ` • Custo Total de Operações: R$ ${custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      ` • Valor Estimado de Venda: R$ ${valorEstimado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      ` • Margem de Lucro: ${margem.toFixed(1)}%`,
      ` • Lucro Previsto: R$ ${lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      "--------------------------------------------------",
      "TOP OPERAÇÕES POR CUSTO:",
      ...topOperacoes.map(
        (op, idx) =>
          ` ${idx + 1}. ${op.nome.padEnd(20, " ")} | R$ ${Number(op.preco || 0).toFixed(2).padStart(8, " ")} | ${op.tempo} min`
      ),
      "--------------------------------------------------",
      "DETALHAMENTO COMPLETO:",
      ...operacoes.map(
        (op) =>
          ` • ${op.nome}: R$ ${Number(op.preco || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (${op.tempo} min)`
      ),
      "==================================================",
    ];

    return linhas.join("\n");
  };

  const handleGerarRelatorio = () => {
    const conteudo = gerarTextoRelatorio();
    setAbaAtiva("relatorios");

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-orcamento-ccm-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImprimir = () => {
    window.print();
  };

  // SÉRIE DE DADOS DO GRÁFICO
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

  const maxSerie = Math.max(...seriesDados.map((item) => item.valor), 1);
  const chartWidth = 800;
  const chartHeight = 260;
  const chartPadding = 32;

  const points = seriesDados.map((item, index) => {
    const x =
      chartPadding +
      (index * (chartWidth - chartPadding * 2)) / (seriesDados.length - 1);
    const y =
      chartHeight -
      chartPadding -
      (item.valor / maxSerie) * (chartHeight - chartPadding * 2.2);
    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - chartPadding} L ${points[0].x} ${chartHeight - chartPadding} Z`;

  const valorLinhaAtual = points[points.length - 1]?.valor || 0;

  return (
    <div className="orcamentos-dashboard-page">
      {/* HEADER E NAVEGAÇÃO */}
      <div className="orcamentos-header">
        <div className="orcamentos-tabs">
          <button
            type="button"
            className={abaAtiva === "dashboard" ? "tab-button active" : "tab-button"}
            onClick={() => setAbaAtiva("dashboard")}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={abaAtiva === "relatorios" ? "tab-button active" : "tab-button"}
            onClick={() => setAbaAtiva("relatorios")}
          >
            Relatórios
          </button>
        </div>

        <button type="button" className="btn-primary" onClick={handleGerarRelatorio}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
            description
          </span>
          Gerar relatório
        </button>
      </div>

      {abaAtiva === "dashboard" && (
        <>
          {/* BANNER DE PERFORMANCE */}
          <section className="hero-dashboard-panel">
            <div className="hero-dashboard-copy">
              <div className="eyebrow">Performance geral</div>
              <h2>Dashboard de orçamento e produção</h2>
              <p>
                Acompanhe a evolução dos custos, o desempenho das operações e a margem
                estimada em um único painel integrado CCM.
              </p>
            </div>

            <div className="hero-score-box">
              <span>Margem atual</span>
              <strong>{margem.toFixed(1)}%</strong>
              <small>Lucro previsto em evolução</small>
            </div>
          </section>

          {/* PAINEL CENTRAL DO GRÁFICO SVG COM BRILHO E INTERAÇÃO */}
          <section className="integrated-panel">
            <div className="main-line-chart">
              <div className="panel-header">
                <div>
                  <h3>Evolução do orçamento</h3>
                  <span>Últimos 8 meses</span>
                </div>
                <div className="chart-mini-kpis">
                  <span>
                    <b>R$ {valorLinhaAtual.toLocaleString("pt-BR")}</b>
                  </span>
                  <span className="positive-trend">+12,4%</span>
                </div>
              </div>

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="line-chart-svg"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* GRADIENTE COM ANIMAÇÃO LASER CONTINUA */}
                  <linearGradient id="laserGlowLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.4" />
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

                  <linearGradient id="lineAreaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* LINHAS DE GRADE */}
                {[0, 1, 2, 3].map((line) => {
                  const y = chartPadding + (line * (chartHeight - chartPadding * 2)) / 3;
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

                <path d={areaPath} fill="url(#lineAreaGradient)" />
                <path d={linePath} className="chart-line" stroke="url(#laserGlowLine)" />

                {/* PONTOS COM NÚMEROS E VALORES ACIMA */}
                {points.map((point) => (
                  <g key={point.mes}>
                    {/* VALOR EXPLICITO EM CIMA DO PONTO */}
                    <text
                      x={point.x}
                      y={point.y - 12}
                      textAnchor="middle"
                      className="chart-value-text"
                    >
                      R$ {point.valor}
                    </text>

                    <circle cx={point.x} cy={point.y} r="5" className="chart-point" />

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

            {/* STACK LATERAL DE CARDS INTERATIVOS */}
            <div className="side-summary-stack">
              <article
                className="mini-stat-card accent"
                onClick={() =>
                  setModalDetalhes({
                    titulo: "Lucro Estimado",
                    valor: `R$ ${lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                    descricao: "Projeção baseada na margem multiplicadora configurada para as peças da oficina.",
                    itens: [
                      { rotulo: "Valor de Venda Previsto", val: `R$ ${valorEstimado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
                      { rotulo: "Custo Bruto de Produção", val: `R$ ${custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
                      { rotulo: "Percentual da Margem", val: `${margem.toFixed(1)}%` },
                    ],
                  })
                }
              >
                <span>
                  Lucro estimado
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>touch_app</span>
                </span>
                <strong>
                  R$ {lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
                <small>+{margem.toFixed(1)}% de margem</small>
              </article>

              <article
                className="mini-stat-card"
                onClick={() =>
                  setModalDetalhes({
                    titulo: "Custo Total de Operações",
                    valor: `R$ ${custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                    descricao: "Soma direta dos insumos e horas registradas nas operações cadastradas.",
                    itens: [
                      { rotulo: "Operações Ativas", val: `${operacoes.length} cadastradas` },
                      { rotulo: "Custo Médio por Peça", val: `R$ ${(totalOperacoes ? custoTotal / totalOperacoes : 0).toFixed(2)}` },
                    ],
                  })
                }
              >
                <span>
                  Custo total
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>touch_app</span>
                </span>
                <strong>
                  R$ {custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
                <small>{operacoes.length} operações cadastradas</small>
              </article>

              <article
                className="mini-stat-card"
                onClick={() =>
                  setModalDetalhes({
                    titulo: "Tempo Total Registrado",
                    valor: `${tempoTotalMinutos} minutos`,
                    descricao: "Tempo acumulado das rotinas de máquinas e mão de obra.",
                    itens: [
                      { rotulo: "Horas Acumuladas", val: `${(tempoTotalMinutos / 60).toFixed(1)} hrs` },
                      { rotulo: "Média por Operação", val: `${mediaTempo.toFixed(0)} min` },
                    ],
                  })
                }
              >
                <span>
                  Tempo total
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>touch_app</span>
                </span>
                <strong>{tempoTotalMinutos} min</strong>
                <small>{mediaTempo.toFixed(0)} min média por peça</small>
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
                  <div key={item.nome} className="distribution-row">
                    <div className="label-with-dot">
                      <span className="dot" />
                      <span>{item.nome}</span>
                    </div>
                    <div className="distribution-meta">
                      <strong>{((item.valor / maxDistribuicao) * 100).toFixed(0)}%</strong>
                      <small>
                        R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </small>
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
                    background: `conic-gradient(var(--accent-color) ${percentualOEE * 3.6}deg, var(--border-color) 0deg)`,
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
                  <div key={operacao.id || operacao.nome} className="top-row">
                    <span>{operacao.nome}</span>
                    <strong>
                      R$ {Number(operacao.preco || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      )}

      {/* ABA DE RELATÓRIOS EXECUTIVOS */}
      {abaAtiva === "relatorios" && (
        <section className="panel report-panel">
          <div className="panel-header">
            <h3>Geração de relatório</h3>
            <button type="button" className="btn-primary" onClick={handleImprimir}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                print
              </span>
              Exportar / Imprimir PDF
            </button>
          </div>

          <div className="report-content">
            <div className="report-summary">
              <div>
                <span>Operações cadastradas</span>
                <strong>{totalOperacoes}</strong>
              </div>
              <div>
                <span>Tempo total</span>
                <strong>{tempoTotalMinutos} min</strong>
              </div>
              <div>
                <span>Lucro previsto</span>
                <strong>
                  R$ {lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </strong>
              </div>
            </div>

            <pre>{gerarTextoRelatorio()}</pre>
          </div>
        </section>
      )}

      {/* MODAL INTERATIVO PARA CARDS */}
      {modalDetalhes && (
        <div className="modal-overlay" onClick={() => setModalDetalhes(null)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: "var(--accent-color)" }}>{modalDetalhes.titulo}</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setModalDetalhes(null)}
              >
                &times;
              </button>
            </div>

            <div style={{ fontSize: "2rem", fontWeight: "900", color: "var(--text-dark)", marginBottom: "8px" }}>
              {modalDetalhes.valor}
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-gray)", lineHeight: "1.5", marginBottom: "20px" }}>
              {modalDetalhes.descricao}
            </p>

            <div style={{ background: "var(--box-subtle)", padding: "16px", borderRadius: "14px", border: "1px solid var(--border-color)" }}>
              {modalDetalhes.itens.map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    fontSize: "0.85rem",
                    borderBottom: idx === modalDetalhes.itens.length - 1 ? "none" : "1px solid var(--border-color)",
                  }}
                >
                  <span style={{ color: "var(--text-gray)" }}>{it.rotulo}</span>
                  <strong style={{ color: "var(--text-dark)" }}>{it.val}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}