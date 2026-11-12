export class DadosTorneamento {
    #idDadosTorneamento;
    #idOperacaoProcesso;
    #comprimentoTorneamento;
    #diametroInicial;
    #diametroFinal;

    constructor(pIdOperacaoProcesso, pComprimentoTorneamento, pDiametroInicial, pDiametroFinal, pIdDadosTorneamento) {
        this.idOperacaoProcesso = pIdOperacaoProcesso;
        this.comprimentoTorneamento = pComprimentoTorneamento;
        this.diametroInicial = pDiametroInicial;
        this.diametroFinal = pDiametroFinal;
        this.idDadosTorneamento = pIdDadosTorneamento;
    }

    get idDadosTorneamento() { 
        return this.#idDadosTorneamento; 
    }
    set idDadosTorneamento(value) {
        this.#validarIdDadosTorneamento(value);
        this.#idDadosTorneamento = value;
    }

    get idOperacaoProcesso() { 
        return this.#idOperacaoProcesso; 
    }
    set idOperacaoProcesso(value) {
        this.#validarIdOperacaoProcesso(value);
        this.#idOperacaoProcesso = value;
    }

    get comprimentoTorneamento() { 
        return this.#comprimentoTorneamento; 
    }
    set comprimentoTorneamento(value) {
        this.#validarComprimentoTorneamento(value);
        this.#comprimentoTorneamento = value;
    }

    get diametroInicial() { 
        return this.#diametroInicial; 
    }
    set diametroInicial(value) {
        this.#validarDiametroInicial(value);
        this.#diametroInicial = value;
    }

    get diametroFinal() { 
        return this.#diametroFinal; 
    }
    set diametroFinal(value) {
        this.#validarDiametroFinal(value);
        this.#diametroFinal = value;
    }
    
    #validarIdDadosTorneamento(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) throw new Error("O Id dos dados de torneamento deve ser um inteiro maior que zero.");
    }

    #validarIdOperacaoProcesso(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O Id da operação do processo deve ser um inteiro maior que zero.");
    }

    #validarComprimentoTorneamento(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("O comprimento de torneamento deve ser maior que zero.");
    }

    #validarDiametroInicial(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("O diâmetro inicial deve ser maior que zero.");
        if (this.#diametroFinal !== undefined && Number(value) <= this.#diametroFinal) throw new Error("O diâmetro inicial deve ser maior que o final.");
    }

    #validarDiametroFinal(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("O diâmetro final deve ser maior que zero.");
        if (this.#diametroInicial !== undefined && Number(value) >= this.#diametroInicial) throw new Error("O diâmetro final deve ser menor que o inicial.");
    }

    static criar(dados) {
        return new DadosTorneamento(dados.idOperacaoProcesso, dados.comprimentoTorneamento, dados.diametroInicial, dados.diametroFinal, null);
    }

    static editar(dados) {
        return new DadosTorneamento(dados.idOperacaoProcesso, dados.comprimentoTorneamento, dados.diametroInicial, dados.diametroFinal, dados.idDadosTorneamento);
    }
}
