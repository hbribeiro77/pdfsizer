// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Configurações globais para testes
global.console = {
  ...console,
  // Suprimir logs durante os testes para manter o output limpo
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 