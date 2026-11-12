import * as THREE from 'three';

export const EST_CARDS = [
 {id:'content',name:'CORE',number:'01',accent:'#58d6e6',top:'#20546b',bottom:'#10253f',description:'Understanding the SCSA "EST Unit 3 Content"'},
 {id:'glossary',name:'TERM',number:'02',accent:'#63d9bb',top:'#205451',bottom:'#12273b',description:'Understanding the SCSA Glossary of terms'},
 {id:'decoder',name:'VTCS',number:'03',accent:'#dec978',top:'#474c40',bottom:'#182539',description:'Understanding the Verb, Topic, Context, Structure of the question using the SCSA Glossary of Key words in the Formulation of questions'},
 {id:'boss',name:'BOSS',number:'04',accent:'#ea91c2',top:'#593c59',bottom:'#24263f',description:'Combining CORE, TERM and VTCS into a final response.'}
];

function wrap(context,text,x,y,width,lineHeight){
 let line='';
 for(const word of text.split(' ')){
  const next=line?line+' '+word:word;
  if(line&&context.measureText(next).width>width){context.fillText(line,x,y);y+=lineHeight;line=word;}else line=next;
 }
 if(line)context.fillText(line,x,y);
 return y;
}

export function createESTStationCards(scene,stations){
 let version=0,guide=null,guideLoad=null;
 const screens=stations.map(station=>{
  const card=EST_CARDS.find(item=>item.id===station.id);
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=600;
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.04,.61),material);
  screen.name=card.name+' learning card';
  // The authored Terminal glass is 1.04 x .61 at z = station.z - .064.
  // Four millimetres in front of its front face; hardware and desks stay intact.
  screen.position.set(station.x,1.47,station.z-.049);scene.add(screen);
  return {card,canvas,texture,screen,textBottom:0,guideReady:false};
 });
 function draw(item){
  const {card,canvas}=item,c=canvas.getContext('2d');
  const gradient=c.createLinearGradient(0,0,canvas.width,canvas.height);gradient.addColorStop(0,card.top);gradient.addColorStop(1,card.bottom);
  c.clearRect(0,0,1024,600);c.fillStyle=gradient;c.fillRect(0,0,1024,600);
  c.strokeStyle=card.accent;c.lineWidth=5;c.beginPath();c.roundRect(8,8,1008,584,28);c.stroke();
  c.fillStyle=card.accent;c.font='800 27px Arial, sans-serif';c.fillText(card.number+' / '+card.name,40,48);
  c.fillStyle='#ffffff';c.font='900 86px Arial Black, Arial, sans-serif';c.fillText(card.name,38,139);
  c.font='700 43px Arial, sans-serif';item.textBottom=wrap(c,card.description,40,201,944,51);
  if(guide){
   // The existing sprite contains a sliver of a neighbouring pose at its far
   // right. Use only the complete, unchanged celebrating pose on this card.
   c.drawImage(guide,0,0,Math.min(512,guide.width),guide.height,798,392,205,200);
   item.guideReady=true;
  }
  item.texture.needsUpdate=true;version++;
 }
 screens.forEach(draw);
 function ensure(){
  if(!guideLoad)guideLoad=new THREE.TextureLoader().loadAsync('../Assets/EST%20Preparation/guide-character/guide-celebration.png').then(texture=>{
   guide=texture.image;screens.forEach(draw);texture.dispose();return true;
  }).catch(error=>{guideLoad=null;throw error;});
  return guideLoad;
 }
 return {screens,ensure,get version(){return version;},get ready(){return screens.every(item=>item.guideReady);}};
}
