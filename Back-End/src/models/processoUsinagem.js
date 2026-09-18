import { tipoOperacao } from "../enums/tipoOperacao.js";

export class ProcessoUsinagem {
    #idProcesso;
    #idPecaFinal;
    #idMaquina;
    #idParametro;
    #tipoOperacao;
    #diametroFerramenta;
    #rpm;
    #velocidadeAvanco;
    #comprimentoUsinado;
    #numeroPasses;
    #tempoUsinagem;

    constructor(pIdPecaFinal, pIdMaquina, pIdParametro, pTipoOperacao, pDiametroFerramenta, pRpm, pVelocidadeAvanco, pComprimentoUsinado, pNumeroPasses, pTempoUsinagem, pIdProcesso) {
        this.idPecaFinal = pIdPecaFinal;
        this.idMaquina = pIdMaquina;
        this.idParametro = pIdParametro;
        this.tipoOperacao = pTipoOperacao;
        this.diametroFerramenta = pDiametroFerramenta;
        this.rpm = pRpm;
        this.velocidadeAvanco = pVelocidadeAvanco;
        this.comprimentoUsinado = pComprimentoUsinado;
        this.numeroPasses = pNumeroPasses;
        this.tempoUsinagem = pTempoUsinagem;
        this.idProcesso = pIdProcesso;
    }

    get idProcesso() { 
        return this.#idProcesso; 
    }
    set idProcesso(value) {
        this.#validarIdProcesso(value);
        this.#idProcesso = value;
    }

    get idPecaFinal() { 
        return this.#idPecaFinal; 
    }
    set idPecaFinal(value) {
        this.#validarIdPecaFinal(value);
        this.#idPecaFinal = value;
    }
    
    get idMaquina() { 
        return this.#idMaquina; 
    }
    set idMaquina(value) {
        this.#validarIdMaquina(value);
        this.#idMaquina = value;
    }

    get idParametro() { 
        return this.#idParametro; 
    }
    set idParametro(value) {
        this.#validarIdParametro(value);
        this.#idParametro = value;
    }

    get tipoOperacao() { 
        return this.#tipoOperacao; 
    }
    set tipoOperacao(value) {
        this.#validarTipoOperacao(value);
        this.#tipoOperacao = value;
    }

    get diametroFerramenta() { 
        return this.#diametroFerramenta; 
    }
    set diametroFerramenta(value) {
        this.#validarDiametroFerramenta(value);
        this.#diametroFerramenta = value;
    }

    get rpm() { 
        return this.#rpm; 
    }
    set rpm(value) {
        this.#validarRpm(value);
        this.#rpm = value;
    }

    get velocidadeAvanco() { 
        return this.#velocidadeAvanco; 
    }
    set velocidadeAvanco(value) {
        this.#validarVelocidadeAvanco(value);
        this.#velocidadeAvanco = value;
    }

    get comprimentoUsinado() { 
        return this.#comprimentoUsinado; 
    }
    set comprimentoUsinado(value) {
        this.#validarComprimentoUsinado(value);
        this.#comprimentoUsinado = value;
    }

    get numeroPasses() { 
        return this.#numeroPasses; 
    }
    set numeroPasses(value) {
        this.#validarNumeroPasses(value);
        this.#numeroPasses = value;
    }

    get tempoUsinagem() { 
        return this.#tempoUsinagem; 
    }
    set tempoUsinagem(value) {
        this.#validarTempoUsinagem(value);
        this.#tempoUsinagem = value;
    }

    #validarIdProcesso(value) {
        if (value !== null && value !== undefined && value <= 0) throw new Error("Verifique o Id do Processo que foi informado");
    }
    #validarIdPecaFinal(value) {
        if (value && value <= 0) throw new Error("Verifique o Id da Peça Final que foi informado");
    }
    #validarIdMaquina(value) {
        if (value && value <= 0) throw new Error("Verifique o Id da Máquina informado");
    }
    #validarIdParametro(value) {
        if (value && value <= 0) throw new Error("Verifique o Id do Parâmetro que foi informado");
    }

    #validarTipoOperacao(value) {
        if (!value || !Object.values(tipoOperacao).includes(value.trim().toLowerCase())) {
            throw new Error("O Tipo de Operação deve ser obrigatoriamente 'furacao', 'fresamento' ou 'torneamento'.");
        }
    }

    #validarDiametroFerramenta(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) throw new Error("O Diâmetro da Ferramenta, se informado, deve ser um número maior que zero.");
    }

    #validarRpm(value) {
        if (value && (isNaN(Number(value)) || Number(value) % 1 !== 0 || Number(value) <= 0)) throw new Error("O RPM, se informado, deve ser um número INTEIRO e maior que zero");
    }
    #validarVelocidadeAvanco(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) throw new Error("A Velocidade de Avanço, se informada, deve ser numérica e maior que zero");
    }
    #validarComprimentoUsinado(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) throw new Error("O Comprimento Usinado, se informado, deve ser numérico e maior que zero");
    }
    #validarNumeroPasses(value) {
        if (value && (isNaN(Number(value)) || Number(value) % 1 !== 0 || Number(value) <= 0)) throw new Error("O Número de Passes, se informado, deve ser um número INTEIRO e maior que zero");
    }
    #validarTempoUsinagem(value) {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) throw new Error("O Tempo de Usinagem, se informado, deve ser numérico e maior que zero");
    }

    static criar(dados) {
        return new ProcessoUsinagem(dados.idPecaFinal, dados.idMaquina, dados.idParametro, dados.tipoOperacao, dados.diametroFerramenta, dados.rpm, dados.velocidadeAvanco, dados.comprimentoUsinado, dados.numeroPasses, dados.tempoUsinagem, null);
    }
    
    static editar(dados) {
        return new ProcessoUsinagem(dados.idPecaFinal, dados.idMaquina, dados.idParametro, dados.tipoOperacao, dados.diametroFerramenta, dados.rpm, dados.velocidadeAvanco, dados.comprimentoUsinado, dados.numeroPasses, dados.tempoUsinagem, dados.idProcesso);
    }
}