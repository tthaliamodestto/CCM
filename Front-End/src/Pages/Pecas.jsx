import { useEffect, useState } from "react";
import Header from "../components/Header";
import { pecaService } from "../services/pecaService";
import { maquinaService } from "../services/maquinaService";

const LISTA_OPERACOES = [
  "Torneamento Externo",
  "Fresamento",
  "Furação",
  "Faceamento",
];

const FORM_INICIAL = {
  nome: "",
  codigo: "",
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
  vc: "200",      // Valor padrão inicial em m/min
  avanco: "0.20", // Valor padrão inicial em mm/rot
  ap: "1.5",      // Valor padrão inicial em mm
};

const RESULTADOS_INICIAIS = {
  volume: 0,
  peso: 0,
  custoMaterial: 0,
  tempoMinutos: 0,
};

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
    volume =
      (largura / 10) *
      (altura / 10) *
      (comprimento / 10);
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

  return {
    volume,
    peso,
    custoMaterial,
    tempoMinutos,
  };
}

function formatarTempo(minutosTotais) {
  const total = Number(minutosTotais) || 0;
  if (total <= 0) return "0m 0s";
  const min = Math.floor(total);
  const seg = Math.round((total % 1) * 60);
  return `${min}m ${seg}s`;
}

export default function Pecas() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [resultados, setResultados] = useState(RESULTADOS_INICIAIS);
  const [materiais, setMateriais] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [filaPecas, setFilaPecas] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const buscarFilaPecas = async () => {
    try {
      const resPecas = await pecaService.listar().catch(() => []);
      const rawPecas = resPecas?.result || resPecas?.data || resPecas;
      setFilaPecas(Array.isArray(rawPecas) ? rawPecas : []);
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
          pecaService.listar().catch(() => [])
        ]);

        if (ativo) {
          const rawMat = resMateriais?.result || resMateriais;
          const rawMaq = resMaquinas?.result || resMaquinas;
          const rawPecas = resPecas?.result || resPecas?.data || resPecas;

          const listaMateriais = Array.isArray(rawMat) ? rawMat : [];
          const listaMaquinas = Array.isArray(rawMaq) ? rawMaq : [];
          const listaPecas = Array.isArray(rawPecas) ? rawPecas : [];

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

    // Payload completo enviando dimensões + máquina + parâmetros de usinagem + tempo calculado
    const payload = {
      idMaterial: Number(form.idMaterial),
      nome: form.nome.trim(),
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
      
      await buscarFilaPecas();
      limparFormulario();
      alert("Peça cadastrada com sucesso com todos os parâmetros de usinagem!");
    } catch (error) {
      setErro(`Não foi possível cadastrar a peça: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const excluirPeca = async (idPeca) => {
    if (!window.confirm("Deseja remover esta peça da fila?")) return;
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
    <div>
      <Header
        titulo="Cadastro e Cálculo de Peças"
        subtitulo="Gerencie especificações técnicas, custos de material e tempo de usinagem."
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

      <div className="grid-3">
        {/* Bloco 1: DADOS DA PEÇA E MATERIAL */}
        <div className="card">
          <div className="card-body">
            <h2 className="section-title">1. DADOS DA PEÇA</h2>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Nome da Peça</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className="input-box"
                  placeholder="Ex: Eixo Principal"
                />
              </div>

              <div
                style={{
                  padding: "0 5px 12px 5px",
                  fontSize: "0.8rem",
                  color: "#64748b",
                  fontWeight: "500",
                }}
              >
                ou
              </div>

              <div className="form-col">
                <label className="form-label">Código de Registro</label>
                <div className="input-group">
                  <input
                    name="codigo"
                    value={form.codigo}
                    onChange={handleChange}
                    placeholder="Auto gerado pelo BD"
                  />
                  <button
                    type="button"
                    className="btn-search"
                    onClick={() =>
                      setErro("O código de registro é atribuído automaticamente ao cadastrar.")
                    }
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                      search
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <h2 className="section-title">2. MATERIAL E FORMA</h2>

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
                    <option value="">Nenum material cadastrado</option>
                  )}
                  {listaMateriaisValida.map((material) => (
                    <option key={material.idMaterial ?? material.id} value={material.idMaterial ?? material.id}>
                      {material.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-col" style={{ flex: 1.5 }}>
                <label className="form-label">Forma Geométrica</label>
                <select
                  name="forma"
                  value={form.forma}
                  onChange={handleChange}
                  className="input-box"
                >
                  <option value="cilindro">Cilindro</option>
                  <option value="prisma">Prisma</option>
                </select>
              </div>

              <div className="form-col" style={{ flex: 1 }}>
                <label className="form-label">Preço / kg (R$)</label>
                <input
                  name="precoKg"
                  type="number"
                  value={form.precoKg}
                  readOnly
                  className="input-box"
                  placeholder="Automático"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Densidade (g/cm³)</label>
                <input
                  name="densidade"
                  type="number"
                  value={form.densidade}
                  readOnly
                  className="input-box"
                  placeholder="Automático"
                />
              </div>
            </div>

            <h2 className="section-title">3. DIMENSÕES</h2>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Comprimento (mm)</label>
                <input
                  name="comprimento"
                  type="number"
                  min="0"
                  value={form.comprimento}
                  onChange={handleChange}
                  className="input-box"
                />
              </div>

              {form.forma === "cilindro" && (
                <div className="form-col">
                  <label className="form-label">Diâmetro (mm)</label>
                  <input
                    name="diametro"
                    type="number"
                    min="0"
                    value={form.diametro}
                    onChange={handleChange}
                    className="input-box"
                  />
                </div>
              )}

              {form.forma === "prisma" && (
                <>
                  <div className="form-col">
                    <label className="form-label">Largura (mm)</label>
                    <input
                      name="largura"
                      type="number"
                      min="0"
                      value={form.largura}
                      onChange={handleChange}
                      className="input-box"
                    />
                  </div>

                  <div className="form-col">
                    <label className="form-label">Altura (mm)</label>
                    <input
                      name="altura"
                      type="number"
                      min="0"
                      value={form.altura}
                      onChange={handleChange}
                      className="input-box"
                    />
                  </div>
                </>
              )}
            </div>

            <h2 className="section-title">4. RESULTADOS PREVISTOS</h2>

            <div className="results-grid">
              <div className="res-box">
                <div className="res-icon">
                  <span className="material-symbols-outlined">view_in_ar</span>
                </div>
                <div>
                  <div className="res-label">Volume</div>
                  <div className="res-val">{resultados.volume.toFixed(2)} cm³</div>
                </div>
              </div>

              <div className="res-box">
                <div className="res-icon">
                  <span className="material-symbols-outlined">weight</span>
                </div>
                <div>
                  <div className="res-label">Peso</div>
                  <div className="res-val">{resultados.peso.toFixed(3)} kg</div>
                </div>
              </div>

              <div className="res-box gold-box">
                <div className="res-label" style={{ color: "var(--accent-color)" }}>
                  Custo Material
                </div>
                <div className="res-val" style={{ color: "var(--accent-color)" }}>
                  R$ {resultados.custoMaterial.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 2: TEMPO DE USINAGEM E BOTÕES DE AÇÃO */}
        <div className="card">
          <div className="card-body">
            <div className="title-gold">
              <span className="material-symbols-outlined">timer</span>
              TEMPO DE USINAGEM
            </div>

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
                <select
                  name="maquina"
                  value={form.maquina}
                  onChange={handleChange}
                  className="input-box"
                  disabled={carregandoDados || listaMaquinasValida.length === 0}
                >
                  {carregandoDados && <option value="">Carregando máquinas...</option>}
                  {!carregandoDados && listaMaquinasValida.length === 0 && (
                    <option value="">Nenhuma máquina cadastrada</option>
                  )}
                  {listaMaquinasValida.map((m) => (
                    <option key={m.id || m.nome} value={m.nome}>
                      {m.nome}
                    </option>
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
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Avanço (f)</label>
                <div className="input-group">
                  <input name="avanco" type="number" step="0.01" value={form.avanco} onChange={handleChange} />
                  <span className="unit">mm/rot</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Profundidade de Corte (ap)</label>
                <div className="input-group">
                  <input name="ap" type="number" step="0.1" value={form.ap} onChange={handleChange} />
                  <span className="unit">mm</span>
                </div>
              </div>
            </div>

            <div className="tempo-total-area" style={{ marginBottom: "20px" }}>
              <div>
                <div className="form-label" style={{ marginBottom: 0 }}>Tempo Estimado</div>
                <div className="tempo-valor">
                  {formatarTempo(resultados.tempoMinutos)}
                </div>
              </div>

              <button className="btn-timer" type="button">
                <span className="material-symbols-outlined">timer</span>
              </button>
            </div>

            {/* BOTÕES DE AÇÃO REPOSICIONADOS PARA O FINAL */}
            <div className="btn-actions">
              <button onClick={limparFormulario} className="btn-limpar" type="button">
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  refresh
                </span>
                Limpar
              </button>

              <button
                onClick={salvarPeca}
                className="btn-add"
                type="button"
                disabled={salvando || carregandoDados}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  {salvando ? "sync" : "add"}
                </span>
                {salvando ? "Salvando..." : "Adicionar Peça"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 3: FILA DE PEÇAS CADASTRADAS */}
      <div className="card" style={{ marginTop: "24px" }}>
        <div className="card-body">
          <div className="title-gold" style={{ marginBottom: "16px" }}>
            <span className="material-symbols-outlined">list_alt</span>
            FILA DE PEÇAS CADASTRADAS ({filaPecas.length})
          </div>

          {filaPecas.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>
              Nenhuma peça cadastrada na fila até o momento.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                    <th style={{ padding: "10px" }}>ID</th>
                    <th style={{ padding: "10px" }}>Nome</th>
                    <th style={{ padding: "10px" }}>Forma</th>
                    <th style={{ padding: "10px" }}>Dimensões</th>
                    <th style={{ padding: "10px" }}>Máquina</th>
                    <th style={{ padding: "10px" }}>Operação</th>
                    <th style={{ padding: "10px" }}>Tempo Usinagem</th>
                    <th style={{ padding: "10px", textAlign: "center" }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filaPecas.map((peca) => {
                    const id = peca.idPeca ?? peca.id;
                    const tempo = peca.tempoMinutos ?? peca.tempoUsinagem ?? peca.tempo ?? 0;
                    const dimensoes =
                      peca.forma === "cilindro"
                        ? `Ø${peca.diametro ?? 0} x ${peca.comprimento ?? 0}mm`
                        : `${peca.comprimento ?? 0}x${peca.largura ?? 0}x${peca.altura ?? 0}mm`;

                    return (
                      <tr key={id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px", fontWeight: "bold" }}>#{id}</td>
                        <td style={{ padding: "10px" }}>{peca.nome}</td>
                        <td style={{ padding: "10px", textTransform: "capitalize" }}>{peca.forma}</td>
                        <td style={{ padding: "10px" }}>{dimensoes}</td>
                        <td style={{ padding: "10px" }}>{peca.maquina || "-"}</td>
                        <td style={{ padding: "10px" }}>{peca.operacao || "-"}</td>
                        <td style={{ padding: "10px", fontWeight: "600", color: "#2563eb" }}>
                          {formatarTempo(tempo)}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => excluirPeca(id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                            }}
                            title="Remover Peça"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                              delete
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}