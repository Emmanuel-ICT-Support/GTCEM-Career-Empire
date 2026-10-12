// Serialized by page.evaluate: read the app's existing diagnostics and actual
// frame milestones without intercepting or rewriting its module response.
export function sampleStartupDiagnostics(){
 const nodes=document.querySelectorAll('#diagnostics'),canvas=document.querySelector('#scene');
 const milestone=key=>{const value=canvas?.dataset[key];if(value===undefined)return null;const ms=Number(value);return Number.isFinite(ms)?ms:null;};
 return {pageMs:Math.round(performance.now()),timeOrigin:performance.timeOrigin,url:location.href,diagnosticsCount:nodes.length,firstFrameMs:milestone('firstFrameMs'),entryVisibleMs:milestone('entryVisibleMs'),state:JSON.parse(nodes[0]?.dataset.state||'{}')};
}
