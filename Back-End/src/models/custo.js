import { calcularCustoTotal } from '../utils/calculoCusto.js';

export class Custo {
    #idCusto;
    #idProcesso;
    #custoMaterial;
    #custoMaquina;
    #tarifaEnergiaAplicada;

    constructor(pIdProcesso, pCustoMaterial, pCustoMaquina, pIdCusto, pTarifaEnergiaAplicada = null) {
        this.idProcesso = pIdProcesso;
        this.custoMaterial = pCustoMaterial;
        this.custoMaquina = pCustoMaquina;
        this.idCusto = pIdCusto;
        this.tarifaEnergiaAplicada = pTarifaEnergiaAplicada;
    }

    get idCusto() { return this.#idCusto; }
    set idCusto(value) {
        if (value !== null && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
            throw new Error('Verifique o Id do Custo informado.');
        }
        this.#idCusto = value === null || value === undefined ? null : Number(value);
    }

    get idProcesso() { return this.#idProcesso; }
    set idProcesso(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
            throw new Error('Verifique o Id do Processo de Usinagem informado.');
        }
        this.#idProcesso = Number(value);
    }

    get custoMaterial() { return this.#custoMaterial; }
    set custoMaterial(value) {
        this.#validarValor(value, 'O custo do material');
        this.#custoMaterial = Number(value);
    }

    get custoMaquina() { return this.#custoMaquina; }
    set custoMaquina(value) {
        this.#validarValor(value, 'O custo da máquina');
        this.#custoMaquina = Number(value);
    }

    get tarifaEnergiaAplicada() { return this.#tarifaEnergiaAplicada; }
    set tarifaEnergiaAplicada(value) {
        if (value === null || value === undefined || value === '') {
            this.#tarifaEnergiaAplicada = null;
            return;
        }
        if (!Number.isFinite(Number(value)) || Number(value) < 0) {
            throw new Error('A tarifa de energia deve ser maior ou igual a zero.');
        }
        this.#tarifaEnergiaAplicada = Number(value);
    }

    get custoTotal() {
        return calcularCustoTotal(this.#custoMaterial, this.#custoMaquina);
    }

    #validarValor(value, campo) {
        if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) || Number(value) < 0) {
            throw new Error(`${campo} deve ser um número maior ou igual a zero.`);
        }
    }

    static criar(dados) {
        return new Custo(dados.idProcesso, dados.custoMaterial, dados.custoMaquina, null, dados.tarifaEnergiaAplicada);
    }

    static editar(dados) {
        return new Custo(dados.idProcesso, dados.custoMaterial, dados.custoMaquina, dados.idCusto, dados.tarifaEnergiaAplicada);
    }
}
