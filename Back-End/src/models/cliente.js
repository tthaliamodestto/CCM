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
            throw new Error("ID do cliente inválido.");
        }
        this.#idCliente = value ? Number(value) : null;
    }

    get nome() { return this.#nome; }
    set nome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error("O nome deve ter entre 3 e 100 caracteres.");
        }
        this.#nome = value.trim();
    }

    get email() { return this.#email; }
    set email(value) {
        if (!value || !value.includes('@')) {
            throw new Error("E-mail inválido.");
        }
        this.#email = value.trim();
    }

    get senha() { return this.#senha; }
    set senha(value) {
        if (!value || value.length < 8) {
            throw new Error("A senha deve ter pelo menos 8 caracteres.");
        }
        this.#senha = value;
    }

    get tipoUsuario() { return this.#tipoUsuario; }
    set tipoUsuario(value) {
        const tiposValidos = ['administrador', 'operador', 'instrutor'];
        if (!tiposValidos.includes(value)) {
            throw new Error("Tipo de usuário inválido.");
        }
        this.#tipoUsuario = value;
    }

    static criar(dados) {
        return new Cliente(dados.nome, dados.email, dados.senha, dados.tipoUsuario, null);
    }

    static editar(dados) {
        return new Cliente(dados.nome, dados.email, dados.senha, dados.tipoUsuario, dados.idCliente);
    }
}