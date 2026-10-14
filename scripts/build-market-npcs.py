import bpy,json,pathlib,hashlib,sys,argparse
parser=argparse.ArgumentParser();parser.add_argument('--source-dir',required=True);parser.add_argument('--only');args=parser.parse_args(sys.argv[sys.argv.index('--')+1:]);out=pathlib.Path(__file__).resolve().parents[1]/'playable-3d/assets/market-npcs';out.mkdir(parents=True,exist_ok=True)
rows=json.loads((out/'build-receipt.json').read_text()) if (out/'build-receipt.json').exists() else []
for name,source,target in [('mara','Mara.glb',21000),('sam','Sam.glb',20000),('customer-a','NPC3.glb',16000),('customer-b','NPC4.glb',16000),('customer-c','NPC5.glb',16000),('customer-d','stylized+boy+3d+model.glb',16000),('customer-e','3d+cartoon+girl+model.glb',16000)]:
 if args.only and name!=args.only:continue
 rows=[r for r in rows if r['id']!=name]
 bpy.ops.wm.read_factory_settings(use_empty=True);src=pathlib.Path(args.source_dir)/source;bpy.ops.import_scene.gltf(filepath=str(src))
 meshes=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.name!='Icosphere']
 for arm in [o for o in bpy.context.scene.objects if o.type=='ARMATURE']:arm.data.pose_position='REST'
 before=sum(len(o.data.loop_triangles) for o in meshes)
 for o in meshes:
  o.data.calc_loop_triangles();count=len(o.data.loop_triangles)
  if count>target:
   bpy.context.view_layer.objects.active=o;mod=o.modifiers.new('Market delivery reduction','DECIMATE');mod.ratio=target/count;mod.use_collapse_triangulate=True;bpy.ops.object.modifier_apply(modifier=mod.name)
 for img in bpy.data.images:
  if img.size[0]>1024:img.scale(1024,1024)
 for arm in [o for o in bpy.context.scene.objects if o.type=='ARMATURE']:arm.data.pose_position='POSE'
 bpy.ops.object.select_all(action='DESELECT')
 for o in bpy.context.scene.objects:
  if o.type=='ARMATURE' or o in meshes:o.select_set(True)
 dest=out/(name+'.glb')
 bpy.ops.export_scene.gltf(filepath=str(dest),export_format='GLB',use_selection=True,export_image_format='JPEG',export_jpeg_quality=85,export_animations=True,export_animation_mode='ACTIONS',export_skins=True,export_morph=False)
 rows.append({'id':name,'source':source,'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'sourceBytes':src.stat().st_size,'outputBytes':dest.stat().st_size})
 print('MARKET_ASSET',rows[-1],flush=True)
(out/'build-receipt.json').write_text(json.dumps(rows,indent=2)+'\n')
