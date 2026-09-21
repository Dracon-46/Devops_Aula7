/**
 * Le relatorios JUnit gerados pelo Vitest e imprime um resumo em Markdown.
 *
 * E o que atende a parte "apresentar os resultados" da Tarefa 07: a pipeline
 * redireciona a saida deste script para $GITHUB_STEP_SUMMARY, entao o
 * resultado dos tres tipos de teste aparece na propria pagina da execucao,
 * sem precisar abrir o log de cada job.
 *
 * Uso:
 *   node scripts/resumo-testes.mjs reports/unit.xml
 *   node scripts/resumo-testes.mjs reports/*.xml --titulo="Resultado consolidado"
 */

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

/** Nome amigavel de cada relatorio, pelo arquivo. */
const ROTULOS = {
  'unit.xml': 'Unitário',
  'integration.xml': 'Integração',
  'performance.xml': 'Performance',
};

/** Extrai o valor de um atributo de uma tag `<testsuites ...>`. */
function atributo(xml, nome) {
  const achado = xml.match(new RegExp(`<testsuites[^>]*\\b${nome}="([^"]*)"`));
  return achado ? achado[1] : null;
}

/** Numero inteiro de um atributo, 0 quando ausente. */
function numero(xml, nome) {
  const valor = atributo(xml, nome);
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : 0;
}

/**
 * Percorre cada `<testcase>` do relatorio.
 *
 * O regex precisa tratar as duas formas que o JUnit usa: a auto-fechada
 * (`<testcase ... />`, quando o caso passou) e a com corpo
 * (`<testcase ...> <failure/> </testcase>`). Tratar so a segunda faz o
 * casamento atravessar varios casos e atribuir a falha ao nome errado.
 */
function casos(xml) {
  const encontrados = [];
  const regex = /<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g;
  let caso;
  while ((caso = regex.exec(xml)) !== null) {
    const atributos = caso[1];
    const corpo = caso[3] ?? '';
    const nome = atributos.match(/\bname="([^"]*)"/);
    encontrados.push({
      nome: nome ? nome[1] : '(sem nome)',
      falhou: /<(failure|error)\b/.test(corpo),
      pulado: /<skipped\b/.test(corpo),
    });
  }
  return encontrados;
}

/** Le um relatorio e devolve os numeros que interessam. */
function lerRelatorio(caminho) {
  const xml = readFileSync(caminho, 'utf-8');
  const arquivo = basename(caminho);

  const lista = casos(xml);
  const total = numero(xml, 'tests') || lista.length;
  const erros = numero(xml, 'failures') + numero(xml, 'errors');
  const pulados = lista.filter((c) => c.pulado).length;

  return {
    tipo: ROTULOS[arquivo] ?? arquivo,
    total,
    passou: total - erros - pulados,
    erros,
    pulados,
    tempo: Number(atributo(xml, 'time') ?? 0),
    falhas: lista.filter((c) => c.falhou).map((c) => c.nome),
  };
}

function principal() {
  const argumentos = process.argv.slice(2);
  const tituloArg = argumentos.find((a) => a.startsWith('--titulo='));
  const titulo = tituloArg ? tituloArg.split('=').slice(1).join('=') : null;
  const caminhos = argumentos.filter((a) => !a.startsWith('--'));

  if (caminhos.length === 0) {
    console.error('Informe ao menos um relatorio JUnit.');
    process.exitCode = 1;
    return;
  }

  const linhas = [];
  const relatorios = [];

  for (const caminho of caminhos) {
    try {
      relatorios.push(lerRelatorio(caminho));
    } catch {
      linhas.push(`> Relatório não encontrado: \`${caminho}\``);
    }
  }

  if (titulo) {
    linhas.push(`## ${titulo}`, '');
  }

  linhas.push(
    '| Tipo de teste | Situação | Testes | Passaram | Falharam | Tempo |',
    '| --- | --- | ---: | ---: | ---: | ---: |',
  );

  for (const r of relatorios) {
    const situacao = r.erros > 0 ? '❌ falhou' : '✅ passou';
    linhas.push(
      `| ${r.tipo} | ${situacao} | ${r.total} | ${r.passou} | ${r.erros} | ${r.tempo.toFixed(2)}s |`,
    );
  }

  const totais = relatorios.reduce(
    (acc, r) => ({
      total: acc.total + r.total,
      erros: acc.erros + r.erros,
      tempo: acc.tempo + r.tempo,
    }),
    { total: 0, erros: 0, tempo: 0 },
  );

  if (relatorios.length > 1) {
    linhas.push(
      `| **Total** | ${totais.erros > 0 ? '❌' : '✅'} | **${totais.total}** | **${totais.total - totais.erros}** | **${totais.erros}** | **${totais.tempo.toFixed(2)}s** |`,
    );
  }

  const comFalha = relatorios.filter((r) => r.falhas.length > 0);
  if (comFalha.length > 0) {
    linhas.push('', '### Casos que falharam', '');
    for (const r of comFalha) {
      for (const nome of r.falhas) {
        linhas.push(`- **${r.tipo}**: ${nome}`);
      }
    }
  }

  console.log(linhas.join('\n'));
}

principal();
