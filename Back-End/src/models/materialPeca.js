
export class MaterialPeca {
    #idMaterial;
    #nome;
    #densidade;
    #custoPerKg;
    #imagem;

    constructor(pNome, pDensidade, pCustoPerKg, pIdMaterial, pImagem) {
        this.nome = pNome;
        this.densidade = pDensidade;
        this.custoPerKg = pCustoPerKg;
        this.imagem = pImagem;
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

    get imagem() {
        return this.#imagem;
    }
    set imagem(value) {
        this.#validarImagem(value);
        this.#imagem = value;
    }

    #validarIdMaterial(value) {
        if (value !== null && value !== undefined && value <= 0) {
            throw new Error("Verifique o Id do Material informado.");
        }
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error("O Nome do material não pode ser vazio.");
        }
    }

    #validarDensidade(value) {
        if (value === null || value === undefined || value <= 0) {
            throw new Error("A densidade deve ser maior que zero.");
        }
    }

    #validarCustoPerKg(value) {
        if (value === null || value === undefined || value < 0) {
            throw new Error("O custo por kg não pode ser negativo.");
        }
    }

    #validarImagem(value) {
        if (value && typeof value !== "string") {
            throw new Error("O campo imagem deve ser um texto válido.");
        }
    }

    static criar(dados) {
        return new MaterialPeca(
            dados.nome,
            dados.densidade,
            dados.custoPerKg,
            null,
            dados.imagem
        );
    }

    static editar(dados) {
        return new MaterialPeca(
            dados.nome,
            dados.densidade,
            dados.custoPerKg,
            dados.idMaterial,
            dados.imagem
        );
    }
}
