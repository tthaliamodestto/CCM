export class PecaFinal {
    #idPecaFinal;
    #idPeca;
    #nome;
    #profundidadeFinal;
    #alturaFinal;
    #diametroFinal;
    #larguraFinal;
    #imagem;

    constructor(pIdPeca, pNome, pProfundidadeFinal, pAlturaFinal, pDiametroFinal, pLarguraFinal, pIdPecaFinal, pImagem) {
        this.idPeca = pIdPeca;
        this.nome = pNome;
        this.profundidadeFinal = pProfundidadeFinal;
        this.alturaFinal = pAlturaFinal;
        this.diametroFinal = pDiametroFinal;
        this.larguraFinal = pLarguraFinal;
        this.imagem = pImagem;
        this.idPecaFinal = pIdPecaFinal;
    }

    get idPecaFinal() { return this.#idPecaFinal; }
    set idPecaFinal(value) {
        this.#validarId(value, "Peça Final");
        this.#idPecaFinal = value;
    }

    get idPeca() { return this.#idPeca; }
    set idPeca(value) {
        this.#validarId(value, "Peça");
        this.#idPeca = value;
    }

    get nome() {
        return this.#nome;
    }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get profundidadeFinal() {
        return this.#profundidadeFinal;
    }
    set profundidadeFinal(value) {
        this.#validarProfundidadeFinal(value);
        this.#profundidadeFinal = value ? Number(value) : null;
    }

    get alturaFinal() {
        return this.#alturaFinal;
    }
    set alturaFinal(value) {
        this.#validarAlturaFinal(value);
        this.#alturaFinal = value ? Number(value) : null;
    }

    get diametroFinal() {
        return this.#diametroFinal;
    }
    set diametroFinal(value) {
        this.#validarDiametroFinal(value);
        this.#diametroFinal = value ? Number(value) : null;
    }

    get larguraFinal() {
        return this.#larguraFinal;
    }
    set larguraFinal(value) {
        this.#validarLarguraFinal(value);
        this.#larguraFinal = value ? Number(value) : null;
    }

    get imagem() {
        return this.#imagem;
    }
    set imagem(value) {
        this.#imagem = value;
    }

    #validarId(value, nomeCampo) {
        if (value !== null && value !== undefined && value <= 0) {
            throw new Error(`Verifique o Id da ${nomeCampo} informado.`);
        }
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error("O Nome da peça final deve ter entre 3 e 100 caracteres.");
        }
    }

    #validarProfundidadeFinal(value) {
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
            throw new Error("A profundidade final, se informada, deve ser um número válido maior ou igual a zero.");
        }
    }

    #validarAlturaFinal(value) {
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
            throw new Error("A altura final, se informada, deve ser um número válido maior ou igual a zero.");
        }
    }

    #validarDiametroFinal(value) {
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
            throw new Error("O diâmetro final, se informado, deve ser um número válido maior ou igual a zero.");
        }
    }

    #validarLarguraFinal(value) {
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
            throw new Error("A largura final, se informada, deve ser um número válido maior ou igual a zero.");
        }
    }

    #validarImagem(value) {
        if (value) {
            if(value.string < 3){
                throw new Error('O campo imagem não pode ficar vazio')
            }
            
        }
    }

    static criar(dados) {
        return new PecaFinal(dados.idPeca, dados.nome, dados.profundidadeFinal, dados.alturaFinal, dados.diametroFinal, dados.larguraFinal, dados.imagem, null);
    }

    static editar(dados) {
        return new PecaFinal(dados.idPeca, dados.nome, dados.profundidadeFinal, dados.alturaFinal, dados.diametroFinal, dados.larguraFinal, dados.imagem, dados.idPecaFinal);
    }
}