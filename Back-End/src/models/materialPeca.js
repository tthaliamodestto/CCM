export class MaterialPeca {
    #idMaterial;
    #nome;
    #densidade;
    #custoPerKg;

    constructor(pNome, pDensidade, pCustoPerKg, pIdMaterial) {
        this.nome = pNome;
        this.densidade = pDensidade;
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

    get densidade() {
        return this.#densidade;
    }
    set densidade(value) {
        this.#validarDensidade(value);
        this.#densidade = value;
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
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error("O Nome do material não pode ser vazio.");
        }
    }

    #validarDensidade(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
            throw new Error("A Densidade deve ser um número e deve ser maior que zero.");
        }
    }

    #validarCustoPerKg(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
            throw new Error("O custo por Kg deve ser um número maior que zero.");
        }
    }

    static criar(dados) {
        return new MaterialPeca(dados.nome, dados.densidade, dados.custoPerKg, null);
    }

    static editar(dados) {
        return new MaterialPeca(dados.nome, dados.densidade, dados.custoPerKg, dados.idMaterial);
    }
}