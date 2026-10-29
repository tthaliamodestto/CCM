export class DadosFresamento {
    #idOperacaoProcesso;
    #diametroFresa;
    #numeroDentes;
    #comprimentoPercurso;
    #profundidadeTotal;
    #quantidadePercursos;
    #idDadosFresamento;

    constructor(pIdOperacaoProcesso, pDiametroFresa, pNumeroDentes, pComprimentoPercurso, pProfundidadeTotal, pQuantidadePercursos, pIdDadosFresamento) {
        this.idOperacaoProcesso = pIdOperacaoProcesso;
        this.diametroFresa = pDiametroFresa;
        this.numeroDentes = pNumeroDentes;
        this.comprimentoPercurso = pComprimentoPercurso;
        this.profundidadeTotal = pProfundidadeTotal;
        this.quantidadePercursos = pQuantidadePercursos;
        this.idDadosFresamento = pIdDadosFresamento;
    }

    get idOperacaoProcesso() { return this.#idOperacaoProcesso; }
    set idOperacaoProcesso(value) {
        this.#validarIdOperacaoProcesso(value);
        this.#idOperacaoProcesso = Number(value);
    }

    get diametroFresa() { return this.#diametroFresa; }
    set diametroFresa(value) {
        this.#validarDiametroFresa(value);
        this.#diametroFresa = Number(value);
    }

    get numeroDentes() { return this.#numeroDentes; }
    set numeroDentes(value) {
        this.#validarNumeroDentes(value);
        this.#numeroDentes = Number(value);
    }

    get comprimentoPercurso() { return this.#comprimentoPercurso; }
    set comprimentoPercurso(value) {
        this.#validarComprimentoPercurso(value);
        this.#comprimentoPercurso = Number(value);
    }

    get profundidadeTotal() { return this.#profundidadeTotal; }
    set profundidadeTotal(value) {
        this.#validarProfundidadeTotal(value);
        this.#profundidadeTotal = Number(value);
    }

    get quantidadePercursos() { return this.#quantidadePercursos; }
    set quantidadePercursos(value) {
        this.#validarQuantidadePercursos(value);
        this.#quantidadePercursos = Number(value);
    }

    get idDadosFresamento() { return this.#idDadosFresamento; }
    set idDadosFresamento(value) {
        this.#validarIdDadosFresamento(value);
        this.#idDadosFresamento = value === null || value === undefined ? null : Number(value);
    }

    #validarIdOperacaoProcesso(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O Id da operação do processo deve ser um inteiro maior que zero.");
    }

    #validarDiametroFresa(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("O diâmetro da fresa deve ser maior que zero.");
    }

    #validarNumeroDentes(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O número de dentes deve ser um inteiro maior que zero.");
    }

    #validarComprimentoPercurso(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("O comprimento do percurso deve ser maior que zero.");
    }

    #validarProfundidadeTotal(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("A profundidade total deve ser maior que zero.");
    }

    #validarQuantidadePercursos(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("A quantidade de percursos deve ser um inteiro maior que zero.");
    }

    #validarIdDadosFresamento(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) throw new Error("O Id dos dados de fresamento deve ser um inteiro maior que zero.");
    }

    static criar(dados) {
        return new DadosFresamento(dados.idOperacaoProcesso, dados.diametroFresa, dados.numeroDentes, dados.comprimentoPercurso, dados.profundidadeTotal, (dados.quantidadePercursos ?? 1), null);
    }

    static editar(dados) {
        return new DadosFresamento(dados.idOperacaoProcesso, dados.diametroFresa, dados.numeroDentes, dados.comprimentoPercurso, dados.profundidadeTotal, (dados.quantidadePercursos ?? 1), dados.idDadosFresamento);
    }
}
