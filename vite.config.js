import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` precisa bater com o nome do repositorio para o GitHub Pages
// resolver os assets corretamente em /Devops_Aula7/.
export default defineConfig({
  plugins: [react()],
  base: '/Devops_Aula7/',
});
