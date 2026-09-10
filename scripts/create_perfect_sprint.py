import bpy
import math
from mathutils import Euler, Quaternion, Vector

print("=== Creating Perfect Anime Sprint Cycle (20 Frames @ 24fps) ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_WalkAnimated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

arm = bpy.data.objects.get("Denia - (blue ver)_arm")
if not arm:
    raise RuntimeError("Armature not found!")

bpy.context.view_layer.objects.active = arm
arm.select_set(True)
bpy.ops.object.mode_set(mode='POSE')

# Helper functions
def kf_rot(pbone, frame, x, y, z):
    if not pbone: return
    pbone.rotation_mode = 'QUATERNION'
    pbone.rotation_quaternion = Euler((math.radians(x), math.radians(y), math.radians(z)), 'XYZ').to_quaternion()
    pbone.keyframe_insert(data_path="rotation_quaternion", frame=frame)

def kf_loc(pbone, frame, x, y, z):
    if not pbone: return
    pbone.location = (x, y, z)
    pbone.keyframe_insert(data_path="location", frame=frame)

action_name = "Denia_Sprint_Cycle_Loop"
if arm.animation_data is None:
    arm.animation_data_create()
action = bpy.data.actions.new(name=action_name)
arm.animation_data.action = action

scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 20
scene.render.fps = 24

# Bones
b_center = arm.pose.bones.get("センター")
b_hips = arm.pose.bones.get("下半身")
b_spine = arm.pose.bones.get("上半身")
b_spine2 = arm.pose.bones.get("上半身2")
b_neck = arm.pose.bones.get("首")
b_head = arm.pose.bones.get("頭")

# FK Leg Bones
b_thigh_l = arm.pose.bones.get("足.L")
b_knee_l = arm.pose.bones.get("ひざ.L")
b_ankle_l = arm.pose.bones.get("足首.L")

b_thigh_r = arm.pose.bones.get("足.R")
b_knee_r = arm.pose.bones.get("ひざ.R")
b_ankle_r = arm.pose.bones.get("足首.R")

# FK Arm Bones
b_arm_l = arm.pose.bones.get("腕.L")
b_elbow_l = arm.pose.bones.get("ひじ.L")
b_wrist_l = arm.pose.bones.get("手首.L")

b_arm_r = arm.pose.bones.get("腕.R")
b_elbow_r = arm.pose.bones.get("ひじ.R")
b_wrist_r = arm.pose.bones.get("手首.R")

# Disable IK constraint influence so pure FK drives the animation cleanly
for b in [b_knee_l, b_ankle_l, b_knee_r, b_ankle_r]:
    if b:
        for c in b.constraints:
            if c.type == 'IK':
                c.influence = 0.0

frames = [1, 4, 6, 11, 14, 16, 21]

# Center vertical leaping bob
c_data = {
    1:  (0, 0, -0.06),   # Contact compression
    4:  (0, 0.03, 0.09), # Flight peak leap!
    6:  (0, 0.01, 0.03), # Descending
    11: (0, 0, -0.06),   # Contact compression
    14: (0, 0.03, 0.09), # Flight peak leap!
    16: (0, 0.01, 0.03), # Descending
    21: (0, 0, -0.06),   # Loop
}

# Torso & Hips Forward Sprint Lean + Counter-twist
spine_data = {
    1:  (18, 0, 10),
    4:  (22, 0, 5),
    6:  (20, 0, -2),
    11: (18, 0, -10),
    14: (22, 0, -5),
    16: (20, 0, 2),
    21: (18, 0, 10),
}

hips_data = {
    1:  (12, 0, -12),
    4:  (10, 0, -6),
    6:  (8,  0, 4),
    11: (12, 0, 12),
    14: (10, 0, 6),
    16: (8,  0, -4),
    21: (12, 0, -12),
}

# Thigh L, Knee L, Ankle L
leg_l_data = {
    1:  (38, 4, -4,    18, 0, 0,   -25, 0, 0),  # Kicked back extension
    4:  (-10, 0, 0,    95, 0, 0,    15, 0, 0),  # High heel recovery flick
    6:  (-55, -4, 4,   45, 0, 0,   -10, 0, 0),  # Knee driving forward high!
    11: (-38, -4, 4,   15, 0, 0,    12, 0, 0),  # Heel strike contact
    14: (5, 0, 0,      25, 0, 0,    0, 0, 0),   # Passing under body
    16: (35, 4, -4,    10, 0, 0,   -20, 0, 0),  # Push off
    21: (38, 4, -4,    18, 0, 0,   -25, 0, 0),  # Loop
}

# Thigh R, Knee R, Ankle R (Mirrored by 10 frames)
leg_r_data = {
    1:  (-38, 4, -4,   15, 0, 0,    12, 0, 0),  # Heel strike contact
    4:  (5, 0, 0,      25, 0, 0,    0, 0, 0),   # Passing under body
    6:  (35, -4, 4,    10, 0, 0,   -20, 0, 0),  # Push off
    11: (38, -4, 4,    18, 0, 0,   -25, 0, 0),  # Kicked back extension
    14: (-10, 0, 0,    95, 0, 0,    15, 0, 0),  # High heel recovery flick
    16: (-55, 4, -4,   45, 0, 0,   -10, 0, 0),  # Knee driving forward high!
    21: (-38, 4, -4,   15, 0, 0,    12, 0, 0),  # Loop
}

# Left Arm & Elbow (Base Z is +42° down, +X swings forward, -X swings back, +Z bends elbow)
arm_l_data = {
    1:  (-42, -10, 38,   -10, 0, 85),  # Pumped forward high
    4:  (-15, -5,  40,   -5,  0, 75),
    6:  (15,  0,   42,    0,  0, 65),
    11: (40,  10,  42,    5,  0, 75),  # Driven backward
    14: (15,  5,   42,    0,  0, 80),
    16: (-20, -5,  40,   -5,  0, 85),
    21: (-42, -10, 38,   -10, 0, 85),  # Loop
}

# Right Arm & Elbow (Base Z is -38° down, -X swings forward, +X swings back, -Z bends elbow)
arm_r_data = {
    1:  (40,  -10, -42,   5,  0, -75),  # Driven backward
    4:  (15,  -5,  -42,   0,  0, -80),
    6:  (-20,  5,  -40,  -5,  0, -85),
    11: (-42, 10,  -38,  -10, 0, -85),  # Pumped forward high
    14: (-15, 5,   -40,  -5,  0, -75),
    16: (15,  0,   -42,   0,  0, -65),
    21: (40,  -10, -42,   5,  0, -75),  # Loop
}

for f in frames:
    cx, cy, cz = c_data[f]
    kf_loc(b_center, f, cx, cy, cz)

    sx, sy, sz = spine_data[f]
    kf_rot(b_spine, f, sx, sy, sz)
    if b_spine2: kf_rot(b_spine2, f, 6, 0, sz * 0.5)

    hx, hy, hz = hips_data[f]
    kf_rot(b_hips, f, hx, hy, hz)

    # Head counter-balance
    if b_neck: kf_rot(b_neck, f, -8, 0, -sz * 0.4)
    if b_head: kf_rot(b_head, f, -12, 0, -sz * 0.3)

    # Left Leg
    tx, ty, tz, kx, ky, kz, ax, ay, az = leg_l_data[f]
    kf_rot(b_thigh_l, f, tx, ty, tz)
    kf_rot(b_knee_l, f, kx, ky, kz)
    kf_rot(b_ankle_l, f, ax, ay, az)

    # Right Leg
    tx, ty, tz, kx, ky, kz, ax, ay, az = leg_r_data[f]
    kf_rot(b_thigh_r, f, tx, ty, tz)
    kf_rot(b_knee_r, f, kx, ky, kz)
    kf_rot(b_ankle_r, f, ax, ay, az)

    # Left Arm
    ax, ay, az, ex, ey, ez = arm_l_data[f]
    kf_rot(b_arm_l, f, ax, ay, az)
    kf_rot(b_elbow_l, f, ex, ey, ez)
    if b_wrist_l: kf_rot(b_wrist_l, f, -15, 0, 0)

    # Right Arm
    ax, ay, az, ex, ey, ez = arm_r_data[f]
    kf_rot(b_arm_r, f, ax, ay, az)
    kf_rot(b_elbow_r, f, ex, ey, ez)
    if b_wrist_r: kf_rot(b_wrist_r, f, -15, 0, 0)

out_blend = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_RunAnimated.blend"
bpy.ops.wm.save_as_mainfile(filepath=out_blend)
print(f"✅ SPRINT CYCLE SAVED TO: {out_blend}")
