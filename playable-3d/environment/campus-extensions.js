import {pavingNetwork} from './paving-network.js?v=student-usability-20260924';
import * as T from 'three';
import {dressedBox,planter,batchStatic} from './approved-campus-kit.js?v=walkthrough2';
import {addAuthoredGarden} from '../ecc-preview/authored-garden.js?v=annotations1';

export function campusExtensions(root,p){
 const works=new T.Group();works.name='Approved standard campus connections';root.add(works);
 const house=new T.Group();house.position.set(43,0,-26);house.name='Market courtyard dressed exterior';
 const b=(x,y,z,w,h,d,m=p.stone)=>dressedBox(house,x,y,z,w,h,d,m);
 // Existing low footprint and roofline, now with depth, windows and shaded entry.
 b(0,1.4,-1.45,12,2.8,.18);b(-5.92,1.4,0,.16,2.8,3);b(5.92,1.4,0,.16,2.8,3);b(0,2.71,1.42,12,.25,.2);b(0,.25,1.42,12,.5,.2);
 b(0,2.97,.30,13,.20,4.4,p.blue);b(0,2.85,.45,12.7,.07,4.4,p.timber);b(0,.075,0,11.8,.15,3,p.paving);
 for(let x=-5;x<=5;x+=2){b(x,1.62,1.45,1.66,1.83,.025,p.glass);b(x-.89,1.5,1.49,.12,2.42,.19,p.blue);b(x,1.32,1.51,1.78,.07,.11,p.blue);b(x,.87,-.25,1.8,.12,.8,p.timber);b(x,.44,-.25,1.7,.8,.65,p.stone);b(x,2.65,.25,.65,.04,.35,p.glow);}
 b(0,1.48,-1.3,11.7,2.44,.08,p.plaster);for(const x of[-5.4,5.4])b(x,1.39,2.14,.13,2.78,.13,p.blue);
 works.add(batchStatic(house));
 const pavingPaths=pavingNetwork(works,p.paving,.075);const path=(points,width)=>pavingPaths.path(points,width,false);
 path([[-15,-22],[-22,-26],[-22,-39],[-18,-41.9],[-4,-41.9]],2.6);
 path([[7,-41.5],[11,-43],[11,-61]],2.4);
 path([[32,-21.8],[43,-21.8],[43,-23]],2.4);
 pavingPaths.finish();
 // A faceted planting ribbon follows the Media frontage.  It removes the
 // leftover grass sliver while keeping a continuous, generous walking path.
 const beds=[[-10.0,-41.15,7.1,.82],[-3.7,-40.72,5.4,.82],[2.8,-41.15,7.1,.82],[12.5,-49.7,1.15,4.1],[12.5,-57,1.15,4.1],[38.4,-23.2,2.7,1.15],[47.6,-23.2,2.7,1.15]];
 const garden=new T.Group();garden.name='Teaching building native landscape';works.add(garden);
 for(const [x,z,w,d]of beds)planter(garden,x,z,w,d,p);
 addAuthoredGarden(garden,beds,{treeSites:[],baseY:.43,density:5.5,detail:'supporting'});
 // Seating uses the same timber/stone language, outside the path and playing line.
 for(const [x,z]of [[-18.5,-40.4],[7.5,-41],[41,-23.4]]){dressedBox(works,x,.42,z,1.8,.16,.48,p.timber);for(const dx of[-.65,.65])dressedBox(works,x+dx,.19,z,.18,.38,.44,p.stone);}
 return {beds};
}
