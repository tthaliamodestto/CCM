export class MaterialPeca {
    #idMaterial;
    #nome;
    #medidas;
    #custoPerKg;

    constructor(pNome, pMedidas, pCustoPerKg, pIdMaterial) {
        this.nome = pNome;
        this.medidas = pMedidas;
        this.custoPerKg = pCustoPerKg;
        this.idMaterial = pIdMaterial;
    }

    get idMaterial() {
        return this.#idMaterial;
    }
    set idMaterial(value) {
        this.#validarIdMaterial(value);
        this.#idMaterial = value;
    }

    get nome() {
        return this.#nome;
    }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get medidas() {
        return this.#medidas;
    }
    set medidas(value) {
        this.#validarMedidas(value);
        this.#medidas = value;
    }

    get custoPerKg() {
        return this.#custoPerKg;
    }
    set custoPerKg(value) {
        this.#validarCustoPerKg(value);
        this.#custoPerKg = value;
    }

    #validarIdMaterial(value) {
        if (value && value <= 0) throw new Error("Verifique o Id do Material informado.");
    }

    #validarNome(value) {
        if (value !== null && value !== undefined && typeof value === 'string' && value.trim() === '') {
            throw new Error("O Nome do material não pode ser vazio.");
        }
    }

    #validarMedidas(value) {
        if (value && typeof value !== 'string') {
            throw new Error("As medidas devem ser em formato de texto.");
        }
    }

    #validarCustoPerKg(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
            throw new Error("O custo por Kg deve ser um número maior que zero.");
        }
    }

    static criar(dados) {
        return new MaterialPeca(dados.nome, dados.medidas, dados.custoPerKg, null);
    }

    static editar(dados) {
        return new MaterialPeca(dados.nome, dados.medidas, dados.custoPerKg, dados.idMaterial);
    }
}