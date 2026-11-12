// Browser-safe. Caller supplies existing PUBLIC anon key, never service credentials.
export function createArchonTransport({endpoint,publicKey,gatewayMode,fetcher=fetch}){
 const url=new URL(endpoint);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error('Reviewed HTTPS function endpoint required');
 if(!publicKey)throw Error('Existing public project key required');
 if(!['publishable-capability','legacy-anon-jwt'].includes(gatewayMode))throw Error('Explicit reviewed gateway mode required');
 if(gatewayMode==='publishable-capability'&&!publicKey.startsWith('sb_publishable_'))throw Error('Expected publishable client key');
 if(gatewayMode==='legacy-anon-jwt'){let claims;try{claims=JSON.parse(atob(publicKey.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));}catch{}if(claims?.role!=='anon')throw Error('Legacy client key must be an anon JWT; privileged/user tokens are not client configuration');}
 async function call(path,{method='GET',seat,attemptId,body,signal}={}){
  if(method==='POST'&&!attemptId)throw Error('Stable attemptId required; preserve across retry');
  const response=await fetcher(url.href.replace(/\/$/,'')+path,{method,signal,headers:{apikey:publicKey,...(gatewayMode==='legacy-anon-jwt'?{Authorization:'Bearer '+publicKey}:{}),...(seat?{'x-archon-seat':seat.token}:{}),...(attemptId?{'x-entry-attempt':attemptId}:{}),...(method==='POST'?{'Content-Type':'application/json'}:{})},...(method==='POST'?{body:JSON.stringify(body||{})}:{})});
  let result;try{result=await response.json();}catch{throw Error('Room service returned an invalid response');}if(!response.ok)throw Object.assign(Error(result.error||'Room request failed'),{status:response.status});return result;
 }
 return {reserve:({attemptId,signal})=>call('/rooms',{method:'POST',attemptId,signal}),join:({gameId,attemptId,signal})=>call('/rooms/'+gameId+'/join',{method:'POST',attemptId,signal}),match:(seat,action,{attemptId,signal,knownVersion}={})=>call('/rooms/'+seat.id+'/match'+(!action&&Number.isSafeInteger(knownVersion)&&knownVersion>=0?'?since='+knownVersion:''),{method:action?'POST':'GET',seat,attemptId,body:action,signal})};
}
