import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';import vm from 'node:vm';
const source=readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
const fn=source.slice(source.indexOf('function updateInteraction(){'),source.indexOf('\nfunction openModule('));
function interact(x,z,teacher=false){
 const span={textContent:''},node={hidden:false,querySelector:()=>span},actions=[];
 const context={actor:{model:{position:{x,y:0,z}}},echo:{open:()=>false,near:()=>true,resourcesNear:()=>false,show:()=>actions.push('Echo')},feedbackOpen:()=>false,marketDialogOpen:()=>false,mode:'town',watchingEST:false,discovery:null,discoveryReview:false,campusReady:true,keys:new Set(),joystick:{x:0,z:0},EST:{x:16,doorZ:14},CAREERS:{x:-18,doorZ:15},CHAPEL:{x:-3.15,z:-8.8},LEGACY:{x:-9.8,z:22.3,url:'original'},worlds:{ensureInterior:async()=>{},ensureCareers:async()=>{}},nearHall:false,nearCareers:false,enteringHall:false,enteringCareers:false,teachers:teacher?[{name:'Mr Middleton',near:()=>true,root:{visible:true,position:{distanceToSquared:()=>1}}}]:[],greetTeacher:()=>actions.push('Teacher'),openStudio:()=>actions.push('Studio'),enterChapel:()=>actions.push('Chapel'),enterHall(){},enterCareers(){},openMarket(){},helperPicker:{selected:()=>({name:'Echo'})},interaction:null,$:id=>id==='interact'?node:{hidden:true,open:false},window:{open:()=>actions.push('Original')}};
 vm.runInNewContext(fn+';updateInteraction();',context);context.interaction?.action();return {label:span.textContent,actions};
}
test('following companion cannot take fixed-world actions away from the player',()=>{
 for(const [x,z,teacher,label,action]of [[-12.2,5,false,'Open Avatar Studio','Studio'],[-3.15,-8.8,false,'Enter Chapel','Chapel'],[-7,-50,true,'Say hello to Mr Middleton','Teacher'],[-9.8,22.3,false,'Open Original Career Empire ↗','Original']])expect(interact(x,z,teacher)).toEqual({label,actions:[action]});
});
test('companion conversation remains available away from world actions',()=>expect(interact(-7,23.3)).toEqual({label:'Talk to Echo',actions:['Echo']}));
