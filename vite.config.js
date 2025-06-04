import { defineConfig } from 'vite';
import monacoEditorPluginImport from 'vite-plugin-monaco-editor';
const monacoEditorPlugin = monacoEditorPluginImport.default || monacoEditorPluginImport

export default defineConfig({
    base: '/thiago-ai-editor/', 
  plugins: [monacoEditorPlugin({customDistPath : (root, buildOutDir, base) => `${buildOutDir}/monacoeditorwork`})],
});