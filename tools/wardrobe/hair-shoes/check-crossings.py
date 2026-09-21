"""Orientation-independent finite edge checks; no source-body edits or masking."""
import bpy,json,os,numpy as np
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
R=Path(__file__).resolve().parent;O=R/'outputs';A=Path(os.environ.get('CE_GAME_ROOT',R.parent/'wardrobe-live-20260921'))/'playable-3d/assets'
bpy.ops.wm.open_mainfile(filepath=str(O/'Hair-and-Shoes.blend'));s=bpy.context.scene;arm=next(o for o in s.objects if o.type=='ARMATURE');base=bpy.data.objects['Canonical Base - unchanged'];items=[o for o in s.objects if o.name.startswith(('Hair-','Shoes-'))]
garments={}
for key,file in [('pants-'+k,'occupational-pants-'+k+'.glb') for k in ['scrubs','suit','chef','tradie']]+[('top-'+k,'hospital-scrub-top.glb' if k=='scrubs' else 'occupational-top-'+k+'.glb') for k in ['scrubs','suit','chef','work']]:
 before=set(s.objects);bpy.ops.import_scene.gltf(filepath=str(A/file));added=set(s.objects)-before;meshes=[o for o in added if o.type=='MESH' and any(m.type=='ARMATURE' for m in o.modifiers)]
 for ob in meshes:
  ob.parent=arm
  for m in ob.modifiers:
   if m.type=='ARMATURE':m.object=arm
 for ob in added:
  if ob.type=='ARMATURE':bpy.data.objects.remove(ob,do_unlink=True)
 garments[key]=meshes
def data(obs,dg):
 v=[];f=[]
 for ob in obs:
  ob.hide_set(False);e=ob.evaluated_get(dg);m=e.to_mesh();m.calc_loop_triangles();offset=len(v);v.extend([e.matrix_world@p.co for p in m.vertices]);f.extend([tuple(offset+i for i in t.vertices) for t in m.loop_triangles]);e.to_mesh_clear()
 edges=set(tuple(sorted((a,b))) for t in f for a,b in zip(t,t[1:]+t[:1]));bounds=(Vector([min(p[i] for p in v)-.0001 for i in range(3)]),Vector([max(p[i] for p in v)+.0001 for i in range(3)]))
 edges=list(edges);ea=np.array(edges);va=np.array(v);elo=np.minimum(va[ea[:,0]],va[ea[:,1]]);ehi=np.maximum(va[ea[:,0]],va[ea[:,1]])
 return v,edges,BVHTree.FromPolygons(v,f,all_triangles=True),bounds,elo,ehi
def crosses(a,b):
 v,edges=a[:2];tree=b[2];lo,hi=b[3];hits=[]
 if any(a[3][0][k]>hi[k] or a[3][1][k]<lo[k] for k in range(3)):return hits
 selected=np.flatnonzero(np.all(a[4]<=np.array(hi),axis=1)&np.all(a[5]>=np.array(lo),axis=1))
 for edge in selected:
  i,j=edges[edge]
  p,q=v[i],v[j]
  if any(min(p[k],q[k])>hi[k] or max(p[k],q[k])<lo[k] for k in range(3)):continue
  d=q-p;l=d.length
  if l<1e-7:continue
  hit,n,index,dist=tree.ray_cast(p+d*.00001,d.normalized(),l*(1-.00002))
  if hit is not None:hits.append(list(hit))
 return hits
report={'method':'Two-way finite edges versus evaluated triangles. Excludes coplanar and endpoint-only contact. Rest plus 46 native walk poses; not swept collision or arbitrary animation proof.','cases':{}}
for frame in [None,*np.linspace(.8,45.6,46)]:
 arm.data.pose_position='REST' if frame is None else 'POSE'
 if frame is not None:s.frame_set(int(frame),subframe=float(frame)%1)
 for ob in items:ob.hide_set(False)
 bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get();bd=data([base],dg);gd={k:data(v,dg) for k,v in garments.items()};case={}
 for ob in items:
  asset=data([ob],dg);hits=crosses(asset,bd)+crosses(bd,asset);case[ob.name+'/body']={'count':len(hits),'first_hits':hits[:8]}
  for key,target in gd.items():
   if ob.name.startswith('Hair-')!=key.startswith('top-'):continue
   hits=crosses(asset,target)+crosses(target,asset);case[ob.name+'/'+key]={'count':len(hits),'first_hits':hits[:8]}
 report['cases']['rest' if frame is None else str(round(frame,3))]=case
 (O/'crossing-progress.json').write_text(json.dumps({'poses':len(report['cases']),'latest':case},indent=2))
 if len(report['cases'])%5==0:print('POSES',len(report['cases']),flush=True)
report['max_crossings']={k:max(c[k]['count'] for c in report['cases'].values()) for k in case};(O/'crossing-checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report['max_crossings']),flush=True)
