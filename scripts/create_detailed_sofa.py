import bpy
import math
from mathutils import Euler, Vector, Color

print("=== Creating High-Detail Modern Fabric Sofa (Rancangan Detil Sofa) ===")

# Reset Blender scene to factory clean state
bpy.ops.wm.read_factory_settings(use_empty=True)

scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.length_unit = 'METERS'

col_sofa = bpy.data.collections.new("HighDetail_Sofa")
col_light = bpy.data.collections.new("Studio_Lighting")
scene.collection.children.link(col_sofa)
scene.collection.children.link(col_light)

# Helper for PBR Fabric Shader with Sheen & Micro-Bump
def create_fabric_material(name, base_color, roughness=0.85, sheen=0.6):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = base_color
        bsdf.inputs['Roughness'].default_value = roughness
        if 'Sheen Weight' in bsdf.inputs:
            bsdf.inputs['Sheen Weight'].default_value = sheen
        if 'Specular IOR Level' in bsdf.inputs:
            bsdf.inputs['Specular IOR Level'].default_value = 0.3
            
        # Add Bump Node for Fabric Weave Texture
        bump = nodes.new(type='ShaderNodeBump')
        bump.inputs['Strength'].default_value = 0.15
        bump.inputs['Distance'].default_value = 0.01
        
        tex = nodes.new(type='ShaderNodeTexNoise')
        tex.inputs['Scale'].default_value = 250.0
        tex.inputs['Detail'].default_value = 5.0
        
        links.new(tex.outputs['Fac'], bump.inputs['Height'])
        links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
        
    return mat

def create_metal_material(name, color=(0.85, 0.65, 0.25, 1.0)):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = color
        bsdf.inputs['Metallic'].default_value = 0.95
        bsdf.inputs['Roughness'].default_value = 0.2
    return mat

# Materials
mat_sofa_main = create_fabric_material("Mat_DetailedSofa_NordicGrey", (0.22, 0.25, 0.30, 1.0), roughness=0.88)
mat_pillow_mustard = create_fabric_material("Mat_Pillow_Mustard", (0.85, 0.52, 0.12, 1.0), roughness=0.9)
mat_pillow_cream = create_fabric_material("Mat_Pillow_Cream", (0.88, 0.84, 0.78, 1.0), roughness=0.92)
mat_pillow_teal = create_fabric_material("Mat_Pillow_Teal", (0.08, 0.25, 0.30, 1.0), roughness=0.85)
mat_blanket = create_fabric_material("Mat_KnitBlanket_Cream", (0.92, 0.90, 0.85, 1.0), roughness=0.95)
mat_leg_brass = create_metal_material("Mat_SofaLeg_Brass")

# Function to create rounded beveled objects
def add_beveled_box(name, loc, size, radius=0.04, mat=None):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    
    # Apply Scale for Bevel
    bpy.ops.object.transform_apply(scale=True)
    
    # Add Bevel Modifier for organic soft cushion edges
    mod_bevel = obj.modifiers.new(name="Bevel", type='BEVEL')
    mod_bevel.width = radius
    mod_bevel.segments = 4
    mod_bevel.limit_method = 'NONE'
    
    # Subdivision Surface for plush softness
    mod_sub = obj.modifiers.new(name="Subsurf", type='SUBSURF')
    mod_sub.levels = 1
    mod_sub.render_levels = 2
    
    bpy.ops.object.shade_smooth()
    
    if mat:
        obj.data.materials.append(mat)
    col_sofa.objects.link(obj)
    bpy.context.scene.collection.objects.unlink(obj)
    return obj

# -------------------------------------------------------------
# DETAILED SOFA GEOMETRY STRUCTURE
# -------------------------------------------------------------

# 1. Sofa Base Frame & Brass Peg Legs
base_frame = add_beveled_box("Sofa_BaseFrame", (0, 0, 0.18), (2.4, 0.95, 0.14), radius=0.02, mat=mat_sofa_main)

# 4 Brass Conical Legs
leg_positions = [(-1.1, -0.4, 0.06), (1.1, -0.4, 0.06), (-1.1, 0.4, 0.06), (1.1, 0.4, 0.06)]
for i, pos in enumerate(leg_positions):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.12, location=pos)
    leg = bpy.context.active_object
    leg.name = f"Sofa_Leg_{i+1}"
    leg.data.materials.append(mat_leg_brass)
    col_sofa.objects.link(leg)
    bpy.context.scene.collection.objects.unlink(leg)

# 2. Main Backrest & Armrests (Plush Thick Bevels)
backrest = add_beveled_box("Sofa_Backrest", (0, 0.38, 0.58), (2.4, 0.22, 0.65), radius=0.06, mat=mat_sofa_main)
armrest_l = add_beveled_box("Sofa_Armrest_L", (-1.12, 0, 0.45), (0.24, 0.95, 0.42), radius=0.05, mat=mat_sofa_main)
armrest_r = add_beveled_box("Sofa_Armrest_R", (1.12, 0, 0.45), (0.24, 0.95, 0.42), radius=0.05, mat=mat_sofa_main)

# 3. Individual Plush Seat Cushions (3-Piece Modular Seats)
cushion_w = 0.64
for i, x_pos in enumerate([-0.66, 0, 0.66]):
    seat = add_beveled_box(f"Seat_Cushion_{i+1}", (x_pos, -0.05, 0.30), (cushion_w, 0.78, 0.18), radius=0.05, mat=mat_sofa_main)

# 4. Ergonomic Backrest Cushions with Button Tufting Accents
for i, x_pos in enumerate([-0.66, 0, 0.66]):
    back_cushion = add_beveled_box(f"Back_Cushion_{i+1}", (x_pos, 0.26, 0.48), (cushion_w, 0.18, 0.48), radius=0.05, mat=mat_sofa_main)
    back_cushion.rotation_euler = (math.radians(-6), 0, 0)
    
    # Tufting Button Indentations (2 Buttons per Back Cushion)
    for b_x in [-0.15, 0.15]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.015, location=(x_pos + b_x, 0.21, 0.48))
        btn = bpy.context.active_object
        btn.name = f"Tuft_Button_{i+1}"
        btn.data.materials.append(mat_sofa_main)
        col_sofa.objects.link(btn)
        bpy.context.scene.collection.objects.unlink(btn)

# 5. Organic Throw Pillows (3 Pillows with natural tilt & overlapping)
pillow_l1 = add_beveled_box("Pillow_Mustard_L", (-0.9, -0.05, 0.48), (0.38, 0.14, 0.38), radius=0.06, mat=mat_pillow_mustard)
pillow_l1.rotation_euler = (math.radians(-15), math.radians(8), math.radians(15))

pillow_l2 = add_beveled_box("Pillow_Cream_L", (-0.75, 0.05, 0.46), (0.35, 0.12, 0.35), radius=0.05, mat=mat_pillow_cream)
pillow_l2.rotation_euler = (math.radians(-10), math.radians(-5), math.radians(-10))

pillow_r = add_beveled_box("Pillow_Teal_R", (0.85, 0.0, 0.48), (0.40, 0.14, 0.40), radius=0.06, mat=mat_pillow_teal)
pillow_r.rotation_euler = (math.radians(-12), math.radians(-10), math.radians(-18))

# 6. Cozy Knit Throw Blanket (Draped over Right Armrest)
blanket_top = add_beveled_box("Throw_Blanket_Drape", (1.08, -0.05, 0.47), (0.28, 0.65, 0.03), radius=0.015, mat=mat_blanket)
blanket_top.rotation_euler = (math.radians(5), 0, math.radians(-4))

blanket_side = add_beveled_box("Throw_Blanket_Fold", (1.23, -0.05, 0.30), (0.03, 0.62, 0.32), radius=0.015, mat=mat_blanket)

# -------------------------------------------------------------
# LIGHTING & CAMERA FOCUS
# -------------------------------------------------------------

# Studio Key Light (Soft Warm Key)
key_light_data = bpy.data.lights.new(name="Key_Light_Soft", type='AREA')
key_light_data.energy = 120.0
key_light_data.color = (1.0, 0.95, 0.88)
key_light_data.size = 2.5
key_obj = bpy.data.objects.new(name="Key_Light_Soft", object_data=key_light_data)
key_obj.location = (-2.5, -2.2, 2.2)
key_obj.rotation_euler = (math.radians(45), 0, math.radians(-40))
col_light.objects.link(key_obj)

# Studio Fill Light (Cool Shadow Fill)
fill_light_data = bpy.data.lights.new(name="Fill_Light_Cool", type='AREA')
fill_light_data.energy = 60.0
fill_light_data.color = (0.85, 0.92, 1.0)
fill_light_data.size = 3.0
fill_obj = bpy.data.objects.new(name="Fill_Light_Cool", object_data=fill_light_data)
fill_obj.location = (2.5, -2.0, 1.8)
fill_obj.rotation_euler = (math.radians(35), 0, math.radians(40))
col_light.objects.link(fill_obj)

# Studio Rim Light (Gold Fabric Edge Highlight)
rim_light_data = bpy.data.lights.new(name="Rim_Light_Gold", type='SPOT')
rim_light_data.energy = 80.0
rim_light_data.color = (1.0, 0.85, 0.6)
rim_light_data.spot_size = math.radians(60)
rim_obj = bpy.data.objects.new(name="Rim_Light_Gold", object_data=rim_light_data)
rim_obj.location = (0, 2.8, 2.0)
rim_obj.rotation_euler = (math.radians(-35), 0, math.radians(180))
col_light.objects.link(rim_obj)

# Product Camera focused on Full Detailed Sofa
cam_data = bpy.data.cameras.new("Sofa_CloseUp_Cam")
cam_data.lens = 36 # 36mm Product Lens for clean framing
cam_obj = bpy.data.objects.new("Sofa_CloseUp_Cam", cam_data)
cam_obj.location = (-0.3, -3.0, 0.95)
cam_obj.rotation_euler = (math.radians(78), 0, math.radians(-6))
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

# Render Setup
scene.render.engine = 'CYCLES'
scene.cycles.device = 'GPU'
scene.cycles.samples = 128
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPTIX'

out_blend = r"C:\Users\PERSONAL\Downloads\Denia\Cozy_Detailed_Sofa.blend"
bpy.ops.wm.save_as_mainfile(filepath=out_blend)

print(f"✅ HIGH-DETAIL FABRIC SOFA MODEL CREATED & SAVED TO: {out_blend}")
