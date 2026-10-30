const TARIFA_PADRAO_KWH = 0.72; // R$/kWh usada quando nada for informado

function arredondar(valor) {
    return parseFloat(Number(valor).toFixed(2));
}

// Prioridade: valor informado na requisição > variável TARIFA_ENERGIA_KWH do .env > padrão
export function obterTarifaEnergia(tarifaInformada) {
    if (tarifaInformada !== undefined && tarifaInformada !== null && tarifaInformada !== '') {
        const tarifa = Number(tarifaInformada);
        if (!Number.isFinite(tarifa) || tarifa < 0) {
            throw new Error("A tarifa de energia deve ser um número maior ou igual a zero.");
        }
        return tarifa;
    }

    const tarifaEnv = Number(process.env.TARIFA_ENERGIA_KWH);
    if (process.env.TARIFA_ENERGIA_KWH && Number.isFinite(tarifaEnv) && tarifaEnv >= 0) {
        return tarifaEnv;
    }

    return TARIFA_PADRAO_KWH;
}

// Custo do material bruto = peso (kg) * custo por kg
export function calcularCustoMaterial(pesoKg, custoPerKg) {
    return arredondar(Number(pesoKg) * Number(custoPerKg));
}

// Custo da máquina:
//  - terceiros: horas * custoHora
//  - própria:   horas * potência (kW) * tarifa de energia (R$/kWh)
export function calcularCustoMaquina({ tipoUtilizacao, custoHora, potencialKw, tempoMinutos, tarifaEnergia }) {
    const horas = Number(tempoMinutos) / 60;

    if (tipoUtilizacao === 'terceiros') {
        return {
            custo: arredondar(horas * Number(custoHora)),
            horas: parseFloat(horas.toFixed(4)),
            baseCalculo: 'custoHora',
            tarifaEnergia: null
        };
    }

    return {
        custo: arredondar(horas * Number(potencialKw) * tarifaEnergia),
        horas: parseFloat(horas.toFixed(4)),
        baseCalculo: 'energia',
        tarifaEnergia
    };
}

export function calcularCustoTotal(custoMaterial, custoMaquina) {
    return arredondar(Number(custoMaterial) + Number(custoMaquina));
}
