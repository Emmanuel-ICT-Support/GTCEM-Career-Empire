import {expect} from '@playwright/test';

// The boot overlay can close before the required outdoor frame completes.
// Wait for the game's actual gate before asserting controls or playable state.
export async function waitForEntry(page,{timeout=30000}={}){
 await expect.poll(()=>page.locator('#diagnostics').evaluate(node=>JSON.parse(node.dataset.state||'{}').entryReady),{timeout,message:'Required entry geometry and its completed world frame are ready'}).toBe(true);
}
