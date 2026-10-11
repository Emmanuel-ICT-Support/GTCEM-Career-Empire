// Whole-person models are added only after the supplied character references are converted
// and their animated GLBs are verified. Existing saved characters remain usable.
export const WHOLE_AVATARS=Object.freeze([]);
export function validateWholeAvatar(item){return Boolean(item&&typeof item.id==='string'&&typeof item.model==='string'&&item.model.endsWith('.glb')&&Array.isArray(item.animations)&&['idle','walk'].every(a=>item.animations.includes(a)));}
