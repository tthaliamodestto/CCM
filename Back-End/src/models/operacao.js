import { tipoOperacao } from "../enums/tipoOperacao.js";

export class Operacao {
    #idOperacao;
    #nome;
    #tipo;
    #descricao;

    constructor(pNome, pTipo, pDescricao, pIdOperacao) {
        this.nome = pNome;
        this.tipo = pTipo;
        this.descricao = pDescricao;
        this.idOperacao = pIdOperacao;
    }
    
    get idOperacao() { 
        return this.#idOperacao; 
    }
    set idOperacao(value) {
        this.#validarIdOperacao(value);
        this.#idOperacao = value;
    }

    get nome() { 
        return this.#nome; 
    }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get tipo() { 
        return this.#tipo; 
    }
    set tipo(value) {
        this.#validarTipo(value);
        this.#tipo = value;
    }

    get descricao() { 
        return this.#descricao; 
    }
    set descricao(value) {
        this.#validarDescricao(value);
        this.#descricao = value;
    }

    #validarIdOperacao(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) throw new Error("O Id da operação deve ser um inteiro maior que zero.");
    }

    #validarNome(value) {
        if (typeof value !== "string" || value.trim().length < 3 || value.trim().length > 100) throw new Error("O nome da operação deve ter entre 3 e 100 caracteres.");
    }

    #validarTipo(value) {
        if (typeof value !== "string" || !Object.values(tipoOperacao).includes(value.trim().toLowerCase())) throw new Error("Tipo de operação inválido.");
    }

    #validarDescricao(value) {
        if (value !== null && value !== undefined && (typeof value !== "string" || value.trim().length > 150)) throw new Error("A descrição deve ser um texto de até 150 caracteres.");
    }

    static criar(dados) {
        return new Operacao(dados.nome, dados.tipo, dados.descricao, null);
    }

    static editar(dados) {
        return new Operacao(dados.nome, dados.tipo, dados.descricao, dados.idOperacao);
    }
}
