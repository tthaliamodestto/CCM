
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

function arredondar(valor) {
    return Number(valor.toFixed(2));
}

// Obtém a tarifa de energia em R$/kWh
export function obterTarifaEnergia(tarifaInformada) {
    if (
        tarifaInformada !== undefined &&
        tarifaInformada !== null &&
        tarifaInformada !== ""
    ) {
        return validarNumero(
            tarifaInformada,
            "Tarifa de energia",
            true
        );
    }

    const tarifaEnv = process.env.TARIFA_ENERGIA_KWH;

    if (tarifaEnv !== undefined && tarifaEnv !== "") {
        return validarNumero(
            tarifaEnv,
            "Tarifa de energia do .env",
            true
        );
    }

    throw new Error("Configure a tarifa de energia antes de calcular o custo da máquina própria.");
}

// Custo do material = peso em kg * custo por kg
export function calcularCustoMaterial(pesoKg, custoPerKg) {
    const peso = validarNumero(pesoKg, "Peso do material");
    const custo = validarNumero(custoPerKg, "Custo por kg", true);

    return arredondar(peso * custo);
}

// Calcula o custo de utilização da máquina
export function calcularCustoMaquina({
    tipoUtilizacao,
    custoHora,
    potencialKw,
    tempoMinutos,
    tarifaEnergia
}) {
    const tempo = validarNumero(tempoMinutos, "Tempo de usinagem", true);
    const horas = tempo / 60;

    if (tipoUtilizacao === "terceiros") {
        const valorHora = validarNumero(
            custoHora,
            "Custo por hora da máquina"
        );

        return {
            custo: arredondar(horas * valorHora),
            horas: Number(horas.toFixed(4)),
            baseCalculo: "custoHora",
            tarifaEnergia: null
        };
    }

    if (tipoUtilizacao === "propria") {
        const potencia = validarNumero(
            potencialKw,
            "Potência da máquina"
        );

        const tarifa = obterTarifaEnergia(tarifaEnergia);

        return {
            custo: arredondar(horas * potencia * tarifa),
            horas: Number(horas.toFixed(4)),
            baseCalculo: "energia",
            tarifaEnergia: tarifa
        };
    }

    throw new Error("Tipo de utilização da máquina inválido.");
}

// Soma os custos do material e das máquinas
export function calcularCustoTotal(custoMaterial, custoMaquina) {
    const material = validarNumero(
        custoMaterial,
        "Custo do material",
        true
    );

    const maquina = validarNumero(
        custoMaquina,
        "Custo da máquina",
        true
    );

    return arredondar(material + maquina);
}


// como chamar as funções no controller:
// import {
//     calcularRPM,
//     calcularVelocidadeAvanco
// } from "../utils/calculoParametrosCorte.js";

// import {
//     calcularTempoUsinagem
// } from "../utils/calculoTempoUsinagem.js";

// // Dados recuperados do banco
// const parametro = {
//     velocidadeCorte: 120,
//     avanco: 0.08,
//     tipoAvanco: "mm_dente",
//     profundidadeCorte: 2
// };

// const dadosFresamento = {
//     diametroFresa: 20,
//     numeroDentes: 4,
//     comprimentoPercurso: 100,
//     profundidadeTotal: 5,
//     quantidadePercursos: 2
// };

// // 1. Calcula RPM
// const rpm = calcularRPM(
//     parametro.velocidadeCorte,
//     dadosFresamento.diametroFresa
// );

// // 2. Calcula velocidade de avanço
// const velocidadeAvanco = calcularVelocidadeAvanco(
//     parametro.avanco,
//     parametro.tipoAvanco,
//     rpm,
//     dadosFresamento.numeroDentes
// );

// // 3. Calcula tempo de usinagem
// const resultadoTempo = calcularTempoUsinagem({
//     tipoOperacao: "fresamento",
//     velocidadeAvanco: velocidadeAvanco,
//     profundidadeCorte: parametro.profundidadeCorte,
//     dados: dadosFresamento
// });

// // Resultados que poderão ser armazenados em OperacaoProcesso
// console.log({
//     rpmCalculado: rpm,
//     velocidadeAvancoCalculada: velocidadeAvanco,
//     numeroPasses: resultadoTempo.numeroPasses,
//     tempoUsinagem: resultadoTempo.tempoMinutos
// });