export class DadosFuracao {
    #idOperacaoProcesso;
    #diametroFuro;
    #profundidadeFuro;
    #quantidadeFuros;
    #idDadosFuracao;

    constructor(pIdOperacaoProcesso, pDiametroFuro, pProfundidadeFuro, pQuantidadeFuros, pIdDadosFuracao) {
        this.idOperacaoProcesso = pIdOperacaoProcesso;
        this.diametroFuro = pDiametroFuro;
        this.profundidadeFuro = pProfundidadeFuro;
        this.quantidadeFuros = pQuantidadeFuros;
        this.idDadosFuracao = pIdDadosFuracao;
    }

    get idOperacaoProcesso() { return this.#idOperacaoProcesso; }
    set idOperacaoProcesso(value) {
        this.#validarIdOperacaoProcesso(value);
        this.#idOperacaoProcesso = Number(value);
    }

    get diametroFuro() { return this.#diametroFuro; }
    set diametroFuro(value) {
        this.#validarDiametroFuro(value);
        this.#diametroFuro = Number(value);
    }

    get profundidadeFuro() { return this.#profundidadeFuro; }
    set profundidadeFuro(value) {
        this.#validarProfundidadeFuro(value);
        this.#profundidadeFuro = Number(value);
    }

    get quantidadeFuros() { return this.#quantidadeFuros; }
    set quantidadeFuros(value) {
        this.#validarQuantidadeFuros(value);
        this.#quantidadeFuros = Number(value);
    }

    get idDadosFuracao() { return this.#idDadosFuracao; }
    set idDadosFuracao(value) {
        this.#validarIdDadosFuracao(value);
        this.#idDadosFuracao = value === null || value === undefined ? null : Number(value);
    }

    #validarIdOperacaoProcesso(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O Id da operação do processo deve ser um inteiro maior que zero.");
    }

    #validarDiametroFuro(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("O diâmetro do furo deve ser maior que zero.");
    }

    #validarProfundidadeFuro(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("A profundidade do furo deve ser maior que zero.");
    }

    #validarQuantidadeFuros(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("A quantidade de furos deve ser um inteiro maior que zero.");
    }

    #validarIdDadosFuracao(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) throw new Error("O Id dos dados de furação deve ser um inteiro maior que zero.");
    }

    static criar(dados) {
        return new DadosFuracao(dados.idOperacaoProcesso, dados.diametroFuro, dados.profundidadeFuro, (dados.quantidadeFuros ?? 1), null);
    }

    static editar(dados) {
        return new DadosFuracao(dados.idOperacaoProcesso, dados.diametroFuro, dados.profundidadeFuro, (dados.quantidadeFuros ?? 1), dados.idDadosFuracao);
    }
}
