import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      // Definimos qué tan atrás queremos llegar en la compatibilidad
      targets: ['defaults', 'not IE 11', 'edge 18'], 
      // Polyfills necesarios para que React y Plotly no rompan
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  // Importante para que el build sea compatible
  build: {
    target: 'es2015'
  }
})