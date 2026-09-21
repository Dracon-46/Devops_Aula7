import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Testes de integracao: apenas src/tests/integration.
 *
 * Precisam de `jsdom` e do plugin do React porque renderizam o componente
 * de verdade e simulam a interacao do usuario (digitar o valor, clicar no
 * botao) - ou seja, exercitam componente + servico juntos.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    name: 'integracao',
    include: ['src/tests/integration/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    reporters: ['default', 'junit'],
    outputFile: { junit: 'reports/integration.xml' },
  },
});
