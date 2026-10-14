import { describe, expect, test } from "vitest";
import { loadBrowserScript } from "./browser-script-loader.mjs";

function loadEconomyLedger() {
  const windowObj = loadBrowserScript("src/services/economy-ledger.js");
  return windowObj.CareerEmpireEconomy;
}

describe("CareerEmpireEconomy", () => {
  test("builds normalised economy events", () => {
    const economy = loadEconomyLedger();
    const event = economy.buildEvent({
      id: "event-1",
      timestamp: "2026-05-31T10:00:00.000Z",
      moduleId: "est-prep",
      eventType: "evidence-saved",
      earnedDelta: "25",
      taxDelta: "5",
      annualSalaryAfter: 62000
    });

    expect(event).toMatchObject({
      id: "event-1",
      timestamp: "2026-05-31T10:00:00.000Z",
      moduleId: "est-prep",
      eventType: "evidence-saved",
      earnedDelta: 25,
      taxDelta: 5,
      spendDelta: 0,
      annualSalaryAfter: 62000
    });
  });

  test("prepends events and keeps the log capped", () => {
    const economy = loadEconomyLedger();

    for (let index = 0; index < economy.ECONOMY_LOG_LIMIT + 5; index += 1) {
      economy.appendEvent({
        id: `event-${index}`,
        label: `Event ${index}`
      });
    }

    const session = economy.getSession();
    expect(session.economyLog).toHaveLength(economy.ECONOMY_LOG_LIMIT);
    expect(session.economyLog[0]).toMatchObject({ id: "event-64", label: "Event 64" });
    expect(session.economyLog.at(-1)).toMatchObject({ id: "event-5", label: "Event 5" });
  });
});
