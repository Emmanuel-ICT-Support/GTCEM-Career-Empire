import { it, expect } from 'vitest';
import { careersPitch, careersLookHeight, careersPortfolioRoute } from '../../playable-3d/careers-view.mjs';
it('bounds vertical look and keeps zero pitch at the authored eye-level target', () => {
  expect(careersLookHeight(1.55, 0, 4.2)).toBe(1.55);
  expect(careersPitch(0, 10000)).toBe(.75);expect(careersPitch(0, -10000)).toBe(-.6);
  expect(careersLookHeight(1.55, careersPitch(0, 100), 4.2)).toBeGreaterThan(1.55);
  expect(careersLookHeight(1.55, careersPitch(0, -100), 4.2)).toBeLessThan(1.55);
});
it('routes guest monitors to an isolated demo and signed-in learners to their normal gated portfolio', () => {
  expect(careersPortfolioRoute(true)).toBe('../dashboards/student.html?portfolioDemo=1#capabilities');
  expect(careersPortfolioRoute(false)).toBe('../dashboards/student.html#capabilities');
});
