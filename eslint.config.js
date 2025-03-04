// eslint.config.js
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
	baseDirectory: import.meta.dirname,
	recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
	...compat.config({
		extends: ['eslint:recommended', 'next'],
	}),
	{
		ignores: ['node_modules/', '.next/', 'out/', 'public/'],
	},
]

export default eslintConfig
