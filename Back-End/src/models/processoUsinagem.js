export class ProcessoUsinagem {
    #idPeca;
    #idPecaFinal;
    #dataCriacao;
    #idProcesso;

    constructor(pIdPeca, pIdPecaFinal, pDataCriacao, pIdProcesso) {
        this.idPeca = pIdPeca;
        this.idPecaFinal = pIdPecaFinal;
        this.dataCriacao = pDataCriacao;
        this.idProcesso = pIdProcesso;
    }

    get idPeca() { return this.#idPeca; }
    set idPeca(value) {
        this.#validarIdPeca(value);
        this.#idPeca = Number(value);
    }

    get idPecaFinal() { return this.#idPecaFinal; }
    set idPecaFinal(value) {
        this.#validarIdPecaFinal(value);
        this.#idPecaFinal = Number(value);
    }

    get dataCriacao() { return this.#dataCriacao; }
    set dataCriacao(value) {
        this.#validarDataCriacao(value);
        this.#dataCriacao = value === undefined ? null : value;
    }

    get idProcesso() { return this.#idProcesso; }
    set idProcesso(value) {
        this.#validarIdProcesso(value);
        this.#idProcesso = value === null || value === undefined ? null : Number(value);
    }

    #validarIdPeca(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O Id da peça bruta deve ser um inteiro maior que zero.");
    }

    #validarIdPecaFinal(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O Id da peça final deve ser um inteiro maior que zero.");
    }

    #validarDataCriacao(value) {
        if (value !== null && value !== undefined && !(value instanceof Date) && (typeof value !== "string" || value.trim() === "")) throw new Error("Data de criação inválida.");
    }

    #validarIdProcesso(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) throw new Error("O Id do processo deve ser um inteiro maior que zero.");
    }

    static criar(dados) {
        return new ProcessoUsinagem(dados.idPeca, dados.idPecaFinal, dados.dataCriacao, null);
    }

    static editar(dados) {
        return new ProcessoUsinagem(dados.idPeca, dados.idPecaFinal, dados.dataCriacao, dados.idProcesso);
    }
}
