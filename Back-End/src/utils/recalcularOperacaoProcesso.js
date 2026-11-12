import operacaoProcessoRepositories from '../repositories/operacaoProcessoRepositories.js';
import parametroCorteRepositories from '../repositories/parametroCorteRepositories.js';
import operacaoRepositories from '../repositories/operacaoRepositories.js';
import dadosTorneamentoRepositories from '../repositories/dadosTorneamentoRepositories.js';
import dadosFaceamentoRepositories from '../repositories/dadosFaceamentoRepositories.js';
import dadosFuracaoRepositories from '../repositories/dadosFuracaoRepositories.js';
import dadosFresamentoRepositories from '../repositories/dadosFresamentoRepositories.js';
import { calcularRPM, calcularVelocidadeAvanco } from './calculoParametrosCorte.js';
import { calcularTempoUsinagem } from './calculoTempoUsinagem.js';

export async function recalcularOperacaoProcesso(idOperacaoProcesso) {
    const etapaRows = await operacaoProcessoRepositories.selecionarUm(idOperacaoProcesso);
    if (etapaRows.length === 0) throw new Error('Operação do processo não encontrada.');
    const etapa = etapaRows[0];

    const parametroRows = await parametroCorteRepositories.selecionarUm(etapa.idParametro);
    if (parametroRows.length === 0) throw new Error('Parâmetro de corte não encontrado.');
    const parametro = parametroRows[0];

    const operacaoRows = await operacaoRepositories.selecionarUm(parametro.idOperacao);
    if (operacaoRows.length === 0) throw new Error('Tipo de operação não encontrado.');
    const tipoOperacao = operacaoRows[0].tipo;

    const configuracao = {
        torneamento: { repositorio: dadosTorneamentoRepositories, diametro: 'diametroInicial' },
        faceamento: { repositorio: dadosFaceamentoRepositories, diametro: 'diametroFaceamento' },
        furacao: { repositorio: dadosFuracaoRepositories, diametro: 'diametroFuro' },
        fresamento: { repositorio: dadosFresamentoRepositories, diametro: 'diametroFresa' }
    }[tipoOperacao];

    if (!configuracao) throw new Error('Tipo de operação não reconhecido para cálculo.');

    const dadosRows = await configuracao.repositorio.selecionarPorOperacaoProcesso(idOperacaoProcesso);
    if (dadosRows.length === 0) throw new Error('Cadastre os dados específicos da operação antes de calcular.');
    const dados = dadosRows[0];

    const rpm = calcularRPM(parametro.velocidadeCorte, dados[configuracao.diametro]);
    const velocidadeAvancoCalculada = calcularVelocidadeAvanco(
        parametro.avanco,
        parametro.tipoAvanco,
        rpm,
        dados.numeroDentes ?? 1
    );
    const resultadoTempo = calcularTempoUsinagem({
        tipoOperacao,
        velocidadeAvanco: velocidadeAvancoCalculada,
        profundidadeCorte: parametro.profundidadeCorte,
        dados
    });

    await operacaoProcessoRepositories.atualizarCalculos(idOperacaoProcesso, {
        rpmCalculado: rpm,
        velocidadeAvancoCalculada,
        numeroPasses: resultadoTempo.numeroPasses,
        tempoUsinagem: resultadoTempo.tempoMinutos
    });

    return {
        idOperacaoProcesso: Number(idOperacaoProcesso),
        rpmCalculado: rpm,
        velocidadeAvancoCalculada,
        numeroPasses: resultadoTempo.numeroPasses,
        tempoUsinagem: resultadoTempo.tempoMinutos,
        comprimentoTotal: resultadoTempo.comprimentoTotal
    };
}
