import bpy
import addon_utils
import os
import math

print("=== Starting Denia MMD Import in Blender ===")

# 1. Enable mmd_tools
try:
    addon_utils.enable("mmd_tools", default_set=True)
    print("Enabled mmd_tools addon.")
except Exception as e:
    print("Error enabling mmd_tools:", e)

# 2. Clean Default Scene
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)
for mesh in list(bpy.data.meshes):
    bpy.data.meshes.remove(mesh, do_unlink=True)
for mat in list(bpy.data.materials):
    bpy.data.materials.remove(mat, do_unlink=True)

# 3. Import PMX Model
pmx_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia - (blue ver)\Denia - (blue ver).pmx"
print("Importing PMX from:", pmx_path)

if hasattr(bpy.ops.mmd_tools, 'import_model'):
    bpy.ops.mmd_tools.import_model(
        filepath=pmx_path,
        types={'MESH', 'ARMATURE', 'PHYSICS', 'DISPLAY', 'MORPHS'},
        clean_model=True
    )
    print("PMX import finished successfully!")
else:
    print("Error: mmd_tools.import_model operator not found!")

# 4. Check Imported Objects
print("Imported objects in scene:")
for obj in bpy.data.objects:
    print(f" - {obj.name} ({obj.type})")

# 5. Set up Lighting & World
world = bpy.context.scene.world
if not world:
    world = bpy.data.worlds.new("World")
    bpy.context.scene.world = world

world.use_nodes = True
bg_node = world.node_tree.nodes.get("Background")
if bg_node:
    bg_node.inputs["Color"].default_value = (0.05, 0.06, 0.08, 1.0)
    bg_node.inputs["Strength"].default_value = 1.0

# Key Light
key_light_data = bpy.data.lights.new(name="KeyLight", type='SUN')
key_light_data.energy = 4.5
key_light_data.color = (1.0, 0.96, 0.92)
key_light_obj = bpy.data.objects.new(name="KeyLight", object_data=key_light_data)
key_light_obj.location = (4.0, -4.0, 6.0)
key_light_obj.rotation_euler = (math.radians(45), math.radians(25), math.radians(-35))
bpy.context.collection.objects.link(key_light_obj)

# Fill Light
fill_light_data = bpy.data.lights.new(name="FillLight", type='SUN')
fill_light_data.energy = 2.0
fill_light_data.color = (0.7, 0.85, 1.0)
fill_light_obj = bpy.data.objects.new(name="FillLight", object_data=fill_light_data)
fill_light_obj.location = (-4.0, -2.0, 4.0)
fill_light_obj.rotation_euler = (math.radians(60), math.radians(-20), math.radians(45))
bpy.context.collection.objects.link(fill_light_obj)

# Rim Light
rim_light_data = bpy.data.lights.new(name="RimLight", type='SUN')
rim_light_data.energy = 3.5
rim_light_data.color = (1.0, 0.9, 0.7)
rim_light_obj = bpy.data.objects.new(name="RimLight", object_data=rim_light_data)
rim_light_obj.location = (0.0, 5.0, 4.0)
rim_light_obj.rotation_euler = (math.radians(-50), 0, math.radians(180))
bpy.context.collection.objects.link(rim_light_obj)

# 6. Set up Cameras
# Full-Body Camera
cam_data_full = bpy.data.cameras.new("FullBodyCamera")
cam_data_full.lens = 50
cam_obj_full = bpy.data.objects.new("FullBodyCamera", cam_data_full)
cam_obj_full.location = (0.0, -3.2, 1.1)
cam_obj_full.rotation_euler = (math.radians(88), 0, 0)
bpy.context.collection.objects.link(cam_obj_full)

# Face Close-Up Camera
cam_data_face = bpy.data.cameras.new("FaceCamera")
cam_data_face.lens = 85
cam_obj_face = bpy.data.objects.new("FaceCamera", cam_data_face)
cam_obj_face.location = (0.0, -1.5, 1.45)
cam_obj_face.rotation_euler = (math.radians(88), 0, 0)
bpy.context.collection.objects.link(cam_obj_face)

# 7. Configure Render Settings (EEVEE / Workbench for fast, clean anime render)
scene = bpy.context.scene
try:
    scene.render.engine = 'BLENDER_EEVEE'
except Exception:
    scene.render.engine = 'CYCLES'
scene.render.resolution_x = 1080
scene.render.resolution_y = 1350
scene.render.resolution_percentage = 100

# 8. Save Blend File
output_blend = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Blender.blend"
bpy.ops.wm.save_as_mainfile(filepath=output_blend)
print("Saved .blend file to:", output_blend)

# 9. Render Full-Body Preview
scene.camera = cam_obj_full
full_render_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_FullBody_Render.png"
scene.render.filepath = full_render_path
bpy.ops.render.render(write_still=True)
print("Rendered full body preview:", full_render_path)

# 10. Render Face Close-Up Preview
scene.camera = cam_obj_face
face_render_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_FaceCloseup_Render.png"
scene.render.filepath = face_render_path
bpy.ops.render.render(write_still=True)
print("Rendered face closeup preview:", face_render_path)

print("=== Finished Denia MMD Process ===")
