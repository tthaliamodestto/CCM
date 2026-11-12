export class DadosFaceamento {
    #idDadosFaceamento;
    #idOperacaoProcesso;
    #diametroFaceamento;
    #espessuraFaceada;

    constructor(pIdOperacaoProcesso, pDiametroFaceamento, pEspessuraFaceada, pIdDadosFaceamento) {
        this.idOperacaoProcesso = pIdOperacaoProcesso;
        this.diametroFaceamento = pDiametroFaceamento;
        this.espessuraFaceada = pEspessuraFaceada;
        this.idDadosFaceamento = pIdDadosFaceamento;
    }

    get idDadosFaceamento() { 
        return this.#idDadosFaceamento; 
    }
    set idDadosFaceamento(value) {
        this.#validarIdDadosFaceamento(value);
        this.#idDadosFaceamento = value;
    }

    get idOperacaoProcesso() { 
        return this.#idOperacaoProcesso; 
    }
    set idOperacaoProcesso(value) {
        this.#validarIdOperacaoProcesso(value);
        this.#idOperacaoProcesso = value;
    }

    get diametroFaceamento() { 
        return this.#diametroFaceamento; 
    }
    set diametroFaceamento(value) {
        this.#validarDiametroFaceamento(value);
        this.#diametroFaceamento = value;
    }

    get espessuraFaceada() { 
        return this.#espessuraFaceada; 
    }
    set espessuraFaceada(value) {
        this.#validarEspessuraFaceada(value);
        this.#espessuraFaceada = value;
    }

    #validarIdOperacaoProcesso(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) throw new Error("O Id da operação do processo deve ser um inteiro maior que zero.");
    }

    #validarDiametroFaceamento(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("O diâmetro de faceamento deve ser maior que zero.");
    }

    #validarEspessuraFaceada(value) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) throw new Error("A espessura faceada deve ser maior que zero.");
    }

    #validarIdDadosFaceamento(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) throw new Error("O Id dos dados de faceamento deve ser um inteiro maior que zero.");
    }

    static criar(dados) {
        return new DadosFaceamento(dados.idOperacaoProcesso, dados.diametroFaceamento, dados.espessuraFaceada, null);
    }

    static editar(dados) {
        return new DadosFaceamento(dados.idOperacaoProcesso, dados.diametroFaceamento, dados.espessuraFaceada, dados.idDadosFaceamento);
    }
}
