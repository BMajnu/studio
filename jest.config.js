module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'lucide-react': '<rootDir>/__mocks__/lucide-react.js'
  },
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: { jsx: 'react' }, useESM: false }]
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM: false,
      diagnostics: false
    }
  }
}; 