import { tipoUtilizacao } from "../enums/tipoUtilizacao.js";
import { bandeiraTarifaria } from "../enums/bandeiraTarifaria.js";

export class Maquina {
    #idMaquina;
    #nome;
    #tipoUtilizacao;
    #custoHora;
    #potencialKw;
    #bandeiraTarifaria;
    #imagem;

    constructor(pNome, pTipoUtilizacao, pCustoHora, pPotencialKw, pBandeiraTarifaria, pImagem, pIdMaquina) {
        this.nome = pNome;
        this.tipoUtilizacao = pTipoUtilizacao;
        this.custoHora = pCustoHora;
        this.potencialKw = pPotencialKw;
        this.bandeiraTarifaria = pBandeiraTarifaria;
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
        if (this.#tipoUtilizacao === tipoUtilizacao.PROPRIA) {
            this.#custoHora = 0;
            return;
        }
        this.#validarCustoHora(value);
        this.#custoHora = value;
    }

    get potencialKw() { 
        return this.#potencialKw; 
    }
    set potencialKw(value) {
        if (this.#tipoUtilizacao === tipoUtilizacao.TERCEIROS) {
            this.#potencialKw = 0;
            return;
        }
        this.#validarPotencialKw(value);
        this.#potencialKw = value;
    }

    get bandeiraTarifaria() { 
        return this.#bandeiraTarifaria; 
    }
    set bandeiraTarifaria(value) {
        if (this.#tipoUtilizacao === tipoUtilizacao.TERCEIROS) {
            this.#bandeiraTarifaria = bandeiraTarifaria.VERDE;
            return;
        }
        const bandeira = value === null || value === undefined ? bandeiraTarifaria.VERDE : value;
        this.#validarBandeiraTarifaria(bandeira);
        this.#bandeiraTarifaria = bandeira.trim().toLowerCase();
    }

    get imagem() { 
        return this.#imagem; 
    }
    set imagem(value) {
        this.#validarImagem(value);
        this.#imagem = value;
    }

    #validarIdMaquina(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
            throw new Error("O Id da máquina deve ser um inteiro maior que zero.");
        }
    }

    #validarNome(value) {
        if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error("O nome da máquina deve ter entre 3 e 100 caracteres.");
        }
    }

    #validarTipoUtilizacao(value) {
        if (typeof value !== 'string' || !Object.values(tipoUtilizacao).includes(value.trim().toLowerCase())) {
            throw new Error("O tipo de utilização deve ser 'propria' ou 'terceiros'.");
        }
    }

    #validarCustoHora(value) {
        if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) || Number(value) <= 0) {
            throw new Error("Para máquinas de terceiros, o custo por hora deve ser maior que zero.");
        }
    }

    #validarPotencialKw(value) {
        if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) || Number(value) <= 0) {
            throw new Error("Para máquinas próprias, a potência em kW deve ser maior que zero.");
        }
    }

    #validarBandeiraTarifaria(value) {
        if (typeof value !== 'string' || !Object.values(bandeiraTarifaria).includes(value.trim().toLowerCase())) {
            throw new Error("A bandeira tarifária informada é inválida.");
        }
    }

    #validarImagem(value) {
        if (value !== null && value !== undefined && (typeof value !== 'string' || value.length > 255)) {
            throw new Error("A imagem deve ser um caminho com no máximo 255 caracteres.");
        }
    }

    static criar(dados) {
        return new Maquina(dados.nome, dados.tipoUtilizacao, dados.custoHora, dados.potencialKw, dados.bandeiraTarifaria, dados.imagem, null);
    }

    static editar(dados) {
        return new Maquina(dados.nome, dados.tipoUtilizacao, dados.custoHora, dados.potencialKw, dados.bandeiraTarifaria, dados.imagem, dados.idMaquina);
    }
}
