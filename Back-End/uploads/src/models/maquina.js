import { tipoUtilizacao } from '../enums/tipoUtilizacao.js';

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

    get idMaquina() { return this.#idMaquina; }
    set idMaquina(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
            throw new Error('O Id da máquina deve ser um inteiro maior que zero.');
        }
        this.#idMaquina = value === null || value === undefined ? null : Number(value);
    }

    get nome() { return this.#nome; }
    set nome(value) {
        if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error('O nome da máquina deve ter entre 3 e 100 caracteres.');
        }
        this.#nome = value.trim();
    }

    get tipoUtilizacao() { return this.#tipoUtilizacao; }
    set tipoUtilizacao(value) {
        const tipo = typeof value === 'string' ? value.trim().toLowerCase() : '';
        if (!Object.values(tipoUtilizacao).includes(tipo)) {
            throw new Error("O tipo de utilização deve ser 'propria' ou 'terceiros'.");
        }
        this.#tipoUtilizacao = tipo;
    }

    get custoHora() { return this.#custoHora; }
    set custoHora(value) {
        if (this.#tipoUtilizacao === tipoUtilizacao.PROPRIA) {
            this.#custoHora = null;
            return;
        }
        if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) || Number(value) <= 0) {
            throw new Error('Para máquinas de terceiros, o custo por hora deve ser maior que zero.');
        }
        this.#custoHora = Number(value);
    }

    get potencialKw() { return this.#potencialKw; }
    set potencialKw(value) {
        if (this.#tipoUtilizacao === tipoUtilizacao.TERCEIROS) {
            this.#potencialKw = null;
            return;
        }
        if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) || Number(value) <= 0) {
            throw new Error('Para máquinas próprias, a potência em kW deve ser maior que zero.');
        }
        this.#potencialKw = Number(value);
    }

    get imagem() { return this.#imagem; }
    set imagem(value) {
        if (value !== null && value !== undefined && (typeof value !== 'string' || value.length > 255)) {
            throw new Error('A imagem deve ser um caminho com no máximo 255 caracteres.');
        }
        this.#imagem = value ?? null;
    }

    static criar(dados) {
        return new Maquina(dados.nome, dados.tipoUtilizacao, dados.custoHora, dados.potencialKw, dados.imagem, null);
    }

    static editar(dados) {
        return new Maquina(dados.nome, dados.tipoUtilizacao, dados.custoHora, dados.potencialKw, dados.imagem, dados.idMaquina);
    }
}
