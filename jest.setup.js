import '@testing-library/jest-dom'

// Mock Konva for testing
jest.mock('konva', () => ({
  Stage: jest.fn(),
  Layer: jest.fn(),
  Circle: jest.fn(),
  Line: jest.fn(),
  Shape: jest.fn(),
  Text: jest.fn(),
  Image: jest.fn(),
}))

jest.mock('react-konva', () => ({
  Stage: jest.fn(({ children }) => children),
  Layer: jest.fn(({ children }) => children),
  Circle: jest.fn(() => null),
  Line: jest.fn(() => null),
  Shape: jest.fn(() => null),
  Text: jest.fn(() => null),
  Image: jest.fn(() => null),
}))

// Mock window.Image for canvas tests
global.Image = class {
  constructor() {
    // Simulate immediate load for most tests
    Promise.resolve().then(() => {
      if (this.onload) {
        this.onload()
      }
    })
  }
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock