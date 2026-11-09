
import { useEffect, useMemo, useState } from "react";
import { pecaService } from "../services/pecaService";
import "../css/PecaPronta.css";

function normalizarLista(resposta) {
  const dados = resposta?.result || resposta?.data || resposta;
  return Array.isArray(dados) ? dados : [];
}

function formatarDimensoes(peca) {
  if (peca.forma === "cilindro") {
    return `Ø ${peca.diametro ?? "-"} × ${peca.comprimento ?? "-"} mm`;
  }

  return `${peca.comprimento ?? "-"} × ${peca.largura ?? "-"} × ${peca.altura ?? "-"} mm`;
}

export default function PecaPronta() {
  const [pecas, setPecas] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroForma, setFiltroForma] = useState("todas");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pecaSelecionada, setPecaSelecionada] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro("");

      try {
        const [resPecas, resMateriais] = await Promise.all([
          pecaService.listar(),
          pecaService.listarMateriais(),
        ]);

        if (!ativo) return;

        setPecas(normalizarLista(resPecas));
        setMateriais(normalizarLista(resMateriais));
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Não foi possível carregar as peças.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  const pecasFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return pecas.filter((peca) => {
      const material = materiais.find(
        (item) =>
          String(item.idMaterial ?? item.id) ===
          String(peca.idMaterial)
      );

      const nomeMaterial = material?.nome || peca.material || "";

      const correspondeBusca =
        !termo ||
        String(peca.nome || "")
          .toLocaleLowerCase("pt-BR")
          .includes(termo) ||
        String(peca.idPeca ?? peca.id ?? "").includes(termo) ||
        nomeMaterial
          .toLocaleLowerCase("pt-BR")
          .includes(termo);

      const correspondeForma =
        filtroForma === "todas" ||
        peca.forma === filtroForma;

      return correspondeBusca && correspondeForma;
    });
  }, [pecas, materiais, busca, filtroForma]);

  const obterMaterial = (peca) =>
    materiais.find(
      (item) =>
        String(item.idMaterial ?? item.id) ===
        String(peca.idMaterial)
    );

  return (
    <section className="peca-pronta-page">
      <header className="peca-pronta-header">
        <div>
          <span className="peca-pronta-eyebrow">
            ESTOQUE DE PRODUÇÃO
          </span>

          <h2>Peças cadastradas</h2>

          <p>
            Consulte as peças brutas registradas no sistema
            e seus dados dimensionais.
          </p>
        </div>

        <div className="peca-pronta-total">
          <strong>{pecas.length}</strong>
          <span>peças cadastradas</span>
        </div>
      </header>

      <div className="peca-pronta-filtros">
        <label className="peca-pronta-busca">
          <span className="material-symbols-outlined">
            search
          </span>

          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, código ou material..."
          />
        </label>

        <select
          value={filtroForma}
          onChange={(e) => setFiltroForma(e.target.value)}
          aria-label="Filtrar por forma"
        >
          <option value="todas">Todas as formas</option>
          <option value="cilindro">Cilindro</option>
          <option value="prisma">Prisma</option>
        </select>
      </div>

      {erro && (
        <div className="peca-pronta-alerta">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="peca-pronta-vazio">
          Carregando peças cadastradas...
        </div>
      ) : pecasFiltradas.length === 0 ? (
        <div className="peca-pronta-vazio">
          <span className="material-symbols-outlined">
            inventory_2
          </span>

          <strong>Nenhuma peça encontrada</strong>

          <span>
            Cadastre uma peça na Calculadora ou altere os filtros.
          </span>
        </div>
      ) : (
        <div className="peca-pronta-tabela-wrap">
          <table className="peca-pronta-tabela">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome da peça</th>
                <th>Material</th>
                <th>Forma</th>
                <th>Dimensões</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {pecasFiltradas.map((peca) => {
                const material = obterMaterial(peca);

                return (
                  <tr
                    key={peca.idPeca ?? peca.id}
                  >
                    <td className="peca-pronta-codigo">
                      #{peca.idPeca ?? peca.id ?? "—"}
                    </td>

                    <td className="peca-pronta-nome">
                      {peca.nome || "Peça sem nome"}
                    </td>

                    <td>
                      {material?.nome ||
                        peca.material ||
                        `Material ${peca.idMaterial ?? "não informado"}`}
                    </td>

                    <td>
                      <span className="peca-pronta-forma">
                        {peca.forma || "—"}
                      </span>
                    </td>

                    <td>
                      {formatarDimensoes(peca)}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="peca-pronta-detalhes"
                        onClick={() =>
                          setPecaSelecionada(peca)
                        }
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pecaSelecionada && (
        <div
          className="peca-pronta-modal-fundo"
          onClick={() => setPecaSelecionada(null)}
        >
          <section
            className="peca-pronta-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="peca-pronta-modal-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <header>
              <div>
                <span className="peca-pronta-eyebrow">
                  FICHA DA PEÇA
                </span>

                <h3 id="peca-pronta-modal-titulo">
                  {pecaSelecionada.nome || "Peça cadastrada"}
                </h3>
              </div>

              <button
                type="button"
                className="peca-pronta-fechar"
                onClick={() => setPecaSelecionada(null)}
                aria-label="Fechar detalhes"
              >
                ×
              </button>
            </header>

            <div className="peca-pronta-detalhes-grid">
              <div>
                <span>Código</span>
                <strong>
                  {pecaSelecionada.idPeca ??
                    pecaSelecionada.id ??
                    "—"}
                </strong>
              </div>

              <div>
                <span>Material</span>
                <strong>
                  {obterMaterial(pecaSelecionada)?.nome ||
                    pecaSelecionada.material ||
                    pecaSelecionada.idMaterial ||
            "—"}
                </strong>
              </div>

              <div>
                <span>Forma</span>
                <strong>
                  {pecaSelecionada.forma || "—"}
                </strong>
              </div>

              <div>
                <span>Comprimento</span>
                <strong>
                  {pecaSelecionada.comprimento ?? "—"} mm
                </strong>
              </div>

              <div>
                <span>Diâmetro</span>
                <strong>
                  {pecaSelecionada.diametro ?? "—"} mm
                </strong>
              </div>

              <div>
                <span>Largura</span>
                <strong>
                  {pecaSelecionada.largura ?? "—"} mm
                </strong>
              </div>

              <div>
                <span>Altura</span>
                <strong>
                  {pecaSelecionada.altura ?? "—"} mm
                </strong>
              </div>

              <div>
                <span>Cliente</span>
                <strong>
                  {pecaSelecionada.idCliente ?? "—"}
                </strong>
              </div>
            </div>

            <footer>
              <span>
                Dimensões: {formatarDimensoes(pecaSelecionada)}
              </span>

              <button
                type="button"
                onClick={() => setPecaSelecionada(null)}
              >
                Fechar
              </button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}
