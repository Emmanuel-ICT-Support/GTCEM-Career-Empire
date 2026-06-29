# Economy Ledger Standard

Career Empire modules should record earnings and spend events through the shared browser service:

- `window.CareerEmpireEconomy.appendEvent({...})`

The shared service lives at:

- `/Users/tania.byrnes/Desktop/Megatrends/src/services/economy-ledger.js`

## Required event shape

- `moduleId`
- `eventType`
- `checkpoint`
- `label`

## Recommended fields

- `detail`
- `earnedDelta`
- `taxDelta`
- `spendDelta`
- `savingsDelta`
- `annualSalaryAfter`
- `netWorthAfter`
- `savingsAfter`
- `taxPaidAfter`

## Current event types

- `scenario-choice`
- `reward-awarded`
- `progress-saved`
- `purchase`

## Platform rule

All current and future modules should:

1. Award income/tax in module logic.
2. Append an economy event when the reward is awarded.
3. Append another economy event when the updated totals are written back to the shared player session/profile.
4. Never invent dashboard totals from net worth when a saved field exists.

This keeps the Student Hub timeline readable and makes reward bugs traceable.
