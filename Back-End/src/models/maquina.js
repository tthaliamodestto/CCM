export class Maquina {
    #idMaquina;
    #nome;
    #tipo;
    #custoHora
    #potenciaKw;

    constructor(pNome, pTipo, pCustoHora, pPotenciaKw, pIdMaquina) {
        this.nome = pNome;
        this.tipo = pTipo;
        this.custoHora = pCustoHora;
        this.potenciaKw = pPotenciaKw;
        this.idMaquinaKw = pIdMaquina;
    }

    get idMaquina() { 
        return this.#idMaquina; 
    }
    set idMaquina(value) {
        this.#validarIdMaquina(value);
        this.#idMaquina = value;
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
    
    get custoHora() { 
        return this.#custoHora; 
    }
    set custoHora(value) {
        this.#validarCusto(value);
        this.#custoHora = value;
    }
    get potenciaKw() { 
        return this.#potenciaKw; 
    }
    set potenciaKw(value) {
        this.#validarPotencia(value);
        this.#potenciaKw = value;
    }


    #validarIdMaquina(value) {
        if (value && value <= 0) {
            throw new Error("Verifique o Id da máquina informado.");
        }
    }

    #validarNome(value) {
        if (!value || value.trim().length < 2 || value.trim().length > 100) {
            throw new Error("O nome da máquina deve ter entre 2 e 100 caracteres.");
        }
    }

    #validarTipo(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error("O tipo da máquina deve ter entre 3 e 100 caracteres.");
        }
    }
    
    #validarCusto(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
            throw new Error("O custo, se informada, deve ser um número maior que zero.");
        }
    }

    #validarPotencia(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
            throw new Error("A potência, se informada, deve ser um número maior que zero.");
        }
    }

    static criar(dados) {
        return new Maquina(dados.nome, dados.tipo, dados.custoHora, dados.potenciaKw, null);
    }

    static editar(dados) {
        return new Maquina(dados.nome, dados.tipo, dados.custoHora, dados.potenciaKw, dados.idMaquina);
    }
}