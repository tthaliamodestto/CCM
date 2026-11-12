import { formato } from "../enums/forma.js";

export class PecaBruta {
    #idPeca;
    #idMaterial;
    #idCliente;
    #nome;
    #forma;
    #comprimento;
    #diametro;
    #largura;
    #altura;

    constructor(pIdMaterial, pIdCliente, pNome, pForma, pComprimento, pDiametro, pLargura, pAltura, pIdPeca) {
        this.idMaterial = pIdMaterial;
        this.idCliente = pIdCliente;
        this.nome = pNome;
        this.forma = pForma;
        this.comprimento = pComprimento;
        this.diametro = pDiametro;
        this.largura = pLargura;
        this.altura = pAltura;
        this.idPeca = pIdPeca;
    }

    get idPeca() { return this.#idPeca; }
    set idPeca(value) {
        this.#validarIdPeca(value);
        this.#idPeca = value === null || value === undefined ? null : Number(value);
    }

    get idMaterial() { return this.#idMaterial; }
    set idMaterial(value) {
        this.#validarIdMaterial(value);
        this.#idMaterial = Number(value);
    }

    get idCliente() { return this.#idCliente; }
    set idCliente(value) {
        this.#validarIdCliente(value);
        this.#idCliente = Number(value);
    }

    get nome() { return this.#nome; }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get forma() { return this.#forma; }
    set forma(value) {
        this.#validarForma(value);
        this.#forma = value.trim().toLowerCase();
    }

    get comprimento() { return this.#comprimento; }
    set comprimento(value) {
        this.#validarComprimento(value);
        this.#comprimento = Number(value);
    }

    get diametro() { return this.#diametro; }
    set diametro(value) {
        if (this.#forma === formato.PRISMA) {
            this.#diametro = null;
            return;
        }
        this.#validarDiametro(value);
        this.#diametro = value === null || value === undefined || value === "" ? null : Number(value);
    }

    get largura() { return this.#largura; }
    set largura(value) {
        if (this.#forma === formato.CILINDRO) {
            this.#largura = null;
            return;
        }
        this.#validarLargura(value);
        this.#largura = value === null || value === undefined || value === "" ? null : Number(value);
    }

    get altura() { return this.#altura; }
    set altura(value) {
        if (this.#forma === formato.CILINDRO) {
            this.#altura = null;
            return;
        }
        this.#validarAltura(value);
        this.#altura = value === null || value === undefined || value === "" ? null : Number(value);
    }

    #validarIdPeca(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
            throw new Error("Verifique o Id da Peça informada.");
        }
    }

    #validarIdMaterial(value) {
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
            throw new Error("Verifique o Id do Material associado.");
        }
    }

    #validarIdCliente(value) {
        if (!value || !Number.isInteger(Number(value)) || Number(value) <= 0) {
            throw new Error("Verifique o Id do Cliente associado.");
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
        return new PecaBruta(dados.idMaterial, dados.idCliente, dados.nome, dados.forma, dados.comprimento, dados.diametro, dados.largura, dados.altura, null); 
    }

    static editar(dados) { 
        return new PecaBruta(dados.idMaterial, dados.idCliente, dados.nome, dados.forma, dados.comprimento, dados.diametro, dados.largura, dados.altura, dados.idPeca); 
    }
}