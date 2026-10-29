import js from '@eslint/js'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['coverage', 'node_modules']),
  {
    // The API runs on Node and uses ES modules ("type": "module")
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      // Express error handlers need all four arguments, even if `next` is unused.
      // ignoreRestSiblings allows `const { answer, ...rest } = item`, which we use
      // to strip private fields before sending an item to the client
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_|^next$', ignoreRestSiblings: true },
      ],
    },
  },
  {
    // Tests also use Jest's describe, it, expect and beforeEach
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
  },
])
