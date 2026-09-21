import bpy,math,json,os
from pathlib import Path
from mathutils import Vector
R=Path(__file__).resolve().parent;O=R/'outputs';W=Path(os.environ.get('CE_GAME_ROOT',R.parent/'wardrobe-live-20260921'))
bpy.ops.wm.open_mainfile(filepath=str(O/'Hair-and-Shoes.blend'));s=bpy.context.scene
s.world=bpy.data.worlds.new('Studio');s.world.color=(.75,.79,.76)
s.render.engine='BLENDER_WORKBENCH';sh=s.display.shading;sh.light='STUDIO';sh.studio_light='paint.sl';sh.color_type='TEXTURE';sh.show_shadows=True;sh.show_cavity=True;sh.cavity_type='BOTH';sh.curvature_ridge_factor=1.25;sh.curvature_valley_factor=1.0;sh.background_type='WORLD'
s.render.resolution_x=440;s.render.resolution_y=480;s.render.resolution_percentage=100;s.render.film_transparent=True
bpy.ops.object.camera_add();cam=bpy.context.object;cam.data.type='ORTHO';s.camera=cam
base=bpy.data.objects['Canonical Base - unchanged'];items=[o for o in bpy.data.objects if o.name.startswith(('Hair-','Shoes-'))]
for ob in items:ob.hide_set(False);ob.hide_render=True
for ob in items:
 ob.hide_render=False
 colours={'Hair-sweep':'543321','Hair-curls':'30251F','Hair-bob':'70412D','Hair-ponytail':'543321','Shoes-trainers':'647D91','Shoes-boots':'AD8049','Shoes-dress':'302B29','Shoes-clogs':'397D88'}
 c=tuple(int(colours[ob.name][i:i+2],16)/255 for i in (0,2,4))
 for mat in ob.data.materials:
  if mat.name in ['Hair_Main','Shoe_Main']:mat.diffuse_color=(*c,1)
  if mat.name in ['Hair_Trim','Shoe_Trim']:mat.diffuse_color=(*(x*.8 for x in c),1)
 isHair=ob.name.startswith('Hair-');target=Vector((0,.01,.884 if isHair else .047));cam.data.ortho_scale=.26 if isHair else .34
 for angle,label in [(0,'front'),(.72,'quarter'),(pi:=math.pi,'rear')]:
  cam.location=target+Vector((math.sin(angle)*2,-math.cos(angle)*2,.1 if isHair else 1.0));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();s.render.filepath=str(O/(ob.name.lower()+'-'+label+'.png'));bpy.ops.render.render(write_still=True)
 # Real style thumbnails include the face for hairstyles, and shoes only for footwear.
 base.hide_render=not isHair;target=Vector((0,.01,.884 if isHair else .04));cam.location=target+Vector((.72,-2,.08 if isHair else 1.35));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();s.render.resolution_x=240;s.render.resolution_y=260;s.render.filepath=str(W/'playable-3d/wardrobe-thumbnails'/ (ob.name.lower()+'.png'));bpy.ops.render.render(write_still=True)
 s.render.resolution_x=440;s.render.resolution_y=480;base.hide_render=False;ob.hide_render=True
