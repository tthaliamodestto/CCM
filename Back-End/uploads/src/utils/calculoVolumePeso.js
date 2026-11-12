export function calcularVolumePeso(forma, dimensoes, densidade) {
    let volume = 0; // em cm³

    // Como o banco agora restringe a cilindro ou prisma, a verificação fica direta
    const formaNormalizada = forma.toLowerCase();

    if (formaNormalizada === 'cilindro') {
        // Divide por 10 para converter milímetros (mm) em centímetros (cm)
        const raio = (dimensoes.diametro / 2) / 10;
        const comprimento = dimensoes.comprimento / 10;
        volume = Math.PI * Math.pow(raio, 2) * comprimento;
        
    } else if (formaNormalizada === 'prisma') {
        // Formas retangulares / blocos / prismas
        // Divide por 10 para converter milímetros (mm) em centímetros (cm)
        const largura = dimensoes.largura / 10;
        const altura = dimensoes.altura / 10;
        const comprimento = dimensoes.comprimento / 10;
        volume = largura * altura * comprimento;
    }

    // Peso em gramas = Volume * Densidade. Convertido para Kg.
    const pesoKg = (volume * densidade) / 1000;

    return {
        volume: parseFloat(volume.toFixed(2)), // cm³
        peso: parseFloat(pesoKg.toFixed(3))    // Kg
    };
}