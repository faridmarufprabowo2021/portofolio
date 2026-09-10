import bpy
import math
from mathutils import Euler, Vector, Color

print("=== Constructing Perfect Living Room: Front-Facing Sofa, Detailed TV, Soundbar & Detailed PS5 ===")

# Reset Blender scene to factory clean state
bpy.ops.wm.read_factory_settings(use_empty=True)

scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.length_unit = 'METERS'

col_arch = bpy.data.collections.new("01_Architecture")
col_furn = bpy.data.collections.new("02_Furniture")
col_decor = bpy.data.collections.new("03_Decor")
col_light = bpy.data.collections.new("04_Lighting")

scene.collection.children.link(col_arch)
scene.collection.children.link(col_furn)
scene.collection.children.link(col_decor)
scene.collection.children.link(col_light)

# Helper function for PBR materials
def create_pbr(name, color, roughness=0.5, metallic=0.0, specular=0.5, emission=None, emission_str=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = color
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metallic
        if 'Specular IOR Level' in bsdf.inputs:
            bsdf.inputs['Specular IOR Level'].default_value = specular
        if emission:
            if 'Emission Color' in bsdf.inputs:
                bsdf.inputs['Emission Color'].default_value = emission
                bsdf.inputs['Emission Strength'].default_value = emission_str
    return mat

def add_box(name, loc, size, mat, col):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    if mat: o.data.materials.append(mat)
    col.objects.link(o)
    bpy.context.scene.collection.objects.unlink(o)
    return o

def add_cyl(name, loc, r, d, mat, col):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc)
    o = bpy.context.active_object
    o.name = name
    if mat: o.data.materials.append(mat)
    col.objects.link(o)
    bpy.context.scene.collection.objects.unlink(o)
    return o

def add_beveled_box(name, loc, size, radius=0.04, mat=None, col=col_furn):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(scale=True)
    
    mod_bevel = obj.modifiers.new(name="Bevel", type='BEVEL')
    mod_bevel.width = radius
    mod_bevel.segments = 4
    mod_bevel.limit_method = 'NONE'
    
    mod_sub = obj.modifiers.new(name="Subsurf", type='SUBSURF')
    mod_sub.levels = 1
    mod_sub.render_levels = 2
    
    bpy.ops.object.shade_smooth()
    if mat:
        obj.data.materials.append(mat)
    col.objects.link(obj)
    bpy.context.scene.collection.objects.unlink(obj)
    return obj

# -------------------------------------------------------------
# MATERIALS SETUP
# -------------------------------------------------------------
m_floor = create_pbr("Mat_OakFloor", (0.42, 0.26, 0.14, 1.0), 0.3, 0.0, 0.6)
m_wall = create_pbr("Mat_WallOffWhite", (0.92, 0.90, 0.86, 1.0), 0.85)
m_accent = create_pbr("Mat_WallTeal", (0.08, 0.18, 0.22, 1.0), 0.7)
m_wood = create_pbr("Mat_WalnutWood", (0.20, 0.12, 0.07, 1.0), 0.4)
m_sofa = create_pbr("Mat_SofaFabric", (0.25, 0.28, 0.32, 1.0), 0.88)
m_mustard = create_pbr("Mat_PillowMustard", (0.85, 0.52, 0.12, 1.0), 0.85)
m_cream = create_pbr("Mat_PillowCream", (0.88, 0.84, 0.78, 1.0), 0.9)
m_teal = create_pbr("Mat_PillowTeal", (0.08, 0.25, 0.30, 1.0), 0.85)
m_blanket = create_pbr("Mat_KnitBlanket", (0.92, 0.90, 0.85, 1.0), 0.95)
m_rug = create_pbr("Mat_AreaRug", (0.82, 0.78, 0.72, 1.0), 0.95)
m_brass = create_pbr("Mat_Brass", (0.85, 0.65, 0.25, 1.0), 0.25, 0.95)
m_glass = create_pbr("Mat_Glass", (0.9, 0.95, 1.0, 0.2), 0.02, 0.0, 1.0)
m_curtain = create_pbr("Mat_Curtain", (0.95, 0.94, 0.92, 1.0), 0.9)
m_pot = create_pbr("Mat_CeramicPot", (0.95, 0.93, 0.90, 1.0), 0.3)
m_leaf = create_pbr("Mat_Leaf", (0.05, 0.35, 0.08, 1.0), 0.4)

# DETAILED TV & SOUNDBAR MATERIALS
m_tv_bezel = create_pbr("Mat_TV_BezelBrushed", (0.04, 0.04, 0.05, 1.0), 0.15, 0.9)
m_tv_game_screen = create_pbr("Mat_TV_GameUI_Screen", (0.05, 0.45, 0.85, 1.0), roughness=0.08, emission=(0.05, 0.45, 0.85, 1.0), emission_str=2.8)
m_soundbar_mesh = create_pbr("Mat_SoundbarGrille", (0.08, 0.08, 0.09, 1.0), roughness=0.6, metallic=0.5)

# DETAILED PS5 MATERIALS
m_ps5_white = create_pbr("Mat_PS5_WhiteShell", (0.96, 0.96, 0.98, 1.0), 0.25, 0.0, 0.8)
m_ps5_black = create_pbr("Mat_PS5_BlackGloss", (0.02, 0.02, 0.03, 1.0), 0.08, 0.0, 1.0)
m_ps5_blue_led = create_pbr("Mat_PS5_BlueLED", (0.0, 0.6, 1.0, 1.0), emission=(0.0, 0.6, 1.0, 1.0), emission_str=8.0)
m_ps5_btn = create_pbr("Mat_PS5_MicroButton", (0.15, 0.15, 0.16, 1.0), 0.2, 0.8)
m_warm_led = create_pbr("Mat_WarmLED", (1.0, 0.85, 0.6, 1.0), emission=(1.0, 0.85, 0.6, 1.0), emission_str=4.5)

# -------------------------------------------------------------
# 1. ARCHITECTURE
# -------------------------------------------------------------
add_box("Floor", (0, 0, -0.05), (5.0, 6.0, 0.1), m_floor, col_arch)
add_box("Baseboard_B", (0, 2.95, 0.06), (5.0, 0.02, 0.12), m_wood, col_arch)
add_box("Baseboard_L", (-2.45, 0, 0.06), (0.02, 6.0, 0.12), m_wood, col_arch)

add_box("Wall_Accent", (0, 3.0, 1.4), (5.0, 0.1, 2.8), m_accent, col_arch)
add_box("Wall_Left", (-2.5, 0, 1.4), (0.1, 6.0, 2.8), m_wall, col_arch)

add_box("Wall_R_Top", (2.5, 0, 2.6), (0.1, 6.0, 0.4), m_wall, col_arch)
add_box("Wall_R_Bot", (2.5, 0, 0.1), (0.1, 6.0, 0.2), m_wall, col_arch)

add_box("Window_Frame", (2.48, 0, 1.35), (0.05, 5.6, 2.3), m_tv_bezel, col_arch)
add_box("Window_Glass", (2.48, 0, 1.35), (0.02, 5.5, 2.2), m_glass, col_arch)

add_box("Curtain_L", (2.35, -2.6, 1.35), (0.15, 0.6, 2.4), m_curtain, col_decor)
add_box("Curtain_R", (2.35, 2.6, 1.35), (0.15, 0.6, 2.4), m_curtain, col_decor)

# -------------------------------------------------------------
# 2. HIGH-DETAIL SOFA (FACING TV AT y = 3.0)
# -------------------------------------------------------------
# Sofa Base & Brass Legs (Positioned at y = 0.2 facing y = 3.0)
add_beveled_box("Sofa_BaseFrame", (0, 0.2, 0.18), (2.4, 0.95, 0.14), radius=0.02, mat=m_sofa)

leg_positions = [(-1.1, -0.2, 0.06), (1.1, -0.2, 0.06), (-1.1, 0.6, 0.06), (1.1, 0.6, 0.06)]
for i, pos in enumerate(leg_positions):
    add_cyl(f"Sofa_Leg_{i+1}", pos, r=0.03, d=0.12, mat=m_brass, col=col_furn)

# Backrest & Armrests (Backrest is at y = -0.18, Seats extend forward to y = 0.25 facing TV)
add_beveled_box("Sofa_Backrest", (0, -0.18, 0.58), (2.4, 0.22, 0.65), radius=0.06, mat=m_sofa)
add_beveled_box("Sofa_Armrest_L", (-1.12, 0.2, 0.45), (0.24, 0.95, 0.42), radius=0.05, mat=m_sofa)
add_beveled_box("Sofa_Armrest_R", (1.12, 0.2, 0.45), (0.24, 0.95, 0.42), radius=0.05, mat=m_sofa)

# 3 Plush Seat Cushions (Front Seats facing TV)
cushion_w = 0.64
for i, x_pos in enumerate([-0.66, 0, 0.66]):
    add_beveled_box(f"Seat_Cushion_{i+1}", (x_pos, 0.25, 0.30), (cushion_w, 0.78, 0.18), radius=0.05, mat=m_sofa)

# 3 Ergonomic Backrest Cushions with Button Tufting
for i, x_pos in enumerate([-0.66, 0, 0.66]):
    back_c = add_beveled_box(f"Back_Cushion_{i+1}", (x_pos, -0.06, 0.56), (cushion_w, 0.18, 0.48), radius=0.05, mat=m_sofa)
    back_c.rotation_euler = (math.radians(-6), 0, 0)
    
    for b_x in [-0.15, 0.15]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.015, location=(x_pos + b_x, -0.01, 0.56))
        btn = bpy.context.active_object
        btn.name = f"Tuft_Button_{i+1}"
        btn.data.materials.append(m_sofa)
        col_furn.objects.link(btn)
        bpy.context.scene.collection.objects.unlink(btn)

# Organic Throw Pillows
p1 = add_beveled_box("Pillow_Mustard_L", (-0.9, 0.25, 0.48), (0.38, 0.14, 0.38), radius=0.06, mat=m_mustard)
p1.rotation_euler = (math.radians(-15), math.radians(8), math.radians(15))

p2 = add_beveled_box("Pillow_Cream_L", (-0.75, 0.35, 0.46), (0.35, 0.12, 0.35), radius=0.05, mat=m_cream)
p2.rotation_euler = (math.radians(-10), math.radians(-5), math.radians(-10))

p3 = add_beveled_box("Pillow_Teal_R", (0.85, 0.30, 0.48), (0.40, 0.14, 0.40), radius=0.06, mat=m_teal)
p3.rotation_euler = (math.radians(-12), math.radians(-10), math.radians(-18))

# Knit Throw Blanket
blanket_top = add_beveled_box("Throw_Blanket_Drape", (1.08, 0.25, 0.47), (0.28, 0.65, 0.03), radius=0.015, mat=m_blanket)
blanket_top.rotation_euler = (math.radians(5), 0, math.radians(-4))
add_beveled_box("Throw_Blanket_Fold", (1.23, 0.25, 0.30), (0.03, 0.62, 0.32), radius=0.015, mat=m_blanket)

# Area Rug under sofa & coffee table
add_box("Area_Rug", (0, 0.9, 0.01), (2.8, 2.4, 0.015), m_rug, col_decor)

# Coffee Table & Decor (In front of Sofa)
add_box("CoffeeTable_Top", (0, 1.35, 0.38), (1.1, 0.6, 0.04), m_wood, col_furn)
add_box("Table_Leg1", (-0.45, 1.10, 0.18), (0.05, 0.05, 0.36), m_brass, col_furn)
add_box("Table_Leg2", (0.45, 1.10, 0.18), (0.05, 0.05, 0.36), m_brass, col_furn)
add_box("Table_Leg3", (-0.45, 1.60, 0.18), (0.05, 0.05, 0.36), m_brass, col_furn)
add_box("Table_Leg4", (0.45, 1.60, 0.18), (0.05, 0.05, 0.36), m_brass, col_furn)

add_box("Decor_Book1", (-0.2, 1.35, 0.42), (0.22, 0.28, 0.03), m_mustard, col_decor)
add_box("Decor_Book2", (-0.2, 1.35, 0.45), (0.20, 0.25, 0.03), m_wall, col_decor)
add_cyl("Decor_Mug", (0.25, 1.40, 0.44), r=0.04, d=0.09, mat=m_pot, col=col_decor)

# -------------------------------------------------------------
# 3. HIGH-DETAIL SMART TV, SOUNDBAR & TV CABINET
# -------------------------------------------------------------
add_box("TV_Cabinet", (0, 2.75, 0.25), (2.4, 0.45, 0.45), m_wood, col_furn)
add_box("TV_Cabinet_Door", (0, 2.51, 0.25), (2.3, 0.02, 0.38), m_wall, col_furn)

# Ultra-thin Metallic TV Bezel & Glowing Game UI Screen
add_box("SmartTV_Bezel", (0, 2.88, 1.45), (1.50, 0.03, 0.88), m_tv_bezel, col_furn)
add_box("SmartTV_GameScreen", (0, 2.86, 1.45), (1.46, 0.01, 0.84), m_tv_game_screen, col_furn)
add_box("TV_LED_Backlight", (0, 2.92, 1.45), (1.48, 0.01, 0.85), m_warm_led, col_light)

# Modern Soundbar under TV
add_beveled_box("TV_Soundbar", (0, 2.72, 0.98), (0.95, 0.10, 0.06), radius=0.015, mat=m_soundbar_mesh, col=col_furn)
add_box("TV_Cable_Raceway", (0, 2.91, 0.72), (0.04, 0.02, 0.45), m_wall, col_decor)

# -------------------------------------------------------------
# 4. HIGH-DETAIL PLAYSTATION 5 & DUALSENSE CHARGING STATION
# -------------------------------------------------------------
# PS5 Stand & Core Unit
add_cyl("PS5_Stand", (0.75, 2.68, 0.485), r=0.09, d=0.015, mat=m_ps5_black, col=col_decor)
add_box("PS5_Black_Core", (0.75, 2.68, 0.68), (0.09, 0.22, 0.38), m_ps5_black, col_decor)

# Curved Outer Plates with Side Fin Flares
pl_l = add_box("PS5_Plate_Left", (0.695, 2.68, 0.685), (0.018, 0.24, 0.39), m_ps5_white, col_decor)
pl_l.rotation_euler = (math.radians(-2), math.radians(-3), 0)

pl_r = add_box("PS5_Plate_Right", (0.805, 2.68, 0.685), (0.018, 0.24, 0.39), m_ps5_white, col_decor)
pl_r.rotation_euler = (math.radians(-2), math.radians(3), 0)

# Micro Power & Eject Buttons + Front USB-C/USB-A Ports
add_box("PS5_Power_Button", (0.75, 2.565, 0.52), (0.008, 0.008, 0.025), m_ps5_btn, col_decor)
add_box("PS5_Eject_Button", (0.75, 2.565, 0.56), (0.008, 0.008, 0.025), m_ps5_btn, col_decor)
add_box("PS5_Disc_Slot", (0.74, 2.565, 0.65), (0.005, 0.008, 0.14), m_ps5_black, col_decor)
add_box("PS5_Blue_LED_Strip", (0.75, 2.68, 0.865), (0.07, 0.20, 0.012), m_ps5_blue_led, col_light)

# DualSense Charging Dock & 2 Controllers
add_box("DualSense_Charging_Dock", (0.42, 2.66, 0.49), (0.16, 0.08, 0.03), m_ps5_black, col_decor)

# Controller 1 (Docked)
ds1_b = add_box("DualSense1_Body", (0.37, 2.66, 0.53), (0.12, 0.08, 0.04), m_ps5_white, col_decor)
ds1_g = add_box("DualSense1_Center", (0.37, 2.66, 0.535), (0.06, 0.05, 0.038), m_ps5_black, col_decor)
ds1_b.rotation_euler = (math.radians(-15), 0, 0)
ds1_g.rotation_euler = (math.radians(-15), 0, 0)

# Controller 2 (Docked)
ds2_b = add_box("DualSense2_Body", (0.47, 2.66, 0.53), (0.12, 0.08, 0.04), m_ps5_white, col_decor)
ds2_g = add_box("DualSense2_Center", (0.47, 2.66, 0.535), (0.06, 0.05, 0.038), m_ps5_black, col_decor)
ds2_b.rotation_euler = (math.radians(-15), 0, 0)
ds2_g.rotation_euler = (math.radians(-15), 0, 0)

# -------------------------------------------------------------
# 5. DECOR, PLANT, LIGHTING & PERFECT ARCHITECTURAL CAMERA
# -------------------------------------------------------------
add_box("Wall_Shelf1", (-1.4, 2.85, 1.6), (0.7, 0.2, 0.03), m_wood, col_decor)
add_box("Wall_Shelf2", (-1.4, 2.85, 1.1), (0.7, 0.2, 0.03), m_wood, col_decor)

add_box("Art_Frame", (1.5, 2.92, 1.5), (0.6, 0.03, 0.8), m_wood, col_decor)
add_box("Art_Canvas", (1.5, 2.90, 1.5), (0.54, 0.01, 0.74), m_cream, col_decor)

add_cyl("Plant_Pot", (-1.9, 2.3, 0.25), r=0.2, d=0.45, mat=m_pot, col=col_decor)
for i in range(5):
    angle = i * (2 * math.pi / 5)
    lx = -1.9 + math.cos(angle) * 0.25
    ly = 2.3 + math.sin(angle) * 0.25
    lz = 0.6 + i * 0.08
    leaf = add_box(f"Leaf_{i+1}", (lx, ly, lz), (0.28, 0.35, 0.01), m_leaf, col_decor)
    leaf.rotation_euler = (math.radians(20 + i*5), math.radians(15 - i*8), angle)

# Lighting Setup
sun_data = bpy.data.lights.new(name="Sunlight_Afternoon", type='SUN')
sun_data.energy = 4.8
sun_data.color = (1.0, 0.94, 0.85)
sun_obj = bpy.data.objects.new(name="Sunlight_Afternoon", object_data=sun_data)
sun_obj.location = (6.0, -4.0, 5.0)
sun_obj.rotation_euler = (math.radians(48), math.radians(12), math.radians(-55))
col_light.objects.link(sun_obj)

sky_data = bpy.data.lights.new(name="Ceiling_Ambient", type='AREA')
sky_data.energy = 85.0
sky_data.color = (0.95, 0.92, 0.88)
sky_data.size = 3.0
sky_obj = bpy.data.objects.new(name="Ceiling_Ambient", object_data=sky_data)
sky_obj.location = (0, 0, 2.7)
col_light.objects.link(sky_obj)

# PERFECT FRONT 3/4 PERSPECTIVE CAMERA (Revealing FRONT of Sofa Seats, Pillows, Table, TV & PS5)
cam_data = bpy.data.cameras.new("Archviz_LivingRoom_Cam")
cam_data.lens = 28
cam_obj = bpy.data.objects.new("Archviz_LivingRoom_Cam", cam_data)
cam_obj.location = (-2.2, 0.2, 1.35)
cam_obj.rotation_euler = (math.radians(78), 0, math.radians(-70))
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

# Render Setup
scene.render.engine = 'CYCLES'
scene.cycles.device = 'GPU'
scene.cycles.samples = 128
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPTIX'

out_blend = r"C:\Users\PERSONAL\Downloads\Denia\Cozy_Modern_LivingRoom_Perfect.blend"
bpy.ops.wm.save_as_mainfile(filepath=out_blend)

print(f"✅ PERFECT DETAILED LIVING ROOM SAVED TO: {out_blend}")
