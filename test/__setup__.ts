import { afterAll, beforeAll } from "vitest";

const originalConsoleError = console.error;

beforeAll(() => {
  console.error = () => {}; // suppress console.error in reporter
});

afterAll(() => {
  console.error = originalConsoleError;
});
