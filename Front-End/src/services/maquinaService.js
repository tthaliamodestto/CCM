const API_URL = 'http://localhost:8000/maquina';

let maquinasLocais = [];

// Função auxiliar para extrair o ID independente do nome retornado pelo banco
const extrairId = (obj) => {
  if (!obj) return null;
  return obj.id ?? obj.id_maquina ?? obj._id ?? obj.idMaquina ?? null;
};

export const maquinaService = {
  cadastrar: async (dados) => {
    const potencia = dados.potenciaKw !== undefined && dados.potenciaKw !== "" ? Number(dados.potenciaKw) : 0;
    const custoH = dados.custoHora !== undefined && dados.custoHora !== "" ? Number(dados.custoHora) : 0;
    const tarifa = dados.tarifaCpfl !== undefined && dados.tarifaCpfl !== "" ? Number(dados.tarifaCpfl) : 0.72;
    const tempo = dados.tempoOperacao !== undefined && dados.tempoOperacao !== "" ? Number(dados.tempoOperacao) : 2;
    const statusVal = dados.status || "Normal";
    const nomeVal = dados.nome ? String(dados.nome).trim() : "Máquina Cadastrada";
    const tipoVal = dados.tipo || "Torno CNC";

    try {
      const formData = new FormData();

      formData.append("nome", nomeVal);
      formData.append("nomeMaquina", nomeVal);
      formData.append("tipo", tipoVal);
      formData.append("status", statusVal);

      formData.append("potenciaKw", potencia);
      formData.append("custoHora", custoH);
      formData.append("tarifaCpfl", tarifa);
      formData.append("tempoOperacao", tempo);

      formData.append("potencia_kw", potencia);
      formData.append("custo_hora", custoH);
      formData.append("tarifa_cpfl", tarifa);
      formData.append("tempo_operacao", tempo);
      formData.append("potencialKw", potencia);

      // Envia o arquivo da imagem
      if (dados.imagem) {
        formData.append("image", dados.imagem);
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error("Erro no servidor ao cadastrar.");
      }

      const resultado = await response.json();
      console.log("RESPOSTA DO CADASTRO DE MÁQUINA:", resultado);

      const idGerado =
        resultado?.result?.insertId ??
        extrairId(resultado) ??
        String(Date.now());

      const maquinaCriada = {
        ...resultado,
        id: idGerado,
        nome: nomeVal,
        nomeMaquina: nomeVal,
        tipo: tipoVal,
        status: statusVal,
        potenciaKw: potencia,
        custoHora: custoH,
        tarifaCpfl: tarifa,
        tempoOperacao: tempo,
        imagem: resultado?.result?.imagem ?? resultado?.imagem ?? null
      };
      
      console.log("MÁQUINA CRIADA NO FRONT:", maquinaCriada);

      maquinasLocais.unshift(maquinaCriada);

      return maquinaCriada;

    } catch (error) {
      console.warn(
        "API offline/erro. Cadastrando localmente no Front:",
        error.message
      );

      const novaMaquinaLocal = {
        id: String(Date.now()),
        nome: nomeVal,
        nomeMaquina: nomeVal,
        tipo: tipoVal,
        status: statusVal,
        imagem: null,
        potenciaKw: potencia,
        custoHora: custoH,
        tarifaCpfl: tarifa,
        tempoOperacao: tempo
      };

      maquinasLocais.unshift(novaMaquinaLocal);

      return novaMaquinaLocal;
    }
  },

  deletar: async (id) => {
    if (!id && id !== 0) {
      throw new Error("ID inválido fornecido para exclusão.");
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(
          `Servidor recusou a exclusão. Status: ${response.status}`
        );
      }

      // Remove da memória local apenas após confirmação do backend
      maquinasLocais = maquinasLocais.filter(
        (m) => String(extrairId(m)) !== String(id)
      );

      return true;

    } catch (error) {
      console.error(
        "Falha ao deletar máquina no banco de dados:",
        error.message
      );

      // Lança o erro para que o componente maquina.jsx saiba que falhou
      throw error;
    }
  },

  selecionar: async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Erro ao buscar máquinas.");
      }

      const dados = await response.json();

      let lista = [];

      if (Array.isArray(dados)) {
        lista = dados;
      } else if (Array.isArray(dados.result)) {
        lista = dados.result;
      } else if (Array.isArray(dados.data)) {
        lista = dados.data;
      } else if (Array.isArray(dados.content)) {
        lista = dados.content;
      }

      if (lista.length > 0) {
        maquinasLocais = lista;
        return lista;
      }

      return maquinasLocais;

    } catch (error) {
      console.error(
        "Erro ao listar máquinas:",
        error.message
      );

      return maquinasLocais;
    }
  },

  listar: async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Erro ao buscar máquinas.");
      }

      const dados = await response.json();
      console.log("RESPOSTA COMPLETA DA API (listar):", dados);

      if (Array.isArray(dados)) {
        maquinasLocais = dados;
        return dados;
      }

      if (Array.isArray(dados.result)) {
        maquinasLocais = dados.result;
        console.log("MÁQUINAS COM IMAGEM (listar):", dados.result);
        return dados.result;
      }

      if (Array.isArray(dados.data)) {
        maquinasLocais = dados.data;
        return dados.data;
      }

      if (Array.isArray(dados.content)) {
        maquinasLocais = dados.content;
        return dados.content;
      }

      return maquinasLocais;

    } catch (error) {
      console.error(
        "Erro ao listar máquinas:",
        error.message
      );

      return maquinasLocais;
    }
  }
};