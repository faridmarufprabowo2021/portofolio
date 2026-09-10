import bpy
import math
from mathutils import Euler, Quaternion

print("=== Creating Smooth Looping Animation for Denia ===")

# Open latest blend file
blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_FixedAnime.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

arm = bpy.data.objects.get("Denia - (blue ver)_arm")
mesh = bpy.data.objects.get("Denia - (blue ver)_mesh")

if not arm or not mesh:
    raise RuntimeError("Armature or Mesh not found in scene!")

# Set Timeline duration: 120 frames (5 seconds @ 24fps)
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 120
scene.render.fps = 24

# Ensure armature is active and in Pose Mode
bpy.context.view_layer.objects.active = arm
bpy.ops.object.mode_set(mode='POSE')

# Helper function to set keyframe on bone with Euler angles
def keyframe_bone_euler(pbone, frame, x_deg, y_deg, z_deg):
    q = Euler((math.radians(x_deg), math.radians(y_deg), math.radians(z_deg)), 'XYZ').to_quaternion()
    pbone.rotation_mode = 'QUATERNION'
    pbone.rotation_quaternion = q
    pbone.keyframe_insert(data_path="rotation_quaternion", frame=frame)

def keyframe_bone_loc(pbone, frame, x, y, z):
    pbone.location = (x, y, z)
    pbone.keyframe_insert(data_path="location", frame=frame)

# Create new Action
action_name = "Denia_Wave_And_Wink_Loop"
if arm.animation_data is None:
    arm.animation_data_create()
action = bpy.data.actions.new(name=action_name)
arm.animation_data.action = action

# Bones to animate
b_hips = arm.pose.bones.get("下半身")
b_spine = arm.pose.bones.get("上半身")
b_spine2 = arm.pose.bones.get("上半身2")
b_neck = arm.pose.bones.get("首")
b_head = arm.pose.bones.get("頭")
b_arm_r = arm.pose.bones.get("腕.R")
b_elbow_r = arm.pose.bones.get("ひじ.R")
b_wrist_r = arm.pose.bones.get("手首.R")
b_arm_l = arm.pose.bones.get("腕.L")
b_elbow_l = arm.pose.bones.get("ひじ.L")
b_wrist_l = arm.pose.bones.get("手首.L")
b_leg_l = arm.pose.bones.get("足.L")
b_knee_l = arm.pose.bones.get("ひざ.L")
b_leg_r = arm.pose.bones.get("足.R")
b_knee_r = arm.pose.bones.get("ひざ.R")

# Base Static Pose for Legs & Left Arm
for f in [1, 30, 60, 90, 120]:
    if b_leg_l: keyframe_bone_euler(b_leg_l, f, -2, 2, -2)
    if b_knee_l: keyframe_bone_euler(b_knee_l, f, 4, 0, 0)
    if b_leg_r: keyframe_bone_euler(b_leg_r, f, -12, -4, 6)
    if b_knee_r: keyframe_bone_euler(b_knee_r, f, 22, 0, -4)
    if b_arm_l: keyframe_bone_euler(b_arm_l, f, -15, -10, 35)
    if b_elbow_l: keyframe_bone_euler(b_elbow_l, f, -10, -15, 25)
    if b_wrist_l: keyframe_bone_euler(b_wrist_l, f, -6, 8, -10)

# 1. Hips (Gentle swaying / breathing bounce)
if b_hips:
    keyframe_bone_euler(b_hips, 1, 1, -2, 3)
    keyframe_bone_euler(b_hips, 30, 0, 2, -2)
    keyframe_bone_euler(b_hips, 60, 2, -3, 4)
    keyframe_bone_euler(b_hips, 90, 0, 1, -1)
    keyframe_bone_euler(b_hips, 120, 1, -2, 3) # Loop

# 2. Spine & Chest (Breathing rhythm)
if b_spine:
    keyframe_bone_euler(b_spine, 1, 2, 1, -2)
    keyframe_bone_euler(b_spine, 30, 5, 2, 1)
    keyframe_bone_euler(b_spine, 60, 3, 3, -3)
    keyframe_bone_euler(b_spine, 90, 5, 1, 1)
    keyframe_bone_euler(b_spine, 120, 2, 1, -2)

if b_spine2:
    keyframe_bone_euler(b_spine2, 1, 1, 1, -1)
    keyframe_bone_euler(b_spine2, 30, 3, 1, 0)
    keyframe_bone_euler(b_spine2, 60, 2, 2, -2)
    keyframe_bone_euler(b_spine2, 90, 3, 1, 0)
    keyframe_bone_euler(b_spine2, 120, 1, 1, -1)

# 3. Head & Neck (Curious tilt during wave)
if b_neck:
    keyframe_bone_euler(b_neck, 1, 1, 2, -2)
    keyframe_bone_euler(b_neck, 30, 2, 3, -3)
    keyframe_bone_euler(b_neck, 55, 3, 6, -6)
    keyframe_bone_euler(b_neck, 85, 2, 3, -3)
    keyframe_bone_euler(b_neck, 120, 1, 2, -2)

if b_head:
    keyframe_bone_euler(b_head, 1, 2, 4, -4)
    keyframe_bone_euler(b_head, 30, 4, 6, -5)
    keyframe_bone_euler(b_head, 55, 6, 12, -8)  # Peak cutesy tilt
    keyframe_bone_euler(b_head, 85, 4, 6, -5)
    keyframe_bone_euler(b_head, 120, 2, 4, -4)

# 4. Right Arm (Waving Motion)
if b_arm_r and b_elbow_r and b_wrist_r:
    # Frame 1: Resting low
    keyframe_bone_euler(b_arm_r, 1, -10, 15, -30)
    keyframe_bone_euler(b_elbow_r, 1, -15, 10, -25)
    keyframe_bone_euler(b_wrist_r, 1, 0, 0, 0)
    
    # Frame 25: Raising arm
    keyframe_bone_euler(b_arm_r, 25, 15, 35, -45)
    keyframe_bone_euler(b_elbow_r, 25, -35, 20, -60)
    keyframe_bone_euler(b_wrist_r, 25, 10, -5, 10)
    
    # Frame 40: High Wave Left
    keyframe_bone_euler(b_arm_r, 40, 28, 45, -55)
    keyframe_bone_euler(b_elbow_r, 40, -45, 30, -75)
    keyframe_bone_euler(b_wrist_r, 40, 20, -18, 30)
    
    # Frame 52: Wave Right
    keyframe_bone_euler(b_arm_r, 52, 26, 42, -52)
    keyframe_bone_euler(b_elbow_r, 52, -42, 25, -70)
    keyframe_bone_euler(b_wrist_r, 52, 10, 15, -15)
    
    # Frame 64: Wave Left again
    keyframe_bone_euler(b_arm_r, 64, 28, 45, -55)
    keyframe_bone_euler(b_elbow_r, 64, -45, 30, -75)
    keyframe_bone_euler(b_wrist_r, 64, 20, -18, 30)
    
    # Frame 80: Wave Right gentle
    keyframe_bone_euler(b_arm_r, 80, 24, 38, -48)
    keyframe_bone_euler(b_elbow_r, 80, -38, 22, -65)
    keyframe_bone_euler(b_wrist_r, 80, 12, 8, -5)
    
    # Frame 100: Lowering arm
    keyframe_bone_euler(b_arm_r, 100, 5, 25, -38)
    keyframe_bone_euler(b_elbow_r, 100, -25, 15, -40)
    keyframe_bone_euler(b_wrist_r, 100, 5, -2, 5)
    
    # Frame 120: Return to start (Seamless loop)
    keyframe_bone_euler(b_arm_r, 120, -10, 15, -30)
    keyframe_bone_euler(b_elbow_r, 120, -15, 10, -25)
    keyframe_bone_euler(b_wrist_r, 120, 0, 0, 0)

# 5. Animate Facial Shape Keys (Wink & Blinking)
if mesh.data.shape_keys:
    keys = mesh.data.shape_keys.key_blocks
    
    # Shape Key Animation
    if "まばたき" in keys:
        # Blink at frame 18-24
        keys["まばたき"].keyframe_insert(data_path="value", frame=1)
        keys["まばたき"].value = 0.0
        keys["まばたき"].keyframe_insert(data_path="value", frame=18)
        keys["まばたき"].value = 1.0
        keys["まばたき"].keyframe_insert(data_path="value", frame=21)
        keys["まばたき"].value = 0.0
        keys["まばたき"].keyframe_insert(data_path="value", frame=24)
        
        # Blink again at frame 105-111
        keys["まばたき"].keyframe_insert(data_path="value", frame=105)
        keys["まばたき"].value = 1.0
        keys["まばたき"].keyframe_insert(data_path="value", frame=108)
        keys["まばたき"].value = 0.0
        keys["まbaたき".replace("ba", "ば") if "まばたき" in keys else "まばたき"].keyframe_insert(data_path="value", frame=111)

    # Wink & Sweet Smile during the Wave (Frame 40-75)
    wink_key = keys.get("ウィンク") or keys.get("ウィンク右")
    if wink_key:
        wink_key.value = 0.0
        wink_key.keyframe_insert(data_path="value", frame=1)
        wink_key.keyframe_insert(data_path="value", frame=35)
        wink_key.value = 0.95
        wink_key.keyframe_insert(data_path="value", frame=50)
        wink_key.keyframe_insert(data_path="value", frame=68)
        wink_key.value = 0.0
        wink_key.keyframe_insert(data_path="value", frame=80)
        wink_key.keyframe_insert(data_path="value", frame=120)

    smile_key = keys.get("口角上げ") or keys.get("笑い")
    if smile_key:
        smile_key.value = 0.3
        smile_key.keyframe_insert(data_path="value", frame=1)
        smile_key.value = 0.85
        smile_key.keyframe_insert(data_path="value", frame=50)
        smile_key.value = 0.85
        smile_key.keyframe_insert(data_path="value", frame=68)
        smile_key.value = 0.3
        smile_key.keyframe_insert(data_path="value", frame=90)
        smile_key.keyframe_insert(data_path="value", frame=120)

# Save animated blend file
animated_blend = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.save_as_mainfile(filepath=animated_blend)
print("Saved animated blend file to:", animated_blend)

# Also update the base blend files so opening them has the animation ready
main_blend = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Blender.blend"
bpy.ops.wm.save_as_mainfile(filepath=main_blend)
print("Updated main blend file with animation!")

print("=== Animation Created and Baked Successfully ===")
