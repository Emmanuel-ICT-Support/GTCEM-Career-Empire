export function mountCourseOutline(){
 const root=document.getElementById('course-outline-content');let loading=null;
 async function show(){
  if(root.dataset.ready)return;
  loading??=fetch(new URL('./course-outline.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Outline unavailable');return r.json();}).then(data=>{
   root.replaceChildren();const intro=document.createElement('p');intro.textContent=data.header.introduction;const note=document.createElement('p');note.className='note';note.textContent=data.header.status_note;root.append(intro,note);
   for(const unit of ['Unit 3','Unit 4']){const section=document.createElement('section');section.className='course-unit';const heading=document.createElement('h3');heading.textContent=unit;section.append(heading);for(const s of data.stages.filter(s=>s.unit===unit)){const card=document.createElement('article'),title=document.createElement('h4');title.textContent=s.number+'. '+s.title;card.append(title);for(const key of ['learn','experience']){const p=document.createElement('p'),b=document.createElement('strong');b.textContent=key==='learn'?'Learn: ':'Experience: ';p.append(b,document.createTextNode(s[key]));card.append(p);}section.append(card);}root.append(section);}
   const tail=document.createElement('section'),heading=document.createElement('h3');heading.textContent=data.throughout.heading;tail.append(heading);for(const [key,text]of Object.entries(data.throughout)){if(key==='heading')continue;const p=document.createElement('p');p.textContent=text;tail.append(p);}root.append(tail);root.dataset.ready='true';
  }).catch(()=>{loading=null;root.textContent='The draft outline could not load. Reopen Course outline to retry, or use the printable PDF.';});
  return loading;
 }
 document.querySelectorAll('[data-panel="course"],[data-open="course"]').forEach(b=>b.addEventListener('click',show));
 if(new URLSearchParams(location.search).get('section')==='course')show();
 return {show};
}
