import bpy,json,numpy as np
from pathlib import Path
from mathutils.bvhtree import BVHTree
from mathutils.kdtree import KDTree
R=Path(__file__).resolve().parent;O=R/'outputs'
bpy.ops.wm.open_mainfile(filepath=str(O/'Hair-and-Shoes.blend'))
arm=next(o for o in bpy.data.objects if o.type=='ARMATURE');base=bpy.data.objects['Canonical Base - unchanged'];items=[o for o in bpy.data.objects if o.name.startswith(('Hair-','Shoes-'))]
for o in items:o.hide_set(False)
scene=bpy.context.scene;report={o.name.lower():{'worst_inside_m':0,'max_inside_vertices':0,'max_inside_centroids':0,'worst_frame':None} for o in items}
source={o.name.lower():{'vertices':[v.co[:] for v in o.data.vertices],'bones':{b.name:np.array(b.matrix_local) for b in arm.data.bones}} for o in items}
action=arm.animation_data.action;frames=np.linspace(float(action.frame_range[0]),float(action.frame_range[1]),46)
for frame in [None,*frames]:
 arm.data.pose_position='REST' if frame is None else 'POSE'
 if frame is not None:scene.frame_set(int(frame),subframe=float(frame)%1)
 bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get();be=base.evaluated_get(dg);bm=be.to_mesh();bv=[be.matrix_world@v.co for v in bm.vertices];tree=BVHTree.FromPolygons(bv,[list(f.vertices) for f in bm.polygons]);be.to_mesh_clear()
 for ob in items:
  e=ob.evaluated_get(dg);me=e.to_mesh();v=[e.matrix_world@p.co for p in me.vertices];centres=[sum((v[i] for i in p.vertices),v[p.vertices[0]]*0)/len(p.vertices) for p in me.polygons]
  counts=[];worst=0
  for samples in [v,centres]:
   count=0
   for p in samples:
    q,n,index,d=tree.find_nearest(p);signed=(p-q).dot(n)
    if signed<-.0002:count+=1;worst=min(worst,signed)
   counts.append(count)
  r=report[ob.name.lower()];r['max_inside_vertices']=max(r['max_inside_vertices'],counts[0]);r['max_inside_centroids']=max(r['max_inside_centroids'],counts[1])
  if worst<r['worst_inside_m']:r['worst_inside_m']=worst;r['worst_frame']='rest' if frame is None else float(frame)
  e.to_mesh_clear()
 print('FRAME',frame,flush=True)
(O/'signed-distance-diagnostic.json').write_text(json.dumps({'samples':'rest plus 46 native walk frames; nearest outward surface signed distance below -0.2 mm','items':report},indent=2))
roundtrip={}
for name,src in source.items():
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(O/(name+'.glb')));a=next(o for o in bpy.data.objects if o.type=='ARMATURE');meshes=[o for o in bpy.data.objects if o.type=='MESH' and any(m.type=='ARMATURE' for m in o.modifiers)];v=[p for o in meshes for p in o.data.vertices];kd=KDTree(len(src['vertices']))
 for i,p in enumerate(src['vertices']):kd.insert(p,i)
 kd.balance()
 roundtrip[name]={'bone_count':len(a.data.bones),'bone_names_match':set(src['bones'])==set(a.data.bones.keys()),'bind_matrix_max_abs_delta':max(float(np.abs(np.array(b.matrix_local)-src['bones'][b.name]).max()) for b in a.data.bones),'vertex_nearest_error_m':max(kd.find(p.co)[2] for p in v),'unweighted':sum(not p.groups for p in v),'max_influences':max(len(p.groups) for p in v),'weight_sum_error':max(abs(sum(g.weight for g in p.groups)-1) for p in v),'finite':bool(np.isfinite([p.co[:] for p in v]).all())}
(O/'roundtrip-checks.json').write_text(json.dumps(roundtrip,indent=2));print(json.dumps(report))
