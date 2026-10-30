import { tipoAvanco } from "../enums/tipoAvanco.js";

export class ParametroCorte {
    #idParametro;
    #idMaterial;
    #idOperacao;
    #velocidadeCorte;
    #avanco;
    #tipoAvanco;
    #profundidadeCorte;

    constructor(pIdMaterial, pIdOperacao, pVelocidadeCorte, pAvanco, pTipoAvanco, pProfundidadeCorte, pIdParametro) {
        this.idMaterial = pIdMaterial;
        this.idOperacao = pIdOperacao;
        this.velocidadeCorte = pVelocidadeCorte;
        this.avanco = pAvanco;
        this.tipoAvanco = pTipoAvanco;
        this.profundidadeCorte = pProfundidadeCorte;
        this.idParametro = pIdParametro;
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

    get tipoAvanco() { 
        return this.#tipoAvanco; 
    }
    set tipoAvanco(value) {
        this.#validarTipoAvanco(value);
        this.#tipoAvanco = value;
    }

    get profundidadeCorte() { 
        return this.#profundidadeCorte; 
    }
    set profundidadeCorte(value) {
        this.#validarProfundidadeCorte(value);
        this.#profundidadeCorte = value;
    }
    
    #validarIdParametro(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) throw new Error("O Id do parâmetro deve ser um inteiro maior que zero.");
    }

    #validarIdMaterial(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O Id do material deve ser um inteiro maior que zero.");
    }

    #validarIdOperacao(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O Id da operação deve ser um inteiro maior que zero.");
    }

    #validarVelocidadeCorte(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("A velocidade de corte deve ser maior que zero.");
    }

    #validarAvanco(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("O avanço deve ser maior que zero.");
    }

    #validarTipoAvanco(value) {
        if (typeof value !== "string" || !Object.values(tipoAvanco).includes(value.trim().toLowerCase())) throw new Error("Tipo de avanço inválido: use mm_volta ou mm_dente.");
    }

    #validarProfundidadeCorte(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("A profundidade de corte deve ser maior que zero.");
    }

    static criar(dados) {
        return new ParametroCorte(dados.idMaterial, dados.idOperacao, dados.velocidadeCorte, dados.avanco, dados.tipoAvanco, dados.profundidadeCorte, null);
    }

    static editar(dados) {
        return new ParametroCorte(dados.idMaterial, dados.idOperacao, dados.velocidadeCorte, dados.avanco, dados.tipoAvanco, dados.profundidadeCorte, dados.idParametro);
    }
}
