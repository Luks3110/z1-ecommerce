import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules/*', '*.js', 'tsconfig.json', 'drizzle.config.ts'],
  rules: {
    'node/prefer-global/process': 'off',
  },
})
