// Compatibility seam for existing Market callers. The former public classroom
// pacing word has been removed; this is not account authentication and grants
// no school-account or student-record permissions. Keep the asynchronous contract
// so requestMarket retains its navigation-interruption and duplicate-open guards.
export function createClassroomGate({onPause=()=>{},onClose=()=>{}}={}){
 const ready=Promise.resolve(true);
 return {open:()=>false,request(){onPause();onClose();return ready;}};
}
