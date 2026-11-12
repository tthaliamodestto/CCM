export class Cliente {
    #idCliente;
    #nome;
    #email;
    #senha;
    #tipoUsuario;

    constructor(pNome, pEmail, pSenha, pTipoUsuario = 'operador', pIdCliente = null) {
        this.nome = pNome;
        this.email = pEmail;
        this.senha = pSenha;
        this.tipoUsuario = pTipoUsuario;
        this.idCliente = pIdCliente;
    }

    get idCliente() { return this.#idCliente; }
    set idCliente(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
            throw new Error('ID do cliente inválido.');
        }
        this.#idCliente = value === null || value === undefined ? null : Number(value);
    }

    get nome() { return this.#nome; }
    set nome(value) {
        if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error('O nome deve ter entre 3 e 100 caracteres.');
        }
        this.#nome = value.trim();
    }

    get email() { return this.#email; }
    set email(value) {
        if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || value.trim().length > 100) {
            throw new Error('E-mail inválido.');
        }
        this.#email = value.trim().toLowerCase();
    }

    get senha() { return this.#senha; }
    set senha(value) {
        if (value === null || value === undefined || value === '') {
            this.#senha = null;
            return;
        }
        if (typeof value !== 'string' || value.length < 8 || value.length > 255) {
            throw new Error('A senha deve ter entre 8 e 255 caracteres.');
        }
        this.#senha = value;
    }

    get tipoUsuario() { return this.#tipoUsuario; }
    set tipoUsuario(value) {
        const tiposValidos = ['administrador', 'operador', 'financeiro'];
        const tipo = typeof value === 'string' ? value.trim().toLowerCase() : '';
        if (!tiposValidos.includes(tipo)) {
            throw new Error("Tipo de usuário inválido: use 'administrador', 'operador' ou 'financeiro'.");
        }
        this.#tipoUsuario = tipo;
    }

    static criar(dados) {
        if (!dados.senha) throw new Error('A senha é obrigatória.');
        return new Cliente(dados.nome, dados.email, dados.senha, dados.tipoUsuario ?? 'operador', null);
    }

    static editar(dados) {
        return new Cliente(dados.nome, dados.email, dados.senha ?? null, dados.tipoUsuario, dados.idCliente);
    }
}
