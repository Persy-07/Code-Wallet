module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    env: {
        node: true,
        browser: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        // Règles générales
        'no-unused-vars': 'warn',
        'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],

        // Règles pour Electron
        'no-restricted-globals': ['error', 'require'],


        // Règles pour React
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/no-unescaped-entities': 'off',

        // Règles spécifiques pour preload/renderer
        'no-undef': 'error'
    },
    overrides: [
        {

            files: ['public/preload.js'],
            env: {
                node: true,
                browser: true
            },
            rules: {
                'no-restricted-globals': 'off'
            }
        },
        {
            files: ['src/**/*.js', 'src/**/*.jsx'],
            env: {
                browser: true,
                node: false
            },
            globals: {
                window: true,
                document: true
            }
        },
        
        {

            files: ['public/electron.js'],
            env: {
                node: true,
                browser: false
            },
            rules: {
                'no-restricted-globals': 'off'
            }
        }
    ]
};