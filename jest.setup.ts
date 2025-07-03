import '@testing-library/jest-dom';

// Polyfill ResizeObserver for Radix components
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-ignore
global.ResizeObserver = global.ResizeObserver || ResizeObserver; 