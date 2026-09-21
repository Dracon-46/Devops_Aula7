import { defineConfig } from 'vitest/config';

/**
 * Testes unitarios: apenas src/tests/unit.
 *
 * Rodam em ambiente `node` porque nao tocam no DOM - validam so as regras
 * de negocio isoladas. E o conjunto mais rapido, por isso e o primeiro da
 * pipeline.
 */
export default defineConfig({
  test: {
    name: 'unitario',
    include: ['src/tests/unit/**/*.test.{js,jsx}'],
    environment: 'node',
    reporters: ['default', 'junit'],
    outputFile: { junit: 'reports/unit.xml' },
  },
});
