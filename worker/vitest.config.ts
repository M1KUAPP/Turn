import { cloudflareTest } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.jsonc' },
      // Made-up secrets, which win over any real ones in `.dev.vars` or the shell.
      miniflare: {
        bindings: { TYPESAFE_API_KEY: 'test-typesafe-key', RC_SECRET_KEY: 'test-rc-key', ID_SALT: 'test-salt' }
      }
    })
  ],
  test: { setupFiles: ['./test/setup.ts'] }
})
