// Renderer-independent access; never marks a 3D trial or shift complete.
export function marketAccessURL(href){const url=new URL(href);url.searchParams.set('experience','sunday-markets');url.searchParams.set('marketAccess','2d');return url.href;}
export function showMarketAccessLinks(doc){for(const link of doc.querySelectorAll('[data-market-fallback]')){link.href=marketAccessURL(doc.location.href);link.hidden=false;}}
