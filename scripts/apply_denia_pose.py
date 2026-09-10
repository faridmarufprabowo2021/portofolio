import bpy
import math
from mathutils import Euler, Quaternion, Vector

print("=== Starting Denia Posing Script ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Blender.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

arm = bpy.data.objects.get("Denia - (blue ver)_arm")
mesh = bpy.data.objects.get("Denia - (blue ver)_mesh")

if not arm or not mesh:
    raise RuntimeError("Armature or Mesh not found!")

# Helper to rotate bone in local euler angles
def rotate_bone_euler(bone_name, x_deg, y_deg, z_deg):
    pbone = arm.pose.bones.get(bone_name)
    if not pbone:
        print(f"Warning: Bone '{bone_name}' not found.")
        return
    
    # Store original mode
    orig_mode = pbone.rotation_mode
    pbone.rotation_mode = 'XYZ'
    pbone.rotation_euler = Euler((math.radians(x_deg), math.radians(y_deg), math.radians(z_deg)), 'XYZ')
    if orig_mode == 'QUATERNION':
        pbone.rotation_quaternion = pbone.rotation_euler.to_quaternion()
        pbone.rotation_mode = 'QUATERNION'

# Helper to rotate bone with quaternion
def rotate_bone_quat(bone_name, x_deg, y_deg, z_deg):
    pbone = arm.pose.bones.get(bone_name)
    if not pbone:
        print(f"Warning: Bone '{bone_name}' not found.")
        return
    q = Euler((math.radians(x_deg), math.radians(y_deg), math.radians(z_deg)), 'XYZ').to_quaternion()
    pbone.rotation_mode = 'QUATERNION'
    pbone.rotation_quaternion = q

# 1. Reset all pose bones first
for pb in arm.pose.bones:
    pb.rotation_quaternion = (1, 0, 0, 0)
    pb.rotation_euler = (0, 0, 0)
    pb.location = (0, 0, 0)

# 2. Apply Graceful S-Curve Torso
# Center / Hips
rotate_bone_quat("下半身", 2, -3, 4)
rotate_bone_quat("上半身", 4, 3, -3)
rotate_bone_quat("上半身2", 3, 2, -2)

# Head & Neck (Cutesy tilt and turn)
rotate_bone_quat("首", 2, 4, -4)
rotate_bone_quat("頭", 4, 8, -6)

# 3. Right Arm: Waving / Welcoming Gesture
rotate_bone_quat("肩.R", 0, -5, -8)
rotate_bone_quat("腕.R", 25, 42, -50)
rotate_bone_quat("腕捩.R", 0, 20, 0)
rotate_bone_quat("ひじ.R", -40, 25, -68)
rotate_bone_quat("手首.R", 15, -10, 22)

# Fingers Right (Graceful open wave)
for f_base in ["人指", "中指", "薬指", "小指"]:
    rotate_bone_quat(f"{f_base}１.R", 12, 0, 6)
    rotate_bone_quat(f"{f_base}２.R", 15, 0, 0)
    rotate_bone_quat(f"{f_base}３.R", 10, 0, 0)
rotate_bone_quat("親指１.R", 10, 8, -12)

# 4. Left Arm: Poised resting near hip
rotate_bone_quat("肩.L", 0, 4, 4)
rotate_bone_quat("腕.L", -15, -12, 38)
rotate_bone_quat("ひじ.L", -10, -15, 28)
rotate_bone_quat("手首.L", -8, 12, -14)

# Fingers Left (Gentle curl)
for f_base in ["人指", "中指", "薬指", "小指"]:
    rotate_bone_quat(f"{f_base}１.L", 18, 0, -4)
    rotate_bone_quat(f"{f_base}２.L", 22, 0, 0)
    rotate_bone_quat(f"{f_base}３.L", 14, 0, 0)

# 5. Legs (Weight on Left, Right knee turned inward)
# Left leg (Straight support)
rotate_bone_quat("足.L", -2, 2, -2)
rotate_bone_quat("ひざ.L", 4, 0, 0)
rotate_bone_quat("足首.L", -2, 0, 2)

# Right leg (Bent knee, inward cute angle)
rotate_bone_quat("足.R", -14, -6, 8)
rotate_bone_quat("ひざ.R", 26, 0, -4)
rotate_bone_quat("足首.R", -10, 4, -4)

# 6. Apply Facial Expression (Morphs / Shape Keys)
if mesh.data.shape_keys:
    keys = mesh.data.shape_keys.key_blocks
    
    # Reset all keys
    for k in keys:
        k.value = 0.0
    
    # Apply Wink & Cheerful Smile
    if "ウィンク" in keys:
        keys["ウィンク"].value = 0.9
    elif "ウィンク右" in keys:
        keys["ウィンク右"].value = 0.9
        
    if "笑い目" in keys:
        keys["笑い目"].value = 0.35
    elif "笑い" in keys:
        keys["笑い"].value = 0.4
        
    if "にこり" in keys:
        keys["にこり"].value = 0.6
    if "口角上げ" in keys:
        keys["口角上げ"].value = 0.75
    if "照れ" in keys:
        keys["照れ"].value = 0.65
    if "あ" in keys:
        keys["あ"].value = 0.15

print("Pose and Facial Expressions applied successfully!")

# 7. Update Scene & Dependencies
bpy.context.view_layer.update()

# 8. Adjust Lighting for Glamour Anime Look
key_light = bpy.data.objects.get("KeyLight")
if key_light:
    key_light.data.energy = 4.8
    key_light.data.color = (1.0, 0.96, 0.92)

fill_light = bpy.data.objects.get("FillLight")
if fill_light:
    fill_light.data.energy = 2.4
    fill_light.data.color = (0.75, 0.88, 1.0)

rim_light = bpy.data.objects.get("RimLight")
if rim_light:
    rim_light.data.energy = 4.2
    rim_light.data.color = (1.0, 0.88, 0.65)

# Adjust Cameras
# Full Body Camera (Angled slightly dynamic)
full_cam = bpy.data.objects.get("FullBodyCamera")
if full_cam:
    full_cam.location = (0.15, -3.1, 1.05)
    full_cam.rotation_euler = (math.radians(88), math.radians(1.5), math.radians(2))

# Portrait Face Camera
face_cam = bpy.data.objects.get("FaceCamera")
if face_cam:
    face_cam.location = (0.1, -1.35, 1.48)
    face_cam.rotation_euler = (math.radians(88), math.radians(2), math.radians(3))

# 9. Configure Render Engine
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 40
scene.cycles.device = 'CPU'
scene.render.resolution_x = 1080
scene.render.resolution_y = 1440
scene.render.resolution_percentage = 100

# 10. Save Posed Blend File
output_blend = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Posed.blend"
bpy.ops.wm.save_as_mainfile(filepath=output_blend)
print("Saved posed model to:", output_blend)

# 11. Render Posed Full Body
scene.camera = full_cam
full_render = r"C:\Users\PERSONAL\Downloads\Denia\Denia_Posed_FullBody.png"
scene.render.filepath = full_render
bpy.ops.render.render(write_still=True)
print("Rendered Full Body:", full_render)

# 12. Render Posed Portrait Close-Up
scene.camera = face_cam
portrait_render = r"C:\Users\PERSONAL\Downloads\Denia\Denia_Posed_Portrait.png"
scene.render.filepath = portrait_render
bpy.ops.render.render(write_still=True)
print("Rendered Portrait:", portrait_render)

print("=== Posing and Rendering Complete ===")
