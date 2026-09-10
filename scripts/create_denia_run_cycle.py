import bpy
import math
from mathutils import Euler, Vector

print("=== Creating Denia Anime High-Speed Run Cycle (20 Frames @ 24fps) ===")

# Base from pristine clean animated file
blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_WalkAnimated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

arm = bpy.data.objects.get("Denia - (blue ver)_arm")
if not arm:
    raise RuntimeError("Armature not found!")

bpy.context.view_layer.objects.active = arm
arm.select_set(True)
bpy.ops.object.mode_set(mode='POSE')

# Reset bones
for pb in arm.pose.bones:
    pb.location = (0, 0, 0)
    pb.rotation_quaternion = (1, 0, 0, 0)
    pb.rotation_euler = (0, 0, 0)
    pb.scale = (1, 1, 1)

action_name = "Denia_Run_Cycle_Loop"
if action_name in bpy.data.actions:
    action = bpy.data.actions[action_name]
else:
    action = bpy.data.actions.new(name=action_name)

if not arm.animation_data:
    arm.animation_data_create()
arm.animation_data.action = action

scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 20
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

# Fast Arm Sprint Pump: Elbows bent ~70 deg, swinging back and forth powerfully
def set_sprint_arm(side, swing_deg, frame):
    bone_arm = arm_l if side == 'L' else arm_r
    bone_elbow = elbow_l if side == 'L' else elbow_r
    bone_wrist = wrist_l if side == 'L' else wrist_r
    sign = 1 if side == 'L' else -1

    # Base upper arm: pulled downwards and forward
    base_x = math.radians(swing_deg)
    base_y = math.radians(-15 * sign)
    base_z = math.radians(-35 * sign)

    bone_arm.rotation_mode = 'XYZ'
    bone_arm.rotation_euler = Euler((base_x, base_y, base_z), 'XYZ')
    bone_arm.keyframe_insert(data_path="rotation_euler", frame=frame)

    # Sharp elbow bend (60° to 85° during sprint)
    elbow_bend = math.radians(65 + abs(swing_deg) * 0.3)
    bone_elbow.rotation_mode = 'XYZ'
    bone_elbow.rotation_euler = Euler((0, elbow_bend * sign, 0), 'XYZ')
    bone_elbow.keyframe_insert(data_path="rotation_euler", frame=frame)

    # Wrist curled into light running fist
    bone_wrist.rotation_mode = 'XYZ'
    bone_wrist.rotation_euler = Euler((math.radians(-15), 0, 0), 'XYZ')
    bone_wrist.keyframe_insert(data_path="rotation_euler", frame=frame)

# 20-frame high speed sprint cycle keyframe table:
# Frame 1: Right Foot Contact / Impact
# Frame 3: Right Foot Deep Compression & Push
# Frame 6: Flight Phase 1 (Both feet in the air! Left knee drives forward high)
# Frame 8: Left Foot Reaching Forward for landing
# Frame 11: Left Foot Contact / Impact
# Frame 13: Left Foot Deep Compression & Push
# Frame 16: Flight Phase 2 (Both feet in the air! Right knee drives forward high)
# Frame 18: Right Foot Reaching Forward
# Frame 21 (Frame 1): Perfect Loop

sprint_data = [
    # (Frame, Center_Z, Center_Y, Spine_RotZ, LegL_Y, LegL_Z, LegL_RotX, LegR_Y, LegR_Z, LegR_RotX, ArmL_Swing, ArmR_Swing)
    # Frame 1: Contact R (Right foot hits ground under chest, Left leg kicked back)
    (1,  -0.03,  0.03,  0.10,  -0.28, 0.16,  0.45,   0.22, 0.00, -0.40,   45.0, -45.0),
    # Frame 3: Compression & Drive R (Lowest center point, powerful spring load)
    (3,  -0.06,  0.04,  0.05,  -0.18, 0.22,  0.60,   0.08, 0.00, -0.10,   30.0, -30.0),
    # Frame 6: Flight Phase 1 (LEAPING IN THE AIR! Right foot pushed off, Left knee driven high)
    (6,   0.08,  0.01, -0.05,   0.26, 0.18, -0.35,  -0.34, 0.12,  0.55,  -15.0,  15.0),
    # Frame 8: Reach Left (Extending left leg forward for ground strike)
    (8,   0.04,  0.02, -0.08,   0.32, 0.06, -0.45,  -0.30, 0.15,  0.50,  -35.0,  35.0),
    # Frame 11: Contact L (Left foot hits ground, Right leg kicked back)
    (11, -0.03,  0.03, -0.10,   0.22, 0.00, -0.40,  -0.28, 0.16,  0.45,  -45.0,  45.0),
    # Frame 13: Compression & Drive L (Lowest center point, left leg spring load)
    (13, -0.06,  0.04, -0.05,   0.08, 0.00, -0.10,  -0.18, 0.22,  0.60,  -30.0,  30.0),
    # Frame 16: Flight Phase 2 (LEAPING IN THE AIR! Left foot pushed off, Right knee driven high)
    (16,  0.08,  0.01,  0.05,  -0.34, 0.12,  0.55,   0.26, 0.18, -0.35,   15.0, -15.0),
    # Frame 18: Reach Right (Extending right leg forward)
    (18,  0.04,  0.02,  0.08,  -0.30, 0.15,  0.50,   0.32, 0.06, -0.45,   35.0, -35.0),
    # Frame 21: Loop Return (Exact duplicate of Frame 1)
    (21, -0.03,  0.03,  0.10,  -0.28, 0.16,  0.45,   0.22, 0.00, -0.40,   45.0, -45.0),
]

for row in sprint_data:
    f, c_z, c_y, s_rz, l_y, l_z, l_rx, r_y, r_z, r_rx, a_l, a_r = row

    # Center translation (Up/Down bounce + forward surge)
    if center:
        center.location = (0, c_y, c_z)
        center.keyframe_insert(data_path="location", frame=f)

    # Spine (Aggressive forward lean of ~18° + sprint counter-twist)
    if spine:
        spine.rotation_mode = 'XYZ'
        spine.rotation_euler = Euler((math.radians(18), 0, s_rz), 'XYZ')
        spine.keyframe_insert(data_path="rotation_euler", frame=f)

    # Hips (Pelvis forward tilt + twist opposite to spine)
    if hips:
        hips.rotation_mode = 'XYZ'
        hips.rotation_euler = Euler((math.radians(12), 0, -s_rz * 1.2), 'XYZ')
        hips.keyframe_insert(data_path="rotation_euler", frame=f)

    # Head & Neck (Focused horizontal gaze, counter-pitching to compensate spine lean)
    if neck:
        neck.rotation_mode = 'XYZ'
        neck.rotation_euler = Euler((math.radians(-8), 0, -s_rz * 0.4), 'XYZ')
        neck.keyframe_insert(data_path="rotation_euler", frame=f)
    if head:
        head.rotation_mode = 'XYZ'
        head.rotation_euler = Euler((math.radians(-10), 0, -s_rz * 0.2), 'XYZ')
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

    # Sprint Arms
    set_sprint_arm('L', a_l, f)
    set_sprint_arm('R', a_r, f)

out_blend = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_RunAnimated.blend"
bpy.ops.wm.save_as_mainfile(filepath=out_blend)
print(f"✅ Fast Run Cycle Saved to: {out_blend}")
