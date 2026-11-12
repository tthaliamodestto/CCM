
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

// Calcula a rotação da máquina (RPM)
export function calcularRPM(velocidadeCorte, diametro) {
    const vc = validarNumero(velocidadeCorte, "Velocidade de corte");
    const d = validarNumero(diametro, "Diâmetro");

    // RPM = (Vc * 1000) / (PI * D)
    const rpm = (vc * 1000) / (Math.PI * d);

    return Math.round(rpm);
}

// Calcula a velocidade de avanço (mm/min)
export function calcularVelocidadeAvanco(
    avanco,
    tipoAvanco,
    rpm,
    numeroDentes = 1
) {
    const f = validarNumero(avanco, "Avanço");
    const n = validarNumero(rpm, "RPM");

    let velocidadeAvanco;

    if (tipoAvanco === "mm_volta") {
        // Avanço por volta
        // Vf = f * RPM
        velocidadeAvanco = f * n;

    } else if (tipoAvanco === "mm_dente") {
        // Avanço por dente
        // Vf = fz * Z * RPM
        const dentes = validarNumero(numeroDentes, "Número de dentes");

        velocidadeAvanco = f * dentes * n;

    } else {
        throw new Error("Tipo de avanço inválido.");
    }

    return Number(velocidadeAvanco.toFixed(2));
}
