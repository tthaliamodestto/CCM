export class Orcamento {
    #id;
    #material;
    #peso;
    #tempo;
    #total;

    constructor(pMaterial, pPeso, pTempo, pTotal, pId) {
        this.material = pMaterial;
        this.peso = pPeso;
        this.tempo = pTempo;
        this.total = pTotal;
        this.id = pId;
    }

    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get material() { return this.#material; }
    set material(value) { 
        if (!value) throw new Error('Material é obrigatório');
        this.#material = value; 
    }

    get peso() { return this.#peso; }
    set peso(value) { this.#peso = value; }

    get tempo() { return this.#tempo; }
    set tempo(value) { this.#tempo = value; }

    get total() { return this.#total; }
    set total(value) { this.#total = value; }

    static criar(dados) {
        return new Orcamento(dados.material, dados.peso, dados.tempo, dados.total, null);
    }
}