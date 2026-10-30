import { calcularCustoTotal } from "../utils/calculoCusto.js";

export class Custo {
    #idCusto;
    #idProcesso;
    #custoMaterial;
    #custoMaquina;

    constructor(pIdProcesso, pCustoMaterial, pCustoMaquina, pIdCusto) {
        this.idProcesso = pIdProcesso;
        this.custoMaterial = pCustoMaterial;
        this.custoMaquina = pCustoMaquina;
        this.idCusto = pIdCusto;
    }

    get idCusto() {
        return this.#idCusto;
    }
    set idCusto(value) {
        this.#validarIdCusto(value);
        this.#idCusto = value;
    }

    get idProcesso() {
        return this.#idProcesso;
    }
    set idProcesso(value) {
        this.#validarIdProcesso(value);
        this.#idProcesso = Number(value);
    }

    get custoMaterial() {
        return this.#custoMaterial;
    }
    set custoMaterial(value) {
        this.#validarValor(value, "O custo do material");
        this.#custoMaterial = Number(value);
    }

    get custoMaquina() {
        return this.#custoMaquina;
    }
    set custoMaquina(value) {
        this.#validarValor(value, "O custo da máquina");
        this.#custoMaquina = Number(value);
    }

    // Calculado a partir dos dois custos, nunca informado de fora
    get custoTotal() {
        return calcularCustoTotal(this.#custoMaterial, this.#custoMaquina);
    }

    #validarIdCusto(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
            throw new Error("Verifique o Id do Custo informado.");
        }
    }

    #validarIdProcesso(value) {
        if (!value || !Number.isInteger(Number(value)) || Number(value) <= 0) {
            throw new Error("Verifique o Id do Processo de Usinagem informado.");
        }
    }

    #validarValor(value, campo) {
        if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) < 0) {
            throw new Error(`${campo} deve ser um número maior ou igual a zero.`);
        }
    }

    static criar(dados) {
        return new Custo(dados.idProcesso, dados.custoMaterial, dados.custoMaquina, null);
    }

    static editar(dados) {
        return new Custo(dados.idProcesso, dados.custoMaterial, dados.custoMaquina, dados.idCusto);
    }
}