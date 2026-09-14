// Bound the network phase, including the response body, without changing a saved avatar.
export async function downloadAvatar(url, {timeoutMs=60000, fetchImpl=fetch}={}) {
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try {
    const response=await fetchImpl(url,{signal:controller.signal});
    if(!response.ok)throw new Error(`Avatar download failed (${response.status}).`);
    return await response.arrayBuffer();
  } catch(error) {
    if(controller.signal.aborted)throw new Error('Your avatar download took too long. Please try again.');
    throw error;
  } finally {clearTimeout(timer);}
}
