import { tipoUtilizacao } from "../enums/tipoUtilizacao.js";

export class Maquina {
    #idMaquina;
    #nome;
    #tipo;
    #tipoUtilizacao;
    #custoHora;
    #potencialKw;
    #imagem;

    constructor(pNome, pTipo, pTipoUtilizacao, pCustoHora, pPotencialKw, pImagem, pIdMaquina) {
        this.nome = pNome;
        this.tipo = pTipo;
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
        this.#nome = value.trim();
    }

    get tipo() {
        return this.#tipo;
    }
    set tipo(value) {
        this.#tipo = value || null;
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
        this.#validarCustoHora(value);
        this.#custoHora =
            value === null || value === "" ? null : Number(value);
    }

    get potencialKw() {
        return this.#potencialKw;
    }
    set potencialKw(value) {
        this.#validarPotencialKw(value);
        this.#potencialKw = Number(value);
    }

    get imagem() {
        return this.#imagem;
    }
    set imagem(value) {
        this.#imagem = value || null;
    }

    #validarIdMaquina(value) {
        if (
            value != null &&
            (!Number.isInteger(Number(value)) || Number(value) <= 0)
        ) {
            throw new Error("Verifique o Id da máquina informada.");
        }
    }

    #validarNome(value) {
        if (
            typeof value !== "string" ||
            value.trim().length < 3 ||
            value.trim().length > 100
        ) {
            throw new Error(
                "O nome da máquina deve ter entre 3 e 100 caracteres."
            );
        }
    }

    #validarTipoUtilizacao(value) {
        if (
            !value ||
            !Object.values(tipoUtilizacao).includes(value)
        ) {
            throw new Error(
                "O tipo de utilização deve ser 'propria' ou 'terceiros'."
            );
        }
    }

    #validarCustoHora(value) {
        if (value === null || value === "") {
            if (this.#tipoUtilizacao === tipoUtilizacao.TERCEIROS) {
                throw new Error(
                    "O custo por hora é obrigatório para máquinas de terceiros."
                );
            }
            return;
        }

        if (
            !Number.isFinite(Number(value)) ||
            Number(value) < 0
        ) {
            throw new Error(
                "O custo por hora deve ser um número maior ou igual a zero."
            );
        }
    }

    #validarPotencialKw(value) {
        if (
            value === null ||
            value === "" ||
            !Number.isFinite(Number(value)) ||
            Number(value) <= 0
        ) {
            throw new Error(
                "A potência da máquina deve ser maior que zero."
            );
        }
    }

    static criar(dados) {
        return new Maquina(
            dados.nome,
            dados.tipo,
            dados.tipoUtilizacao,
            dados.custoHora,
            dados.potencialKw,
            dados.imagem,
            null
        );
    }

    static editar(dados) {
        return new Maquina(
            dados.nome,
            dados.tipo,
            dados.tipoUtilizacao,
            dados.custoHora,
            dados.potencialKw,
            dados.imagem,
            dados.idMaquina
        );
    }
}