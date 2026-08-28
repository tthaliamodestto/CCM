import { formato } from "../enums/forma.js";

export class PecaBruta {
    #idPeca;
    #idMaterial;
    #nome;
    #forma;
    #comprimento;
    #diametro;
    #largura;
    #altura;

    constructor(pIdMaterial, pNome, pForma, pComprimento, pDiametro, pLargura, pAltura, pIdPeca) {
        this.idMaterial = pIdMaterial;
        this.nome = pNome;
        this.forma = pForma;
        this.comprimento = pComprimento;
        this.diametro = pDiametro;
        this.largura = pLargura;
        this.altura = pAltura;
        this.idPeca = pIdPeca;
    }

    get idPeca() { 
        return this.#idPeca; 
    }
    set idPeca(value) {
        this.#validarIdPeca(value);
        this.#idPeca = value;
    }

    get idMaterial() { 
        return this.#idMaterial; 
    }
    set idMaterial(value) {
        this.#validarIdMaterial(value);
        this.#idMaterial = value;
    }

    get nome() { 
        return this.#nome; 
    }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get forma() { 
        return this.#forma; 
    }
    set forma(value) {
        this.#validarForma(value);
        this.#forma = value;
    }

    get comprimento() { 
        return this.#comprimento; 
    }
    set comprimento(value) {
        this.#validarComprimento(value);
        this.#comprimento = value;
    }

    get diametro() { 
        return this.#diametro; 
    }
    set diametro(value) {
        if (this.#forma === formato.PRISMA) {
            this.#diametro = null;
        }
        this.#validarDiametro(value);
        this.#diametro = value ? Number(value) : null;
    }

    get largura() { 
        return this.#largura; 
    }
    set largura(value) {
        if (this.#forma === formato.CILINDRO) {
            this.#largura = null;
        }
        this.#validarLargura(value);
        this.#largura = value ? Number(value) : null;
    }

    get altura() { 
        return this.#altura; 
    }
    set altura(value) {
        if (this.#forma === formato.CILINDRO) {
            this.#altura = null;
        }
        this.#validarAltura(value);
        this.#altura = value ? Number(value) : null;
    }

    #validarIdPeca(value) {
        if (value && value <= 0) throw new Error("Verifique o Id da Peça informada.");
    }

    #validarIdMaterial(value) {
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
            throw new Error("Verifique o Id do Material associado.");
        }
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error("O Nome da peça deve ter entre 3 e 100 caracteres.");
        }
    }

    #validarForma(value) {
        if (!value || !Object.values(formato).includes(value.trim().toLowerCase())) {
            throw new Error("A forma geométrica deve ser obrigatoriamente 'cilindro' ou 'prisma'.");
        }
    }

    #validarComprimento(value) {
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
            throw new Error("O comprimento é obrigatório e deve ser um número maior que zero.");
        }
    }

    #validarDiametro(value) {
        if (this.#forma === formato.CILINDRO) {
            if (!value || isNaN(Number(value)) || Number(value) <= 0) {
                throw new Error("Para peças em forma de 'cilindro', o diâmetro é obrigatório e deve ser maior que zero.");
            }
        }
    }

    #validarLargura(value) {
        if (this.#forma === formato.PRISMA) {
            if (!value || isNaN(Number(value)) || Number(value) <= 0) {
                throw new Error("Para peças em forma de 'prisma', a largura é obrigatória e deve ser maior que zero.");
            }
        }
    }

    #validarAltura(value) {
        if (this.#forma === formato.PRISMA) {
            if (!value || isNaN(Number(value)) || Number(value) <= 0) {
                throw new Error("Para peças em forma de 'prisma', a altura é obrigatória e deve ser maior que zero.");
            }
        }
    }

    static criar(dados) { 
        return new PecaBruta(dados.idMaterial, dados.nome, dados.forma, dados.comprimento, dados.diametro, dados.largura, dados.altura, null); 
    }

    static editar(dados) { 
        return new PecaBruta(dados.idMaterial, dados.nome, dados.forma, dados.comprimento, dados.diametro, dados.largura, dados.altura, dados.idPeca); 
    }
}