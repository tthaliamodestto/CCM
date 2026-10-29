export class OperacaoProcesso {
    #idProcesso;
    #idMaquina;
    #idParametro;
    #ordem;
    #localOperacao;
    #rpmCalculado;
    #velocidadeAvancoCalculada;
    #numeroPasses;
    #tempoUsinagem;
    #idOperacaoProcesso;

    constructor(pIdProcesso, pIdMaquina, pIdParametro, pOrdem, pLocalOperacao, pRpmCalculado, pVelocidadeAvancoCalculada, pNumeroPasses, pTempoUsinagem, pIdOperacaoProcesso) {
        this.idProcesso = pIdProcesso;
        this.idMaquina = pIdMaquina;
        this.idParametro = pIdParametro;
        this.ordem = pOrdem;
        this.localOperacao = pLocalOperacao;
        this.rpmCalculado = pRpmCalculado;
        this.velocidadeAvancoCalculada = pVelocidadeAvancoCalculada;
        this.numeroPasses = pNumeroPasses;
        this.tempoUsinagem = pTempoUsinagem;
        this.idOperacaoProcesso = pIdOperacaoProcesso;
    }

    get idProcesso() { return this.#idProcesso; }
    set idProcesso(value) {
        this.#validarIdProcesso(value);
        this.#idProcesso = Number(value);
    }

    get idMaquina() { return this.#idMaquina; }
    set idMaquina(value) {
        this.#validarIdMaquina(value);
        this.#idMaquina = Number(value);
    }

    get idParametro() { return this.#idParametro; }
    set idParametro(value) {
        this.#validarIdParametro(value);
        this.#idParametro = Number(value);
    }

    get ordem() { return this.#ordem; }
    set ordem(value) {
        this.#validarOrdem(value);
        this.#ordem = Number(value);
    }

    get localOperacao() { return this.#localOperacao; }
    set localOperacao(value) {
        this.#validarLocalOperacao(value);
        this.#localOperacao = value === null || value === undefined ? null : value.trim();
    }

    get rpmCalculado() { return this.#rpmCalculado; }
    set rpmCalculado(value) {
        this.#validarRpmCalculado(value);
        this.#rpmCalculado = value === null || value === undefined ? null : Number(value);
    }

    get velocidadeAvancoCalculada() { return this.#velocidadeAvancoCalculada; }
    set velocidadeAvancoCalculada(value) {
        this.#validarVelocidadeAvancoCalculada(value);
        this.#velocidadeAvancoCalculada = value === null || value === undefined ? null : Number(value);
    }

    get numeroPasses() { return this.#numeroPasses; }
    set numeroPasses(value) {
        this.#validarNumeroPasses(value);
        this.#numeroPasses = value === null || value === undefined ? null : Number(value);
    }

    get tempoUsinagem() { return this.#tempoUsinagem; }
    set tempoUsinagem(value) {
        this.#validarTempoUsinagem(value);
        this.#tempoUsinagem = value === null || value === undefined ? null : Number(value);
    }

    get idOperacaoProcesso() { return this.#idOperacaoProcesso; }
    set idOperacaoProcesso(value) {
        this.#validarIdOperacaoProcesso(value);
        this.#idOperacaoProcesso = value === null || value === undefined ? null : Number(value);
    }

    #validarIdProcesso(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O Id do processo deve ser um inteiro maior que zero.");
    }

    #validarIdMaquina(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O Id da máquina deve ser um inteiro maior que zero.");
    }

    #validarIdParametro(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O Id do parâmetro deve ser um inteiro maior que zero.");
    }

    #validarOrdem(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("A ordem da operação deve ser um inteiro maior que zero.");
    }

    #validarLocalOperacao(value) {
        if (value !== null && value !== undefined && (typeof value !== "string" || value.trim().length > 100)) throw new Error("O local da operação deve ser um texto de até 100 caracteres.");
    }

    #validarRpmCalculado(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) throw new Error("O RPM calculado deve ser um inteiro maior que zero.");
    }

    #validarVelocidadeAvancoCalculada(value) {
        if (value !== null && value !== undefined && value !== "" && (!Number.isFinite(Number(value)) || Number(value) <= 0)) throw new Error("A velocidade de avanço calculada deve ser maior que zero.");
        if (value === "") throw new Error("A velocidade de avanço calculada não pode ser vazio.");
    }

    #validarNumeroPasses(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) throw new Error("O número de passes deve ser um inteiro maior que zero.");
    }

    #validarTempoUsinagem(value) {
        if (value !== null && value !== undefined && value !== "" && (!Number.isFinite(Number(value)) || Number(value) <= 0)) throw new Error("O tempo de usinagem deve ser maior que zero.");
        if (value === "") throw new Error("O tempo de usinagem não pode ser vazio.");
    }

    #validarIdOperacaoProcesso(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) throw new Error("O Id da operação do processo deve ser um inteiro maior que zero.");
    }

    static criar(dados) {
        return new OperacaoProcesso(dados.idProcesso, dados.idMaquina, dados.idParametro, dados.ordem, dados.localOperacao, dados.rpmCalculado, dados.velocidadeAvancoCalculada, dados.numeroPasses, dados.tempoUsinagem, null);
    }

    static editar(dados) {
        return new OperacaoProcesso(dados.idProcesso, dados.idMaquina, dados.idParametro, dados.ordem, dados.localOperacao, dados.rpmCalculado, dados.velocidadeAvancoCalculada, dados.numeroPasses, dados.tempoUsinagem, dados.idOperacaoProcesso);
    }
}
