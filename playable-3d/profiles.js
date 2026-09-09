export const STORAGE_KEY = 'career-empire-3d-profiles-v2-tripo';
export const SKIN = { porcelain:'#edc9af', sand:'#d2a075', warm:'#b7774f', copper:'#955d3e', mahogany:'#65432f', deep:'#39281f' };
export const OPTIONS = {
  body: [['schoolboy','School student'],['tripo','Base avatar'],['shirt','Shirt avatar (test)'],['a','Body A'],['b','Body B']],
  face: [['soft','Soft'],['round','Round'],['defined','Defined']],
  hair: [['waves','Tousled'],['bob','Side-part bob'],['ponytail','Ponytail'],['none','No hair']],
  top: [['shirt','Shirt & tie'],['scrubs','Scrub top'],['chef','Chef jacket']],
  bottom: [['trousers','Trousers'],['jeans','Jeans'],['scrubs','Scrub trousers'],['skirt','Pleated skirt']],
  outer: [['blazer','School blazer'],['hivis','Hi-vis vest'],['labcoat','Lab coat'],['apron','Chef apron'],['none','No outer layer']],
  accessory: [['none','None'],['backpack','Backpack'],['glasses','Glasses'],['toolbelt','Tool belt']]
};
export const DEFAULT_COLOURS = { hair:'#543321', eye:'#4a705e', top:'#e9ece5', bottom:'#263849', outer:'#243947', jumper:'#245961', shoes:'#242522' };
export function normaliseProfile(value = {}) {
  if(!value || typeof value!=='object' || Array.isArray(value))value={};
  const profile = { schemaVersion:1, id:String(value.id || 'avery'), name:String(value.name || 'Avery').slice(0,36),
    body:'a', face:'soft', skin:'sand', hair:'waves', top:'shirt', bottom:'trousers', outer:'blazer', accessory:'backpack',
    jumper:Boolean(value.jumper), colours:{...DEFAULT_COLOURS}, future:{occupation:'',training:'',strength:''} };
  for (const [key, entries] of Object.entries(OPTIONS)) if (entries.some(([id]) => id === value[key])) profile[key]=value[key];
  if (Object.hasOwn(SKIN,value.skin)) profile.skin=value.skin;
  for (const key of Object.keys(DEFAULT_COLOURS)) if (/^#[0-9a-f]{6}$/i.test(value.colours?.[key] || '')) profile.colours[key]=value.colours[key];
  for (const key of Object.keys(profile.future)) profile.future[key]=String(value.future?.[key] || '').slice(0,500);
  return profile;
}
export const STARTERS = [normaliseProfile({id:'avery',name:'Avery',body:'schoolboy',skin:'warm',accessory:'backpack'}),normaliseProfile({id:'morgan',name:'Morgan',body:'b',skin:'deep',hair:'bob',bottom:'skirt',outer:'none',jumper:true,accessory:'glasses',colours:{hair:'#2a221d',top:'#e9e3dd',jumper:'#8a4260',bottom:'#354547',eye:'#895b2e'}})];
export function loadProfiles(storage) {
  try {
    const raw=JSON.parse(storage.getItem(STORAGE_KEY));
    if (!raw || !Array.isArray(raw.profiles)) throw new Error('No profiles');
    const seen=new Set();
    const profiles=raw.profiles.slice(0,24).map(normaliseProfile).filter(p=>{if(seen.has(p.id))return false;seen.add(p.id);return true;});
    if (!profiles.length) throw new Error('Empty');
    return {profiles,activeId:profiles.some(p=>p.id===raw.activeId)?raw.activeId:profiles[0].id};
  } catch { return {profiles:structuredClone(STARTERS),activeId:STARTERS[0].id}; }
}
export function saveProfiles(storage,state) {
  const profiles=state.profiles.map(normaliseProfile);
  if (!profiles.some(p=>p.id===state.activeId)) throw new Error('Unknown profile');
  storage.setItem(STORAGE_KEY,JSON.stringify({schemaVersion:1,profiles,activeId:state.activeId}));
}
export function readOwnedLegacyProfile(storage) {
  const read=k=>{try{const value=JSON.parse(storage.getItem(k)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}};
  const auth=read('career-empire-auth-demo'),session=read('career-empire-session'),stored=read('career-empire-avatar-v1');
  const login=auth.studentLogin || {};
  const owner=String(login.id || login.username || session.studentId || session.username || session.playerName || 'demo');
  return stored.profiles && Object.hasOwn(stored.profiles,owner) ? stored.profiles[owner] : null;
}
export function migrateLegacyProfile(source,id='imported') {
  if (!source || typeof source!=='object') throw new Error('No saved avatar for this student');
  const warnings=[];
  const maps={top:{'ecc-shirt-tie':'shirt','scrubs-top-teal':'scrubs','chef-jacket-white':'chef'},bottom:{'ecc-navy-pants':'trousers','ecc-jeans':'jeans','scrubs-pants-teal':'scrubs','tartan-skirt':'skirt','ecc-burgundy-pants':'trousers'},outer:{'ecc-navy-blazer':'blazer','camel-blazer':'blazer','hivis-vest':'hivis','lab-coat':'labcoat','chef-apron-black':'apron','none':'none'},accessory:{'none':'none','tool-belt-brown':'toolbelt','safety-goggles-clear':'glasses','glasses':'glasses','backpack':'backpack'}};
  const profile={id,name:source.studentName || 'Imported avatar',body:/girl/i.test(source.characterBase || source.avatarSpec?.slots?.assetRig || '')?'b':'a',skin:source.skinTone,face:source.faceStyle==='sharp'?'defined':source.faceStyle,hair:source.hairStyle,jumper:source.jumper && source.jumper!=='none',future:{occupation:source.occupation,training:source.training,strength:source.strength},colours:{...DEFAULT_COLOURS}};
  for (const [target,key] of Object.entries({top:'shirt',bottom:'pants',outer:'blazer',accessory:'accessory'})) {
    if (maps[target][source[key]]) profile[target]=maps[target][source[key]];
    else if(source[key])warnings.push(source[key]);
  }
  if (source.accessory==='safety-goggles-clear')warnings.push('safety goggles (glasses preview)');
  const colourSlots={hair:'hair',top:'shirt',bottom:'pants',outer:'blazer',jumper:'jumper',shoes:'shoes'};
  for (const [target,key] of Object.entries(colourSlots)) if(source.colours?.[key])profile.colours[target]=source.colours[key];
  if(!source.colours?.hair)profile.colours.hair=({brown:'#5a3524',black:'#171717',blonde:'#cfad63',auburn:'#923f29',silver:'#b7b7b0',teal:'#107e7a'})[source.hairColour] || DEFAULT_COLOURS.hair;
  profile.colours.eye=({brown:'#6f3b18',blue:'#238fcc',green:'#3f9b4a',amber:'#bd841f',grey:'#788995'})[source.eyeColour]||DEFAULT_COLOURS.eye;
  if(source.pants==='ecc-burgundy-pants'&&!source.colours?.pants)profile.colours.bottom='#75233d';
  if(source.blazer==='camel-blazer'&&!source.colours?.blazer)profile.colours.outer='#b08a4d';
  return {profile:normaliseProfile(profile),warnings};
}
export const PHASES = {
  disrepair:{label:'Disrepair',grass:0x78846b,stone:0x958f7d,trim:0xb2ab97,roof:0x505957,glass:0x394f52,light:.12,leaf:0x63775b},
  growth:{label:'Growth',grass:0x6f935d,stone:0xb3ac98,trim:0xd1c6ad,roof:0x35464a,glass:0x427781,light:.9,leaf:0x4b783f},
  flourishing:{label:'Flourishing',grass:0x64945c,stone:0xc1bba9,trim:0xe1d5b9,roof:0x2a3c43,glass:0x457f8b,light:2.4,leaf:0x386f44}
};
