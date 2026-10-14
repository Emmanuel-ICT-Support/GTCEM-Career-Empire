# Testing Priority Coverage

Issue #17 started the unit-test coverage pass by focusing on shared browser services that carry cross-page risk.

## First Priority Areas

1. `src/services/economy-ledger.js`
   - Used to persist and summarise player economy events.
   - Small, shared, stateful logic where regressions can affect multiple pages.
   - Current tests cover event normalisation and log capping/order.

2. `src/services/response-moderation.js`
   - Protects teacher-visible evidence and shared comparison examples.
   - High-risk logic for privacy flags, review eligibility, duplicate review avoidance, and queueing pending review rows.
   - Current tests cover privacy/workplace/location flags, reviewability rules, duplicate suppression, excluded responses, and queued review payloads.

## Coverage Reporting

`npm run coverage` runs Vitest with V8 coverage and writes text, JSON, HTML, and LCOV reports to `coverage/`.

The general CI build now runs:

```bash
npm run check && npm run coverage && npm run test:e2e
```

GitHub Actions uploads the generated `coverage/` directory as the `coverage-report` artifact.

## Next Coverage Targets

- Extract and unit test teacher dashboard evidence/economy aggregation from `dashboards/dashboard.js`.
- Extract and unit test EST scoring/state transitions from `modules/est-prep/`.
- Add focused regression tests whenever legacy areas are changed.
