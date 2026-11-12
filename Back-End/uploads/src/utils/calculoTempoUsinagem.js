
function validarNumero(valor, nome, permitirZero = false) {
    if (
        valor === null ||
        valor === undefined ||
        valor === "" ||
        !Number.isFinite(Number(valor)) ||
        (permitirZero ? Number(valor) < 0 : Number(valor) <= 0)
    ) {
        throw new Error(`${nome} inválido.`);
    }

    return Number(valor);
}

function calcularPasses(profundidadeTotal, profundidadeCorte) {
    const total = validarNumero(profundidadeTotal, "Profundidade total");
    const corte = validarNumero(profundidadeCorte, "Profundidade de corte");

    return Math.ceil(total / corte);
}

// Calcula o tempo de corte de cada operação
export function calcularTempoUsinagem({
    tipoOperacao,
    velocidadeAvanco,
    profundidadeCorte,
    dados
}) {
    const vf = validarNumero(velocidadeAvanco, "Velocidade de avanço");
    const ap = validarNumero(profundidadeCorte, "Profundidade de corte");

    if (!dados || typeof dados !== "object") {
        throw new Error("Os dados da operação são obrigatórios.");
    }

    let comprimentoTotal = 0;
    let numeroPasses = 1;

    switch (tipoOperacao.toLowerCase()) {

        case "torneamento": {
            const comprimento = validarNumero(
                dados.comprimentoTorneamento,
                "Comprimento do torneamento"
            );

            const diametroInicial = validarNumero(
                dados.diametroInicial,
                "Diâmetro inicial"
            );

            const diametroFinal = validarNumero(
                dados.diametroFinal,
                "Diâmetro final",
                true
            );

            if (diametroFinal >= diametroInicial) {
                throw new Error("O diâmetro final deve ser menor que o inicial no torneamento.");
            }

            // A profundidade de corte é radial.
            const profundidadeRadial = (diametroInicial - diametroFinal) / 2;

            numeroPasses = calcularPasses(profundidadeRadial, ap);
            comprimentoTotal = comprimento * numeroPasses;

            break;
        }

        case "faceamento": {
            const diametro = validarNumero(
                dados.diametroFaceamento,
                "Diâmetro do faceamento"
            );

            const espessura = validarNumero(
                dados.espessuraFaceada,
                "Espessura faceada"
            );

            numeroPasses = calcularPasses(espessura, ap);

            // Percurso radial aproximado: do diâmetro externo ao centro.
            comprimentoTotal = (diametro / 2) * numeroPasses;

            break;
        }

        case "furacao": {
            const profundidade = validarNumero(
                dados.profundidadeFuro,
                "Profundidade do furo"
            );

            const quantidade = validarNumero(
                dados.quantidadeFuros ?? 1,
                "Quantidade de furos"
            );

            if (!Number.isInteger(quantidade)) {
                throw new Error("A quantidade de furos deve ser um inteiro.");
            }

            // Uma entrada da broca para cada furo.
            comprimentoTotal = profundidade * quantidade;

            break;
        }

        case "fresamento": {
            const percurso = validarNumero(
                dados.comprimentoPercurso,
                "Comprimento do percurso"
            );

            const profundidade = validarNumero(
                dados.profundidadeTotal,
                "Profundidade total"
            );

            const quantidade = validarNumero(
                dados.quantidadePercursos ?? 1,
                "Quantidade de percursos"
            );

            if (!Number.isInteger(quantidade)) {
                throw new Error("A quantidade de percursos deve ser um inteiro.");
            }

            numeroPasses = calcularPasses(profundidade, ap);

            comprimentoTotal =
                percurso * quantidade * numeroPasses;

            break;
        }

        default:
            throw new Error("Tipo de operação não reconhecido.");
    }

    const tempoMinutos = comprimentoTotal / vf;

    return {
        numeroPasses,
        comprimentoTotal: Number(comprimentoTotal.toFixed(2)),
        tempoMinutos: Number(tempoMinutos.toFixed(3))
    };
}
