// ============================================================
// scenarioState — per-scenario shared state across step files.
// Cucumber step definitions are split across multiple .ts files,
// but they all need to share a few variables within one Scenario
// (e.g. the auth header obtained in Given, used in When/Then).
//
// e2e.ts wires a beforeEach hook that calls resetState() so every
// Scenario starts clean.
// ============================================================

export interface ScenarioState {
  auth?: Record<string, string>;
  role?: 'admin' | 'user';
  plantId?: number;
  plantStockBefore?: number;
  plantOriginalName?: string;
  saleId?: number;
  lastResponse?: { status: number; body: unknown };
  rowsBefore?: number;
}

export const state: ScenarioState = {};

export function resetState(): void {
  (Object.keys(state) as Array<keyof ScenarioState>).forEach((k) => delete state[k]);
}
