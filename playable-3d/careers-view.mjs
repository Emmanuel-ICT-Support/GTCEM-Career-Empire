export function careersPitch(start, dragY) {
  return Math.max(-0.6, Math.min(0.75, start + dragY * 0.004));
}
export function careersLookHeight(base, pitch, distance) {
  return base + Math.tan(pitch) * Math.max(0.1, distance);
}
export function careersPortfolioRoute(guest) {
  return guest ? '../dashboards/student.html?portfolioDemo=1#capabilities' : '../dashboards/student.html#capabilities';
}
