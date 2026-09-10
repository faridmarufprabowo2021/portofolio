import bpy
import math
from mathutils import Euler, Quaternion, Vector

print("=== Creating Kawaii Anime Idol Dance Loop (96 Frames / 4.0s @ 24fps / 120 BPM) ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_WalkAnimated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

arm = bpy.data.objects.get("Denia - (blue ver)_arm")
main_mesh = bpy.data.objects.get("Denia - (blue ver)_mesh")
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

def kf_shape(mesh_obj, key_name, frame, value):
    if not mesh_obj or not mesh_obj.data.shape_keys: return
    kb = mesh_obj.data.shape_keys.key_blocks.get(key_name)
    if kb:
        kb.value = value
        kb.keyframe_insert(data_path="value", frame=frame)

# Create action
action_name = "Denia_Idol_Dance_Loop"
if arm.animation_data is None:
    arm.animation_data_create()
action = bpy.data.actions.new(name=action_name)
arm.animation_data.action = action

scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 96
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

# Disable IK constraint influence so pure FK drives the dance cleanly
for b in [b_knee_l, b_ankle_l, b_knee_r, b_ankle_r]:
    if b:
        for c in b.constraints:
            if c.type == 'IK':
                c.influence = 0.0

# -------------------------------------------------------------
# 96-FRAME KAWAII IDOL CHOREOGRAPHY (8 Beats @ 120 BPM)
# -------------------------------------------------------------

# BEAT 1 (F1 - F12): Sway Right + Cheek Touch + Wink 😉
# BEAT 2 (F13 - F24): Sway Left + Cheek Touch Left + Sweet Smile 😊
# BEAT 3 (F25 - F36): Heart Chest Pulse 1 ♡
# BEAT 4 (F37 - F48): Heart Chest Pulse 2 ♡ + Toe Bounce
# BEAT 5 (F49 - F60): Idol Point to Camera ✨ (Finger Gun / Kira)
# BEAT 6 (F61 - F72): Arm Wave Sweep & Flare
# BEAT 7 (F73 - F84): Double Peace ✌️✌️ Joyful Hop
# BEAT 8 (F85 - F96): Smooth Transition Loop to Beat 1

dance_keyframes = [
    # Frame, Center(x,y,z), Spine(x,y,z), Hips(x,y,z), Head(x,y,z), ThighL(x,y,z), KneeL, ThighR(x,y,z), KneeR, ArmL(x,y,z), ElbowL, ArmR(x,y,z), ElbowR
    # F1: Beat 1 Start - Sway Right, Right hand on cheek, Left hand on hip
    (1,  (0.04, 0, -0.02),  (-2, -3, -6),   (3, 4, 10),   (-4, 6, 8),    (-8, 2, -4),  12,   (4, -2, 6),    6,    (-15, -10, 38),  (10,0,45),   (-30, 20, -75),  (0,0,-110)),
    # F6: Beat 1 Peak - Bounce & Wink
    (6,  (0.05, 0,  0.03),  (-4, -4, -8),   (4, 5, 14),   (-6, 8, 10),   (-12, 3, -6), 18,   (2, -2, 8),    4,    (-18, -12, 40),  (15,0,50),   (-35, 25, -80),  (0,0,-118)),
    # F12: Transition
    (12, (0.00, 0,  0.00),  (0, 0, 0),      (0, 0, 0),    (0, 0, 0),     (0, 0, 0),    6,    (0, 0, 0),     6,    (-10, -5, 35),   (5,0,30),    (-10, 5, -35),   (0,0,-30)),
    # F13: Beat 2 Start - Sway Left, Left hand on cheek, Right hand on hip
    (13, (-0.04, 0, -0.02), (-2, 3, 6),     (3, -4, -10), (-4, -6, -8),  (4, 2, -6),   6,    (-8, -2, 4),   12,   (-30, -20, 75),  (0,0,110),   (-15, 10, -38),  (-10,0,-45)),
    # F18: Beat 2 Peak
    (18, (-0.05, 0, 0.03),  (-4, 4, 8),     (4, -5, -14), (-6, -8, -10), (2, 2, -8),   4,    (-12, -3, 6),  18,   (-35, -25, 80),  (0,0,118),   (-18, 12, -40),  (-15,0,-50)),
    # F24: Center
    (24, (0.00, 0,  0.00),  (0, 0, 0),      (0, 0, 0),    (0, 0, 0),     (0, 0, 0),    6,    (0, 0, 0),     6,    (-10, -5, 35),   (5,0,30),    (-10, 5, -35),   (0,0,-30)),
    
    # F25: Beat 3 Start - Heart Shape in front of chest (Both hands come together)
    (25, (0.00, 0, -0.03),  (6, 0, 0),      (-3, 0, 0),   (-6, 0, 0),    (-4, 3, -2),  10,   (-4, -3, 2),   10,   (-45, -25, 60),  (0,0,95),    (-45, 25, -60),  (0,0,-95)),
    # F30: Beat 3 Heart Pump Outward
    (30, (0.00, 0,  0.02),  (8, 0, 0),      (-4, 0, 0),   (-8, 0, 0),    (-6, 4, -3),  14,   (-6, -4, 3),   14,   (-55, -20, 55),  (0,0,85),    (-55, 20, -55),  (0,0,-85)),
    # F36: Beat 4 Heart Retract
    (36, (0.00, 0, -0.02),  (6, 0, 0),      (-3, 0, 0),   (-6, 0, 0),    (-4, 3, -2),  10,   (-4, -3, 2),   10,   (-45, -25, 60),  (0,0,95),    (-45, 25, -60),  (0,0,-95)),
    # F42: Beat 4 Heart Pump Peak + Toe Lift
    (42, (0.00, 0,  0.04),  (10, 0, 0),     (-5, 0, 0),   (-10, 0, 0),   (-2, 1, 0),   4,    (-2, -1, 0),   4,    (-60, -18, 50),  (0,0,80),    (-60, 18, -50),  (0,0,-80)),
    # F48: Release
    (48, (0.00, 0,  0.00),  (0, 0, 0),      (0, 0, 0),    (0, 0, 0),     (0, 0, 0),    6,    (0, 0, 0),     6,    (-20, -10, 40),  (0,0,45),    (-20, 10, -40),  (0,0,-45)),

    # F49: Beat 5 Start - Idol Point (Right arm points straight at camera ✨)
    (49, (0.02, 0, -0.02),  (2, -6, -12),   (-2, 8, 14),  (-4, 6, 8),    (8, 2, 4),    16,   (-10, -2, -6), 8,    (-10, -15, 35),  (0,0,50),    (-85, 10, -15),  (0,0,-15)),
    # F54: Beat 5 Kira Point Peak
    (54, (0.03, 0,  0.03),  (3, -8, -16),   (-3, 10, 18), (-6, 8, 10),   (12, 3, 6),   22,   (-14, -3, -8), 6,    (-15, -20, 38),  (0,0,60),    (-95, 12, -10),  (0,0,-10)),
    # F60: Transition
    (60, (0.00, 0,  0.00),  (0, 0, 0),      (0, 0, 0),    (0, 0, 0),     (0, 0, 0),    6,    (0, 0, 0),     6,    (-10, -5, 35),   (5,0,30),    (-10, 5, -35),   (0,0,-30)),

    # F61: Beat 6 Start - Arm Wave Sweep Across Body (Left sweep)
    (61, (-0.03, 0, -0.02), (-2, 6, 12),    (2, -8, -14), (-4, -6, -8),  (-8, 2, -6),  8,    (8, -2, 4),    16,   (-65, -30, 45),  (0,0,70),    (-50, -15, -45), (0,0,-60)),
    # F66: Beat 6 Sweep Peak
    (66, (-0.04, 0,  0.03), (-3, 8, 16),    (3, -10, -18),(-6, -8, -10), (-12, 3, -8), 6,    (12, -3, 6),   22,   (-75, -35, 40),  (0,0,60),    (-60, -20, -40), (0,0,-50)),
    # F72: Transition to Hop
    (72, (0.00, 0, -0.04),  (4, 0, 0),      (-2, 0, 0),   (-4, 0, 0),    (0, 2, 0),    18,   (0, -2, 0),    18,   (-20, -10, 45),  (0,0,50),    (-20, 10, -45),  (0,0,-50)),

    # F73: Beat 7 Start - DOUBLE PEACE ✌️✌️ JOYFUL AIR HOP!
    (73, (0.00, 0,  0.08),  (-6, 0, 0),     (4, 0, 0),    (-8, 0, 0),    (-15, 4, -4), 35,   (-15, -4, 4),  35,   (-45, -35, 75),  (0,0,115),   (-45, 35, -75),  (0,0,-115)),
    # F78: Beat 7 Peak Hop (Highest airborne apex)
    (78, (0.00, 0,  0.11),  (-8, 0, 0),     (6, 0, 0),    (-10, 0, 0),   (-20, 5, -5), 45,   (-20, -5, 5),  45,   (-50, -40, 80),  (0,0,120),   (-50, 40, -80),  (0,0,-120)),
    # F84: Land & Bounce
    (84, (0.00, 0, -0.03),  (2, 0, 0),      (-2, 0, 0),   (-2, 0, 0),    (-4, 2, -2),  12,   (-4, -2, 2),   12,   (-30, -20, 60),  (0,0,85),    (-30, 20, -60),  (0,0,-85)),

    # F90: Beat 8 Start - Transitioning back to Beat 1
    (90, (0.02, 0, -0.01),  (-1, -1, -3),   (1, 2, 5),    (-2, 3, 4),    (-4, 1, -2),  8,    (2, -1, 3),    6,    (-12, -8, 36),   (8,0,38),    (-20, 15, -60),  (0,0,-80)),
    # F96: Exact match to Frame 1 for 100% SEAMLESS LOOP!
    (96, (0.04, 0, -0.02),  (-2, -3, -6),   (3, 4, 10),   (-4, 6, 8),    (-8, 2, -4),  12,   (4, -2, 6),    6,    (-15, -10, 38),  (10,0,45),   (-30, 20, -75),  (0,0,-110)),
]

for row in dance_keyframes:
    f, c_loc, sp_rot, hp_rot, hd_rot, tl_rot, kl_rot, tr_rot, kr_rot, al_rot, el_rot, ar_rot, er_rot = row

    kf_loc(b_center, f, c_loc[0], c_loc[1], c_loc[2])
    kf_rot(b_spine, f, sp_rot[0], sp_rot[1], sp_rot[2])
    if b_spine2: kf_rot(b_spine2, f, sp_rot[0] * 0.6, sp_rot[1] * 0.6, sp_rot[2] * 0.6)
    kf_rot(b_hips, f, hp_rot[0], hp_rot[1], hp_rot[2])
    if b_neck: kf_rot(b_neck, f, hd_rot[0] * 0.5, hd_rot[1] * 0.5, hd_rot[2] * 0.5)
    if b_head: kf_rot(b_head, f, hd_rot[0], hd_rot[1], hd_rot[2])

    kf_rot(b_thigh_l, f, tl_rot[0], tl_rot[1], tl_rot[2])
    kf_rot(b_knee_l, f, kl_rot, 0, 0)
    kf_rot(b_thigh_r, f, tr_rot[0], tr_rot[1], tr_rot[2])
    kf_rot(b_knee_r, f, kr_rot, 0, 0)

    kf_rot(b_arm_l, f, al_rot[0], al_rot[1], al_rot[2])
    kf_rot(b_elbow_l, f, el_rot[0], el_rot[1], el_rot[2])
    kf_rot(b_arm_r, f, ar_rot[0], ar_rot[1], ar_rot[2])
    kf_rot(b_elbow_r, f, er_rot[0], er_rot[1], er_rot[2])

# Facial Expression Keyframes (Shape keys for cute idol vibe)
if main_mesh and main_mesh.data.shape_keys:
    # Smile
    kf_shape(main_mesh, '笑い目', 1, 0.4)
    kf_shape(main_mesh, '笑い目', 25, 0.8)
    kf_shape(main_mesh, '笑い目', 49, 0.6)
    kf_shape(main_mesh, '笑い目', 73, 1.0) # Double peace big smile
    kf_shape(main_mesh, '笑い目', 96, 0.4)

    # Wink
    kf_shape(main_mesh, 'ウィンク', 1, 0.85) # Beat 1 wink
    kf_shape(main_mesh, 'ウィンク', 10, 0.0)
    kf_shape(main_mesh, 'ウィンク', 49, 0.9)  # Beat 5 idol point wink
    kf_shape(main_mesh, 'ウィンク', 58, 0.0)
    kf_shape(main_mesh, 'ウィンク', 96, 0.85)

    # Mouth smile / singing
    kf_shape(main_mesh, '口角上げ', 1, 0.7)
    kf_shape(main_mesh, '口角上げ', 25, 0.9)
    kf_shape(main_mesh, '口角上げ', 73, 0.95)
    kf_shape(main_mesh, '口角上げ', 96, 0.7)

    # Cute blush
    kf_shape(main_mesh, '照れ', 1, 0.6)
    kf_shape(main_mesh, '照れ', 49, 0.7)
    kf_shape(main_mesh, '照れ', 73, 0.9)
    kf_shape(main_mesh, '照れ', 96, 0.6)

# Save dance blend file
out_blend = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_IdolDance.blend"
bpy.ops.wm.save_as_mainfile(filepath=out_blend)
print(f"✅ KAWAII IDOL DANCE SAVED TO: {out_blend}")
