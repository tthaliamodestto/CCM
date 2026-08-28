export class ParametroCorte {
    #idParametro;
    #idMaterial;
    #idOperacao;
    #velocidadeCorte;
    #avanco;
    #profundidadeCorte;

    constructor(pIdParametro, pIdMaterial, pIdOperacao, pVelocidadeCorte, pAvanco, pProfundidadeCorte) {
        this.idMaterial = pIdMaterial;
        this.idOperacao = pIdOperacao;
        this.velocidadeCorte = pVelocidadeCorte;
        this.avanco = pAvanco;
        this.profundidadeCorte = pProfundidadeCorte;
        this.idParametro = pIdParametro
    }

    get idParametro() {
        return this.#idParametro;
    }
    set idParametro(value) {
        this.#validarIdParametro(value);
        this.#idParametro = value;
    }

    get idMaterial() {
        return this.#idMaterial;
    }
    set idMaterial(value) {
        this.#validarIdMaterial(value);
        this.#idMaterial = value;
    }

    get idOperacao() {
        return this.#idOperacao;
    }
    set idOperacao(value) {
        this.#validarIdOperacao(value);
        this.#idOperacao = value;
    }

    get velocidadeCorte() {
        return this.#velocidadeCorte;
    }
    set velocidadeCorte(value) {
        this.#validarVelocidadeCorte(value);
        this.#velocidadeCorte = value;
    }

    get avanco() {
        return this.#avanco;
    }
    set avanco(value) {
        this.#validarAvanco(value);
        this.#avanco = value;
    }

    get profundidadeCorte() {
        return this.#profundidadeCorte;
    }
    set profundidadeCorte(value) {
        this.#validarProfundidadeCorte(value);
        this.#profundidadeCorte = value;
    }

    #validarIdParametro(value) {
        if (value && value <= 0) throw new Error("Verifique o Id do Parâmetro que foi informado");
    }
    #validarIdMaterial(value) {
        if (value && value <= 0) throw new Error("Verifique o Id do Material informado");
    }
    #validarIdOperacao(value) {
        if (value && value <= 0) throw new Error("Verifique o Id da Operação informada");
    }

    #validarVelocidadeCorte(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) throw new Error("A Velocidade de Corte, se informada, deve ser um valor numérico maior que zero");
    }
    #validarAvanco(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) throw new Error("O Avanço, se informado, deve ser numérico e maior que zero");
    }
    #validarProfundidadeCorte(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) throw new Error("A Profundidade de Corte, se informada, deve ser numérica e maior que zero");
    }

    static criar(dados) {
        return new ParametroCorte(dados.idMaterial, dados.idOperacao, dados.velocidadeCorte, dados.avanco, dados.profundidadeCorte, null);
    }
    static editar(dados) {
        return new ParametroCorte(dados.idMaterial, dados.idOperacao, dados.velocidadeCorte, dados.avanco, dados.profundidadeCorte, dados.idParametro);
    }
}