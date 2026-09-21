"""Deterministic fitted accessories. Metres in the unchanged canonical rest space."""
import bpy, math, json, hashlib, random, os
import numpy as np
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from mathutils.kdtree import KDTree
from math import sin,cos,pi,sqrt
R=Path(__file__).resolve().parent;O=R/'outputs';O.mkdir(exist_ok=True)
W=Path(os.environ.get('CE_GAME_ROOT',R.parent/'wardrobe-live-20260921'));A=W/'playable-3d/assets'
expected='38631c75839ef638ce6821b9ccd7152cbc1f2ca75cd8c7d075c6c6847b732b3e'
assert hashlib.sha256((A/'studio-walking-base.glb').read_bytes()).hexdigest()==expected,'Canonical base differs: '+str(A/'studio-walking-base.glb')
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.context.preferences.filepaths.save_version=0
bpy.ops.import_scene.gltf(filepath=str(A/'studio-walking-base.glb'))
arm=next(o for o in bpy.data.objects if o.type=='ARMATURE');arm.data.pose_position='REST'
base=max((o for o in bpy.data.objects if o.type=='MESH'),key=lambda o:len(o.data.vertices));base.name='Canonical Base - unchanged';bpy.context.view_layer.update()
verts=[base.matrix_world@v.co for v in base.data.vertices];arr=np.array(verts)
bvh=BVHTree.FromPolygons(verts,[list(f.vertices) for f in base.data.polygons]);kd=KDTree(len(verts))
for i,p in enumerate(verts):kd.insert(p,i)
kd.balance()
# Footwear fits inside the existing trouser openings, with the full body retained.
pants_trees=[]
for style in ['scrubs','suit','chef','tradie']:
 before=set(bpy.context.scene.objects);bpy.ops.import_scene.gltf(filepath=str(A/('occupational-pants-'+style+'.glb')));added=set(bpy.context.scene.objects)-before
 for ob in added:
  if ob.type=='MESH' and any(m.type=='ARMATURE' for m in ob.modifiers):
   pants_trees.append(BVHTree.FromPolygons([ob.matrix_world@v.co for v in ob.data.vertices],[list(f.vertices) for f in ob.data.polygons]))
 for ob in added:bpy.data.objects.remove(ob,do_unlink=True)
foot_centres={}
levels=np.linspace(.016,.155,140)
for side in [-1,1]:
 foot=arr[(arr[:,0]*side>0)&(arr[:,2]<.17)];centres=[]
 for z in levels:
  ps=foot[abs(foot[:,2]-z)<.004];centres.append((ps.min(axis=0)+ps.max(axis=0))[:2]/2)
 foot_centres[side]=np.array(centres)
def radial_hits(tree,c,d,side):
 hits=[];start=c.copy();travel=0
 for k in range(16):
  p,n,idx,dist=tree.ray_cast(start,d,.14-travel)
  if p is None:break
  travel+=(p-start).length
  if p.x*side>0:hits.append(travel)
  start=p+d*.00002;travel+=.00002
  if travel>=.14:break
 return hits
def fit_footwear(points):
 result=[]
 for xyz in points:
  p=Vector(xyz)
  # A gentle inner-arch taper keeps the passing foot clear of the loose chef hem.
  if p.z<.030:
   side=1 if p.x>0 else -1;cx=np.interp(p.z,levels,foot_centres[side][:,0])
   inner=max(0,min(1,(abs(cx)-abs(p.x))/.04))**2
   fade=max(0,min(1,(.030-p.z)/.018))
   p.x+=side*.007*inner*fade*(.5+.5*cos(pi*max(-1,min(1,(p.y+.004)/.055))))
  if p.z<.016:result.append(p);continue
  side=1 if p.x>0 else -1;cs=foot_centres[side];c=Vector((np.interp(p.z,levels,cs[:,0]),np.interp(p.z,levels,cs[:,1]),p.z));d=p-c;r=d.length
  if r<1e-8:result.append(p);continue
  d.normalize();hits=radial_hits(bvh,c,d,side)
  if hits:
   minimum=max(hits)+.0013;radius=max(r,minimum)
   if p.z>.049:
    outer=[h[0]-.002 for tree in pants_trees if (h:=radial_hits(tree,c+Vector((0,0,.004)),d,side))]
    if outer:radius=max(minimum,min(radius,min(outer)))
   p=c+d*radius
  result.append(p)
 return result
def mat(name,hex,rough=.65,metal=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;c=tuple(int(hex[i:i+2],16)/255 for i in (0,2,4));m.diffuse_color=(*c,1);n=m.node_tree.nodes.get('Principled BSDF');n.inputs['Base Color'].default_value=(*c,1);n.inputs['Roughness'].default_value=rough;n.inputs['Metallic'].default_value=metal;return m
M=[mat('Hair_Main','543321',.48),mat('Hair_Trim','402719',.5),mat('Hair_Band','262b30',.8),mat('Shoe_Main','647d91'),mat('Shoe_Trim','485c70'),mat('Shoe_Shadow','354555'),mat('Shoe_Rubber','ebe8df',.9),mat('Shoe_Outsole','303435',.9),mat('Shoe_Laces','e0dfd6',.8),mat('Shoe_Metal','b4b2a8',.35,.65)]
class Builder:
 def __init__(self):self.v=[];self.f=[];self.mi=[]
 def patch(self,v,f,m):
  offset=len(self.v);self.v.extend([tuple(p) for p in v]);self.f.extend([tuple(offset+i for i in face) for face in f]);self.mi.extend([m]*len(f))
 def rings(self,rings,m,close_start=False,close_end=False):
  n=len(rings[0]);v=[p for ring in rings for p in ring];f=[]
  for j in range(len(rings)-1):
   for i in range(n):f.append((j*n+i,j*n+(i+1)%n,(j+1)*n+(i+1)%n,(j+1)*n+i))
  if close_start:f.append(tuple(reversed(range(n))))
  if close_end:f.append(tuple((len(rings)-1)*n+i for i in range(n)))
  self.patch(v,f,m)
 def tube(self,points,radius,m,sides=8):
  pts=[Vector(p) for p in points];rings=[];previous=None
  for i,p in enumerate(pts):
   t=(pts[min(i+1,len(pts)-1)]-pts[max(0,i-1)]).normalized();up=Vector((0,0,1))
   if abs(t.dot(up))>.95:up=Vector((0,1,0))
   u=(previous-t*previous.dot(t)).normalized() if previous is not None else t.cross(up).normalized();previous=u.copy();v=t.cross(u).normalized();r=radius[i] if isinstance(radius,list) else radius
   rings.append([p+r*(u*cos(a*2*pi/sides)+v*sin(a*2*pi/sides)) for a in range(sides)])
  self.rings(rings,m,True,True)
 def object(self,name,hair=False):
  if not hair:self.v=fit_footwear(self.v)
  me=bpy.data.meshes.new(name);me.from_pydata(self.v,[],self.f);me.update();ob=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(ob)
  for m in M:me.materials.append(m)
  for f,mi in zip(me.polygons,self.mi):f.material_index=mi;f.use_smooth=True
  # Recalculate each shell's winding and retain real thickness at openings.
  bpy.context.view_layer.objects.active=ob;ob.select_set(True);bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.normals_make_consistent(inside=False);bpy.ops.object.mode_set(mode='OBJECT');ob.select_set(False)
  if name=='Hair-curls':
   bpy.context.view_layer.objects.active=ob
   rem=ob.modifiers.new('Joined curl volume','REMESH');rem.mode='VOXEL';rem.voxel_size=.0013;rem.use_smooth_shade=True;bpy.ops.object.modifier_apply(modifier=rem.name)
   smooth=ob.modifiers.new('Soft curl joins','SMOOTH');smooth.factor=.75;smooth.iterations=3;bpy.ops.object.modifier_apply(modifier=smooth.name)
   dec=ob.modifiers.new('Game curl mesh','DECIMATE');dec.ratio=.10;bpy.ops.object.modifier_apply(modifier=dec.name)
   me=ob.data
   # Retain the continuous fitted under-cap: voxel union may omit its thin open shell.
   cv,cf,cmi=self.cap
   offset=len(me.vertices);vv=[v.co[:] for v in me.vertices]+cv;ff=[tuple(f.vertices) for f in me.polygons]+[tuple(offset+i for i in f) for f in cf];mi=[f.material_index for f in me.polygons]+cmi
   out=bpy.data.meshes.new(name+' finished');out.from_pydata(vv,[],ff)
   for m in M:out.materials.append(m)
   ob.data=out;me=out
   for f,matid in zip(me.polygons,mi):f.use_smooth=True;f.material_index=matid
  groups={g.name:ob.vertex_groups.new(name=g.name) for g in base.vertex_groups}
  for v in me.vertices:
   if hair:weights={'Head':1.0}
   else:
    weights={}
    for co,index,d in kd.find_n(v.co,4):
     fac=1/max(.0007,d)**2
     for g in base.data.vertices[index].groups:
      n=base.vertex_groups[g.group].name;weights[n]=weights.get(n,0)+g.weight*fac
    weights=dict(sorted(weights.items(),key=lambda x:x[1],reverse=True)[:4]);total=sum(weights.values());weights={k:x/total for k,x in weights.items()}
   for k,x in weights.items():groups[k].add([v.index],x,'REPLACE')
  mod=ob.modifiers.new('Canonical skeleton','ARMATURE');mod.object=arm;ob.parent=arm
  return ob

C=Vector((.0008,.001,.908))
def endtheta(a):
 # Front hairline stays above the brows; sides stop above the ears.
 return 1.43+.73*max(0,-cos(a))**4-.20*max(0,cos(a))**1.5
def scalp(a,t,style='sweep'):
 d=Vector((sin(t)*sin(a),-sin(t)*cos(a),cos(t)))
 hit=bvh.ray_cast(C,d,.25)[0];p=hit if hit else C+Vector((.064*d.x,.073*d.y,.073*d.z))
 extra={'sweep':.005,'curls':.007,'bob':.008,'ponytail':.004}[style]
 if style=='sweep':extra+=.012*math.exp(-((t-.6)/.55)**2)*(.5+.5*max(0,cos(a-.5)))
 if style=='curls':extra+=.005*(.5+.5*sin(a*14+t*3)*sin(t*14))
 if style=='bob':extra+=.004*sin(t)**2
 flow=a*32+t*9
 extra+=.00032*cos(flow)*sin(t)**2
 return p+d*extra
def hair(style):
 b=Builder();rings=[];N=96;rows=32
 # Polar cap and tucked edge return.
 for j in range(rows+1):
  ring=[]
  for i in range(N):
   a=2*pi*i/N;u=j/rows;t=.005+(endtheta(a)-.005)*u;p=scalp(a,t,style)
   if style=='bob':
    lateral=max(0,min(1,(abs(math.atan2(sin(a),cos(a)))-.65)/.5));q=max(0,(u-.55)/.45)
    if q>0:
     start=scalp(a,.005+(endtheta(a)-.005)*.55,style)
     dest=Vector((.0008+.077*sin(a),.005-.083*cos(a),.818+.007*cos(a)))
     skirt=start.lerp(dest,q)+Vector((sin(a),-cos(a),0))*(.007*sin(pi*q))
     p=p.lerp(skirt,lateral)
   if style=='sweep':p+=(p-C).normalized()*(.0035*max(0,sin(t))*max(0,cos(a-.35))**2*(.5+.5*cos(a*20+t*8)))
   ring.append(p)
  rings.append(ring)
 b.rings(rings,0,True)
 b.rings([rings[-1],[p-(p-C).normalized()*.003 for p in rings[-1]]],1)
 if style=='curls':
  b.cap=(list(b.v),list(b.f),list(b.mi))
  rng=random.Random(19)
  for j in range(0,8):
   t=.10+j*.225;count=max(3,int(31*sin(t)))
   for i in range(count):
    a=i*2*pi/count+j*.23
    if t>endtheta(a)-.04:continue
    p=scalp(a,t,style);n=(p-C).normalized();u=Vector((cos(a),sin(a),0));v=n.cross(u).normalized();rr=.0105+rng.random()*.0015;rows=[]
    for phi in np.linspace(.03,pi-.03,10):
     rows.append([p+n*(.001+.005*cos(phi))+u*(rr*cos(k*2*pi/14)*sin(phi))+v*(rr*1.12*sin(k*2*pi/14)*sin(phi)) for k in range(14)])
    b.rings(rows,0,True,True)
 if style=='ponytail':
  pts=[];r=[]
  for j in range(40):
   u=j/39;pts.append(Vector((.003+.014*sin(pi*u),.075+.071*sin(pi*u*.7),.936-.151*u)));r.append(.009+.011*sin(pi*u)**.75-.008*u**4)
  b.tube(pts,r,0,24)
  for i in range(0):
   a=i*2*pi/14;lock=[p+Vector((cos(a),sin(a)*.8,0))*(rad+.0004) for p,rad in zip(pts,r)];b.tube(lock,.00065,0,5)
  b.tube([Vector((.003+.011*cos(a),.084,.922+.011*sin(a))) for a in np.linspace(0,2*pi,33)],.0023,2,8)
 return b.object('Hair-'+style,True)

def shoes(style):
 b=Builder();height={'trainers':.069,'boots':.122,'dress':.060,'clogs':.052}[style]
 for side in [-1,1]:
  foot=arr[(arr[:,0]*side>0)&(arr[:,2]<.155)]
  zs=np.linspace(.006,height,30);params=[]
  for z in zs:
   points=foot[(foot[:,2]<.030) if z<.020 else (abs(foot[:,2]-z)<(.002 if z>.045 else .004))]
   lo=points.min(axis=0);hi=points.max(axis=0);cx=(lo[0]+hi[0])/2;cy=(lo[1]+hi[1])/2
   ease=.002 if z>.045 else .004;rx=(hi[0]-lo[0])/2+ease;ry=(hi[1]-lo[1])/2+ease
   factor=max(1,float(np.max((abs((points[:,0]-cx)/rx)**2.55+abs((points[:,1]-cy)/ry)**2.55)**(1/2.55))))
   params.append([cx,cy,rx*factor+.001,ry*factor+.001])
  params=np.array(params)
  # Smooth silhouette, then expand to contain the sampled foot at each level.
  for k in range(5):params[1:-1]=(params[:-2]+2*params[1:-1]+params[2:])/4
  def ring(z,par,add=0):
   cx,cy,rx,ry=par
   return [Vector((cx+(rx+add)*math.copysign(abs(cos(a))**.78,cos(a)),cy+(ry+add)*math.copysign(abs(sin(a))**.78,sin(a)),z)) for a in np.linspace(0,2*pi,64,endpoint=False)]
  solepar=params[0].copy();solepar[2]+=.001;solepar[3]+=.001
  soleMat=7 if style in ['boots','dress'] else 6
  b.rings([ring(-.005,solepar),ring(-.003,solepar,.001),ring(.003,solepar,.001),ring(.008,solepar)],soleMat,True)
  upper=[ring(float(z),p) for z,p in zip(zs,params)];b.rings(upper,3)
  # Narrow padded welt and a turned rim; the ankle opening is real.
  b.tube(ring(.008,solepar)+[ring(.008,solepar)[0]],.0013,4 if style=='boots' else soleMat,8)
  rim=upper[-1];b.tube(rim+[rim[0]],.002,4,8)
  inner=ring(height-.002,params[-1],-.0006);b.rings([rim,inner],4)
  def front(z,dx=0):
   par=[np.interp(z,zs,params[:,i]) for i in range(4)];cx,cy,rx,ry=par
   return Vector((cx+dx,cy-ry*(max(0,1-(abs(dx)/rx)**2.55))**.39-.001,z))
  if style!='clogs':
   # Raised tongue, crossed laces and metal eyelets seated on the sloped instep.
   zvals=np.linspace(.027 if style=='dress' else .030,height-.007,18);tongue=[]
   for z in zvals:tongue.append([front(z,dx) for dx in np.linspace(-.010,.010,9)])
   b.patch([p for row in tongue for p in row],[(j*9+i,j*9+i+1,(j+1)*9+i+1,(j+1)*9+i) for j in range(17) for i in range(8)],4)
   for z in np.linspace(.031 if style=='dress' else .036,height-.009,4 if style=='dress' else 5 if style!='boots' else 7):
    for flip in [-1,1]:
     pts=[front(z+u*.004,flip*(u-.5)*.019)+Vector((0,-.0015,0)) for u in np.linspace(0,1,7)];b.tube(pts,.0008 if style=='dress' else .00115,8 if style=='trainers' else 7,7)
    for dx in [-.012,.012]:
     p=front(z,dx);b.tube([p+Vector((.0018*cos(a),-.0007,.0018*sin(a))) for a in np.linspace(0,2*pi,13)],.0006,9,6)
   if style=='dress':
    # Curved toe-cap seam across the vamp.
    z=.028;pts=[front(z+.003*cos(u*pi/2),u*.027) for u in np.linspace(-1,1,32)];b.tube(pts,.00065,5,6)
   if style=='trainers':
    for sign in [-1,1]:
     pts=[]
     for u in np.linspace(0,1,20):
      z=.02+.03*u;par=np.array([np.interp(z,zs,params[:,i]) for i in range(4)]);cx,cy,rx,ry=par
      pts.append(Vector((cx+sign*(rx+.001),cy+.006+.010*sin(pi*u),z)))
     b.tube(pts,.003,6,8)
   if style=='boots':
    # Reinforced toe and a stitched quarter panel, with a heel pull tab.
    for sign in [-1,1]:
     pts=[ring(float(z),p)[0 if sign==1 else 32] for z,p in zip(zs[5:],params[5:])];b.tube(pts,.0007,8,6)
    cx,cy,rx,ry=params[-1];p=Vector((cx,cy+ry+.006,height));b.tube([p+Vector((0,0,-.015)),p+Vector((0,.004,.008)),p+Vector((0,-.002,.012)),p+Vector((0,-.005,-.014))],.003,4,10)
  else:
   # Moulded closed toe and a separate curved heel strap, contrasting ventilation insets.
   cx,cy,rx,ry=params[-1];pts=[Vector((cx+rx*1.03*cos(a),cy+ry*1.04*sin(a),height-.010+.003*sin(a))) for a in np.linspace(0,pi,30)];b.tube(pts,.0035,4,10)
   for z in [.025,.034]:
    for dx in [-.014,0,.014]:
     p=front(z,dx);b.tube([p+Vector((.0015*cos(a),-.0002,.001*sin(a))) for a in np.linspace(0,2*pi,13)],.0007,5,6)
 return b.object('Shoes-'+style)

objects=[];report={}
for family,styles,fn in [('hair',['sweep','curls','bob','ponytail'],hair),('shoes',['trainers','boots','dress','clogs'],shoes)]:
 for style in styles:
  ob=fn(style);objects.append(ob)
  for o in bpy.context.view_layer.objects:o.select_set(False)
  ob.select_set(True);arm.select_set(True);bpy.context.view_layer.objects.active=arm
  path=O/f'{family}-{style}.glb'
  bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,export_animations=False,export_skins=True,export_all_influences=False,export_rest_position_armature=True,export_cameras=False,export_lights=False)
  report[f'{family}-{style}']={'bytes':path.stat().st_size,'vertices':len(ob.data.vertices),'triangles':sum(len(f.vertices)-2 for f in ob.data.polygons),'materials':sorted(set(M[f.material_index].name for f in ob.data.polygons))}
  ob.hide_render=True;ob.hide_set(True)
report['canonical_source_sha256']=hashlib.sha256((A/'studio-walking-base.glb').read_bytes()).hexdigest()
(O/'build-report.json').write_text(json.dumps(report,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(O/'Hair-and-Shoes.blend'))
print(json.dumps(report))
