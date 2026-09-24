import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // Forward API calls to the gateway so the browser sees one origin:
      // no CORS setup is needed and the HttpOnly login cookie just works.
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'es2022',
      sourcemap: false,
      rolldownOptions: {
        output: {
          // Libraries change less often than our code. Keeping them in their own
          // files means an app update doesn't make browsers download React again.
          codeSplitting: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 3 },
              { name: 'router', test: /node_modules[\\/]react-router[\\/]/, priority: 2 },
              { name: 'http', test: /node_modules[\\/]axios[\\/]/, priority: 1 },
            ],
          },
        },
      },
    },
  }
})
