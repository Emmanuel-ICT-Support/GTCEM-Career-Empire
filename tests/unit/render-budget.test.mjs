import {it,expect} from 'vitest';
import {createRenderBudget} from '../../playable-3d/render-budget.js';
it('reduces sustained slow pixel rendering to a bounded floor',()=>{const b=createRenderBudget(2);expect(b.ratio).toBe(1);for(let i=0;i<150;i++)b.sample(1/7);expect(b.ratio).toBe(.65);});
it('does not reduce for a single slow frame or normal 30fps operation',()=>{const b=createRenderBudget(2);b.sample(.2);for(let i=0;i<120;i++)b.sample(1/60);expect(b.ratio).toBe(1);const c=createRenderBudget(2);for(let i=0;i<180;i++)c.sample(1/30);expect(c.ratio).toBe(1);});
it('recovers slowly, respects device ceiling and resets the measurement window',()=>{const b=createRenderBudget(1);for(let i=0;i<50;i++)b.sample(.15);const low=b.ratio;for(let i=0;i<300;i++)b.sample(1/60);expect(b.ratio).toBe(low);for(let i=0;i<3000;i++)b.sample(1/60);expect(b.ratio).toBe(1);expect(b.reset()).toBe(1);});
