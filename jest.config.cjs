/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  // The app imports JSON (the 88x31 badge list) and loads templates/styles through Angular's own transformer.
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
};
