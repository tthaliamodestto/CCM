import { useEffect, useState } from "react";
import { pecaService } from "../services/pecaService";
import { maquinaService } from "../services/maquinaService";
import "../css/Pecas.css";

const LISTA_OPERACOES = [
  "Torneamento Externo",
  "Fresamento",
  "Furação",
  "Faceamento",
];

// LISTA DE PRIORIDADES COM SUA COR E NOME CORRESPONDENTE
const LISTA_PRIORIDADES = [
  { id: "p1", nome: "1 - Muito Baixa", hex: "#6366f1", bg: "#e0e7ff", text: "#4338ca" },
  { id: "p2", nome: "2 - Baixa",       hex: "#0284c7", bg: "#e0f2fe", text: "#0369a1" },
  { id: "p3", nome: "3 - Média",       hex: "#10b981", bg: "#d1fae5", text: "#047857" },
  { id: "p4", nome: "4 - Alta",        hex: "#f59e0b", bg: "#fef3c7", text: "#b45309" },
  { id: "p5", nome: "5 - Urgente",     hex: "#ef4444", bg: "#fee2e2", text: "#b91c1c" },
];

const FORM_INICIAL = {
  nome: "",
  idPrioridade: "p3", // Padrão: 3 - Média
  idMaterial: "",
  forma: "cilindro",
  comprimento: "",
  largura: "",
  altura: "",
  diametro: "",
  densidade: "",
  precoKg: "",
  operacao: "Torneamento Externo",
  maquina: "",
  ferramenta: "Pastilha CNMG 120408",
  vc: "200",
  avanco: "0.20",
  ap: "1.5",
};

const RESULTADOS_INICIAIS = {
  volume: 0,
  peso: 0,
  custoMaterial: 0,
  tempoMinutos: 0,
};

const COLUNAS_KANBAN = [
  { id: "pendente", titulo: "To Do", dotClass: "todo" },
  { id: "em_andamento", titulo: "In Progress", dotClass: "in_progress" },
  { id: "concluida", titulo: "Completed", dotClass: "completed" },
];

function calcularPreview(form) {
  const comprimento = Number(form.comprimento) || 0;
  const largura = Number(form.largura) || 0;
  const altura = Number(form.altura) || 0;
  const densidade = Number(form.densidade) || 0;
  const precoKg = Number(form.precoKg) || 0;

  let volume = 0;

  if (form.forma === "cilindro") {
    const diametro = Number(form.diametro) || 0;
    const raioCm = (diametro / 2) / 10;
    const comprimentoCm = comprimento / 10;
    volume = Math.PI * raioCm ** 2 * comprimentoCm;
  } else if (form.forma === "prisma") {
    volume = (largura / 10) * (altura / 10) * (comprimento / 10);
  }

  const peso = (volume * densidade) / 1000;
  const custoMaterial = peso * precoKg;

  const vc = Number(form.vc) || 0;
  const avanco = Number(form.avanco) || 0;
  let tempoMinutos = 0;

  if (comprimento > 0 && vc > 0 && avanco > 0) {
    const diametroCalculo =
      form.forma === "cilindro"
        ? Number(form.diametro) || 0
        : Number(form.largura) || 0;

    if (diametroCalculo > 0) {
      const rpm = (vc * 1000) / (Math.PI * diametroCalculo);
      if (rpm > 0) {
        tempoMinutos = comprimento / (avanco * rpm);
      }
    }
  }

  return { volume, peso, custoMaterial, tempoMinutos };
}

function formatarTempo(minutosTotais) {
  const total = Number(minutosTotais) || 0;
  if (total <= 0) return "0m 0s";
  const min = Math.floor(total);
  const seg = Math.round((total % 1) * 60);
  return `${min}m ${seg}s`;
}

export default function Pecas() {
  const [desenhosPecas, setDesenhosPecas] = useState({});
  const [form, setForm] = useState(FORM_INICIAL);
  const [resultados, setResultados] = useState(RESULTADOS_INICIAIS);
  const [materiais, setMateriais] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [filaPecas, setFilaPecas] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [desenhoTecnico, setDesenhoTecnico] = useState(null);

  const buscarFilaPecas = async () => {
    try {
      const resPecas = await pecaService.listar().catch(() => []);
      const rawPecas = resPecas?.result || resPecas?.data || resPecas;
      const listaNormalizada = (Array.isArray(rawPecas) ? rawPecas : []).map((p) => ({
        ...p,
        status: p.status || "pendente",
        idPrioridade: p.idPrioridade || "p3",
      }));
      setFilaPecas(listaNormalizada);
    } catch {
      setFilaPecas([]);
    }
  };

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const [resMateriais, resMaquinas, resPecas] = await Promise.all([
          pecaService.listarMateriais().catch(() => []),
          maquinaService.listar().catch(() => []),
          pecaService.listar().catch(() => []),
        ]);

        if (ativo) {
          const rawMat = resMateriais?.result || resMateriais;
          const rawMaq = resMaquinas?.result || resMaquinas;
          const rawPecas = resPecas?.result || resPecas?.data || resPecas;

          const listaMateriais = Array.isArray(rawMat) ? rawMat : [];
          const listaMaquinas = Array.isArray(rawMaq) ? rawMaq : [];
          const listaPecas = (Array.isArray(rawPecas) ? rawPecas : []).map((p) => ({
            ...p,
            status: p.status || "pendente",
            idPrioridade: p.idPrioridade || "p3",
          }));

          setMateriais(listaMateriais);
          setMaquinas(listaMaquinas);
          setFilaPecas(listaPecas);

          setForm((atual) => ({
            ...atual,
            idMaterial: listaMateriais.length > 0 ? String(listaMateriais[0].idMaterial ?? listaMateriais[0].id) : "",
            densidade: listaMateriais.length > 0 ? (listaMateriais[0].densidade ?? "") : "",
            precoKg: listaMateriais.length > 0 ? (listaMateriais[0].custoPerKg ?? listaMateriais[0].custo ?? "") : "",
            maquina: listaMaquinas.length > 0 ? listaMaquinas[0].nome : "",
          }));
        }
      } catch (error) {
        if (ativo) {
          setErro(`Não foi possível carregar os dados: ${error.message}`);
        }
      } finally {
        if (ativo) setCarregandoDados(false);
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    setResultados(calcularPreview(form));
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "idMaterial") {
      const listaMateriaisValida = Array.isArray(materiais) ? materiais : [];
      const materialSelecionado = listaMateriaisValida.find(
        (m) => String(m.idMaterial ?? m.id) === value
      );

      setForm((atual) => ({
        ...atual,
        idMaterial: value,
        densidade: materialSelecionado?.densidade ?? "",
        precoKg: materialSelecionado?.custoPerKg ?? materialSelecionado?.custo ?? "",
      }));
      return;
    }

    if (name === "forma") {
      setForm((atual) => ({
        ...atual,
        forma: value,
        diametro: value === "cilindro" ? atual.diametro : "",
        largura: value === "prisma" ? atual.largura : "",
        altura: value === "prisma" ? atual.altura : "",
      }));
      return;
    }

    setForm((atual) => ({
      ...atual,
      [name]: value,
    }));
  };

  const handleDesenhoChange = (e) => {
    const arquivo = e.target.files[0];

    if (!arquivo) {
      setDesenhoTecnico(null);
      return;
    }

    if (!arquivo.type.startsWith("image/")) {
      setErro("Selecione somente um arquivo de imagem.");
      return;
    }

    setErro("");
    setDesenhoTecnico(arquivo);
  };

  const limparFormulario = () => {
    const listaMateriaisValida = Array.isArray(materiais) ? materiais : [];
    const listaMaquinasValida = Array.isArray(maquinas) ? maquinas : [];

    const primeiroMaterial = listaMateriaisValida[0];
    const primeiraMaquina = listaMaquinasValida[0];

    setForm({
      ...FORM_INICIAL,
      idMaterial: primeiroMaterial ? String(primeiroMaterial.idMaterial ?? primeiroMaterial.id) : "",
      densidade: primeiroMaterial?.densidade ?? "",
      precoKg: primeiroMaterial?.custoPerKg ?? primeiroMaterial?.custo ?? "",
      maquina: primeiraMaquina ? primeiraMaquina.nome : "",
    });

    setResultados(RESULTADOS_INICIAIS);
    setErro("");
    setDesenhoTecnico(null);
  };

  const salvarPeca = async () => {
    setErro("");

    if (!form.nome.trim()) {
      setErro("Preencha o nome da peça.");
      return;
    }

    if (!form.idMaterial) {
      setErro("Selecione um material.");
      return;
    }

    if (!form.comprimento || Number(form.comprimento) <= 0) {
      setErro("Informe um comprimento maior que zero.");
      return;
    }

    if (form.forma === "cilindro" && (!form.diametro || Number(form.diametro) <= 0)) {
      setErro("Informe um diâmetro maior que zero para o cilindro.");
      return;
    }

    if (
      form.forma === "prisma" &&
      (!form.largura || Number(form.largura) <= 0 || !form.altura || Number(form.altura) <= 0)
    ) {
      setErro("Informe largura e altura maiores que zero para o prisma.");
      return;
    }

    const payload = {
      idMaterial: Number(form.idMaterial),
      nome: form.nome.trim(),
      idPrioridade: form.idPrioridade,
      status: "pendente",
      forma: form.forma,
      comprimento: Number(form.comprimento),
      diametro: form.forma === "cilindro" ? Number(form.diametro) : null,
      largura: form.forma === "prisma" ? Number(form.largura) : null,
      altura: form.forma === "prisma" ? Number(form.altura) : null,
      maquina: form.maquina,
      operacao: form.operacao,
      ferramenta: form.ferramenta,
      vc: Number(form.vc) || 0,
      avanco: Number(form.avanco) || 0,
      ap: Number(form.ap) || 0,
      tempoMinutos: Number(resultados.tempoMinutos) || 0,
      tempoUsinagem: Number(resultados.tempoMinutos) || 0,
    };

    try {
      setSalvando(true);

      await pecaService.cadastrar(payload);

      if (desenhoTecnico) {
        const leitor = new FileReader();

        leitor.onload = () => {
          const desenhosSalvos = JSON.parse(
            localStorage.getItem("ccm_desenhos_tecnicos") || "{}"
          );

          desenhosSalvos[form.nome.trim()] = leitor.result;

          localStorage.setItem(
            "ccm_desenhos_tecnicos",
            JSON.stringify(desenhosSalvos)
          );

          setDesenhosPecas(desenhosSalvos);
        };

        leitor.readAsDataURL(desenhoTecnico);
      }

      await buscarFilaPecas();
      limparFormulario();
    } catch (error) {
      setErro(`Não foi possível cadastrar a peça: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const moverStatus = async (idPeca, novoStatus) => {
    setFilaPecas((prev) =>
      prev.map((p) => {
        const id = p.idPeca ?? p.id;
        if (id === idPeca) {
          return { ...p, status: novoStatus };
        }
        return p;
      })
    );

    if (pecaService.atualizarStatus) {
      await pecaService.atualizarStatus(idPeca, { status: novoStatus }).catch(() => {});
    }
  };

  const excluirPeca = async (idPeca) => {
    if (!window.confirm("Deseja remover esta peça do Kanban?")) return;
    try {
      await pecaService.deletar(idPeca);
      await buscarFilaPecas();
    } catch (error) {
      setErro(`Erro ao excluir peça: ${error.message}`);
    }
  };

  const listaMateriaisValida = Array.isArray(materiais) ? materiais : [];
  const listaMaquinasValida = Array.isArray(maquinas) ? maquinas : [];

  return (
    <div className="pecas-container">
      {erro && (
        <div style={{ marginBottom: "16px", padding: "12px", borderRadius: "8px", background: "#fff1f2", color: "#be123c", fontSize: "0.85rem" }}>
          {erro}
        </div>
      )}

      {/* PAINEL DE FORMULÁRIO */}
      <div className="grid-3">
        {/* BLOCO 1: DADOS DA PEÇA E SELEÇÃO DE PRIORIDADE COM COR */}
        <div className="card-section">
          <h2 className="section-title">1. Dados da Peça</h2>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Nome da Peça</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="input-box"
                placeholder="Ex: Eixo Principal CNC"
              />
            </div>
          </div>

          {/* SELETOR DE PRIORIDADE COM A BOLINHA COLORIDA E O NOME AO LADO */}
          <div className="form-row" style={{ flexDirection: "column", gap: "4px" }}>
            <label className="form-label">Prioridade da Peça</label>
            <div className="priority-picker-container">
              {LISTA_PRIORIDADES.map((prio) => {
                const selecionado = form.idPrioridade === prio.id;
                return (
                  <button
                    key={prio.id}
                    type="button"
                    className={`priority-btn ${selecionado ? "selected" : ""}`}
                    style={{
                      backgroundColor: prio.bg,
                      color: prio.text,
                    }}
                    onClick={() => setForm((f) => ({ ...f, idPrioridade: prio.id }))}
                  >
                    <span className="priority-dot" style={{ backgroundColor: prio.hex }} />
                    <span>{prio.nome}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: "20px" }}>2. Material e Forma</h2>

          <div className="form-row">
            <div className="form-col" style={{ flex: 2 }}>
              <label className="form-label">Material</label>
              <select
                name="idMaterial"
                value={form.idMaterial}
                onChange={handleChange}
                className="input-box"
                disabled={carregandoDados || listaMateriaisValida.length === 0}
              >
                {carregandoDados && <option value="">Carregando materiais...</option>}
                {!carregandoDados && listaMateriaisValida.length === 0 && (
                  <option value="">Nenhum material cadastrado</option>
                )}
                {listaMateriaisValida.map((material) => (
                  <option key={material.idMaterial ?? material.id} value={material.idMaterial ?? material.id}>
                    {material.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-col" style={{ flex: 1.5 }}>
              <label className="form-label">Forma</label>
              <select name="forma" value={form.forma} onChange={handleChange} className="input-box">
                <option value="cilindro">Cilindro</option>
                <option value="prisma">Prisma</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Densidade (g/cm³)</label>
              <input name="densidade" type="number" value={form.densidade} readOnly className="input-box" placeholder="Auto" />
            </div>
            <div className="form-col">
              <label className="form-label">Preço / kg (R$)</label>
              <input name="precoKg" type="number" value={form.precoKg} readOnly className="input-box" placeholder="Auto" />
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: "20px" }}>3. Dimensões</h2>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Comprimento (mm)</label>
              <input name="comprimento" type="number" min="0" value={form.comprimento} onChange={handleChange} className="input-box" />
            </div>

            {form.forma === "cilindro" ? (
              <div className="form-col">
                <label className="form-label">Diâmetro (mm)</label>
                <input name="diametro" type="number" min="0" value={form.diametro} onChange={handleChange} className="input-box" />
              </div>
            ) : (
              <>
                <div className="form-col">
                  <label className="form-label">Largura (mm)</label>
                  <input name="largura" type="number" min="0" value={form.largura} onChange={handleChange} className="input-box" />
                </div>
                <div className="form-col">
                  <label className="form-label">Altura (mm)</label>
                  <input name="altura" type="number" min="0" value={form.altura} onChange={handleChange} className="input-box" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* BLOCO 2: TEMPO DE USINAGEM E RESULTADOS */}
        <div className="card-section">
          <h2 className="section-title">4. Parâmetros de Usinagem</h2>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Operação</label>
              <select name="operacao" value={form.operacao} onChange={handleChange} className="input-box">
                {LISTA_OPERACOES.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Máquina</label>
              <select name="maquina" value={form.maquina} onChange={handleChange} className="input-box" disabled={carregandoDados || listaMaquinasValida.length === 0}>
                {carregandoDados && <option value="">Carregando máquinas...</option>}
                {!carregandoDados && listaMaquinasValida.length === 0 && <option value="">Nenhuma máquina cadastrada</option>}
                {listaMaquinasValida.map((m) => (
                  <option key={m.id || m.nome} value={m.nome}>{m.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Ferramenta</label>
              <input name="ferramenta" value={form.ferramenta} onChange={handleChange} className="input-box" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Velocidade de Corte (Vc)</label>
              <div className="input-group">
                <input name="vc" type="number" value={form.vc} onChange={handleChange} />
                <span className="unit">m/min</span>
              </div>
            </div>
            <div className="form-col">
              <label className="form-label">Avanço (f)</label>
              <div className="input-group">
                <input name="avanco" type="number" step="0.01" value={form.avanco} onChange={handleChange} />
                <span className="unit">mm/rot</span>
              </div>
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: "20px" }}>5. Resultados Estimados</h2>

          <div className="results-grid">
            <div className="res-box">
              <div className="res-label">Volume</div>
              <div className="res-val">{resultados.volume.toFixed(1)} cm³</div>
            </div>
            <div className="res-box">
              <div className="res-label">Peso</div>
              <div className="res-val">{resultados.peso.toFixed(2)} kg</div>
            </div>
            <div className="res-box">
              <div className="res-label">Custo</div>
              <div className="res-val">R$ {resultados.custoMaterial.toFixed(2)}</div>
            </div>
          </div>

          <div className="tempo-total-area" style={{ marginTop: "16px" }}>
            <div>
              <div className="form-label" style={{ marginBottom: 2 }}>Tempo Estimado</div>
              <div className="tempo-valor">{formatarTempo(resultados.tempoMinutos)}</div>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "var(--primary-purple)" }}>
              schedule
            </span>
          </div>
        </div>
      </div>

      {/* BLOCO 3: DESENHO TÉCNICO */}
      <div className="card-section">
        <h2 className="section-title">6. Desenho Técnico</h2>
        <div style={{ border: "2px dashed #cbd5e1", borderRadius: "12px", padding: "20px", textAlign: "center", background: "#f8fafc" }}>
          <input type="file" accept="image/*" onChange={handleDesenhoChange} style={{ fontSize: "0.85rem" }} />
          {desenhoTecnico && (
            <div style={{ marginTop: "12px" }}>
              <img src={URL.createObjectURL(desenhoTecnico)} alt="Desenho técnico" style={{ maxHeight: "180px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
          )}
        </div>
      </div>

      {/* BOTÕES DE AÇÃO DO FORMULÁRIO */}
      <div className="form-actions">
        <button onClick={limparFormulario} className="btn-limpar" type="button">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>refresh</span>
          Limpar
        </button>

        <button onClick={salvarPeca} className="btn-add" type="button" disabled={salvando || carregandoDados}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
          {salvando ? "Salvando..." : "Cadastrar Peça no Kanban"}
        </button>
      </div>

      {/* QUADRO KANBAN */}
      <div className="kanban-section">
        <div className="kanban-header-title">
          <span>Quadro de Usinagem</span>
        </div>

        <div className="kanban-grid">
          {COLUNAS_KANBAN.map((coluna) => {
            const pecasColuna = filaPecas.filter(
              (p) => (p.status || "pendente") === coluna.id
            );

            return (
              <div key={coluna.id} className="kanban-column">
                <div className="kanban-col-header">
                  <div className="col-title-group">
                    <span className={`status-dot ${coluna.dotClass}`} />
                    <span className="col-title">{coluna.titulo}</span>
                    <span className="col-count">{pecasColuna.length}</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#94a3b8", cursor: "pointer" }}>
                    more_horiz
                  </span>
                </div>

                <div className="kanban-col-body">
                  {pecasColuna.length === 0 ? (
                    <div className="empty-col-card">
                      <span className="material-symbols-outlined">inbox</span>
                      <span>Nenhuma peça nesta etapa</span>
                    </div>
                  ) : (
                    pecasColuna.map((peca) => {
                      const id = peca.idPeca ?? peca.id;
                      const tempo = peca.tempoMinutos ?? peca.tempoUsinagem ?? 0;
                      const dimensoes = peca.forma === "cilindro"
                        ? `Ø${peca.diametro ?? 0} x ${peca.comprimento ?? 0}mm`
                        : `${peca.comprimento ?? 0}x${peca.largura ?? 0}x${peca.altura ?? 0}mm`;

                      // Pega os dados da prioridade selecionada
                      const prioObj = LISTA_PRIORIDADES.find((p) => p.id === peca.idPrioridade) || LISTA_PRIORIDADES[2];

                      return (
                        <div key={id} className="kanban-card">
                          <div className="card-top">
                            <h3 className="card-title">{peca.nome}</h3>
                            <button
                              type="button"
                              className="btn-delete-card"
                              onClick={() => excluirPeca(id)}
                              title="Remover Peça"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                                close
                              </span>
                            </button>
                          </div>

                          {/* ETIQUETAS DO CARD: EXIBE A PRIORIDADE COM A COR E NOME E A OPERAÇÃO */}
                          <div className="card-tags">
                            <span
                              className="pill-tag"
                              style={{
                                backgroundColor: prioObj.bg,
                                color: prioObj.text,
                              }}
                            >
                              <span className="priority-dot" style={{ backgroundColor: prioObj.hex }} />
                              {prioObj.nome}
                            </span>

                            <span
                              className="pill-tag"
                              style={{
                                backgroundColor: "#f1f5f9",
                                color: "#475569",
                              }}
                            >
                              {peca.operacao || "Usinagem"}
                            </span>
                          </div>

                          <div className="card-details-grid">
                            <div><strong>Dim:</strong> {dimensoes}</div>
                            <div><strong>Máq:</strong> {peca.maquina || "-"}</div>
                          </div>

                          {desenhosPecas[peca.nome] && (
                            <img
                              src={desenhosPecas[peca.nome]}
                              alt={`Desenho de ${peca.nome}`}
                              className="card-drawing-preview"
                            />
                          )}

                          <div className="card-footer">
                            <div className="card-meta">
                              <div className="user-avatar-circle">P</div>
                              <span>{formatarTempo(tempo)}</span>
                            </div>

                            <div className="card-move-btns">
                              {coluna.id !== "pendente" && (
                                <button
                                  type="button"
                                  className="btn-move"
                                  onClick={() => moverStatus(id, coluna.id === "concluida" ? "em_andamento" : "pendente")}
                                  title="Voltar Etapa"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                    arrow_back
                                  </span>
                                </button>
                              )}

                              {coluna.id !== "concluida" && (
                                <button
                                  type="button"
                                  className="btn-move btn-move-next"
                                  onClick={() => moverStatus(id, coluna.id === "pendente" ? "em_andamento" : "concluida")}
                                  title="Avançar Etapa"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                    arrow_forward
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}