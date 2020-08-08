module.exports = {
    testEnvironment: 'node',
    "roots": [
      "<rootDir>"
    ],
    "testMatch": [
      "**/__tests__/**/*.+(ts|tsx)",
      "**/?(*.)+(spec|test).+(ts|tsx)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
  }
