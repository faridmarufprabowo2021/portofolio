import bpy
import math
from mathutils import Euler, Vector, Color

print("=== Constructing 3D Archviz Living Room + PS5 Console ===")

# Reset Blender scene to factory clean state
bpy.ops.wm.read_factory_settings(use_empty=True)

scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.length_unit = 'METERS'

# Collections
col_arch = bpy.data.collections.new("01_Architecture")
col_furn = bpy.data.collections.new("02_Furniture")
col_decor = bpy.data.collections.new("03_Decor")
col_light = bpy.data.collections.new("04_Lighting")

scene.collection.children.link(col_arch)
scene.collection.children.link(col_furn)
scene.collection.children.link(col_decor)
scene.collection.children.link(col_light)

# Materials helper
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

# Materials
m_floor = create_pbr("Mat_OakFloor", (0.42, 0.26, 0.14, 1.0), 0.3, 0.0, 0.6)
m_wall = create_pbr("Mat_WallOffWhite", (0.92, 0.90, 0.86, 1.0), 0.85)
m_accent = create_pbr("Mat_WallTeal", (0.08, 0.18, 0.22, 1.0), 0.7)
m_wood = create_pbr("Mat_WalnutWood", (0.20, 0.12, 0.07, 1.0), 0.4)
m_sofa = create_pbr("Mat_SofaFabric", (0.25, 0.28, 0.32, 1.0), 0.9)
m_mustard = create_pbr("Mat_PillowMustard", (0.85, 0.55, 0.12, 1.0), 0.85)
m_cream = create_pbr("Mat_PillowCream", (0.88, 0.84, 0.78, 1.0), 0.9)
m_rug = create_pbr("Mat_AreaRug", (0.82, 0.78, 0.72, 1.0), 0.95)
m_tv_frame = create_pbr("Mat_TVFrame", (0.05, 0.05, 0.05, 1.0), 0.2, 0.9)
m_tv_screen = create_pbr("Mat_TVScreen", (0.01, 0.01, 0.02, 1.0), 0.05, 0.0, 1.0)
m_glass = create_pbr("Mat_Glass", (0.9, 0.95, 1.0, 0.2), 0.02, 0.0, 1.0)
m_curtain = create_pbr("Mat_Curtain", (0.95, 0.94, 0.92, 1.0), 0.9)
m_brass = create_pbr("Mat_Brass", (0.85, 0.65, 0.25, 1.0), 0.25, 0.95)
m_pot = create_pbr("Mat_CeramicPot", (0.95, 0.93, 0.90, 1.0), 0.3)
m_leaf = create_pbr("Mat_Leaf", (0.05, 0.35, 0.08, 1.0), 0.4)
m_warm_led = create_pbr("Mat_WarmLED", (1.0, 0.85, 0.6, 1.0), emission=(1.0, 0.85, 0.6, 1.0), emission_str=5.0)

# PS5 Materials
m_ps5_white = create_pbr("Mat_PS5_White", (0.96, 0.96, 0.98, 1.0), 0.25, 0.0, 0.8)
m_ps5_black = create_pbr("Mat_PS5_Black", (0.02, 0.02, 0.03, 1.0), 0.1, 0.0, 1.0)
m_ps5_led = create_pbr("Mat_PS5_LED", (0.0, 0.6, 1.0, 1.0), emission=(0.0, 0.6, 1.0, 1.0), emission_str=8.0)

# 1. ARCHITECTURE
add_box("Floor", (0, 0, -0.05), (5.0, 6.0, 0.1), m_floor, col_arch)
add_box("Baseboard_B", (0, 2.95, 0.06), (5.0, 0.02, 0.12), m_wood, col_arch)
add_box("Baseboard_L", (-2.45, 0, 0.06), (0.02, 6.0, 0.12), m_wood, col_arch)

add_box("Wall_Accent", (0, 3.0, 1.4), (5.0, 0.1, 2.8), m_accent, col_arch)
add_box("Wall_Left", (-2.5, 0, 1.4), (0.1, 6.0, 2.8), m_wall, col_arch)

add_box("Wall_R_Top", (2.5, 0, 2.6), (0.1, 6.0, 0.4), m_wall, col_arch)
add_box("Wall_R_Bot", (2.5, 0, 0.1), (0.1, 6.0, 0.2), m_wall, col_arch)

add_box("Window_Frame", (2.48, 0, 1.35), (0.05, 5.6, 2.3), m_tv_frame, col_arch)
add_box("Window_Glass", (2.48, 0, 1.35), (0.02, 5.5, 2.2), m_glass, col_arch)

add_box("Curtain_L", (2.35, -2.6, 1.35), (0.15, 0.6, 2.4), m_curtain, col_decor)
add_box("Curtain_R", (2.35, 2.6, 1.35), (0.15, 0.6, 2.4), m_curtain, col_decor)

# 2. FURNITURE
add_box("Sofa_Base", (-0.6, -0.5, 0.2), (2.4, 0.9, 0.25), m_sofa, col_furn)
add_box("Sofa_Back", (-0.6, -0.9, 0.55), (2.4, 0.25, 0.55), m_sofa, col_furn)
add_box("Sofa_Arm_L", (-1.75, -0.5, 0.4), (0.25, 0.9, 0.45), m_sofa, col_furn)

add_box("Sofa_Cush1", (-1.2, -0.45, 0.35), (0.8, 0.75, 0.18), m_sofa, col_furn)
add_box("Sofa_Cush2", (-0.4, -0.45, 0.35), (0.8, 0.75, 0.18), m_sofa, col_furn)
add_box("Sofa_Chaise", (0.35, 0.1, 0.35), (0.75, 1.1, 0.18), m_sofa, col_furn)
add_box("Sofa_Chaise_Base", (0.35, 0.1, 0.2), (0.75, 1.1, 0.25), m_sofa, col_furn)

p1 = add_box("Pillow_Mustard", (-1.3, -0.8, 0.55), (0.35, 0.15, 0.35), m_mustard, col_decor)
p1.rotation_euler = (math.radians(-15), 0, math.radians(10))

p2 = add_box("Pillow_Cream", (0.35, -0.3, 0.52), (0.35, 0.15, 0.35), m_cream, col_decor)
p2.rotation_euler = (math.radians(-10), 0, math.radians(-15))

add_box("Area_Rug", (-0.4, -0.1, 0.01), (2.8, 2.2, 0.015), m_rug, col_decor)

add_box("CoffeeTable_Top", (-0.4, 0.5, 0.38), (1.1, 0.6, 0.04), m_wood, col_furn)
add_box("Table_Leg1", (-0.85, 0.25, 0.18), (0.05, 0.05, 0.36), m_brass, col_furn)
add_box("Table_Leg2", (0.05, 0.25, 0.18), (0.05, 0.05, 0.36), m_brass, col_furn)
add_box("Table_Leg3", (-0.85, 0.75, 0.18), (0.05, 0.05, 0.36), m_brass, col_furn)
add_box("Table_Leg4", (0.05, 0.75, 0.18), (0.05, 0.05, 0.36), m_brass, col_furn)

add_box("Decor_Book1", (-0.6, 0.5, 0.42), (0.22, 0.28, 0.03), m_mustard, col_decor)
add_box("Decor_Book2", (-0.6, 0.5, 0.45), (0.20, 0.25, 0.03), m_wall, col_decor)
add_cyl("Decor_Mug", (-0.2, 0.55, 0.44), 0.04, 0.09, m_pot, col_decor)

add_box("TV_Cabinet", (-0.4, 2.75, 0.25), (2.4, 0.45, 0.45), m_wood, col_furn)
add_box("TV_Door", (-0.4, 2.51, 0.25), (2.3, 0.02, 0.38), m_wall, col_furn)

add_box("SmartTV_Frame", (-0.4, 2.88, 1.45), (1.45, 0.04, 0.85), m_tv_frame, col_furn)
add_box("SmartTV_Screen", (-0.4, 2.85, 1.45), (1.40, 0.01, 0.80), m_tv_screen, col_furn)
add_box("TV_LED", (-0.4, 2.92, 1.45), (1.42, 0.01, 0.82), m_warm_led, col_light)

# 3. PLAYSTATION 5 CONSOLE & DUALSENSE CONTROLLERS
add_cyl("PS5_Stand", (0.55, 2.68, 0.485), 0.09, 0.015, m_ps5_black, col_decor)
add_box("PS5_Core", (0.55, 2.68, 0.68), (0.09, 0.22, 0.38), m_ps5_black, col_decor)

pl_l = add_box("PS5_Plate_L", (0.495, 2.68, 0.685), (0.018, 0.24, 0.39), m_ps5_white, col_decor)
pl_l.rotation_euler = (math.radians(-2), math.radians(-3), 0)

pl_r = add_box("PS5_Plate_R", (0.605, 2.68, 0.685), (0.018, 0.24, 0.39), m_ps5_white, col_decor)
pl_r.rotation_euler = (math.radians(-2), math.radians(3), 0)

add_box("PS5_LED_Strip", (0.55, 2.68, 0.865), (0.07, 0.20, 0.012), m_ps5_led, col_light)

ds1_b = add_box("DS1_Body", (0.28, 2.65, 0.49), (0.13, 0.09, 0.04), m_ps5_white, col_decor)
ds1_g = add_box("DS1_Center", (0.28, 2.65, 0.495), (0.07, 0.06, 0.038), m_ps5_black, col_decor)
ds1_b.rotation_euler = (0, 0, math.radians(-25))
ds1_g.rotation_euler = (0, 0, math.radians(-25))

ds2_b = add_box("DS2_Body", (-0.35, 0.52, 0.42), (0.13, 0.09, 0.04), m_ps5_white, col_decor)
ds2_g = add_box("DS2_Center", (-0.35, 0.52, 0.425), (0.07, 0.06, 0.038), m_ps5_black, col_decor)
ds2_b.rotation_euler = (0, 0, math.radians(40))
ds2_g.rotation_euler = (0, 0, math.radians(40))

# 4. DECOR & PLANT
add_box("Wall_Shelf1", (1.3, 2.85, 1.6), (0.7, 0.2, 0.03), m_wood, col_decor)
add_box("Wall_Shelf2", (1.3, 2.85, 1.1), (0.7, 0.2, 0.03), m_wood, col_decor)

add_box("Art_Frame", (-1.6, 2.92, 1.5), (0.6, 0.03, 0.8), m_wood, col_decor)
add_box("Art_Canvas", (-1.6, 2.90, 1.5), (0.54, 0.01, 0.74), m_cream, col_decor)

add_cyl("Plant_Pot", (-1.9, 2.3, 0.25), 0.2, 0.45, m_pot, col_decor)
for i in range(5):
    angle = i * (2 * math.pi / 5)
    lx = -1.9 + math.cos(angle) * 0.25
    ly = 2.3 + math.sin(angle) * 0.25
    lz = 0.6 + i * 0.08
    leaf = add_box(f"Leaf_{i+1}", (lx, ly, lz), (0.28, 0.35, 0.01), m_leaf, col_decor)
    leaf.rotation_euler = (math.radians(20 + i*5), math.radians(15 - i*8), angle)

# 5. LIGHTING & CAMERA
sun_data = bpy.data.lights.new(name="Sunlight_Afternoon", type='SUN')
sun_data.energy = 4.5
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

spot_data = bpy.data.lights.new(name="Spot_Accent", type='SPOT')
spot_data.energy = 45.0
spot_data.color = (1.0, 0.8, 0.5)
spot_data.spot_size = math.radians(45)
spot_obj = bpy.data.objects.new(name="Spot_Accent", object_data=spot_data)
spot_obj.location = (-1.6, 1.5, 2.5)
spot_obj.rotation_euler = (math.radians(-30), 0, 0)
col_light.objects.link(spot_obj)

# Camera
cam_data = bpy.data.cameras.new("Archviz_LivingRoom_Cam")
cam_data.lens = 28
cam_obj = bpy.data.objects.new("Archviz_LivingRoom_Cam", cam_data)
cam_obj.location = (-0.4, -3.8, 1.35)
cam_obj.rotation_euler = (math.radians(82), 0, math.radians(-4))
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

# Render Setup
scene.render.engine = 'CYCLES'
scene.cycles.device = 'GPU'
scene.cycles.samples = 128
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPTIX'

out_blend = r"C:\Users\PERSONAL\Downloads\Denia\Cozy_Modern_LivingRoom_PS5.blend"
bpy.ops.wm.save_as_mainfile(filepath=out_blend)

print(f"✅ LIVING ROOM WITH PS5 CONSOLE SAVED TO: {out_blend}")
