export class Maquina {
    #idMaquina;
    #nome;
    #tipoUtilizacao;
    #custoHora;
    #potencialKw;
    #imagem;

    constructor(pNome, pTipoUtilizacao, pCustoHora, pPotencialKw, pImagem, pIdMaquina) {
        this.nome = pNome;
        this.tipoUtilizacao = pTipoUtilizacao;
        this.custoHora = pCustoHora;
        this.potencialKw = pPotencialKw;
        this.imagem = pImagem;
        this.idMaquina = pIdMaquina;
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

    get tipoUtilizacao() { 
        return this.#tipoUtilizacao; 
    }
    set tipoUtilizacao(value) {
        this.#validarTipoUtilizacao(value);
        this.#tipoUtilizacao = value;
    }
    
    get custoHora() { 
        return this.#custoHora; 
    }
    set custoHora(value) {
        this.#validarCusto(value);
        this.#custoHora = value;
    }

    get potencialKw() { 
        return this.#potencialKw; 
    }
    set potencialKw(value) {
        this.#validarPotencia(value);
        this.#potencialKw = value;
    }

    get imagem() {
        return this.#imagem;
    }
    set imagem(value) {
        this.#validarImagem(value);
        this.#imagem = value;
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

    #validarTipoUtilizacao(value) {
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

    #validarImagem(value) {
        if (value) {
            if(value.string < 3){
                throw new Error('O campo imagem não pode ficar vazio')
            }
            
        }
    }

    static criar(dados) {
        return new Maquina(dados.nome, dados.tipo, dados.custoHora, dados.potencialKw, dados.imagem, null);
    }

    static editar(dados) {
        return new Maquina(dados.nome, dados.tipo, dados.custoHora, dados.potencialKw, dados.imagem, dados.idMaquina);
    }
}