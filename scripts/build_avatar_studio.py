import bpy, math, os

OUT = os.path.join(os.path.dirname(__file__), '..', 'playable-3d', 'assets', 'scenery', 'ecc-avatar-studio-v1.glb')
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, colour, rough=.6, metallic=0, emission=None):
    m=bpy.data.materials.new(name); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*colour,1); p.inputs['Roughness'].default_value=rough; p.inputs['Metallic'].default_value=metallic
    if emission: p.inputs['Emission Color'].default_value=(*emission,1); p.inputs['Emission Strength'].default_value=.8
    return m
limestone=material('Limestone',(.72,.66,.55),.82); navy=material('Navy',(.025,.07,.12),.3,.2); timber=material('Timber',(.36,.19,.075),.65); glass=material('Glass',(.14,.54,.62),.16,.08); teal=material('Avatar teal',(.04,.72,.72),.24,.15,(.02,.45,.47)); green=material('Native planting',(.08,.27,.1),.95); solar=material('Solar panels',(.018,.09,.15),.22,.35); paving=material('Paving',(.60,.56,.49),.88)

def box(name, loc, size, mat, bevel=.04):
    bpy.ops.mesh.primitive_cube_add(location=loc); o=bpy.context.object; o.name=name; o.scale=tuple(v/2 for v in size); bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); o.data.materials.append(mat)
    if bevel: b=o.modifiers.new('Soft edges','BEVEL'); b.width=bevel; b.segments=2
    return o
def cylinder(name,loc,r,d,mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=20,radius=r,depth=d,location=loc); o=bpy.context.object;o.name=name;o.data.materials.append(mat);return o

# Local front is +Y. Compact, modular, campus-scale pavilion.
box('Paved plinth',(0,0,.12),(9,8.8,.24),paving)
box('Rear wall',(0,-3.65,2.15),(7.6,.38,4.1),limestone)
for x in (-3.55,3.55): box('Side pier',(x,0,2.05),(.5,7.2,4),limestone)
box('Navy roof',(0,0,4.15),(8.4,8.15,.26),navy);box('Limestone roof cap',(0,0,4.34),(8.64,8.42,.14),limestone)
for x in (-2.65,-1.35,1.35,2.65):
    box('Window',(x,3.56,2.0),(1.12,.05,3.5),glass,.01);box('Mullion',(x,3.61,2.05),(.12,.12,3.75),navy,.01)
box('Entry glass',(0,3.57,1.85),(1.62,.05,3.35),glass,.01)
for x in (-.86,.86): box('Entry frame',(x,3.61,1.85),(.12,.12,3.5),navy,.01)
box('Entry header',(0,3.61,3.62),(1.9,.14,.18),navy,.01)
box('Veranda roof',(0,4.38,3.3),(8.9,1.15,.22),navy)
for x in (-4.1,4.1): box('Veranda column',(x,4.78,1.72),(.18,.18,3.35),navy,.02)
for side in (-1,1):
    for i in range(6): box('Timber fin',(side*(2.45+i*.17),3.78,2.28),(.09,.24,3.05),timber,.01)
for i in range(3): box('Entry step',(0,4.08+i*.20,.18+i*.12),(3.05-i*.28,.62,.18),limestone,.02)
for x in (-3.5,3.5):
    box('Planter',(x,3.9,.55),(1.45,1.05,.72),limestone)
    for i in range(4): cylinder('Native shrub',(x-.42+i*.28,3.91,1.0),.18,.55,green)
bpy.ops.mesh.primitive_torus_add(major_radius=.87,minor_radius=.075,major_segments=40,minor_segments=10,location=(0,3.78,2.08),rotation=(math.pi/2,0,0)); bpy.context.object.name='Avatar portal'; bpy.context.object.data.materials.append(teal)
cylinder('Portal plinth',(0,3.78,.33),.95,.18,limestone)
for x in (-2.1,-.7,.7,2.1):
    o=box('Solar panel',(x,-.65,4.58),(1.12,2.25,.08),solar,.01);o.rotation_euler=(math.radians(12),0,0)
box('Studio sign band',(0,3.69,3.56),(3.25,.12,.42),navy,.02)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=os.path.abspath(OUT),export_format='GLB',export_materials='EXPORT',export_apply=True,export_yup=True)
