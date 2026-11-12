
export class MaterialPeca {
    #idMaterial;
    #nome;
    #densidade;
    #custoPerKg;
    #imagem;

    constructor(pNome, pDensidade, pCustoPerKg, pIdMaterial, pImagem) {
        this.nome = pNome;
        this.densidade = pDensidade;
        this.custoPerKg = pCustoPerKg;
        this.imagem = pImagem;
        this.idMaterial = pIdMaterial;
    }

    get idMaterial() { 
        return this.#idMaterial; 
    }
    set idMaterial(value) {
        this.#validarIdMaterial(value);
        this.#idMaterial = value === null || value === undefined ? null : Number(value);
    }

    get nome() { 
        return this.#nome; 
    }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value.trim();
    }

    get densidade() { 
        return this.#densidade; 
    }
    set densidade(value) {
        this.#validarDensidade(value);
        this.#densidade = Number(value);
    }

    get custoPerKg() { 
        return this.#custoPerKg; 
    }
    set custoPerKg(value) {
        this.#validarCustoPerKg(value);
        this.#custoPerKg = Number(value);
    }

    get imagem() { 
        return this.#imagem; 
    }
    set imagem(value) {
        this.#validarImagem(value);
        this.#imagem = value ?? null;
    }

    #validarIdMaterial(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
            throw new Error('Verifique o Id do Material informado.');
        }
    }

    #validarNome(value) {
        if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error('O nome do material deve ter entre 3 e 100 caracteres.');
        }
    }

    #validarDensidade(value) {
        if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) || Number(value) <= 0) {
            throw new Error('A densidade deve ser maior que zero.');
        }
    }

    #validarCustoPerKg(value) {
        if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) || Number(value) < 0) {
            throw new Error('O custo por kg não pode ser negativo.');
        }
    }

    #validarImagem(value) {
        if (value !== null && value !== undefined && (typeof value !== 'string' || value.length > 255)) {
            throw new Error('A imagem deve ser um caminho com no máximo 255 caracteres.');
        }
    }

    static criar(dados) {
        return new MaterialPeca(dados.nome, dados.densidade, dados.custoPerKg, null, dados.imagem);
    }

    static editar(dados) {
        return new MaterialPeca(dados.nome, dados.densidade, dados.custoPerKg, dados.idMaterial, dados.imagem);
    }
}
