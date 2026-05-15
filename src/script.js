const btn = document.getElementById("btnCalcular");

btn.addEventListener("click", async () => {
    const dadosCalculados = calcularProjeto();

    if (dadosCalculados) {
        await salvarNoBanco(dadosCalculados);
    }
});

function calcularProjeto() {
    const diametro = document.getElementById("diametro");
    const D = parseFloat(diametro.value);
    const L = parseFloat(document.getElementById("comprimento").value);
    const rho = parseFloat(document.getElementById("densidade").value);

 let materialNome = "Material";
    if (rho == 7.85) materialNome = "Aço Carbono";
    else if (rho == 2.70) materialNome = "Alumínio";
    else if (rho == 8.96) materialNome = "Cobre";

    const Vc = parseFloat(document.getElementById("vc").value);
    const f = parseFloat(document.getElementById("avanco").value);

    // CÁLCULOS 
    const raio = D / 2;
    const volumeMM3 = Math.PI * Math.pow(raio, 2) * L;
    const volumeCM3 = volumeMM3 / 1000;
    const pesoKG = (volumeCM3 * rho) / 1000;

    const rpm = (Vc * 1000) / (Math.PI * D);
    const tempoMinutos = L / (f * rpm);

    const custoMaterial = pesoKG * 15;
    const custoHoraMaquina = 120;
    const custoUsinagem = (tempoMinutos / 60) * custoHoraMaquina;
    
    const totalCalculado = custoMaterial + custoUsinagem;

    // ATUALIZAÇÃO DA INTERFACE 
    document.getElementById("vol-res").innerText = volumeMM3.toFixed(2);
    document.getElementById("peso-res").innerText = pesoKG.toFixed(3);
    document.getElementById("rpm-info").innerText = `RPM: ${Math.round(rpm)} | Tempo: ${tempoMinutos.toFixed(2)} min`;
    document.getElementById("resultado").innerText = "Custo Total: R$ " + totalCalculado.toFixed(2);

    return {
        material: materialNome,
        peso: pesoKG.toFixed(3),
        tempo: tempoMinutos.toFixed(2),
        total: totalCalculado.toFixed(2)
    };
}

async function salvarNoBanco(dadosOrcamento) {
    try {
        const response = await fetch('http://localhost:8000/orcamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosOrcamento)
        });

        if (response.ok) {
            console.log("Orçamento salvo via API!");
        } else {
            alert("Erro ao salvar no banco de dados.");
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}