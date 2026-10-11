// Hysteresis keeps a dismissed interaction quiet until the player leaves its zone.
export function createProximityGate(){
 const entered=new Set();
 return {sample(id,distance,{enter=1.8,leave=2.8,enabled=true}={}){if(distance>leave){entered.delete(id);return false;}if(!enabled||entered.has(id)||distance>enter)return false;entered.add(id);return true;},reset(){entered.clear();}};
}
