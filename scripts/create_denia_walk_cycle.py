import bpy
import math
from mathutils import Quaternion, Euler, Vector

print("=== Creating Denia Anime Walk Cycle Loop (48 Frames @ 24fps) ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

arm = bpy.data.objects.get("Denia - (blue ver)_arm")
if not arm:
    raise RuntimeError("Armature not found!")

bpy.context.view_layer.objects.active = arm
arm.select_set(True)
bpy.ops.object.mode_set(mode='POSE')

# Reset all bones to rest
for pb in arm.pose.bones:
    pb.location = (0, 0, 0)
    pb.rotation_quaternion = (1, 0, 0, 0)
    pb.rotation_euler = (0, 0, 0)
    pb.scale = (1, 1, 1)

# Create new Action
action_name = "Denia_Walk_Cycle_Loop"
if action_name in bpy.data.actions:
    action = bpy.data.actions[action_name]
else:
    action = bpy.data.actions.new(name=action_name)

if not arm.animation_data:
    arm.animation_data_create()
arm.animation_data.action = action

scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 48
scene.render.fps = 24

# Key bones
center = arm.pose.bones.get("センター")
hips = arm.pose.bones.get("下半身")
spine = arm.pose.bones.get("上半身")
neck = arm.pose.bones.get("首")
head = arm.pose.bones.get("頭")

leg_ik_l = arm.pose.bones.get("足ＩＫ.L")
leg_ik_r = arm.pose.bones.get("足ＩＫ.R")
toe_ik_l = arm.pose.bones.get("つま先ＩＫ.L")
toe_ik_r = arm.pose.bones.get("つま先ＩＫ.R")

arm_l = arm.pose.bones.get("腕.L")
elbow_l = arm.pose.bones.get("ひじ.L")
wrist_l = arm.pose.bones.get("手首.L")

arm_r = arm.pose.bones.get("腕.R")
elbow_r = arm.pose.bones.get("ひじ.R")
wrist_r = arm.pose.bones.get("手首.R")

# Base natural arm resting posture (downwards near hips, not T-pose)
def set_arm_pose(side, swing_angle, frame):
    # swing_angle: positive = forward swing, negative = backward swing
    bone_arm = arm_l if side == 'L' else arm_r
    bone_elbow = elbow_l if side == 'L' else elbow_r
    bone_wrist = wrist_l if side == 'L' else wrist_r
    sign = 1 if side == 'L' else -1

    # Base down rotation: ~48 deg down along Z, slightly out along Y
    base_z = math.radians(-48 * sign)
    base_x = math.radians(swing_angle)
    base_y = math.radians(-10 * sign)

    bone_arm.rotation_mode = 'XYZ'
    bone_arm.rotation_euler = Euler((base_x, base_y, base_z), 'XYZ')
    bone_arm.keyframe_insert(data_path="rotation_euler", frame=frame)

    # Elbow natural bend (15 - 35 deg, bends more on forward swing)
    elbow_bend = math.radians(20 + max(0, swing_angle) * 0.4)
    bone_elbow.rotation_mode = 'XYZ'
    bone_elbow.rotation_euler = Euler((0, elbow_bend * sign, 0), 'XYZ')
    bone_elbow.keyframe_insert(data_path="rotation_euler", frame=frame)

    # Wrist subtle overlap
    wrist_flex = math.radians(-swing_angle * 0.25)
    bone_wrist.rotation_mode = 'XYZ'
    bone_wrist.rotation_euler = Euler((wrist_flex, 0, 0), 'XYZ')
    bone_wrist.keyframe_insert(data_path="rotation_euler", frame=frame)

# 48-frame walk cycle keyframes
# Frames: 1 (Contact R), 7 (Down R), 13 (Pass R), 19 (Up R), 25 (Contact L), 31 (Down L), 37 (Pass L), 43 (Up L), 49/48 (Loop)

walk_data = [
    # (Frame, Center_Z, Center_X, Hips_RotZ, Spine_RotZ, LegL_Y, LegL_Z, LegL_RotX, LegR_Y, LegR_Z, LegR_RotX, ArmL_Swing, ArmR_Swing)
    # Frame 1: Contact (Right foot forward, Left foot back)
    (1,  0.0,    0.0,   -0.08,  0.06,  -0.18, 0.02,  0.25,   0.20, 0.00, -0.30,   22.0, -22.0),
    # Frame 7: Down (Right foot flat taking full weight, lowest bob)
    (7, -0.025,  0.015, -0.04,  0.03,  -0.12, 0.05,  0.35,   0.12, 0.00,  0.00,   12.0, -12.0),
    # Frame 13: Passing (Right foot carrying weight, Left knee passing)
    (13, 0.01,   0.025,  0.00,  0.00,   0.00, 0.08, -0.10,   0.00, 0.00,  0.00,    0.0,   0.0),
    # Frame 19: Up (Right foot on toe, highest bob, Left reaching out)
    (19, 0.025,  0.015,  0.04, -0.03,   0.14, 0.04, -0.25,  -0.12, 0.04,  0.30,  -14.0,  14.0),
    # Frame 25: Contact (Left foot forward, Right foot back)
    (25, 0.0,    0.0,    0.08, -0.06,   0.20, 0.00, -0.30,  -0.18, 0.02,  0.25,  -22.0,  22.0),
    # Frame 31: Down (Left foot flat taking full weight, lowest bob)
    (31,-0.025, -0.015,  0.04, -0.03,   0.12, 0.00,  0.00,  -0.12, 0.05,  0.35,  -12.0,  12.0),
    # Frame 37: Passing (Left foot carrying weight, Right knee passing)
    (37, 0.01,  -0.025,  0.00,  0.00,   0.00, 0.00,  0.00,   0.00, 0.08, -0.10,    0.0,   0.0),
    # Frame 43: Up (Left foot on toe, highest bob, Right reaching out)
    (43, 0.025, -0.015, -0.04,  0.03,  -0.12, 0.04,  0.30,   0.14, 0.04, -0.25,   14.0, -14.0),
    # Frame 49: Loop return (exact mirror of Frame 1)
    (49, 0.0,    0.0,   -0.08,  0.06,  -0.18, 0.02,  0.25,   0.20, 0.00, -0.30,   22.0, -22.0),
]

for row in walk_data:
    f, c_z, c_x, h_rz, s_rz, l_y, l_z, l_rx, r_y, r_z, r_rx, a_l, a_r = row
    
    # Center (Translation)
    if center:
        center.location = (c_x * 0.8, 0, c_z * 0.6)
        center.keyframe_insert(data_path="location", frame=f)
    
    # Hips Pelvis Sway (Feminine swing)
    if hips:
        hips.rotation_mode = 'XYZ'
        hips.rotation_euler = Euler((0, 0, h_rz), 'XYZ')
        hips.keyframe_insert(data_path="rotation_euler", frame=f)

    # Spine Torso Counter-rotation
    if spine:
        spine.rotation_mode = 'XYZ'
        spine.rotation_euler = Euler((0, 0, s_rz), 'XYZ')
        spine.keyframe_insert(data_path="rotation_euler", frame=f)

    # Neck & Head Stabilization
    if neck:
        neck.rotation_mode = 'XYZ'
        neck.rotation_euler = Euler((0.02, 0, -s_rz * 0.5), 'XYZ')
        neck.keyframe_insert(data_path="rotation_euler", frame=f)
    if head:
        head.rotation_mode = 'XYZ'
        head.rotation_euler = Euler((-0.03, 0, -s_rz * 0.3), 'XYZ')
        head.keyframe_insert(data_path="rotation_euler", frame=f)

    # Left Leg IK
    if leg_ik_l:
        leg_ik_l.location = (0, l_y, l_z)
        leg_ik_l.rotation_mode = 'XYZ'
        leg_ik_l.rotation_euler = Euler((l_rx, 0, 0), 'XYZ')
        leg_ik_l.keyframe_insert(data_path="location", frame=f)
        leg_ik_l.keyframe_insert(data_path="rotation_euler", frame=f)

    # Right Leg IK
    if leg_ik_r:
        leg_ik_r.location = (0, r_y, r_z)
        leg_ik_r.rotation_mode = 'XYZ'
        leg_ik_r.rotation_euler = Euler((r_rx, 0, 0), 'XYZ')
        leg_ik_r.keyframe_insert(data_path="location", frame=f)
        leg_ik_r.keyframe_insert(data_path="rotation_euler", frame=f)

    # Arms
    set_arm_pose('L', a_l, f)
    set_arm_pose('R', a_r, f)

# Save project
out_blend = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_WalkAnimated.blend"
bpy.ops.wm.save_as_mainfile(filepath=out_blend)
print(f"✅ Walk Cycle Saved to: {out_blend}")
