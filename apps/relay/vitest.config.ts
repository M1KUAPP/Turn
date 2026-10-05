import { cloudflareTest } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vitest/config'
import { unstable_readConfig } from 'wrangler'

/**
 * The committed vars, set again for the tests, since Wrangler would otherwise take a var of the same name from the
 * shell, `.env`, or `.dev.vars`, and the tests would check whatever those hold.
 */
const { vars } = unstable_readConfig({ config: './wrangler.jsonc' })

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.jsonc' },
      miniflare: {
        bindings: {
          ...vars,
          // Made-up secrets, which win over any real ones in `.dev.vars` or the shell.
          TYPESAFE_API_KEY: 'test-typesafe-key',
          RC_SECRET_KEY: 'test-rc-key',
          ID_SALT: 'test-salt',
          // Wrong on purpose: the SDK reads these from `process.env` for any option the relay's code leaves out, so
          // the contract and log tests fail if it ever does.
          TYPESAFE_BASE_URL: 'https://stray.invalid',
          TYPESAFE_DEFAULT_MODEL: 'jev-stray',
          TYPESAFE_LOG_LEVEL: 'debug'
        }
      }
    })
  ],
  test: { setupFiles: ['./test/setup.ts'] }
})
