// Approved first theme; CSS crops preserve the original generated artwork unchanged.
export function carnivalGraphic(kind,label){const n=document.createElement('span');n.className='carnival-art carnival-'+kind;n.setAttribute('role','img');n.setAttribute('aria-label',label);return n;}
export function carnivalButton(button,kind,label){button.setAttribute('aria-label',label);button.classList.add('carnival-button');button.replaceChildren(carnivalGraphic(kind,''));button.firstChild.removeAttribute('role');button.firstChild.setAttribute('aria-hidden','true');}
