import { formato } from "../enums/forma.js";

export class PecaFinal {
    #idPecaFinal;
    #nome;
    #forma;
    #comprimentoFinal;
    #diametroMaximoFinal;
    #larguraFinal;
    #alturaFinal;
    #imagem;

    constructor(pNome, pForma, pComprimentoFinal, pDiametroMaximoFinal, pLarguraFinal, pAlturaFinal, pImagem, pIdPecaFinal) {
        this.nome = pNome;
        this.forma = pForma;
        this.comprimentoFinal = pComprimentoFinal;
        this.diametroMaximoFinal = pDiametroMaximoFinal;
        this.larguraFinal = pLarguraFinal;
        this.alturaFinal = pAlturaFinal;
        this.imagem = pImagem;
        this.idPecaFinal = pIdPecaFinal;
    }

    get idPecaFinal() { return this.#idPecaFinal; }
    set idPecaFinal(value) {
        this.#validarIdPecaFinal(value);
        this.#idPecaFinal = value === null || value === undefined ? null : Number(value);
    }

    get nome() { return this.#nome; }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value.trim();
    }

    get forma() { return this.#forma; }
    set forma(value) {
        this.#validarForma(value);
        this.#forma = value.trim().toLowerCase();
    }

    get comprimentoFinal() { return this.#comprimentoFinal; }
    set comprimentoFinal(value) {
        this.#validarDimensao(value, "O comprimento final");
        this.#comprimentoFinal = Number(value);
    }

    get diametroMaximoFinal() { return this.#diametroMaximoFinal; }
    set diametroMaximoFinal(value) {
        if (this.#forma === formato.PRISMA) {
            this.#diametroMaximoFinal = 0;
            return;
        }
        this.#validarDimensao(value, "O diâmetro máximo final");
        this.#diametroMaximoFinal = Number(value);
    }

    get larguraFinal() { return this.#larguraFinal; }
    set larguraFinal(value) {
        if (this.#forma === formato.CILINDRO) {
            this.#larguraFinal = 0;
            return;
        }
        this.#validarDimensao(value, "A largura final");
        this.#larguraFinal = Number(value);
    }

    get alturaFinal() { return this.#alturaFinal; }
    set alturaFinal(value) {
        if (this.#forma === formato.CILINDRO) {
            this.#alturaFinal = 0;
            return;
        }
        this.#validarDimensao(value, "A altura final");
        this.#alturaFinal = Number(value);
    }

    get imagem() { return this.#imagem; }
    set imagem(value) {
        this.#validarImagem(value);
        this.#imagem = value === null || value === undefined ? null : value;
    }

    #validarIdPecaFinal(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
            throw new Error("O Id da peça final deve ser um inteiro maior que zero.");
        }
    }

    #validarNome(value) {
        if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error("O nome da peça final deve ter entre 3 e 100 caracteres.");
        }
    }

    #validarForma(value) {
        if (typeof value !== 'string' || !Object.values(formato).includes(value.trim().toLowerCase())) {
            throw new Error("A forma deve ser 'cilindro' ou 'prisma'.");
        }
    }

    #validarDimensao(value, campo) {
        if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) || Number(value) <= 0) {
            throw new Error(`${campo} deve ser maior que zero.`);
        }
    }

    #validarImagem(value) {
        if (value !== null && value !== undefined && (typeof value !== 'string' || value.length > 255)) {
            throw new Error("A imagem deve ser um caminho com no máximo 255 caracteres.");
        }
    }

    static criar(dados) {
        return new PecaFinal(dados.nome, dados.forma, dados.comprimentoFinal, dados.diametroMaximoFinal, dados.larguraFinal, dados.alturaFinal, dados.imagem, null);
    }

    static editar(dados) {
        return new PecaFinal(dados.nome, dados.forma, dados.comprimentoFinal, dados.diametroMaximoFinal, dados.larguraFinal, dados.alturaFinal, dados.imagem, dados.idPecaFinal);
    }
}
