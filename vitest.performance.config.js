import { defineConfig } from 'vitest/config';

/**
 * Testes de performance: apenas src/tests/performance.
 *
 * Ambiente `node` e execucao serializada (um worker so): medicao de
 * tempo fica instavel quando varios workers disputam CPU no runner. Sem
 * isso o teste falha de forma intermitente na pipeline.
 */
export default defineConfig({
  test: {
    name: 'performance',
    include: ['src/tests/performance/**/*.test.{js,jsx}'],
    environment: 'node',
    pool: 'forks',
    fileParallelism: false,
    maxWorkers: 1,
    reporters: ['default', 'junit'],
    outputFile: { junit: 'reports/performance.xml' },
  },
});
