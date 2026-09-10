import bpy
import math
from mathutils import Euler, Vector, Color

print("=== Creating 3D Archviz Living Room (Ruang Keluarga) ===")

# Reset Blender scene to factory clean state
bpy.ops.wm.read_factory_settings(use_empty=True)

scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.length_unit = 'METERS'

# Create Collections for Organization
col_architecture = bpy.data.collections.new("01_Architecture")
col_furniture = bpy.data.collections.new("02_Furniture")
col_decor = bpy.data.collections.new("03_Decor")
col_lighting = bpy.data.collections.new("04_Lighting")

scene.collection.children.link(col_architecture)
scene.collection.children.link(col_furniture)
scene.collection.children.link(col_decor)
scene.collection.children.link(col_lighting)

# -------------------------------------------------------------
# HELPER FUNCTIONS (Material & Mesh Creation)
# -------------------------------------------------------------

def create_pbr_material(name, base_color, roughness=0.5, metallic=0.0, specular=0.5, emission_color=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = base_color
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metallic
        if 'Specular IOR Level' in bsdf.inputs:
            bsdf.inputs['Specular IOR Level'].default_value = specular
        if emission_color:
            if 'Emission Color' in bsdf.inputs:
                bsdf.inputs['Emission Color'].default_value = emission_color
                bsdf.inputs['Emission Strength'].default_value = emission_strength
    return mat

def create_cube(name, location, size, material, collection):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    if material:
        obj.data.materials.append(material)
    collection.objects.link(obj)
    bpy.context.scene.collection.objects.unlink(obj)
    return obj

def create_cylinder(name, location, radius, depth, material, collection):
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, location=location)
    obj = bpy.context.active_object
    obj.name = name
    if material:
        obj.data.materials.append(material)
    collection.objects.link(obj)
    bpy.context.scene.collection.objects.unlink(obj)
    return obj

# -------------------------------------------------------------
# MATERIALS SETUP
# -------------------------------------------------------------

mat_floor = create_pbr_material("Mat_OakFloor", (0.42, 0.26, 0.14, 1.0), roughness=0.3, specular=0.6)
mat_wall_main = create_pbr_material("Mat_WallOffWhite", (0.92, 0.90, 0.86, 1.0), roughness=0.85)
mat_wall_accent = create_pbr_material("Mat_WallAccentTeal", (0.08, 0.18, 0.22, 1.0), roughness=0.7)
mat_wood_dark = create_pbr_material("Mat_WalnutWood", (0.20, 0.12, 0.07, 1.0), roughness=0.4)
mat_sofa_fabric = create_pbr_material("Mat_SofaFabricGrey", (0.25, 0.28, 0.32, 1.0), roughness=0.9)
mat_pillow_mustard = create_pbr_material("Mat_PillowMustard", (0.85, 0.55, 0.12, 1.0), roughness=0.85)
mat_pillow_cream = create_pbr_material("Mat_PillowCream", (0.88, 0.84, 0.78, 1.0), roughness=0.9)
mat_rug = create_pbr_material("Mat_AreaRugBoho", (0.82, 0.78, 0.72, 1.0), roughness=0.95)
mat_tv_frame = create_pbr_material("Mat_TVFrameMetal", (0.05, 0.05, 0.05, 1.0), roughness=0.2, metallic=0.9)
mat_tv_screen = create_pbr_material("Mat_TVScreenGlass", (0.01, 0.01, 0.02, 1.0), roughness=0.05, specular=1.0)
mat_glass = create_pbr_material("Mat_WindowGlass", (0.9, 0.95, 1.0, 0.2), roughness=0.02, specular=1.0)
mat_curtain = create_pbr_material("Mat_CurtainSheer", (0.95, 0.94, 0.92, 1.0), roughness=0.9)
mat_brass = create_pbr_material("Mat_BrassMetal", (0.85, 0.65, 0.25, 1.0), roughness=0.25, metallic=0.95)
mat_plant_pot = create_pbr_material("Mat_CeramicPot", (0.95, 0.93, 0.90, 1.0), roughness=0.3)
mat_leaf = create_pbr_material("Mat_PlantLeaf", (0.05, 0.35, 0.08, 1.0), roughness=0.4)
mat_ambient_led = create_pbr_material("Mat_LEDWarmGlow", (1.0, 0.85, 0.6, 1.0), emission_color=(1.0, 0.85, 0.6, 1.0), emission_strength=5.0)

# -------------------------------------------------------------
# 1. ARCHITECTURE (Dinding, Lantai, Jendela)
# -------------------------------------------------------------
# Room: Width (X) = 5.0m, Depth (Y) = 6.0m, Height (Z) = 2.8m

# Floor
floor = create_cube("Floor", (0, 0, -0.05), (5.0, 6.0, 0.1), mat_floor, col_architecture)

# Baseboards
create_cube("Baseboard_Back", (0, 2.95, 0.06), (5.0, 0.02, 0.12), mat_wood_dark, col_architecture)
create_cube("Baseboard_Left", (-2.45, 0, 0.06), (0.02, 6.0, 0.12), mat_wood_dark, col_architecture)

# Back Wall (Accent Wall)
wall_back = create_cube("Wall_Back_Accent", (0, 3.0, 1.4), (5.0, 0.1, 2.8), mat_wall_accent, col_architecture)

# Left Wall
wall_left = create_cube("Wall_Left", (-2.5, 0, 1.4), (0.1, 6.0, 2.8), mat_wall_main, col_architecture)

# Right Window Wall Structure (Large floor-to-ceiling patio window)
wall_right_top = create_cube("Wall_Right_Top", (2.5, 0, 2.6), (0.1, 6.0, 0.4), mat_wall_main, col_architecture)
wall_right_bot = create_cube("Wall_Right_Bot", (2.5, 0, 0.1), (0.1, 6.0, 0.2), mat_wall_main, col_architecture)

# Glass Window Frame & Pane
window_frame = create_cube("Window_Frame", (2.48, 0, 1.35), (0.05, 5.6, 2.3), mat_tv_frame, col_architecture)
window_glass = create_cube("Window_Glass", (2.48, 0, 1.35), (0.02, 5.5, 2.2), mat_glass, col_architecture)

# Curtains (Right side)
curtain_left = create_cube("Curtain_Left", (2.35, -2.6, 1.35), (0.15, 0.6, 2.4), mat_curtain, col_decor)
curtain_right = create_cube("Curtain_Right", (2.35, 2.6, 1.35), (0.15, 0.6, 2.4), mat_curtain, col_decor)

# -------------------------------------------------------------
# 2. FURNITURE (Sofa L-Shape, Meja Kopi, Buffet TV)
# -------------------------------------------------------------

# L-Shaped Sofa (Center Left)
# Main Bench
sofa_base = create_cube("Sofa_Base", (-0.6, -0.5, 0.2), (2.4, 0.9, 0.25), mat_sofa_fabric, col_furniture)
sofa_back = create_cube("Sofa_Backrest", (-0.6, -0.9, 0.55), (2.4, 0.25, 0.55), mat_sofa_fabric, col_furniture)
sofa_arm_l = create_cube("Sofa_Arm_L", (-1.75, -0.5, 0.4), (0.25, 0.9, 0.45), mat_sofa_fabric, col_furniture)

# Seat Cushions
sofa_cushion1 = create_cube("Sofa_Cushion_1", (-1.2, -0.45, 0.35), (0.8, 0.75, 0.18), mat_sofa_fabric, col_furniture)
sofa_cushion2 = create_cube("Sofa_Cushion_2", (-0.4, -0.45, 0.35), (0.8, 0.75, 0.18), mat_sofa_fabric, col_furniture)

# L-Extension Chaise (Right side of sofa)
sofa_chaise = create_cube("Sofa_Chaise", (0.35, 0.1, 0.35), (0.75, 1.1, 0.18), mat_sofa_fabric, col_furniture)
sofa_chaise_base = create_cube("Sofa_Chaise_Base", (0.35, 0.1, 0.2), (0.75, 1.1, 0.25), mat_sofa_fabric, col_furniture)

# Throw Pillows
pillow1 = create_cube("Pillow_Mustard_1", (-1.3, -0.8, 0.55), (0.35, 0.15, 0.35), mat_pillow_mustard, col_decor)
pillow1.rotation_euler = (math.radians(-15), 0, math.radians(10))

pillow2 = create_cube("Pillow_Cream_1", (0.35, -0.3, 0.52), (0.35, 0.15, 0.35), mat_pillow_cream, col_decor)
pillow2.rotation_euler = (math.radians(-10), 0, math.radians(-15))

# Area Rug (Under Sofa & Table)
rug = create_cube("Area_Rug", (-0.4, -0.1, 0.01), (2.8, 2.2, 0.015), mat_rug, col_decor)

# Coffee Table (Center)
table_top = create_cube("CoffeeTable_Top", (-0.4, 0.5, 0.38), (1.1, 0.6, 0.04), mat_wood_dark, col_furniture)
table_leg1 = create_cube("Table_Leg1", (-0.85, 0.25, 0.18), (0.05, 0.05, 0.36), mat_brass, col_furniture)
table_leg2 = create_cube("Table_Leg2", (0.05, 0.25, 0.18), (0.05, 0.05, 0.36), mat_brass, col_furniture)
table_leg3 = create_cube("Table_Leg3", (-0.85, 0.75, 0.18), (0.05, 0.05, 0.36), mat_brass, col_furniture)
table_leg4 = create_cube("Table_Leg4", (0.05, 0.75, 0.18), (0.05, 0.05, 0.36), mat_brass, col_furniture)

# Table Decor (Coffee books & mug)
book1 = create_cube("Decor_Book1", (-0.6, 0.5, 0.42), (0.22, 0.28, 0.03), mat_pillow_mustard, col_decor)
book2 = create_cube("Decor_Book2", (-0.6, 0.5, 0.45), (0.20, 0.25, 0.03), mat_wall_main, col_decor)
mug = create_cylinder("Decor_Mug", (-0.2, 0.55, 0.44), radius=0.04, depth=0.09, material=mat_plant_pot, collection=col_decor)

# TV Console Unit & Smart TV (Back Wall)
tv_cabinet = create_cube("TV_Console_Cabinet", (-0.4, 2.75, 0.25), (2.4, 0.45, 0.45), mat_wood_dark, col_furniture)
tv_cabinet_door = create_cube("TV_Console_Door", (-0.4, 2.51, 0.25), (2.3, 0.02, 0.38), mat_wall_main, col_furniture)

# Smart TV 65-inch (Mounted on Wall)
tv_frame = create_cube("SmartTV_Frame", (-0.4, 2.88, 1.45), (1.45, 0.04, 0.85), mat_tv_frame, col_furniture)
tv_screen = create_cube("SmartTV_Screen", (-0.4, 2.85, 1.45), (1.40, 0.01, 0.80), mat_tv_screen, col_furniture)

# Ambient Backlight LED strip behind TV
tv_led = create_cube("TV_Backlight_LED", (-0.4, 2.92, 1.45), (1.42, 0.01, 0.82), mat_ambient_led, col_lighting)

# Wall Shelves & Art (Back Wall Right)
shelf1 = create_cube("Wall_Shelf_1", (1.3, 2.85, 1.6), (0.7, 0.2, 0.03), mat_wood_dark, col_decor)
shelf2 = create_cube("Wall_Shelf_2", (1.3, 2.85, 1.1), (0.7, 0.2, 0.03), mat_wood_dark, col_decor)

# Framed Art Canvas (Back Wall Left)
art_frame = create_cube("Framed_Art_Outer", (-1.6, 2.92, 1.5), (0.6, 0.03, 0.8), mat_wood_dark, col_decor)
art_canvas = create_cube("Framed_Art_Canvas", (-1.6, 2.90, 1.5), (0.54, 0.01, 0.74), mat_pillow_cream, col_decor)

# -------------------------------------------------------------
# 3. HOUSE PLANT (Tanaman Hias Monstera Pot)
# -------------------------------------------------------------

plant_pot = create_cylinder("Plant_Pot", location=(-1.9, 2.3, 0.25), radius=0.2, depth=0.45, material=mat_plant_pot, collection=col_decor)

# Plant Stems & Leaves
for i in range(5):
    angle = i * (2 * math.pi / 5)
    lx = -1.9 + math.cos(angle) * 0.25
    ly = 2.3 + math.sin(angle) * 0.25
    lz = 0.6 + i * 0.08
    leaf = create_cube(f"Monstera_Leaf_{i+1}", (lx, ly, lz), (0.28, 0.35, 0.01), mat_leaf, col_decor)
    leaf.rotation_euler = (math.radians(20 + i*5), math.radians(15 - i*8), angle)

# -------------------------------------------------------------
# 4. LIGHTING & CAMERA SETUP (Archviz Lighting)
# -------------------------------------------------------------

# Sun Light (Warm afternoon natural light through window)
sun_data = bpy.data.lights.new(name="Sunlight_Afternoon", type='SUN')
sun_data.energy = 4.5
sun_data.color = (1.0, 0.94, 0.85)
sun_obj = bpy.data.objects.new(name="Sunlight_Afternoon", object_data=sun_data)
sun_obj.location = (6.0, -4.0, 5.0)
sun_obj.rotation_euler = (math.radians(48), math.radians(12), math.radians(-55))
col_lighting.objects.link(sun_obj)

# Ceiling Warm Ambient Recessed Light
sky_data = bpy.data.lights.new(name="Ceiling_Ambient_Light", type='AREA')
sky_data.energy = 85.0
sky_data.color = (0.95, 0.92, 0.88)
sky_data.size = 3.0
sky_obj = bpy.data.objects.new(name="Ceiling_Ambient_Light", object_data=sky_data)
sky_obj.location = (0, 0, 2.7)
sky_obj.rotation_euler = (0, 0, 0)
col_lighting.objects.link(sky_obj)

# Accent Warm Spot Light (Highlighting Plant & Art Wall)
spot_data = bpy.data.lights.new(name="Spot_Accent_Warm", type='SPOT')
spot_data.energy = 45.0
spot_data.color = (1.0, 0.8, 0.5)
spot_data.spot_size = math.radians(45)
spot_obj = bpy.data.objects.new(name="Spot_Accent_Warm", object_data=spot_data)
spot_obj.location = (-1.6, 1.5, 2.5)
spot_obj.rotation_euler = (math.radians(-30), 0, 0)
col_lighting.objects.link(spot_obj)

# -------------------------------------------------------------
# 5. ARCHVIZ CAMERA (Eye-Level 1.3m Perspective Shot)
# -------------------------------------------------------------

cam_data = bpy.data.cameras.new("Archviz_LivingRoom_Cam")
cam_data.lens = 28 # Wide 28mm architectural lens
cam_obj = bpy.data.objects.new("Archviz_LivingRoom_Cam", cam_data)
cam_obj.location = (-0.4, -3.8, 1.35)
cam_obj.rotation_euler = (math.radians(82), 0, math.radians(-4))
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

# Setup Render & Viewport Settings
scene.render.engine = 'CYCLES'
scene.cycles.device = 'GPU'
scene.cycles.samples = 128
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPTIX'

# Save Living Room project file
out_blend = r"C:\Users\PERSONAL\Downloads\Denia\Cozy_Modern_LivingRoom.blend"
bpy.ops.wm.save_as_mainfile(filepath=out_blend)

print(f"✅ ARCHVIZ LIVING ROOM SCENE CREATED SUCCESSFULLY: {out_blend}")
