export function calcularTempoUsinagem(velocidadeCorte, diametroFerramenta, comprimentoUsinado, avanco, numeroPasses = 1) {
    // 2. Cálculo do RPM (N)
    // Fórmula: N = (Vc * 1000) / (π * D)
    const rpmCalculado = (velocidadeCorte * 1000) / (Math.PI * diametroFerramenta);
    
    // Arredondamos o RPM para um número inteiro, pois as máquinas 
    // CNC e convencionais geralmente trabalham com rotações exatas.
    const rpm = Math.round(rpmCalculado);

    // 3. Cálculo do Tempo Base
    // Fórmula: Tempo = Comprimento / (Avanço * N)
    const tempoBase = comprimentoUsinado / (avanco * rpm);

    // 4. Tempo Total considerando a quantidade de passes
    const tempoTotal = tempoBase * numeroPasses;

    // Retorna os dois valores calculados prontos para irem para o banco
    return {
        rpm: rpm,
        tempoMinutos: parseFloat(tempoTotal.toFixed(2)) 
    };
}