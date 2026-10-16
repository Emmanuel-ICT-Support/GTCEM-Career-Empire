// Observe existing gate calls and counters once; never query or submit GPU work.
export function observeStartupGate(gate,record,isDone=()=>false,metadata=()=>({})){
 let completed=gate.completedFrame;
 for(const name of ['ready','readyForDraw']){
  const original=gate[name].bind(gate);
  gate[name]=(...args)=>{const result=original(...args);if(gate.completedFrame!==completed){completed=gate.completedFrame;if(!isDone())record('gpu-complete',{frame:completed});}return result;};
 }
 const submitted=gate.submitted.bind(gate);
 gate.submitted=(...args)=>{const result=submitted(...args);if(!isDone())record('canvas-submit',{frame:gate.submittedFrame,...metadata()});return result;};
}
