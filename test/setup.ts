import { vi } from "vitest";

vi.mock("ofetch", async (importOriginal) => {
  const mod = await importOriginal() as Record<string, unknown>;
  return { ...mod, $fetch: vi.fn(mod.$fetch as (...args: unknown[]) => unknown) };
});
