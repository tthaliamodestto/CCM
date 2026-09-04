export class Operacao {
    #idOperacao;
    #nome;
    #tipo;

    constructor(pNome, pTipo, pIdOperacao) {
        this.nome = pNome;
        this.tipo = pTipo;
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

    #validarIdOperacao(value) {
        if (value && value <= 0) throw new Error("Verifique o Id da operação informado.");
    }

    #validarNome(value) {
        if (!value || value.trim().length < 2 || value.trim().length > 100)throw new Error("O nome da máquina deve ter entre 2 e 100 caracteres.");
    }

    #validarTipo(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100)throw new Error("O tipo da máquina deve ter entre 3 e 100 caracteres.");
    }

    static criar(dados) {
        return new Operacao(dados.nome, dados.tipo, null);
    }

    static editar(dados) {
        return new Operacao(dados.nome, dados.tipo, dados.idOperacao);
    }
}