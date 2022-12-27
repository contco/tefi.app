module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    "plugin:react-hooks/recommended",
    'airbnb',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'prettier/react'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: "detect"
    },
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  plugins: [
    'react',
    'prettier',
    '@typescript-eslint'
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "no-undef": "off",
    "no-use-before-define": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error"
    ],
    "react/jsx-props-no-spreading": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "jsx-a11y/anchor-is-valid": [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton']
      }
    ],
    "prettier/prettier": ["error"],
    "react/jsx-filename-extension": [1, {
      "extensions": [".tsx", ".ts"]
    }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ]
  },
  "overrides": [{
    "files": ["**/*.tsx"],
    "rules": {
      "react/prop-types": "off"
    }
  }]
};