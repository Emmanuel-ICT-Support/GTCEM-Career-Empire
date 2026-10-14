import bpy
from pathlib import Path
from mathutils import Vector,Matrix
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(Path('work/game-live/playable-3d/assets/player-tripo-20260908.glb').resolve()))
s=bpy.context.scene;r=next(o for o in s.objects if o.type=='ARMATURE');s.frame_set(1);r.data.pose_position='REST';bpy.context.view_layer.update();deps=bpy.context.evaluated_depsgraph_get()
# A temporary joined posed source retains named vertex groups from all torso/arm parts.
verts=[];faces=[];weights=[]
for name in ['tripo_part_0','tripo_part_5','tripo_part_6']:
 o=bpy.data.objects[name];ev=o.evaluated_get(deps);off=len(verts)
 verts.extend([o.matrix_world@v.co for v in ev.data.vertices]);faces.extend([tuple(off+i for i in p.vertices) for p in ev.data.polygons]);weights.extend([[(o.vertex_groups[g.group].name,g.weight) for g in v.groups] for v in o.data.vertices])
mesh=bpy.data.meshes.new('Posed weight source');mesh.from_pydata(verts,[],faces);mesh.update();source=bpy.data.objects.new('Posed weight source',mesh);s.collection.objects.link(source)
for i,ws in enumerate(weights):
 for n,w in ws:
  vg=source.vertex_groups.get(n) or source.vertex_groups.new(name=n);vg.add([i],w,'REPLACE')
bpy.ops.import_scene.fbx(filepath=str(next(Path('work/tripo-shirt').glob('*.fbx')).resolve()));shirt=next(o for o in bpy.context.selected_objects if o.type=='MESH');shirt.name='Tripo uniform shirt'
# Identify sleeves by connected regions below the armpits, then blend over the shoulder.
import heapq,math,bmesh
coords=[shirt.matrix_world@v.co for v in shirt.data.vertices]
adj=[[] for _ in coords]
for e in shirt.data.edges:
 a,b=e.vertices;length=(coords[a]-coords[b]).length;adj[a].append((b,length));adj[b].append((a,length))
visited=set();regions=[]
for i,p in enumerate(coords):
 if i in visited or p.z>.5:continue
 stack=[i];visited.add(i);region=[]
 while stack:
  j=stack.pop();region.append(j)
  for k,_ in adj[j]:
   if k not in visited and coords[k].z<=.5:visited.add(k);stack.append(k)
 if len(region)>100:regions.append(region)
def distances(seed):
 d=[1e9]*len(coords);q=[]
 for i in seed:d[i]=0;heapq.heappush(q,(0,i))
 while q:
  cost,i=heapq.heappop(q)
  if cost>d[i]:continue
  for j,length in adj[i]:
   v=cost+length
   if v<d[j]:d[j]=v;heapq.heappush(q,(v,j))
 return d
body=max(regions,key=len);arms=[j for region in regions if region is not body for j in region]
db=distances(body);da=distances(arms)
for i,v in enumerate(shirt.data.vertices):
 p=coords[i];side=1 if p.x>0 else -1
 torso=Vector((p.x*.43,p.y*.39-.003,p.z*.35-.035))
 u=(.79-p.z)/.79
 sleeve=Vector((side*(.108+.292*u),(.026-.027*u)+(p.y-(.03+.04*u))*.40,(.264-.020*u)+(abs(p.x)-(.275+.060*u))*.40))
 t=max(0,min(1,.5+(db[i]-da[i])/.12));t=t*t*(3-2*t)
 v.co=torso.lerp(sleeve,t)
 if t<.05 and p.z<.24:
  v.co.y*=1+.30*max(0,1-p.z/.24)
# Smooth the deformed shoulder transitions while preserving collar, tie and cuffs.
for iteration in range(35):
 old=[v.co.copy() for v in shirt.data.vertices]
 for i,v in enumerate(shirt.data.vertices):
  p=coords[i]
  strength=.48*max(0,min(1,(abs(p.x)-.15)/.10))*max(0,min(1,(p.z-.38)/.18))
  if strength and adj[i]:v.co=old[i].lerp(sum((old[j] for j,_ in adj[i]),Vector())/len(adj[i]),strength)
# Imported custom normals describe the unposed garment; recompute after fitting.
if shirt.data.has_custom_normals:shirt.data.normals_split_custom_set([(0,0,0)]*len(shirt.data.loops))
shirt.data.update()
# Conceal the avatar surfaces covered by clothing; retain visible hands.
for name in ['tripo_part_5','tripo_part_6']:
 arm=bpy.data.objects[name];bm=bmesh.new();bm.from_mesh(arm.data)
 remove=[f for f in bm.faces if all(abs((arm.matrix_world@v.co).x)<.37 for v in f.verts)]
 bmesh.ops.delete(bm,geom=remove,context='FACES');bm.to_mesh(arm.data);bm.free()
shirt.matrix_world=Matrix.Identity(4);bpy.context.view_layer.objects.active=shirt
mod=shirt.modifiers.new('Video workflow - vertex group transfer','DATA_TRANSFER');mod.object=source;mod.use_vert_data=True;mod.data_types_verts={'VGROUP_WEIGHTS'};mod.vert_mapping='POLYINTERP_NEAREST';mod.layers_vgroup_select_src='ALL';mod.layers_vgroup_select_dst='NAME'
bpy.ops.object.datalayout_transfer(modifier=mod.name);bpy.ops.object.modifier_apply(modifier=mod.name)
# Blend neighbouring weights to avoid nearest-surface assignment seams.
ws=[{g.group:g.weight for g in v.groups} for v in shirt.data.vertices]
for _ in range(12):
 updated=[]
 for i,weights in enumerate(ws):
  result={k:v*.6 for k,v in weights.items()}
  if adj[i]:
   for j,_ in adj[i]:
    for k,v in ws[j].items():result[k]=result.get(k,0)+v*.4/len(adj[i])
  updated.append(result)
 ws=updated
# Cuffs follow the wrist, never individual finger bones.
for i,v in enumerate(shirt.data.vertices):
 p=coords[i]
 if p.z<.17 and da[i]<1e-8:
  name='L_Hand' if v.co.x>0 else 'R_Hand'
  vg=shirt.vertex_groups.get(name)
  if vg:
   t=max(0,min(1,(.17-p.z)/.12))
   ws[i]={k:w*(1-t) for k,w in ws[i].items()}
   ws[i][vg.index]=ws[i].get(vg.index,0)+t
for vg in shirt.vertex_groups:vg.remove(list(range(len(ws))))
for i,weights in enumerate(ws):
 total=sum(weights.values())
 for k,w in weights.items():
  if w>.0001:shirt.vertex_groups[k].add([i],w/total,'REPLACE')
mod=shirt.modifiers.new('Existing avatar armature','ARMATURE');mod.object=r
source.hide_render=True;source.hide_set(True);bpy.data.objects['tripo_part_0'].hide_render=True
r.data.pose_position='POSE';s.frame_set(1);bpy.context.view_layer.update()
# Matched render setup.
s.render.engine='CYCLES';s.cycles.samples=20
w=bpy.data.worlds.new('Studio');s.world=w;w.use_nodes=True;w.node_tree.nodes['Background'].inputs[0].default_value=(.4,.4,.4,1)
bpy.ops.object.camera_add(location=(.9,-3,1));c=bpy.context.object;c.rotation_euler=(Vector((0,0,.05))-c.location).to_track_quat('-Z','Y').to_euler();c.data.type='ORTHO';c.data.ortho_scale=1.2;s.camera=c
bpy.ops.object.light_add(type='AREA',location=(-2,-3,3));bpy.context.object.data.energy=300;bpy.context.object.data.size=4
s.render.resolution_x=900;s.render.resolution_y=1100;s.render.resolution_percentage=100
bpy.ops.wm.save_as_mainfile(filepath=str(Path('outputs/tripo-shirt-transfer.blend').resolve()))
for frame in [1,18,36]:
 s.frame_set(frame);s.render.filepath=str(Path('outputs/tripo-shirt-transfer-'+str(frame)+'.png').resolve());bpy.ops.render.render(write_still=True)
